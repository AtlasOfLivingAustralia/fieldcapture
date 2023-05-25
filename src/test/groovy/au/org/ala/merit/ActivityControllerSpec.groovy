package au.org.ala.merit

import au.org.ala.merit.config.ProgramConfig
import grails.converters.JSON
import org.apache.http.HttpStatus
import org.grails.plugins.excelimport.ExcelImportService
import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import org.joda.time.format.DateTimeFormatter
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

/**
 * Tests for the ActivityController
 */
class ActivityControllerSpec extends Specification implements ControllerUnitTest<ActivityController>{

    def activityService = Mock(ActivityService)
    def projectService = Mock(ProjectService)
    def userService = Mock(UserService)
    def documentService = Mock(DocumentService)
    def metadataService = Mock(MetadataService)
    def reportService = Mock(ReportService)
    def siteService = Mock(SiteService)
    def excelImportService = Mock(ExcelImportService)
    def speciesService = Mock(SpeciesService)
    def projectConfigurationService = Mock(ProjectConfigurationService)

    def setup() {
        controller.activityService = activityService
        controller.projectService = projectService
        controller.userService = userService
        controller.documentService = documentService
        controller.metadataService = metadataService
        controller.reportService = reportService
        controller.siteService = siteService
        controller.excelImportService = excelImportService
        controller.speciesService = speciesService
        controller.projectConfigurationService = projectConfigurationService

    }

    def "Non-project members cannot edit activities"() {
        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        projectService.canUserEditProject(_, projectId) >> false
        userService.getCurrentUserId() >> null
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId]

        when:
        request.method = 'POST'
        request.JSON = '{"projectId":"'+projectId+'"}'
        controller.ajaxUpdate(activityId)

