package au.org.ala.fieldcapture

import grails.converters.JSON
import grails.util.Environment
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.web.multipart.MultipartHttpServletRequest

//@PreAuthorise(accessLevel = 'admin')
class AdminController {

    def cacheService
    def metadataService
    def authService
    def userService
    def projectService
    def importService
    def adminService
    def auditService
    def searchService
    def settingService
    def beforeInterceptor = [action:this.&auth]

    private auth() {
        if (!userService.userIsSiteAdmin()) {
            flash.message = "You are not authorised to access this page."
            redirect(controller: "home")
            false
        } else {
            true
        }
    }

    def index() {}

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def tools() {}

    /**
     * Admin page for checking or modifying user/project roles, requires CAS admin role
     * for access (see Config.groovy "security.cas.adminRole" for actual role)
     *
     * @return
     */
    def users() {
        def user = authService.userDetails()
        def projects = projectService.list(true)
        def roles = metadataService.getAccessLevels().collect { it.name }

        if (user && projects) {
            [ projects: projects, user: user, roles: roles]
        } else {
            flash.message = "Error: ${!user?'Logged-in user could not be determined ':' '}${!userList?'List of all users not found ':' '}${!projects?'List of all projects not found ':''}"
            redirect(action: "index")
        }
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

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def settings() {
        def settings = [
//            [key:'app.external.model.dir', value: grailsApplication.config.app.external.model.dir,
//            comment: 'location of the application meta-models such as the list of activities and ' +
//                    'the output data models']
        ]
        def grailsStuff = []
        def config = grailsApplication.config.flatten()
        for ( e in config ) {
            if(e.key.startsWith("grails.")){
                 grailsStuff << [key: e.key, value: e.value, comment: '']
            } else {
                settings << [key: e.key, value: e.value, comment: '']
            }
        }
        // Now add editable stuff...

        settings << [key:'about.page.text', value: "&lt;Click edit to view...&gt;", editLink: createLink(controller:'admin', action:'editAboutText')]
        settings << [key:'page.footer.text', value: "&lt;Click edit to view...&gt;", editLink: createLink(controller:'admin', action:'editFooterText')]

        [settings: settings, grailsStuff: grailsStuff]
    }

    def editAboutText() {
        def aboutText = settingService.getAboutPageText()
        render(view:'editTextAreaSetting', model:[textValue: aboutText, settingTitle:'About Page Content', settingKey:'about.page.text'] )
    }

    def editFooterText() {
        def footerText = settingService.getPageFooterText()
        println footerText
        render(view:'editTextAreaSetting', model:[textValue: footerText, settingTitle:'Page Footer', settingKey:'page.footer.text'] )
    }

    def saveTextAreaSetting() {
        def text = params.textValue
        def settingKey = params.settingKey
        if (settingKey && text) {
            switch (settingKey) {
                case 'about.page.text':
                    settingService.setAboutPageText(text)
                    break;
                case 'page.footer.text':
                    settingService.setPageFooterText(text)
                    break;
                default:
                    throw new RuntimeException("Undefined setting key!")
            }
            flash.message = "${settingKey} content saved."
        }

        redirect(action:'settings')
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

    /**
     * Accepts a CSV file (as a multipart file upload) and validates and loads project, site & institution data from it.
     * @return an error message if the CSV file is invalid, otherwise writes a CSV file describing any validation
     * errors that were encountered.
     */
    def importProjectData() {

        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('projectData')

            if (file) {

                def results = importService.importProjectsByCsv(file.inputStream, params.importWithErrors)

                if (results.error) {
                    render contentType: 'text/json', status:400, text:"""{"error":"${results.error}"}"""
                }
                else {
                    // Make sure the new projects are re-indexed.
                    adminService.reIndexAll()
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

}
