package au.org.ala.merit

import au.com.bytecode.opencsv.CSVReader
import au.org.ala.merit.command.Reef2050PlanActionReportSummaryCommand
import au.org.ala.merit.hub.HubSettings
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.converters.JSON
import grails.util.Environment
import grails.util.GrailsNameUtils
import grails.web.http.HttpHeaders
import groovy.util.logging.Slf4j
import org.grails.plugin.cache.GrailsCacheManager
import org.joda.time.Period
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.web.multipart.MultipartHttpServletRequest

@PreAuthorise(accessLevel = 'officer', redirectController = "home")
@Slf4j
class AdminController {
    static allowedMethods = [ searchUserDetails: "GET", removeUserDetails:"POST"]

    BlogService blogService
    GrailsCacheManager grailsCacheManager

    def cacheService
    def metadataService
    def authService
    def projectService
    def importService
    def adminService
    def auditService
    def searchService
    def settingService
    def documentService
    def organisationService
    def reportService
    def roleService
    def userService
    RisksService risksService

    def index() {}

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def tools() {}

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
    def bulkLoadUserPermissions() {
        def user = authService.userDetails()
        [user:user]
    }

    @PreAuthorise(accessLevel = 'alaAdmin')
    def syncCollectoryOrgs() {
        def result = adminService.syncCollectoryOrgs()
        if (result.statusCode == 200)
            render (status: 200)
        else
            render (status: result.statusCode, error: result.error)
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

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def removeUserPermission(){
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def createUserHubPermission(){
        HubSettings hubSettings = SettingService.getHubConfig()
        def user = userService.getUser()
        render(view: "createUserHubPermission", model:[roles: RoleService.MERIT_HUB_ROLES, user: user, hubId: hubSettings.hubId, hubFlg:true])
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def searchUserDetails(){
        String emailAddress = params.emailAddress
        def result = authService.getUserForEmailAddress(emailAddress)
        Map userDetails
        if (result != null && result.userName == emailAddress){
            userDetails = [userId: result.userId, emailAddress: result.userName, firstName: result.firstName, lastName: result.lastName]
        }else{
            userDetails = [error: "error", emailAddress: emailAddress]
        }
        render userDetails as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def removeUserDetails(){
        String userId = params.userId
        def result = adminService.deleteUserPermission(userId)

        if (result?.resp?.status == 200){
            result = [status: 200, success: "Success"]
        }else{
            result = [status: result?.resp?.status, error: result?.resp?.error]
        }
        render result as JSON

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
    def editHelpLinks() {
        def helpLinks = documentService.findAllHelpResources()?:[]

        // The current design supports exactly 5 help documents.
        while (helpLinks.size() < 5) {
            helpLinks << [:]
        }
        [helpLinks:helpLinks]
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def editSettingText(String id) {
        String content

        String returnController = (params.returnTo.equals("staticPage")) ? "admin" : 'home'
        String returnAction = (params.returnTo.equals("about")) ? 'about' :  (params.returnTo.equals("help")) ? "help" : (params.returnTo.equals("contacts")) ? "contacts" : 'staticPages'

        String returnUrl = g.createLink(controller:returnController, action:returnAction)
        String returnLabel = GrailsNameUtils.getScriptName(returnAction).replaceAll('-',' ').capitalize()
        SettingPageType type = SettingPageType.getForName(id)

        if (type) {
            content = settingService.getSettingText(type)
        } else {
            render(status: 404, text: "No settings type found for: ${id}")
            return
        }

        render(view:'editTextAreaSetting', model:[
                textValue: content,
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

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def reloadConfig() {
        // reload system config
        List reloadableConfigs = grailsApplication.config.getProperty('grails.config.locations', List, [])
        String fileConfig = reloadableConfigs.find{it.endsWith('properties')}

        if (!fileConfig) {
            def warning = "No external config to reload. grailsApplication.config.grails.config.locations is empty."
            println warning
            flash.message = warning
            render warning
        } else {
            def resolver = new PathMatchingResourcePatternResolver()
            def resource = resolver.getResource(fileConfig)
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

                grailsApplication.config.toProperties().each { key, value ->
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
                def error = "No external config to reload configuration. Looking for ${grailsApplication.config.getProperty('grails.config.locations', List, [])[0]}"
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
     * Re-index all docs with ElasticSearch
     */
    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
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

        render(view: 'audit', model:[results: results, searchTerm: params.searchTerm, searchType:'Project', action:'auditProject', id:'projectId'])
    }

    @PreAuthorise(accessLevel = 'readOnly', redirectController = "home")
    def auditProject() {
        def id = params.id
        if (id) {
            def project = projectService.get(id)
            if (project) {
                [project: project]
            } else {
                flash.message = "Specified project id does not exist!"
                redirect(action:'audit')
            }
        } else {
            flash.message = "No project specified!"
            redirect(action:'audit')
        }
    }

    @PreAuthorise(accessLevel = 'readOnly')
    def searchProjectAuditMessages() {
        String id = params.id
        String sort = params.sort?:'date'
        String orderBy = params.orderBy?:'desc'
        Integer start = params.int('start') ?: 0
        Integer size = params.int('length') ?: 10
        String q = params.q

        def results = auditService.getAuditMessagesForProject(id,start,size,sort,orderBy,q)
        render results as JSON
    }

    def auditOrganisationSearch() {

        def results = []
        def searchTerm = params.searchTerm as String
        if (searchTerm) {
            if (!searchTerm.endsWith("*")) {
                searchTerm += "*"
            }
            results = organisationService.search(0, 50, searchTerm)
        }

        render(view: 'audit', model:[results: results, searchTerm: params.searchTerm, searchType:'Organisation', action:'auditOrganisation', id:'organisationId'])
    }

    def auditOrganisation() {
        def id = params.id
        if (id) {
            def organisation = organisationService.get(id)
            if (organisation) {
                def messages = auditService.getAuditMessagesForOrganisation(id)
                [organisation: organisation, messages: messages?.messages, userMap: messages?.userMap]
            } else {
                flash.message = "Specified organisation id does not exist!"
                redirect(action:'audit')
            }
        } else {
            flash.message = "No organisation specified!"
            redirect(action:'audit')
        }
    }

    def auditSettings() {
        Map messages = auditService.getAuditMessagesForSettings()
        [messages: messages?.messages, userMap: messages?.userMap, nameKey:'key']
    }

    @PreAuthorise(accessLevel = 'readOnly', redirectController = "home")
    def auditMessageDetails() {
        def results = auditService.getAuditMessage(params.id as String)
        def userDetails = [:]
        def compare = null
        if (results?.message) {
            userDetails = auditService.getUserDetails(results?.message?.userId)
            if (params.compareId) {
                compare = auditService.getAuditMessage(params.compareId as String)
            } else {
                compare = auditService.getAutoCompareAuditMessage(params.id)
            }
        }
        [message: results?.message, compare: compare?.message, userDetails: userDetails.user]
    }

    def gmsProjectImport() {
        render(view:'import', model:[:])
    }

    def gmsImport() {

        Boolean preview = params.getBoolean('preview')
        Boolean update = params.getBoolean('update')
        def file
        if (preview) {
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
            Map status = [finished: false, projects: []].asSynchronized()
            session.status = status
            def fileIn = new FileInputStream(file)
            try {
                def result = importService.gmsImport(fileIn, status.projects, preview, update)
                status.finished = true
                status.error = result.error
            }
            finally {
                fileIn.close()
            }
            render status as JSON

        }
        else {
            render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
        }
    }

    def importStatus() {
        render session.status as JSON
    }

    /** Produces and responds with a CSV file in the correct format to upload MERIT projects */
    def meritImportCSVTemplate() {
        response.setContentType('text/csv')
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, 'attachment; filename="merit-project-import.csv"')
        new GmsMapper().buildMeritImportCSVTemplate(response.writer)
        response.writer.flush()
        null
    }

    def generateProjectReports() {
        def projectId = params.projectId
        def activityType = params.activityType
        def period = params.period


        if (!projectId || !activityType || !period) {
            flash.errorMessage = 'Invalid inputs, no parameters may be null'
        }
        else {
            def result = projectService.createReportingActivitiesForProject(projectId, [[type:activityType, period:Period.months(period as Integer)]])
            flash.errorMessage = result.message
        }

        render view:'tools'
    }


    @PreAuthorise(accessLevel = 'alaAdmin')
    def bulkUploadSites() {

        if (request.respondsTo('getFile')) {
            def f = request.getFile('shapefile')

            boolean matchProjectsOnly = params.getBoolean('matchProjectsOnly', false)

            def result =  importService.bulkImportSites(f, matchProjectsOnly)

            flash.message = result.message
            render view:'tools'


        } else {
            flash.message = 'No shapefile attached'
            render view:'tools'
        }
    }

    def allScores() {
        def scores = []
        def activityModel = metadataService.activitiesModel()
        activityModel.outputs.each { output ->
            def outputScores = output.scores.findAll{it.isOutputTarget}
            outputScores.each {
                scores << [output:output.name] + it
            }
        }

        render scores as JSON


    }


    def createMissingOrganisations() {

        def results = [errors:[], messages:[]]
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('orgData')
            if (file) {
                CSVReader reader = new CSVReader(new InputStreamReader(file.inputStream, 'UTF-8'))
                String[] line = reader.readNext()
                line = reader.readNext() // Discard header line
                while (line) {
                    def currentOrgName = line[0]
                    def correctOrgName = line[3]

                    def orgResults = createOrg(currentOrgName, correctOrgName)
                    results.errors += orgResults.errors
                    results.messages += orgResults.messages

                    line = reader.readNext()
                }
            }

        }
        def jsonResults = results as JSON
        new File('/tmp/organisation_creation_results.json').withPrintWriter { pw ->
            pw.print jsonResults.toString(true)
        }

        render results as JSON
    }
    def createOrg(String existingOrgName, String correctOrgName) {

        def errors = []
        def messages = []
        def existingOrganisations = metadataService.organisationList()

        def orgName = correctOrgName ?: existingOrgName

        def organisationId
        def organisation = existingOrganisations.list.find{it.name == orgName}
        if (!organisation) {
            def resp = organisationService.update('', [name:orgName, sourceSystem:'merit'])

            organisationId = resp?.resp?.organisationId
            if (!organisationId) {
                errors << "Error creating organisation ${orgName} - ${resp?.error}"
                return [errors:errors]
            }
            else {
                messages << "Created organisation with name: ${orgName}"
            }

        }
        else {
            organisationId = organisation.organisationId
            messages << "Organisation with name: ${orgName} already exists"
        }


        def projectsResp = projectService.search([organisationName:existingOrgName])
        if (projectsResp?.resp.projects) {
            def projects = projectsResp.resp.projects
            messages << "Found ${projects.size()} projects with name ${existingOrgName}"
            projects.each { project ->
                if (project.organisationId != organisationId || project.organisationName != orgName) {
                    def resp = projectService.update(project.projectId, [organisationName:orgName, organisationId:organisationId])
                    if (!resp || resp.error) {
                        errors << "Error updating project ${project.projectId}"
                    }
                    else {
                        messages << "Updated project ${project.projectId} organisation to ${orgName}"
                    }
                }
                else {
                    messages << "Project ${project.projectId} already had correct organisation details"
                }

            }
        }
        else {
            if (projectsResp?.resp?.projects?.size() == 0) {
                messages << "Organisation ${existingOrgName} has no projects"
            }
            else {
                errors << "Error retreiving projects for organisation ${existingOrgName} - ${projectsResp.error}"
            }
        }
        return [errors:errors, messages:messages]

    }

    def createReports() {
        def offset = 0
        def max = 100

        def projects = searchService.allProjects([max:max, offset:offset])

        while (offset < projects.hits.total) {

            offset+=max
            projects = searchService.allProjects([max:max, offset:offset])

            projects.hits?.hits?.each { hit ->
                def project = hit._source
                if (!project.timeline) {
                    projectService.generateProjectStageReports(project.projectId, new ReportGenerationOptions())
                    println "Generated reports for project ${project.projectId}"
                }
            }
            println offset

        }

    }

    def editSiteBlog() {
        List<Map> blog = blogService.getSiteBlog()
        [blog:blog]
    }


    def selectHomePageImages() {
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def adminReports(Reef2050PlanActionReportSummaryCommand command) {

        command.approvedActivitiesOnly = false
        List reefReports = command.reportSummary()

        int[] reportsPeriodsOfManagementUnit = reportService.findReportPeriodsOfManagmentUnit()

        [reports:[[name: 'performanceAssessmentComparison', label: 'Performance Assessment Comparison']], reef2050Reports:reefReports, reportsPeriodsOfManagementUnit:reportsPeriodsOfManagementUnit]
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def cacheManagement() {
        [cacheRegions:grailsCacheManager.getCacheNames()]
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def clearCache() {
        if (params.cache) {
            grailsCacheManager.getCache(params.cache).clear()
        }

        redirect action: 'cacheManagement'
    }

    def bulkUploadESPSites() {

        if (request.respondsTo('getFile')) {
            def f = request.getFile('shapefile')

            def result =  importService.bulkImportESPSites(f)

            flash.message = result.message
            render view:'tools'


        } else {
            flash.message = 'No shapefile attached'
            render view:'tools'
        }
    }

    def buildScore(String output, String label, String method, String property, String filterProperty, String filterValue) {
        Map score = [
                label:label.trim(),
                outputType:output.trim(),
                category:'RLP',
                units:'',
                isOutputTarget:true,
                status:'active',
                entityTypes:['RLP Output Report'],
                configuration:[
                        label:label.trim(),
                        filter:[
                                filterValue:output.trim(),
                                property:'name',
                                type:'filter'
                        ],
                        childAggregations:[

                        ]
                ]

        ]

        if (!filterProperty) {
            score.configuration.childAggregations << [
                    "type":method.trim(),
                    "property":"data."+property.trim()
            ]
        }
        else {
            score.configuration.childAggregations << [
                    filter: [
                            type:'filter',
                            filterValue:filterValue.trim(),
                            property:'data.'+filterProperty.trim()

                    ],
                    childAggregations: [
                            [
                                    "type":method.trim(),
                                    "property":"data."+property.trim()
                            ]
                    ]
            ]
        }
        score
    }

    /** Manual trigger for the scheduled job that polls for changes to risks and threats */
    def checkForRisksAndThreatsChanges() {
        risksService.checkAndSendEmail()
        render 'ok'
    }

}
