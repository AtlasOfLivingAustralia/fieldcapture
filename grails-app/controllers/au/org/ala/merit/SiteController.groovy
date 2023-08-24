package au.org.ala.merit

import au.org.ala.merit.command.CreateSiteFromShapefileCommand
import grails.converters.JSON
import org.apache.commons.io.FilenameUtils
import org.apache.commons.io.IOUtils
import org.apache.http.HttpStatus
import org.springframework.web.multipart.MultipartFile
import static grails.async.Promises.task

class SiteController {

    def siteService, projectService, activityService, metadataService, userService, searchService, importService, webService, projectConfigurationService

    static defaultAction = "index"

    static ignore = ['action','controller','id']

    def search = {
        params.fq = "docType:site"
        def results = searchService.fulltextSearch(params, false)
        render results as JSON
    }

    def create(){
        render view: 'edit', model: [create:true, documents:[]]
    }

    def createForProject(){
        def project = projectService.getRich(params.projectId)
        // permissions check
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), params.projectId)) {
            flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${params.projectId}"
            redirect(controller:'project', action:'index', id: params.projectId)
        }
        render view: 'edit', model: [create:true, project:project, documents:[]]
    }

    def index(String id) {
        def site = siteService.get(id)
        if (site) {

            def user = userService.getUser()

            // permissions check - can't use annotation as we have to know the projectId in order to lookup access right
            if (!isUserMemberOfSiteProjects(site)) {
                flash.message = "Access denied: User does not have permission to view site: ${id}"
                redirect(controller:'home', action:'index')
                return
            }

            List userProjects = site.projects?.findAll { projectService.canUserViewProject(user?.userId, it.projectId) }

            // Tracks navigation and provides context to the "create activity" feature on the site page.
            Map selectedProject = null
            if (params.projectId) {
                selectedProject = userProjects.find{it.projectId == params.projectId}
            }
            else if (userProjects.size() == 1) {
                selectedProject = userProjects[0]
            }

            // Filter visible activities to those the user has access to.
            List activities = site.activities?.findAll{activity -> userProjects.find{it.projectId == activity.projectId}}
            if (activities) {
                siteService.addPhotoPointPhotosForSites([site], activities, selectedProject?[selectedProject]:userProjects)
            }

            Map tabs = [
                    activities: projectActivitiesTab(selectedProject, site, activities),
                    pois:[visible:true, label:'Photos', type:'tab', site:site]
            ]

            [site: site,
             tabs:tabs,
             project:selectedProject,
             mapFeatures: siteService.getSiteGeoJson(site.siteId)]

        } else {
            flash.message = "No site exists with id: ${id}"
            redirect(controller:'home', action:'index')
        }
    }

    private Map projectActivitiesTab(Map selectedProject, Map site, List activities) {

        Map activitiesTabProperties = [visible:true, label:'Activities', type:'tab', default:true, activities:activities, template:'activities']
        if (selectedProject) {

            Map project = projectService.get(selectedProject.projectId)
            Map config = projectConfigurationService.getProjectConfiguration(project)
            if (config.projectTemplate != ProjectController.RLP_TEMPLATE) {
                def user = userService.getUser()
                if (user) {
                    user = user.properties
                    user.isAdmin = projectService.isUserAdminForProject(user.userId, selectedProject.projectId)?:false
                    user.isCaseManager = projectService.isUserCaseManagerForProject(user.userId, selectedProject.projectId)?:false
                    user.isEditor = projectService.canUserEditProject(user.userId, selectedProject.projectId)?:false
                    user.hasViewAccess = projectService.canUserViewProject(user.userId, selectedProject.projectId)?:false
                }

                activitiesTabProperties.putAll([visible:true, label:'Activities', type:'tab', default:true, project:project, template:'activitiesPlan', stopBinding:true,
                                                reports:project.reports, scores:metadataService.outputTargetScores, activities:activityService.activitiesForProject(project.projectId), user:user])
            }
        }

        activitiesTabProperties
    }

    def edit(String id) {
        def result = siteService.getRaw(id)
        if (!result.site) {
            render 'no such site'
        } else if (!isUserMemberOfSiteProjects(result.site)) {
            // check user has permissions to edit - user must have edit access to
            // ALL linked projects to proceed.
            flash.message = "Access denied: User does not have <b>editor</b> permission to edit site: ${id}"
            redirect(controller:'home', action:'index')
        } else {
            if (result.site.type == SiteService.SITE_TYPE_COMPOUND) {
                redirect(action:'index', id:id)
            }
            result
        }
    }

    def downloadShapefile(String id) {

        def site = siteService.get(id)
        if (site) {
            // permissions check - can't use annotation as we have to know the projectId in order to lookup access right
            if (!isUserMemberOfSiteProjects(site)) {
                flash.message = "Access denied: User does not have permission to view site: ${id}"
                redirect(controller: 'home', action: 'index')
            }
        }
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "site/${id}.shp"
        def resp = webService.proxyGetRequest(response, url, true, true,960000)
        if (resp.status != 200) {
            render view:'/error', model:[error:resp.error]
        }
    }

    /** Returns geojon for a site */
    def geojson(String id) {
        Map site = siteService.get(id)
        if (!site) {
            respond status:HttpStatus.SC_NOT_FOUND
            return
        }
        if (!isUserMemberOfSiteProjects(site)) {
            respond status:HttpStatus.SC_UNAUTHORIZED
            return
        }

        Map resp = siteService.getSiteGeoJson(site.siteId)
        resp = resp?.resp ?: resp // Render the geojson directly if successful, otherwise render the ecodata response including the status
        render resp as JSON
    }

    @PreAuthorise(accessLevel = 'editor')
    def ajaxDeleteSitesFromProject(String id){

        def payload = request.JSON
        // permissions check - id is the projectId here
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), id)) {
            render status:403, text: "Access denied: User does not have permission to delete sites"
            return
        }

        Map project = projectService.get(id, 'all')
        List siteIds = payload.siteIds

        project?.sites?.each { site ->
            if (site.type == SiteService.SITE_TYPE_COMPOUND) {
                siteIds.remove(site.siteId)
            }
        }

        Map resp = siteService.deleteSitesFromProject(id, payload.siteIds)
        if (resp.statusCode < 400) {
            render resp.resp as JSON
        } else {
            def result = [status: status]
            render result as JSON
        }
    }

    def ajaxDeleteSiteFromProject(String id) {
        def projectId = id
        def siteId = params.siteId
        if (!projectId || !siteId) {
            render status:400, text:'The siteId parameter is mandatory'
            return
        }
        Map site = siteService.get(id)
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), projectId) || site.type == SiteService.SITE_TYPE_COMPOUND) {
            render status:403, text: "Access denied: User does not have permission to edit sites for project: ${projectId}"
            return
        }

        Map resp = siteService.deleteSitesFromProject(id, [siteId])
        if (resp.statusCode < 400) {
            render resp.resp as JSON
        } else {
            def result = [status: status]
            render result as JSON
        }

    }

    def ajaxDelete(String id) {
        // permissions check
        Map site = siteService.get(id)
        if (!isUserMemberOfSiteProjects(site) || site.type == SiteService.SITE_TYPE_COMPOUND) {
            render status:403, text: "Access denied: User does not have permission to edit site: ${id}"
            return
        }

        def status = siteService.delete(id)
        if (status < 400) {
            def result = [status: 'deleted']
            render result as JSON
        } else {
            def result = [status: status]
            render result as JSON
        }
    }

    def update(String id) {

        log.debug("Updating site: " + id)
        Map site = siteService.get(id)
        // permissions check
        if (!isUserMemberOfSiteProjects(site) || site.type == SiteService.SITE_TYPE_COMPOUND) {
            render status:403, text: "Access denied: User does not have permission to edit site: ${id}"
            return
        }

        //params.each { println it }
        //todo: need to detect 'cleared' values which will be missing from the params
        def values = [:]
        // filter params to remove:
        //  1. keys in the ignore list; &
        //  2. keys with dot notation - the controller will automatically marshall these into maps &
        //  3. keys in nested maps with dot notation
        removeKeysWithDotNotation(params).each { k, v ->
            if (!(k in ignore)) {
                values[k] = reMarshallRepeatingObjects(v);
            }
        }
        values.visibility = 'private'
        //log.debug (values as JSON).toString()
        siteService.update(id, values)
        chain(action: 'index', id:  id)
    }

    def siteUpload() {
        String projectId = params.projectId
        if (!projectService.canUserEditProject(userService.getCurrentUserId(), projectId)) {
            flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${params.projectId}"
            redirect(controller:'project', action:'index', id: params.projectId)
        }
        else if (request.respondsTo('getFile')) {

            MultipartFile file = request.getFile("shapefile")

            Map result
            String extension = FilenameUtils.getExtension(file.originalFilename)
            switch (extension) {
                case 'zip':
                    result = uploadShapeFile(projectId, file)
                    break
                case 'kmz':
                    uploadKmz(projectId, file)
                    redirect(controller:'project', id:params.projectId)
                    return
                case 'kml':
                    uploadKml(projectId, file)
                    redirect(controller:'project', id:params.projectId)
                    return
                default:
                    flash.message = "Unsupported file type.  Please attach a shapefile, kmz or kml file"
                    result = [view:'upload', model:[projectId: projectId, returnTo:params.returnTo]]
            }

            result.model.putAll([projectId: projectId, returnTo:params.returnTo])
            render result

        }
        else {
            render view:'upload', model:[projectId: projectId, returnTo:params.returnTo]
        }
    }

    private void uploadKmz(String projectId, MultipartFile file) {
        InputStream kmzIn = file.inputStream
        try {
            siteService.createSitesFromKmz(projectId, kmzIn)
        }
        finally {
            IOUtils.closeQuietly(kmzIn)
        }

    }

    private void uploadKml(String projectId, MultipartFile file) {
        InputStream kmlIn = file.inputStream
        try {
            siteService.createSitesFromKml(kmlIn, projectId)
        }
        finally {
            IOUtils.closeQuietly(kmlIn)
        }
    }

    private Map uploadShapeFile(String projectId, MultipartFile file) {


        def result =  siteService.uploadShapefile(file)

        if (!result.error && result.resp.size() > 1) {
            def content = result.resp
            def shapeFileId = content.remove('shp_id')
            def firstShape = content["0"]
            def attributeNames = []
            firstShape.each {key, value ->
                attributeNames << key
            }
            def shapes = content.collect {key, value ->
                [id:(key), values:(value)]
            }
            JSON.use("nullSafe") // JSONNull is rendered as empty string.
            return [view:'upload', model:[projectId: projectId, shapeFileId:shapeFileId, shapes:shapes, attributeNames:attributeNames]]
        }
        else {
            //flag error for extension
            def message ='There was an error uploading the shapefile.  Please send an email to support for further assistance.'

            flash.message = "An error was encountered when processing the shapefile: ${message}"
            return [view:'upload', model:[projectId: projectId, returnTo:params.returnTo]]
        }
    }

    def createSitesFromShapefile(CreateSiteFromShapefileCommand siteData) {

        if (siteData.hasErrors()) {
            flash.message = siteData.errors
            redirect(url: params.returnTo)
        }
        else if (!projectService.canUserEditProject(userService.getCurrentUserId(), siteData.projectId)) {
            flash.message = "Access denied: User does not have <b>editor</b> permission for projectId ${params.projectId}"
            redirect(url: params.returnTo)
        }
        else {
            Map progress = [total:siteData.sites.size(), uploaded:0, errors:[]].asSynchronized()
            session.uploadProgress = progress
            UserDetails user = userService.getUser()
            task {
                userService.withUser(user) {
                    try {
                        while (!progress.cancelling && progress.uploaded < progress.total) {
                            Map site = siteData.sites[progress.uploaded]
                            Map result = siteService.createSiteFromUploadedShapefile(siteData.shapeFileId, site.id, asString(site.externalId), asString(site.name), asString(site.description, 'No description supplied'), siteData.projectId, false)
                            if (!result.success) {
                                progress.errors << [error: result.error, detail: result.detail]
                            }
                            progress.uploaded = progress.uploaded + 1
                        }
                    }
                    finally {
                        progress.finished = true
                    }

                }
            }

            def result = [message:'success', progress:progress]
            render result as JSON
        }

    }

    private String asString(field, String defaultValue = "") {
        if (field) {
            return field as String
        }
        return defaultValue
    }

    def validate(String id) {
        List sites = siteService.getProjectSites(id)

        sites.each { site ->
            Map result = siteService.validate(site)
        }

        render view:'/project/projectSites', model:sites
    }

    def siteUploadProgress() {
        Map progress = session.uploadProgress?:[:]
        render progress as JSON
    }

    def cancelSiteUpload() {
        Map progress = session.uploadProgress?:[:]
        progress.cancelling = true
        render progress as JSON
    }

    def updateSiteCentrePoint(String grantId, Double lat, Double lon) {
        def project = importService.findProjectByGrantId(grantId)
        if (project) {
            def site = importService.findProjectSiteByName(project, grantId)
            if (site) {
                def strLat =  "" + lat + ""
                def strLon = "" + lon + ""
                site.extent.geometry.centre = [strLon, strLat]
                siteService.update(site.siteId, site)
                render site as JSON
            } else {
                render "COULD NOT FIND SITE"
            }
        } else {
            render "EMPTY"
        }
    }

    def ajaxUpdateProjects() {
        def postBody = request.JSON
        log.debug "Body: " + postBody
        log.debug "Params:"
        params.each { println it }
        //todo: need to detect 'cleared' values which will be missing from the params - implement _destroy
        def values = [:]
        // filter params to remove:
        //  1. keys in the ignore list; &
        //  2. keys with dot notation - the controller will automatically marshall these into maps &
        //  3. keys in nested maps with dot notation
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v //reMarshallRepeatingObjects(v);
            }
        }
        log.debug "values: " + (values as JSON).toString()

        def result = siteService.updateProjectAssociations(values)
        if(result.error){
            response.status = 500
        } else {
            render result as JSON
        }
    }

    def ajaxUpdate(String id) {
        def postBody = request.JSON
        log.debug "Body: " + postBody
        log.debug "Params:"
        params.each { println it }
        //todo: need to detect 'cleared' values which will be missing from the params - implement _destroy
        def values = [:]
        // filter params to remove:
        //  1. keys in the ignore list; &
        //  2. keys with dot notation - the controller will automatically marshall these into maps &
        //  3. keys in nested maps with dot notation
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v //reMarshallRepeatingObjects(v);
            }
        }

        def result = [:]
        // check user has persmissions to edit/update site - user must have 'editor' access to
        // ALL linked projects to proceed.
        String userId = userService.getCurrentUserId()
        values.projects?.each { projectId ->
            if (!projectService.canUserEditProject(userId, projectId)) {
                flash.message = "Error: access denied: User does not have <b>editor</b> permission for projectId ${projectId}"
                result = [status: 'error']
                //render result as JSON
            }
        }

        if (!result)
            result = siteService.updateRaw(id, values)
        render result as JSON
    }

    def ajaxUpdatePOI(String id) {
        def postBody = request.JSON

        Map site = siteService.get(id)
        if (!site) {
            Map result = [error:"No site exists with id ${id}"]
            response.status = HttpStatus.SC_NOT_FOUND
            render result as JSON
            return
        }
        Boolean canUpdate = isUserMemberOfSiteProjects(site)
        if (!canUpdate) {

            Map result = [error:"You are not authorized to create or update a POI"]
            response.status = HttpStatus.SC_UNAUTHORIZED
            render result as JSON
        }

        Map result = siteService.updatePOI(id, postBody)
        render result as JSON
    }

    def ajaxDeletePOI(String id) {
        if (!id || !params.poiId) {
            Map result = [error:"The parameters id and poiId are mandatory"]
            response.status = HttpStatus.SC_BAD_REQUEST
            render result as JSON
            return
        }
        Map site = siteService.get(id)
        if (!site) {
            Map result = [error:"No site exists with id ${id}"]
            response.status = HttpStatus.SC_NOT_FOUND
            render result as JSON
            return
        }
        Boolean canUpdate = isUserMemberOfSiteProjects(site)
        if (!canUpdate) {

            Map result = [error:"You are not authorized to create or update a POI"]
            response.status = HttpStatus.SC_UNAUTHORIZED
            render result as JSON
        }

        int result = siteService.deletePOI(id, params.poiId)
        if (result == HttpStatus.SC_OK) {
            Map resp = [status:"deleted"]
            render resp as JSON
        }
        else {
            Map resp = [error:"Unable to delete photo point"]
            response.status = result
            render resp as JSON
        }

    }

    def locationLookup(String id) {
        def md = [:]
        def site = siteService.get(id)
        if (!site || site.error) {
            md = [error: 'no such site']
        } else {
            md = siteService.getLocationMetadata(site)
            if (!md) {
                md = [error: 'no metadata found']
            }
        }
        render md as JSON
    }

    /**
     * Looks up the site metadata (used for facetting) based on the supplied
     * point and returns it as JSON.
     * @param lat the latitude of the point (or centre of a shape)
     * @param lon the longitude of the point (or centre of a shape)
     */
    def locationMetadataForPoint() {
        def lat = params.lat
        def lon = params.lon


        if (!lat || !lon) {
            response.status = 400
            def result = [error:'lat and lon parameters are required']
            render result as JSON
        }
        if (!lat.isDouble() || !lon.isDouble()) {
            response.status = 400
            def result = [error:'invalid lat and lon supplied']
            render result as JSON
        }

        render metadataService.getLocationMetadataForPoint(lat, lon) as JSON
    }

    /**
     * Looks up the site metadata  based on the supplied
     * site geometry / pid and returns it as JSON.
     */
    def lookupLocationMetadataForSite() {

        def site = request.JSON

        if (!site?.extent?.geometry) {
            response.status = 400
            def result = [error:'site geometry is required']
            render result as JSON
        }

        render siteService.lookupLocationMetadataForSite(site) as JSON
    }

    def projectsForSite(String id) {
        def projects = siteService.projectsForSite(id) ?: []
        //log.debug projects
        render projects as JSON
    }

    /**
     * Re-marshalls a map of arrays to an array of maps.
     *
     * Grails marshalling of repeating fields with names in dot notation: eg
     * <pre>
     *     <bs:textField name="shape.pid" label="Shape PID"/>
     *     <bs:textField name="shape.name" label="Shape name"/>
     *     <bs:textField name="shape.pid" label="Shape PID"/>
     *     <bs:textField name="shape.name" label="Shape name"/>
     * </pre>
     * produces a map like:
     *  [name:['shape1','shape2'],pid:['23','24']]
     * while we want:
     *  [[name:'shape1',pid:'23'],[name:'shape2',pid:'24']]
     *
     * We indicate that we want this style of marshalling (the other is also valid) by adding a hidden
     * field data-marshalling='list'.
     *
     * @param value the map to re-marshall
     * @return re-marshalled map
     */
    def reMarshallRepeatingObjects(value) {
        if (!(value instanceof HashMap)) {
            return value
        }
        if (value.handling != 'repeating') {
            return value
        }
        value.remove('handling')
        def list = []
        def len = value.collect({ it.value.size() }).max()
        (0..len-1).each { idx ->
            def newMap = [:]
            value.keySet().each { key ->
                newMap[key] = reMarshallRepeatingObjects(value[key][idx])
            }
            list << newMap
        }
        list
    }

    def removeKeysWithDotNotation(value) {
        if (value instanceof String) {
            return value
        }
        if (value instanceof Object[]) {
            return stripBlankElements(value)
        }
        // assume map for now
        def iter = value.entrySet().iterator()
        while (iter.hasNext()) {
            def entry = iter.next()
            if (entry.key.indexOf('.') >= 0) {
                iter.remove()
            }
            entry.value = removeKeysWithDotNotation(entry.value)
        }
        value
    }

    def stripBlankElements(list) {
        list.findAll {it}
    }

    // debug only
    def features(String id) {
        def site = siteService.get(id)
        if (site) {
            render siteService.getMapFeatures(site)
        } else {
            render 'no such site'
        }
    }

    /**
     * Check each of the site's projects if logged in user is a member
     *
     * @param site
     * @return
     */
    private Boolean isUserMemberOfSiteProjects(site) {
        Boolean userCanEdit = false

        site.projects.each { p ->
            // handle both 'raw' and normal (project is a Map) output from siteService.get()
            def pId = (p instanceof Map && p.containsKey('projectId')) ? p.projectId : p
            if (pId && projectService.canUserEditProject(userService.getCurrentUserId(), pId)) {
                userCanEdit = true
            }
        }

        userCanEdit
    }
}