        then:
        response.status == HttpStatus.SC_UNAUTHORIZED
        response.json.error =~ /access denied/
    }

    def "A project id must be specified when creating an activity"() {
        setup:
        String activityId = null
        userService.getCurrentUserId() >> "1234"

        when:
        request.method = 'POST'
        request.JSON = '{"type":"Revegetation"}'
        controller.ajaxUpdate(activityId)

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
        response.json.error =~ /No project id/

    }

    def "An activity can be updated"() {
        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        projectService.canUserEditProject(_, projectId) >> true
        userService.getCurrentUserId() >> "1234"
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId]
        def activityData = [projectId:projectId, activityId:activityId, type:"Revegetation"]

        when:
        request.method = 'POST'
        request.JSON = activityData as JSON
        controller.ajaxUpdate(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        1 * activityService.update(activityId, activityData) >> [resp:[message:'updated'], statusCode:HttpStatus.SC_OK]
        response.status == HttpStatus.SC_OK
        response.json.activity.message == 'updated'
    }

    def "An activity can be created"() {
        setup:
        String projectId = 'p1234'
        String activityId = null
        projectService.canUserEditProject(_, projectId) >> true
        userService.getCurrentUserId() >> "1234"
        def activityData = [projectId:projectId, type:"Revegetation"]

        when:
        request.method = 'POST'
        request.JSON = activityData as JSON
        controller.ajaxUpdate(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        1 * activityService.update('', activityData) >> [resp:[message:'created', activityId:'1234'], statusCode:HttpStatus.SC_OK]
        response.status == HttpStatus.SC_OK
        response.json.activity.message == 'created'
        response.json.activity.activityId == '1234'

    }

    def "Photos can be attached to photo points and document ids for those photos are returned correctly"() {
        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId]
        projectService.canUserEditProject(_, projectId) >> true
        userService.getCurrentUserId() >> "1234"
        def activityData = [projectId:projectId, type:"Revegetation"]
        def photoData = [photoPoints:[photos:[[clientId:'1', name:"photo 1", poiId:"poi 1"]]]]
        def requestBody = activityData + photoData

        when:
        request.method = 'POST'
        request.JSON = requestBody as JSON
        controller.ajaxUpdate(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        1 * activityService.update(activityId, activityData) >> [resp:[message:'created', activityId:'1234'], statusCode:HttpStatus.SC_OK]
        1 * siteService.updatePhotoPoints(null, [activityId:activityId], [[name:"photo 1", poiId:'poi 1', clientId:'1']], null) >> [1:[message:'created', documentId:'d1234']]
        response.status == HttpStatus.SC_OK
        response.json.activity.message == 'created'
        response.json.activity.activityId == '1234'
        response.json.photoPoints['1'].documentId == 'd1234'
    }

    def "Activity types for selection are restricted by programme / subprogramme"() {

        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId, type:'activity 1']
        projectService.canUserEditProject(_, projectId) >> true
        projectService.get(projectId) >> [projectId:projectId, associatedProgram:'Programme 1', associatedSubProgram:'Sub-Programme 1']
        def activityTypes = [[name:'category 1', list:[[name:'activity 1', description:'description 1'], [name:'activity 2', description:'description 2']]]]

        userService.getCurrentUserId() >> "1234"

        when:
        def model = controller.edit(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        response.status == HttpStatus.SC_OK
        1 * metadataService.activityTypesList('Programme 1', 'Sub-Programme 1') >> activityTypes
        model.activityTypes == activityTypes
    }

    def "The activity type of the activity being edited will be available for selection, even if it is not normally associated with the project's programme or subprogramme"() {

        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId, type:'activity 3']
        projectService.canUserEditProject(_, projectId) >> true
        projectService.get(projectId) >> [projectId:projectId, associatedProgram:'Programme 1', associatedSubProgram:'Sub-Programme 1']
        def activityTypes = [[name:'category 1', list:[[name:'activity 1', description:'description 1'], [name:'activity 2', description:'description 2']]]]
        def extraActivityType = [name:'Current Activity', list:[[name:"activity 3", description: "The current activity type of the activity being edited"]]]

        userService.getCurrentUserId() >> "1234"

        when:
        def model = controller.edit(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        response.status == HttpStatus.SC_OK
        1 * metadataService.activityTypesList('Programme 1', 'Sub-Programme 1') >> activityTypes
        model.activityTypes == activityTypes.plus(0, extraActivityType)
    }

    def "When a user leaves the activity data entry page, the lock is released and the user is returned to the page of origin"() {
        when: "The user leaves activity a1, having navigated there from the project page"
        controller.exitActivity('a1', 'project')

        then:
        1 * userService.currentUserId >> '1'
        1 * activityService.get('a1') >> [activityId:'a1', lock:[userId:'1'], projectId:'p1']

        and: "The activity service is asked to release the lock"
        1 * activityService.unlock('a1')

        and: "The user is redirected back to the project page"
        response.redirectUrl.endsWith('/project/index/p1')

        when: "The user leaves activity a1, having navigated there from the site page"
        response.reset()
        controller.exitActivity('a1', 'site')

        then:
        1 * userService.currentUserId >> '1'
        1 * activityService.get('a1') >> [activityId:'a1', lock:[userId:'1'], projectId:'p1', siteId:'s1']

        and: "The activity service is asked to release the lock"
        1 * activityService.unlock('a1')

        and: "The user is redirected back to the project page"
        response.redirectUrl.endsWith('/site/index/s1')

    }

    def "If an invalid activity is passed to the exit activity method, the user is redirected to the homepage"() {
        when: "A request is received to exit an invalid activity"
        controller.exitActivity('a1', 'project')

        then:
        1 * activityService.get('a1') >> null
        0 * _
        and: "The user is redirected to the homepage"
        response.redirectUrl.endsWith('/home')
    }

    def "The activity controller prepares a model for use by the activity data entry page"() {
        setup:
        String activityId = 'a1'
        String userId = 'u1'
        String projectId = 'p1'
        String siteId = 's1'
        Map activity = [activityId:activityId, projectId:projectId, siteId:siteId, type:'revegetation', plannedEndDate:'2020-12-31T13:00:00Z']
        Map project = [projectId:'p1', plannedStartDate:'2019-12-31T13:00:00Z', reports:[]]
        Map speciesConfig = [:]
        List themes = []
        Map report = [name:'Stage 1']
        Map site = [siteId:siteId]

        when: "The user elects to edit an activity that is not locked"
        params.returnTo = 'project'
        Map model = controller.enterData(activityId)

        then: "Checks are done that the activity exists and that the user has permission to edit it"
        1 * userService.currentUserId >> userId
        1 * activityService.get(activityId) >> activity
        1 * projectService.canUserEditProject(userId, projectId) >> true
        1 * activityService.canEditActivity(activity) >> true

        and: "Data is retrieved"
        1 * activityService.getActivityMetadata(activity.type, null) >> [metaModel:[:], outputModels:[:]]
        1 * projectService.getProgramConfiguration(project) >> [requiresActivityLocking: false]
        1 * siteService.get(siteId, _) >> site
        1 * siteService.getMapFeatures(site) >> [:]
        1 * projectService.get(projectId) >> project
        1 * projectService.findSpeciesFieldConfigForActivity(projectId, activity.type) >> speciesConfig
        1 * metadataService.getThemesForProject(project) >> themes
        1 * reportService.findReportForDate(activity.plannedEndDate, project.reports) >> report

        and: "The model has the data needed by the page"
        model.activity == activity
        model.project == project
        model.site == site
        model.speciesConfig == speciesConfig
        model.themes == themes
        model.activity.projectStage == report.name
        model.locked == false

        and: "The navigation options are correct"
        model.navContext == 'project'
        model.showNav == true
        model.navigationMode == 'stayOnPage'
        model.returnToUrl == '/project/index/p1'

    }

    def "The activity controller will initiate an edit lock if the program is configured to do so"() {
        setup:
        String activityId = 'a1'
        String userId = 'u1'
        String projectId = 'p1'
        String siteId = 's1'
        Map activity = [activityId:activityId, projectId:projectId, siteId:siteId, type:'revegetation', plannedEndDate:'2020-12-31T13:00:00Z']
        Map project = [projectId:'p1', plannedStartDate:'2019-12-31T13:00:00Z', reports:[]]
        Map speciesConfig = [:]
        List themes = []
        Map report = [name:'Stage 1']
        Map site = [siteId:siteId]

        when: "The user elects to edit an activity that is not locked"
        params.returnTo = 'project'
        Map model = controller.enterData(activityId)

        then: "Checks are done that the activity exists and that the user has permission to edit it"
        1 * userService.currentUserId >> userId
        1 * activityService.get(activityId) >> activity
        1 * projectService.canUserEditProject(userId, projectId) >> true
        1 * activityService.canEditActivity(activity) >> true

        and: "Data is retrieved"
        1 * activityService.getActivityMetadata(activity.type, null) >> [metaModel:[:], outputModels:[:]]
        1 * projectService.getProgramConfiguration(project) >> [requiresActivityLocking: true]
        1 * siteService.get(siteId, _) >> site
        1 * siteService.getMapFeatures(site) >> [:]
        1 * projectService.get(projectId) >> project
        1 * projectService.findSpeciesFieldConfigForActivity(projectId, activity.type) >> speciesConfig
        1 * metadataService.getThemesForProject(project) >> themes
        1 * reportService.findReportForDate(activity.plannedEndDate, project.reports) >> report

        and: "The activity is locked"
        1 * activityService.lock(activity)

        and: "The model has the data needed by the page"
        model.activity == activity
        model.project == project
        model.site == site
        model.speciesConfig == speciesConfig
        model.themes == themes
        model.activity.projectStage == report.name
        model.locked == true

        and: "The navigation options are correct"
        model.navContext == 'project'

        and: "The navigation mode requires returnToProject"
        model.navigationMode == 'returnToProject'

        and: "The return URL will force an unlock"
        model.returnToUrl == '/activity/exitActivity/a1?navigateTo=project'
    }

    def "If the activity is already locked, the user will be redirected to the view page"() {
        String activityId = 'a1'
        String userId = 'u1'
        String projectId = 'p1'
        String siteId = 's1'
        Map activity = [activityId:activityId, projectId:projectId, siteId:siteId, type:'revegetation', plannedEndDate:'2020-12-31T13:00:00Z', lock:[userId:'2']]
        Map project = [projectId:'p1', plannedStartDate:'2019-12-31T13:00:00Z', reports:[]]
        Map speciesConfig = [:]
        List themes = []
        Map report = [name:'Stage 1']
        Map site = [siteId:siteId]

        when: "The user elects to edit an activity that is locked by another user"
        params.returnTo = 'project'
        controller.enterData(activityId)

        then: "Checks are done that the activity exists and that the user has permission to edit it"
        1 * userService.currentUserId >> userId
        1 * activityService.get(activityId) >> activity
        1 * projectService.canUserEditProject(userId, projectId) >> true
        1 * activityService.canEditActivity(activity) >> true

        and: "Data is retrieved"
        1 * activityService.getActivityMetadata(activity.type, null) >> [metaModel:[:], outputModels:[:]]
        1 * projectService.getProgramConfiguration(project) >> [requiresActivityLocking: true]
        1 * siteService.get(siteId, _) >> site
        1 * siteService.getMapFeatures(site) >> [:]
        1 * projectService.get(projectId) >> project
        1 * projectService.findSpeciesFieldConfigForActivity(projectId, activity.type) >> speciesConfig
        1 * metadataService.getThemesForProject(project) >> themes
        1 * reportService.findReportForDate(activity.plannedEndDate, project.reports) >> report

        and: "The user is redirected to the view page"
        response.redirectUrl == '/activity/index/a1'

    }

    def "When editing an activity, if the activity doesn't exist, redirect to the homepage"() {
        when:
        controller.enterData('a1')

        then:
        1 * activityService.get('a1') >> null

        and:
        response.redirectUrl.endsWith('/home')
    }

    def "When editing an activity, if the user doesn't have permission to view the activity, redirect to the project"() {
        when:
        controller.index('a1')

        then:
        1 * activityService.get('a1') >> [projectId:'p1', activityId:'a1']
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserViewProject('u1', 'p1') >> false

        and:
        response.redirectUrl.endsWith('/project/index/p1')
    }

    def "The controller sets up the activity view / index page"() {
        setup:
        String activityId = 'a1'
        String userId = 'u1'
        String projectId = 'p1'
        Map activity = [activityId:activityId, projectId:projectId, type:'revegetation', plannedEndDate:'2020-12-31T13:00:00Z']
        Map project = [projectId:'p1', plannedStartDate:'2019-12-31T13:00:00Z', reports:[]]
        List themes = []
        Map report = [name:'Stage 1']
        Map speciesConfig = [:]

        when:
        params.returnTo = 'project'
        Map model = controller.index(activityId)

        then: "Permission checks are performed"
        1 * userService.currentUserId >> userId
        1 * activityService.get(activityId) >> activity
        1 * projectService.canUserViewProject(userId, projectId) >> true

        and: "Data is retrieved"
        1 * activityService.getActivityMetadata(activity.type, null) >> [metaModel:[:], outputModels:[:]]
        1 * projectService.get(projectId) >> project
        1 * projectService.findSpeciesFieldConfigForActivity(projectId, activity.type) >> speciesConfig
        1 * metadataService.getThemesForProject(project) >> themes
        1 * reportService.findReportForDate(activity.plannedEndDate, project.reports) >> report

        and: "The model has the data needed by the page"
        model.activity == activity
        model.project == project
        model.site == null
        model.speciesConfig == speciesConfig
        model.themes == themes
        model.activity.projectStage == report.name
        model.navContext == 'project'

        and: "In view mode the navigation mode defaults to stay on page"
        model.navigationMode == 'stayOnPage'

        and: "The return URL will force an unlock"
        model.returnToUrl == '/project/index/p1'
    }

    def "When viewing an activity, if the activity doesn't exist, redirect to the homepage"() {
        when:
        controller.index('a1')

        then:
        1 * activityService.get('a1') >> null

        and:
        response.redirectUrl.endsWith('/home')
    }

    def "When viewing an activity, if the user doesn't have permission to view the activity, redirect to the project"() {
        when:
        controller.index('a1')

        then:
        1 * activityService.get('a1') >> [projectId:'p1', activityId:'a1']
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserViewProject('u1', 'p1') >> false

        and:
        response.redirectUrl.endsWith('/project/index/p1')
    }

    def "Activities cannot be deleted via a GET"() {
        when:
        controller.ajaxDelete('a1')

        then:
        response.status == HttpStatus.SC_METHOD_NOT_ALLOWED
    }

    def "When deleting an activity, if the activity doesn't exist, return unauthorized to avoid leaking ids"() {
        when:
        request.method = 'POST'
        controller.ajaxDelete('a1')

        then:
        1 * activityService.get('a1') >> null

        and:
        response.status == HttpStatus.SC_UNAUTHORIZED
    }

    def "When deleting an activity, if the user doesn't have permission to view the activity, return unauthorized"() {
        when:
        request.method = 'POST'
        controller.ajaxDelete('a1')

        then:
        1 * activityService.get('a1') >> [projectId:'p1', activityId:'a1']
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> false

        and:
        response.status == HttpStatus.SC_UNAUTHORIZED
    }

    def "When deleting an activity, checks are performed when the project is complete"() {
        setup:
        Map activity = [projectId:'p1', activityId:'a1']
        when:
        request.method = 'POST'
        controller.ajaxDelete(activity.activityId)

        then:
        1 * activityService.get(activity.activityId) >> activity
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> true
        1 * activityService.canEditActivity(activity) >> false

        and:
        response.status == HttpStatus.SC_BAD_REQUEST
    }

    def "When deleting an activity, delegate to the activity service"() {
        setup:
        Map activity = [projectId:'p1', activityId:'a1']
        when:
        request.method = 'POST'
        controller.ajaxDelete(activity.activityId)

        then:
        1 * activityService.get(activity.activityId) >> activity
        1 * userService.getCurrentUserId() >> 'u1'
        1 * projectService.canUserEditProject('u1', 'p1') >> true
        1 * activityService.canEditActivity(activity) >> true
        1 * activityService.delete(activity.activityId) >> HttpStatus.SC_OK

        and:
        response.status == HttpStatus.SC_OK
    }

    def "Successfully able to import Flora species with a correct sheet name in the spreadsheet"() {
        setup:
        controller.setExcelImportService(new ExcelImportService())
        request.addFile(new MockMultipartFile('data', getClass().getResourceAsStream('/floraSurveyTest.xlsx')))

        params.type = 'RLP - Flora survey'
        params.listName = 'floraSurveyDetails'

        JSON.createNamedConfig("clientSideFormattedDates", { cfg ->
            DateTimeFormatter formatter = DateTimeFormat.forPattern("dd-MM-yyyy")
            cfg.registerObjectMarshaller(LocalDate.class, { formatter.print(it) })
        })

        when:
        request.method = 'POST'
        controller.ajaxUpload()

        then:
        1 * metadataService.annotatedOutputDataModel('RLP - Flora survey') >> getListModel()
        1 * metadataService.findByName('floraSurveyDetails', getListModel()) >> getMapModel()
        1 * speciesService.searchByScientificName(_) >> getScientificModel()

        response.status == HttpStatus.SC_OK
    }


    def "Not able to import Flora species with incorrect sheet name in the spreadsheet"() {
        setup:
        controller.setExcelImportService(new ExcelImportService())
        request.addFile(new MockMultipartFile('data', getClass().getResourceAsStream('/floraSurveyTest.xlsx')))

        params.type = 'RLP  Flora survey'
        params.listName = 'floraSurveyDetails'

        JSON.createNamedConfig("clientSideFormattedDates", { cfg ->
            DateTimeFormatter formatter = DateTimeFormat.forPattern("dd-MM-yyyy")
            cfg.registerObjectMarshaller(LocalDate.class, { formatter.print(it) })
        })

        when:
        request.method = 'POST'
        controller.ajaxUpload()

        then:
        0 * metadataService.annotatedOutputDataModel('RLP - Flora survey') >> getListModel()
        0 * metadataService.findByName('floraSurveyDetails', getListModel()) >> getMapModel()
        0 * speciesService.searchByScientificName(_) >> getScientificModel()

        response.status == HttpStatus.SC_BAD_REQUEST
    }

    def "Activities will not be retrieved from the activities-model when a project has a programId"() {

        setup:
        def activityTypes = [[name:'category 1', list:[[name:'activity 1', description:'description 1'], [name:'activity 2', description:'description 2']]]]
        def siteId = "111"
        def projectId = "222"
        def programId = "333"
        def project = [projectId:projectId, associatedProgram:'Programme 1', associatedSubProgram:'Sub-Programme 1', programId:programId]
        def model = model.project
        ProgramConfig programConfig = new ProgramConfig(projectReports:[[activityType:'type', adjustmentActivityType:'adjustment']])

        when:
        def result = controller.createPlan(siteId,projectId)

        then:
        1 * projectService.get(projectId) >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> programConfig
        0 * metadataService.activityTypesList('Programme 1', 'Sub-Programme 1') >> null
        1 * metadataService.activitiesListByProgramId(programId) >> activityTypes

        and:
        result.activityTypes != null
        result.activityTypes == activityTypes
    }


    private ArrayList<LinkedHashMap<String, Serializable>> getListModel() {
        def model = [[columns:[[preLabel:'Baseline survey or indicator (follow-up) survey?', css:'span3', dataType:'text', name:'baselineOrIndicatorSurvey', description:'', label:'Baseline survey or indicator (follow-up) survey?', source:'baselineOrIndicatorSurvey', type:'selectOne', constraints:['Baseline', 'Indicator'], validate:'required'], [preLabel:'Number of flora surveys conducted', css:'span3', dataType:'number', name:'numberOfFloraSurveys', label:'Number of flora surveys conducted', source:'numberOfFloraSurveys', type:'number', validate:'required,min[0]'], [preLabel:'Date range', css:'span3', dataType:'text', name:'dateRange', description:'What time of year (eg. Dates by dd/mm/yyyyy, Months, Season/s)', label:'Date range', source:'dateRange', type:'text', validate:'required,maxSize[300]'], [preLabel:'Site/s covered by flora surveys', dataType:'feature', name:'sitesSurveyed', label:'Site/s covered by flora surveys', source:'sitesSurveyed', type:'feature'], [decimalPlaces:3, computed:['expression:$geom.areaHa(sitesSurveyed)'], readonly:true, dataType:'number', name:'siteCalculatedAreaHa', behaviour:[[condition:'areaInvoicedHa > 0', type:'conditional_validation', value:[message:'The surveyed area must be mapped', validate:'required,min[0.0001]']]], units:'ha', label:'siteCalculatedAreaHa', source:'siteCalculatedAreaHa', type:'number', displayOptions:[displayUnits:true]], [preLabel:'Actual area (ha) covered by flora surveys', decimalPlaces:3, helpText:'Manually enter correct figure for this reporting period if different to mapped value.', defaultValue:['expression:$geom.areaHa(sitesSurveyed), type:computed'], dataType:'number', name:'areaSurveyedHa', units:'ha', label:'Actual area (ha) covered by flora surveys', source:'areaSurveyedHa', type:'number', validate:'required,min[0]', displayOptions:[displayUnits:true]], [preLabel:'Invoiced area (ha) covered by flora surveys', decimalPlaces:3, helpText:'Enter the amount you will invoice for during this reporting period.', dataType:'number', name:'areaInvoicedHa', units:'ha', label:'Invoiced area (ha) covered by flora surveys', source:'areaInvoicedHa', type:'number', validate:'required', displayOptions:[displayUnits:true]], [preLabel:'Reason for actual being different to mapped amount', dataType:'text', name:'mappingNotAlignedReason', behaviour:['[condition:not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1), type:if]'], label:'Reason for actual being different to mapped amount', source:'mappingNotAlignedReason', type:'selectOne', constraints:['Mapped area simplifies more complex area/s where work was undertaken during this period, Other'], validate:'required'], [dataType:'text', name:'mappingNotAlignedComments', behaviour:[[condition:"Other" == 'mappingNotAlignedReason', type:'if']], label:'mappingNotAlignedComments', placeholder:'Please enter the reason/s the mapping didnt align with the invoiced amount', source:'mappingNotAlignedComments', type:'textarea', rows:5, validate:'required,maxSize[300]'], [preLabel:'Reason for invoiced amount being different to actual amount', dataType:'text', name:'invoicedNotActualReason', behaviour:[['condition:roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2), type:visible']], label:'Reason for invoiced amount being different to actual amount', source:'invoicedNotActualReason', type:'selectOne', constraints:['Work was undertaken over a greater area than will be invoiced for', 'Other'], validate:'required'], [dataType:'text', name:'invoicedNotActualComments', behaviour:[[condition:"Other" == 'invoicedNotActualReason', type:'if']], label:'invoicedNotActualComments', placeholder:'Please enter the reason/s the mapping didnt align with the invoiced amount', source:'invoicedNotActualComments', type:'textarea', rows:5, validate:'required,maxSize[300]'], [preLabel:'Please attach mapping details', dataType:'document', name:'extraMappingDetails', description:'Please fill in the Mapped detailed map for the area, covered by this project service - during reporting period (include the scale measure for each map).', behaviour:['[condition:not within(areaSurveyedHa, siteCalculatedAreaHa, 0.1) or roundTo(areaSurveyedHa, 2) != roundTo(areaInvoicedHa, 2), type:if]'], label:'Please attach mapping details', source:'extraMappingDetails', type:'document', validate:'required'], [columns:[[dataType:'species', name:'species', width:'30%', label:'Target species recorded', source:'species', title:'Target species recorded', type:'speciesSelect', validate:'required'], [dataType:'text', name:'threatenedEcologicalCommunity', width:'25%', label:'Threatened ecological communities (if applicable)', source:'threatenedEcologicalCommunity', title:'Threatened ecological communities (if applicable)', type:'text', validate:'maxSize[300]'], [dataType:'text', name:'surveyTechnique', width:'20%', description:'What/how will the survey capture the flora data', label:'Survey technique', source:'surveyTechnique', title:'Survey technique', type:'text', validate:'required,maxSize[300]'], [dataType:'text', name:'individualsOrGroups', width:'15%', label:'Individuals or groups?', source:'individualsOrGroups', title:'Individuals or groups?', type:'selectOne', constraints:['Individuals', 'Groups'], validate:'required'], [dataType:'number', name:'numberOfIndividualsOrGroups', width:'10%', label:'Number of groups / individuals in flora survey', source:'numberOfIndividualsOrGroups', title:'Number of groups / individuals in flora survey', type:'number', validate:'required,min[0]']], dataType:'list', name:'floraSurveyDetails']], dataType:'list', name:'floraSurveys', minSize:1], [preLabel:'Clarification, if needed', css:'span8', dataType:'text', name:'comments', label:'Clarification, if needed', source:'comments', placeholder:'Clarification comments include points for follow up with the project manager about this service like:', type:'textarea', rows:4, validate:'maxSize[1500]'], [preLabel:'Optionally attach photos', dataType:'image', name:'photographicEvidence', label:'Optionally attach photos', source:'photographicEvidence', type:'image'], [preLabel:'', dataType:'text', name:'projectAssuranceDetails', description:'', label:'projectAssuranceDetails', source:'projectAssuranceDetails', placeholder:'List the documentary evidence you have available for this project service. Include specifically, the document titles and location (e.g. internal IT network pathway, URLs) to assist with locating this material for future audits/assurance purposes.', type:'textarea', rows:4], [columns:[[dataType:'document', name:'attachments', description:'Please attach any Evidence of Service Delivery here', label:'Attached documents', source:'attachments', title:'Attached documents', type:'document']], dataType:'list', name:'assuranceDocuments']]
        model
    }

    private LinkedHashMap<String, Serializable> getMapModel() {
        def model = [columns:[
                [dataType:'species', name:'species', width:'30%', label:'Target species recorded', source:'species', title:'Target species recorded', type:'speciesSelect', validate:'required'],
                [dataType:'text', name:'threatenedEcologicalCommunity', width:'25%', label:'Threatened ecological communities (if applicable)', source:'threatenedEcologicalCommunity', title:'Threatened ecological communities (if applicable)', type:'text', validate:'maxSize[300]'],
                [dataType:'text', name:'surveyTechnique', width:'20%', description:'What/how will the survey capture the flora data', label:'Survey technique', source:'surveyTechnique', title:'Survey technique', type:'text', validate:'required,maxSize[300]'],
                [dataType:'text', name:'individualsOrGroups', width:'15%', label:'Individuals or groups?', source:'individualsOrGroups', title:'Individuals or groups?', type:'selectOne', constraints:['Individuals', 'Groups'], validate:'required'],
                [dataType:'number', name:'numberOfIndividualsOrGroups', width:'10%', label:'Number of groups / individuals in flora survey', source:'numberOfIndividualsOrGroups', title:'Number of groups / individuals in flora survey', type:'number', validate:'required,min[0]']],
                      dataType:'list', name:'floraSurveyDetails']
        model
    }

    private LinkedHashMap<String, Serializable> getScientificModel() {
        def scientificModel = [commonName:'Sheeps Burr', matchedNames:['Acaena echinata'], rankID:7000, rankString:'species', scientificName:'Acaena echinata', georeferencedCount:0, name:'Acaena echinata', guid:'https://id.biodiversity.org.au/node/apni/2917353', occurrenceCount:0, scientificNameMatches:['<b>Acaena echinata</b>'], commonNameMatches:[]]
        scientificModel
    }
}
