package au.org.ala.fieldcapture

import grails.converters.JSON
import grails.util.Environment
import grails.util.GrailsNameUtils
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.web.multipart.MultipartHttpServletRequest

@PreAuthorise(accessLevel = 'officer', redirectController = "home")
class AdminController {

    def cacheService
    def metadataService
    def authService
    def projectService
    def importService
    def adminService
    def auditService
    def searchService
    def settingService
    def siteService

    def index() {}

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def tools() {}

    /**
     * Admin page for checking or modifying user/project roles, requires CAS admin role
     * for access (see Config.groovy "security.cas.officerRole" for actual role)
     *
     * @return
     */
    def users() {
        def user = authService.userDetails()
        def projects = projectService.list(true)
        def roles = metadataService.getAccessLevels().collect {
            it.name
        }

        if (user && projects) {
            [ projects: projects, user: user, roles: roles]
        } else {
            flash.message = "Error: ${!user?'Logged-in user could not be determined ':' '}${!userList?'List of all users not found ':' '}${!projects?'List of all projects not found ':''}"
            redirect(action: "index")
        }
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def bulkLoadUserPermissions() {
        def user = authService.userDetails()
        [user:user]
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def uploadUserPermissionsCSV() {

        def user = authService.userDetails()

        def results

        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('projectData')
            if (file) {
                results = importService.importUserPermissionsCsv(file.inputStream)
                flash.message = results?.message
            }
        }

        render(view:'bulkLoadUserPermissions', model:[user: user, results: results])
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def metadata() {
        [activitiesMetadata: metadataService.activitiesModel()]
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def activityModel() {
        [activitiesModel: metadataService.activitiesModel()]
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def programsModel() {
        [programsModel: metadataService.programsModel()]
    }

    def updateActivitiesModel() {
        def model = request.JSON
        log.debug model
        metadataService.updateActivitiesModel(model)
        flash.message = "Activity model updated."
        def result = model
        render result
    }

    def updateProgramsModel() {
        def model = request.JSON
        log.debug model
        metadataService.updateProgramsModel(model)
        flash.message = "Programs model updated."
        def result = model
        render result
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def outputModels() {
        def model = [activitiesModel: metadataService.activitiesModel()]
        if (params.open) {
            model.open = params.open
        }
        model
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def rawOutputModels() {
        def model = [activitiesModel: metadataService.activitiesModel()]
        if (params.open) {
            model.open = params.open
        }
        model
    }

    def getOutputDataModel(String id) {
        log.debug(id)
        def model = metadataService.getDataModel(id)
        render model as JSON
    }

    def updateOutputDataModel(String id) {
        def model = request.JSON
        log.debug "template = ${id} model = ${model}"
        log.debug "model class is ${model.getClass()}"
        metadataService.updateOutputDataModel(model, id)
        flash.message = "Output data model updated."
        def result = model
        render result
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def staticPages() {
        def settings = []

        for (setting in SettingPageType.values()) {
            log.debug "setting = $setting"
            settings << [key:setting.key, value:"&lt;Click edit to view...&gt;", editLink: createLink(controller:'admin', action:"editSettingText"), name:setting.name]
        }

        [settings: settings]
    }

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def settings() {
        def settings = []

        def grailsStuff = []
        def config = grailsApplication.config.flatten()
        for ( e in config ) {
            if(e.key.startsWith("grails.")){
                grailsStuff << [key: e.key, value: e.value, comment: '']
            } else {
                settings << [key: e.key, value: e.value, comment: '']
            }
        }

        [settings: settings, grailsStuff: grailsStuff]
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def editSettingText(String id) {
        def content
        def layout = params.layout?:"adminLayout"
        def returnUrl = params.returnUrl?:g.createLink(controller:'admin', action:'staticPages', absolute: true )
        def returnAction = returnUrl.tokenize("/")[-1]
        def returnLabel = GrailsNameUtils.getScriptName(returnAction).replaceAll('-',' ').capitalize()
        SettingPageType type = SettingPageType.getForName(id)

        if (type) {
            content = settingService.getSettingText(type)
        } else {
            render(status: 404, text: "No settings type found for: ${id}")
            return
        }

        render(view:'editTextAreaSetting', model:[
                textValue: content,
                layout: layout,
                ajax: (layout =~ /ajax/) ? true : false,
                returnUrl: returnUrl,
                returnLabel: returnLabel,
                settingTitle: type.title,
                settingKey: type.key] )
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def saveTextAreaSetting() {
        def text = params.textValue
        def settingKey = params.settingKey
        def returnUrl = params.returnUrl?:g.createLink(controller:'admin', action:'settings', absolute: true )

        if (settingKey) {
            SettingPageType type = SettingPageType.getForKey(settingKey)

            if (type) {
                settingService.setSettingText(type, text)
                cacheService.clear(type.key) // clear cached copy
                flash.message = "${settingKey} content saved."
            } else {
                throw new RuntimeException("Undefined setting key!")
                flash.message = "Error: Undefined setting key - ${settingKey}"
            }
        }

        redirect(uri: returnUrl)
    }

    def reloadConfig = {
        // reload system config
        def resolver = new PathMatchingResourcePatternResolver()
        def resource = resolver.getResource(grailsApplication.config.reloadable.cfgs[0])
        if (!resource) {
            def warning = "No external config to reload. grailsApplication.config.grails.config.locations is empty."
            println warning
            flash.message = warning
            render warning
        } else {
            def stream = null

            try {
                stream = resource.getInputStream()
                ConfigSlurper configSlurper = new ConfigSlurper(Environment.current.name)
                if(resource.filename.endsWith('.groovy')) {
                    def newConfig = configSlurper.parse(stream.text as String)
                    grailsApplication.getConfig().merge(newConfig)
                }
                else if(resource.filename.endsWith('.properties')) {
                    def props = new Properties()
                    props.load(stream)
                    def newConfig = configSlurper.parse(props)
                    grailsApplication.getConfig().merge(newConfig)
                }
                flash.message = "Configuration reloaded."
                String res = "<ul>"
                grailsApplication.config.each { key, value ->
                    if (value instanceof Map) {
                        res += "<p>" + key + "</p>"
                        res += "<ul>"
                        value.each { k1, v1 ->
                            res += "<li>" + k1 + " = " + v1 + "</li>"
                        }
                        res += "</ul>"
                    }
                    else if (key != 'api_key') { // never reveal the api key
                        res += "<li>${key} = ${value}</li>"
                    }
                }
                render res + "</ul>"
            }
            catch (FileNotFoundException fnf) {
                def error = "No external config to reload configuration. Looking for ${grailsApplication.config.grails.config.locations[0]}"
                log.error error
                flash.message = error
                render error
            }
            catch (Exception gre) {
                def error = "Unable to reload configuration. Please correct problem and try again: " + gre.getMessage()
                log.error error
                flash.message = error
                render error
            }
            finally {
                stream?.close()
            }
        }
    }

    def clearMetadataCache() {
        if (params.clearEcodataCache) {
            metadataService.clearEcodataCache()
        }
        cacheService.clear()
        flash.message = "Metadata cache cleared."
        render 'done'
    }

    def gmsProjectImport() {
        render(view:'import', model:[:])
    }

    /**
     * Accepts a CSV file (as a multipart file upload) and validates and loads project, site & institution data from it.
     * @return an error message if the CSV file is invalid, otherwise writes a CSV file describing any validation
     * errors that were encountered.
     */
    def importProjectData() {

        if (params.newFormat) {
            gmsImport()
            return
        }
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('projectData')

            if (file) {

                def results = importService.importProjectsByCsv(file.inputStream, params.importWithErrors)

                if (results.error) {
                    render contentType: 'text/json', status:400, text:"""{"error":"${results.error}"}"""
                }
                else {
                    // Make sure the new projects are re-indexed.
                    //adminService.reIndexAll()
                }

                // The validation results are current returned as a CSV file so that it can easily be sent back to
                // be corrected at the source.  It's not great usability at the moment.
                response.setContentType("text/csv")
                PrintWriter pw = new PrintWriter(response.outputStream)
                results.validationErrors.each {
                    pw.println('"'+it.join('","')+'"')
                }
                pw.flush()
                return null
            }

        }

        render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
    }

    def gmsImport() {

        def file
        if (params.preview) {
            if (request instanceof MultipartHttpServletRequest) {
                def tmp = request.getFile('projectData')
                file = File.createTempFile(tmp.originalFilename, '.csv')
                tmp.transferTo(file)
                file.deleteOnExit()

                session.gmsFile = file
            }
        }
        else {
            file = session.gmsFile
            session.gmsFile = null
        }

        if (file) {
            def status = [finished: false, projects: []]
            session.status = status
            def fileIn = new FileInputStream(file)
            try {
                def result = importService.gmsImport(fileIn, status.projects, params.preview)
                status.finished = true
                status.error = result.error
            }
            finally {
                fileIn.close()
            }
            def statusJson = status as JSON
            render contentType: 'text/plain', status: 200, text: statusJson

        }
        else {
            render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
        }
    }

    def importStatus() {
        render session.status as JSON
    }

    /**
     * Accepts a CSV file (as a multipart file upload) and validates and bulk loads activity plan data for multiple projects.
     * @return an error message if the CSV file is invalid, otherwise writes a CSV file describing any validation
     * errors that were encountered.
     */
    def importPlanData() {
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('planData')

            if (file) {

                def results = importService.importPlansByCsv(file.inputStream, params.overwriteActivities)

                render results as JSON
            }

        }

        render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
    }

    /**
     * Re-index all docs with ElasticSearch
     */
    def reIndexAll() {
        render adminService.reIndexAll()
    }

    def audit() {
    }

    def auditProjectSearch() {

        def results = []
        def searchTerm = params.searchTerm as String
        if (searchTerm) {
            if (!searchTerm.endsWith("*")) {
                searchTerm += "*"
            }
            results = searchService.allProjects(params, searchTerm)
        }

        render(view: 'audit', model:[results: results, searchTerm: params.searchTerm])
    }

    def auditProject() {
        def id = params.id
        if (id) {
            def project = projectService.get(id)
            if (project) {
                def messages = auditService.getAuditMessagesForProject(id)
                [project: project, messages: messages?.messages, userMap: messages?.userMap]
            } else {
                flash.message = "Specified project id does not exist!"
                redirect(action:'audit')
            }
        } else {
            flash.message = "No project specified!"
            redirect(action:'audit')
        }
    }

    def auditMessageDetails() {
        def results = auditService.getAuditMessage(params.id as String)
        def userDetails = [:]
        if (results?.message) {
            userDetails = auditService.getUserDetails(results?.message?.userId)
        }
        [message: results?.message, userDetails: userDetails.user]
    }

    def reloadSiteMetadata() {
        def sites = siteService.list()
        for (site in sites) {
             def siteId = site["siteId"]
             def geometry = site["extent"]["geometry"]
             if (geometry)
             if (geometry.containsKey("centre")) {
                 def longitude = geometry["centre"][0]
                 def latitude = geometry["centre"][1]
                 def metadata = metadataService.getLocationMetadataForPoint(latitude, longitude)
                 geometry.putAll(metadata)

                 def updatedSite = [:]
                 updatedSite["extent"] = site["extent"]
                 siteService.update(siteId, updatedSite)
             }

        }
        def result = [result: "success"]
        render result as JSON
    }

    def populateAggregrateProjectData() {
        def result = [:]
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('activityData')

            if (file) {
                result = importService.populateAggregrateProjectData(file.inputStream, params.preview)
            }
        }

        render result as JSON
    }
}
