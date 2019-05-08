package au.org.ala.merit

import grails.converters.JSON
import grails.test.mixin.TestFor
import org.codehaus.groovy.grails.web.converters.marshaller.json.CollectionMarshaller
import org.codehaus.groovy.grails.web.converters.marshaller.json.MapMarshaller
import org.joda.time.Period
import spock.lang.Specification
import spock.lang.Unroll

/**
 * Tests the ProjectService class.
 */
@TestFor(ProjectService)
class ProjectServiceSpec extends Specification {

    WebService webService = Mock(WebService)
    ReportService reportService = Mock(ReportService)
    UserService userService = Stub(UserService)
    MetadataService metadataService = Stub(MetadataService)
    ActivityService activityService = Mock(ActivityService)
    DocumentService documentService = Mock(DocumentService)
    EmailService emailService = Mock(EmailService)
    ProjectConfigurationService projectConfigurationService = Mock(ProjectConfigurationService)

    def setup() {
        JSON.registerObjectMarshaller(new MapMarshaller())
        JSON.registerObjectMarshaller(new CollectionMarshaller())
        service.webService = webService
        // Delegate activity description to the implementation in the ActivityService while retaining the ability to mock other methods.
        au.org.ala.merit.ActivityService realService = new au.org.ala.merit.ActivityService()
        activityService.defaultDescription(_ as Map) >> {Map activity -> realService.defaultDescription(activity) }
        service.grailsApplication = [config:[ecodata:[baseUrl:'']]]
        service.reportService = reportService
        service.userService = userService
        service.metadataService = metadataService
        service.activityService = activityService
        service.documentService = documentService
        service.emailService = emailService
        service.projectConfigurationService = projectConfigurationService
        userService.userIsAlaOrFcAdmin() >> false
        metadataService.getProgramConfiguration(_,_) >> [reportingPeriod:6, reportingPeriodAlignedToCalendar: true, weekDaysToCompleteReport:43]
        projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([reportingPeriod:6, reportingPeriodAlignedToCalendar: true, weekDaysToCompleteReport:43])
    }

    def "generate reports with 3 monthly period"() {

        given:
        def projectId = 'project1'
        def start = '2014-01-01T00:00:00Z'
        def end = '2014-12-29T00:00:00Z'

        def config = [[type:'t1', period: Period.months(3)]]
        webService.getJson(_) >> [projectId:projectId, plannedStartDate:start, plannedEndDate:end]

        when:
        def result = service.regenerateReportingActivitiesForProject(projectId, config)

        then:
        result.create.size() == 4
        result.delete.size() == 0
        def activities = result.create
        activities.size() == 4
        activities[0].plannedStartDate == '2014-01-01T00:00:00Z'
        activities[0].plannedEndDate == '2014-03-31T00:00:00Z'
        activities[0].type == 't1'
        activities[0].projectId == projectId
        activities[0].description == 't1 (Jan - Mar 2014)'
        activities[1].plannedStartDate == '2014-04-01T00:00:00Z'
        activities[1].plannedEndDate == '2014-06-30T00:00:00Z'
        activities[1].type == 't1'
        activities[1].projectId == projectId
        activities[1].description == 't1 (Apr - Jun 2014)'
        activities[2].plannedStartDate == '2014-07-01T00:00:00Z'
        activities[2].plannedEndDate == '2014-09-30T00:00:00Z'
        activities[2].type == 't1'
        activities[2].projectId == projectId
        activities[2].description == 't1 (Jul - Sep 2014)'
        activities[3].plannedStartDate == '2014-10-01T00:00:00Z'
        activities[3].plannedEndDate == '2014-12-29T00:00:00Z'  // Last activity end date should not be after the project end date.
        activities[3].type == 't1'
        activities[3].projectId == projectId
        activities[3].description == 't1 (Oct - Dec 2014)'

    }

    def "generate reports with 1 monthly period"() {

        given:
        def projectId = 'project1'
        def start = '2014-01-01T00:00:00Z'
        def end = '2014-06-30T00:00:00Z'

        def config = [[type:'t1', period: Period.months(1)]]
        webService.getJson(_) >> [projectId:projectId, plannedStartDate:start, plannedEndDate:end]

        when:
        def result = service.regenerateReportingActivitiesForProject(projectId, config)

        then:
        result.create.size() == 6
        result.delete.size() == 0
        def activities = result.create
        activities[0].plannedStartDate == '2014-01-01T00:00:00Z'
        activities[0].plannedEndDate == '2014-01-31T00:00:00Z'
        activities[0].type == 't1'
        activities[0].projectId == projectId
        activities[0].description == 't1 (Jan 2014)'
        activities[5].plannedStartDate == '2014-06-01T00:00:00Z'
        activities[5].plannedEndDate == '2014-06-30T00:00:00Z'
        activities[5].type == 't1'
        activities[5].projectId == projectId
        activities[5].description == 't1 (Jun 2014)'

    }

    def "activities should not be created in periods that already have them"() {
        given:
        def projectId = 'project1'
        def start = '2014-01-01T00:00:00Z'
        def end = '2014-06-30T00:00:00Z'
        def existingActivities = [[type:'t1', plannedStartDate: '2014-01-05T00:00:00Z', plannedEndDate:'2014-01-25T00:00:00Z'],
                                  [type:'t2', plannedStartDate: '2014-02-05T00:00:00Z', plannedEndDate:'2014-02-25T00:00:00Z'],
                                  [type:'t1', plannedStartDate: '2014-05-05T00:00:00Z', plannedEndDate:'2014-05-25T00:00:00Z']]

        def config = [[type:'t1', period: Period.months(1)]]
        webService.getJson(_) >> [projectId:projectId, plannedStartDate:start, plannedEndDate:end, activities:existingActivities]

        when:
        def result = service.regenerateReportingActivitiesForProject(projectId, config)

        then:
        result.create.size() == 4
        result.delete.size() == 0
        def activities = result.create
        activities.size() == 4
        activities[0].plannedStartDate == '2014-02-01T00:00:00Z'
        activities[0].plannedEndDate == '2014-02-28T00:00:00Z'
        activities[0].type == 't1'
        activities[0].projectId == projectId
        activities[0].description == 't1 (Feb 2014)'
        activities[1].plannedStartDate == '2014-03-01T00:00:00Z'
        activities[1].plannedEndDate == '2014-03-31T00:00:00Z'
        activities[1].type == 't1'
        activities[1].projectId == projectId
        activities[1].description == 't1 (Mar 2014)'
        activities[2].plannedStartDate == '2014-04-01T00:00:00Z'
        activities[2].plannedEndDate == '2014-04-30T00:00:00Z'
        activities[2].type == 't1'
        activities[2].projectId == projectId
        activities[2].description == 't1 (Apr 2014)'
        activities[3].plannedStartDate == '2014-06-01T00:00:00Z'
        activities[3].plannedEndDate == '2014-06-30T00:00:00Z'
        activities[3].type == 't1'
        activities[3].projectId == projectId
        activities[3].description == 't1 (Jun 2014)'


    }

    def "plan should not be submitted if it's already been submitted."(){
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_SUBMITTED
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.submitPlan(projectId)

        then:
        result.error == "Invalid plan status"
    }


    def "plan should not be approved if it's already been approved."(){
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_APPROVED
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.approvePlan(projectId)

        then:
        result.error == "Invalid plan status"
    }

    def "plan should not be rejected if it's not been approved."(){
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_NOT_APPROVED
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.rejectPlan(projectId)

        then:
        result.error == "Invalid plan status"
    }

    def "an email should be sent when a plan is submitted"() {
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_NOT_APPROVED
        List projectRoles = []
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.submitPlan(projectId)

        then:
        result.message == 'success'
        1 * webService.doPost({it.endsWith("project/"+projectId)}, [planStatus:ProjectService.PLAN_SUBMITTED]) >> [resp:[status:'ok']]
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> projectRoles
        1 * emailService.sendEmail(EmailTemplate.DEFAULT_PLAN_SUBMITTED_EMAIL_TEMPLATE,_,projectRoles, RoleService.PROJECT_ADMIN_ROLE)
    }

    def "an email should be sent when a plan is approved"() {
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_SUBMITTED
        List projectRoles = []
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.approvePlan(projectId)

        then:
        result.message == 'success'
        1 * webService.doPost({it.endsWith("project/"+projectId)}, [planStatus:ProjectService.PLAN_APPROVED]) >> [resp:[status:'ok']]
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> projectRoles
        1 * emailService.sendEmail(EmailTemplate.DEFAULT_PLAN_APPROVED_EMAIL_TEMPLATE,_,projectRoles, RoleService.GRANT_MANAGER_ROLE)

    }

    def "an email should be sent when a plan is returned"() {
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_SUBMITTED
        List projectRoles = []
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.rejectPlan(projectId)

        then:
        result.message == 'success'
        1 * webService.doPost({it.endsWith("project/"+projectId)}, [planStatus:ProjectService.PLAN_NOT_APPROVED]) >> [resp:[status:'ok']]
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> projectRoles
        1 * emailService.sendEmail(EmailTemplate.DEFAULT_PLAN_RETURNED_EMAIL_TEMPLATE,_,projectRoles, RoleService.GRANT_MANAGER_ROLE)
    }

    @Unroll
    def "the email template for the plan workflow can be specified by the program configuration"(String initialState, Closure action, EmailTemplate expectedTemplate, String expectedRole) {
        given:
        def projectId = 'project1'
        def planStatus = initialState
        List projectRoles = []
        Map project =  [projectId:projectId, planStatus:planStatus]
        ProgramConfig programConfig = new ProgramConfig([
                emailTemplates:[
                        (ProgramConfig.PLAN_SUBMITTED_EMAIL_TEMPLATE_CONFIG_ITEM): EmailTemplate.RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE.name(),
                        (ProgramConfig.PLAN_APPROVED_EMAIL_TEMPLATE_CONFIG_ITEM) : EmailTemplate.RLP_PLAN_APPROVED_EMAIL_TEMPLATE.name(),
                        (ProgramConfig.PLAN_RETURNED_EMAIL_TEMPLATE_CONFIG_ITEM) : EmailTemplate.RLP_PLAN_RETURNED_EMAIL_TEMPLATE.name()
                ]
        ])
        webService.getJson(_) >> project
        Map results = [:]
        1 * emailService.sendEmail(_,_,_,_) >> {actualTemplate, p , roles, actualRole -> results.actualEmailTemplate = actualTemplate; results.actualRole = actualRole}

        when:
        action(service, projectId)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> programConfig
        1 * webService.doPost({it.endsWith("project/"+projectId)}, _) >> [resp:[status:'ok']]
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> projectRoles
        results.actualEmailTemplate == expectedTemplate
        results.actualRole == expectedRole



        where:
        initialState                     | action                       | expectedTemplate                                | expectedRole
        ProjectService.PLAN_NOT_APPROVED | {s, id -> s.submitPlan(id)}  | EmailTemplate.RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE | RoleService.PROJECT_ADMIN_ROLE
        ProjectService.PLAN_SUBMITTED    | {s, id -> s.approvePlan(id)} | EmailTemplate.RLP_PLAN_APPROVED_EMAIL_TEMPLATE  | RoleService.GRANT_MANAGER_ROLE
        ProjectService.PLAN_SUBMITTED    | {s, id -> s.rejectPlan(id)}  | EmailTemplate.RLP_PLAN_RETURNED_EMAIL_TEMPLATE  | RoleService.GRANT_MANAGER_ROLE
        ProjectService.PLAN_APPROVED     | {s, id -> s.rejectPlan(id)}  | EmailTemplate.RLP_PLAN_RETURNED_EMAIL_TEMPLATE  | RoleService.GRANT_MANAGER_ROLE
    }


    def "the project service should delegate to the report service to submit a report"() {
        given:
        def projectId = 'project1'
        List projectRoles = []
        Map project = [projectId: projectId, planStatus: ProjectService.PLAN_APPROVED]
        webService.getJson(_) >> project
        String reportId = 'r1'
        Map report = [reportId: reportId, name:'Report 1']
        Map reportDetails = [reportId: reportId, activityIds: ['a1', 'a2']]
        reportService.getReportsForProject(_) >> [report]


        when:
        def result = service.submitReport(projectId, reportDetails)

        then:
        result.success == true

        1 * projectConfigurationService.getProjectConfiguration(project) >> new ProgramConfig([:])
        1 * webService.getJson({ it.endsWith("permissions/getMembersForProject/" + projectId) }) >> projectRoles
        1 * reportService.submitReport(reportId, reportDetails.activityIds, project, projectRoles, EmailTemplate.DEFAULT_REPORT_SUBMITTED_EMAIL_TEMPLATE) >> [success:true]
    }

    def "the project service should delegate to the report service to approve a report"() {
        given:
        def projectId = 'project1'
        List projectRoles = []
        Map project = [projectId: projectId, planStatus: ProjectService.PLAN_APPROVED]
        webService.getJson(_) >> project
        String reportId = 'r1'
        Map report = [reportId: reportId]
        Map reportDetails = [reportId: reportId, activityIds: ['a1', 'a2'], reason:'unused']
        reportService.getReportsForProject(_) >> [report]


        when:
        def result = service.approveReport(projectId, reportDetails)

        then:
        result.success == true

        1 * projectConfigurationService.getProjectConfiguration(project) >> new ProgramConfig([:])
        1 * webService.getJson({ it.endsWith("permissions/getMembersForProject/" + projectId) }) >> projectRoles
        1 * reportService.approveReport(reportId, reportDetails.activityIds, reportDetails.reason, project, projectRoles, EmailTemplate.DEFAULT_REPORT_APPROVED_EMAIL_TEMPLATE) >> [success:true]
    }

    def "the project service should delegate to the report service to return a report"() {
        given:
        def projectId = 'project1'
        List projectRoles = []
        Map project = [projectId: projectId, planStatus: ProjectService.PLAN_APPROVED]
        webService.getJson(_) >> project
        String reportId = 'r1'
        Map report = [reportId: reportId]
        Map reportDetails = [reportId: reportId, activityIds: ['a1', 'a2'], reason:'unused']
        reportService.getReportsForProject(_) >> [report]


        when:
        def result = service.rejectReport(projectId, reportDetails)

        then:
        result.success == true

        1 * projectConfigurationService.getProjectConfiguration(project) >> new ProgramConfig([:])
        1 * webService.getJson({ it.endsWith("permissions/getMembersForProject/" + projectId) }) >> projectRoles
        1 * reportService.rejectReport(reportId, reportDetails.activityIds, reportDetails.reason, project, projectRoles, EmailTemplate.DEFAULT_REPORT_RETURNED_EMAIL_TEMPLATE) >> [success:true]
    }


    def "a project's start date cannot be changed if the project has a submitted MERI plan"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-06-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> false
        reportService.getReportsForProject(_) >> []
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_SUBMITTED, plannedStartDate: '2015-07-01T00:00Z']

        when:
        def result = service.changeProjectStartDate(projectId, newStartDate, false)

        then:
        result.error != null
    }

    def "a project's start date cannot be changed if the project has an approved MERI plan"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-06-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> false
        reportService.getReportsForProject(_) >> []
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, plannedStartDate: '2015-07-01T00:00Z']

        when:
        def result = service.changeProjectStartDate(projectId, newStartDate, false)

        then:
        result.error != null
    }

    def "a project's start date cannot be changed if the project has a submitted or approved report"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-06-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> true
        reportService.getReportsForProject(_) >> [[publicationStatus:ReportService.REPORT_APPROVED]]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_NOT_APPROVED, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']

        when:
        def result = service.changeProjectStartDate(projectId, newStartDate, false)

        then:
        result.error != null
    }

    def "a project's end date cannot be changed to fall within a period containing a submitted or approved report"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-07-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> true
        reportService.getReportsForProject(_) >> [[publicationStatus:ReportService.REPORT_APPROVED]]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_NOT_APPROVED, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        webService.doPost(_, _) >> [resp:[status:200]]
        when:
        def result = service.changeProjectStartDate(projectId, newStartDate, false)

        then:
        result.error != null
    }

    def "a project should only be marked as completed when the final stage report is approved"(String reportId, boolean shouldComplete) {
        setup:
        def projectId = 'project1'
        def reason = null
        def activityIds = ['a1', 'a2']
        def stageReportDetails = [activityIds:activityIds, reportId:reportId, stage:'Stage 2', reason:reason]
        reportService.getReportsForProject(projectId) >>[
                [reportId:'r1', publicationStatus:ReportService.REPORT_APPROVED, name:'Stage 1', fromDate: '2015-07-01T00:00Z', toDate: '2016-01-01T00:00Z'],
                [reportId:'r2', publicationStatus:ReportService.REPORT_NOT_APPROVED, name:'Stage 2', fromDate: '2016-01-01T00:00Z', toDate: '2017-01-01T00:00Z']]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_NOT_APPROVED, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']

        when:

        service.approveReport(projectId, stageReportDetails)

        then:
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> []
        1 * documentService.createTextDocument(_, _)
        1 * reportService.approveReport(*_) >> [success:true]
        if (shouldComplete) {
            1 * webService.doPost(_, [status:'completed'])
        }

        where:
        reportId | shouldComplete
        'r1'     | false
        'r2'     | true
    }

    def "only completed projects with approved plans can be unlocked for correction"(String projectStatus, String planStatus) {
        given:
        String projectId = 'project1'
        String declarationText = 'declaration'

        when:
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus, status:projectStatus, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        Map result = service.unlockPlanForCorrection(projectId, declarationText)

        then:
        result.error

        where:
        projectStatus | planStatus
        'active'      | 'approved'
        'active'      | 'submitted'
        'active'      | 'not approved'
        'completed'   | 'submitted'
        'completed'   | 'not approved'
    }

    def "the declaration should be recorded when a plan is unlocked for correction"() {
        given:
        String projectId = 'project1'
        String declarationText = 'declaration'

        when:
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, status:ProjectService.COMPLETE, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        Map result = service.unlockPlanForCorrection(projectId, declarationText)

        then:
        1 * webService.doPost({it.endsWith("project/${projectId}")}, [planStatus:ProjectService.PLAN_UNLOCKED]) >> [resp:[status:200]]
        1 * documentService.createTextDocument({it.projectId == projectId}, {it.contains(declarationText)})

    }

    def "only unlocked projects can be locked after corrections are finished"(String projectStatus, String planStatus) {
        given:
        String projectId = 'project1'

        when:
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus, status:projectStatus, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        Map result = service.finishedCorrectingPlan(projectId)

        then:
        result.error

        where:
        projectStatus | planStatus
        'active'      | 'approved'
        'active'      | 'submitted'
        'active'      | 'not approved'
        'completed'   | 'submitted'
        'completed'   | 'not approved'
    }

    def "unlocked projects can be locked after corrections are finished"() {
        given:
        String projectId = 'project1'

        when:
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_UNLOCKED, status:ProjectService.COMPLETE, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        Map result = service.finishedCorrectingPlan(projectId)

        then:
        1 * webService.doPost({it.endsWith("project/${projectId}")}, [planStatus:ProjectService.PLAN_APPROVED]) >> [resp:[status:200]]

    }

    def "activities in unlocked projects can be edited"() {
        when:
        String projectId = 'project1'
        String endDate = '2016-12-31T13:00:00Z'
        Map activity = [projectId:projectId, plannedEndDate: endDate]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_UNLOCKED, status:ProjectService.COMPLETE, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', reports:[]]

        then:
        service.canEditActivity(activity) == true
    }

    def "activities in complete projects (that are not unlocked) cannot be edited"() {
        when:
        String projectId = 'project1'
        String endDate = '2016-12-31T13:00:00Z'
        Map activity = [projectId:projectId, plannedEndDate: endDate]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, status:ProjectService.COMPLETE, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', reports:[]]

        then:
        service.canEditActivity(activity) == false
    }

    def "activities in approved or submitted stages cannot be edited"() {
        setup:
        String projectId = 'project1'
        String endDate = '2016-12-31T13:00:00Z'
        Map activity = [projectId:projectId, plannedEndDate: endDate]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, status:'active', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        reportService.getReportsForProject(projectId) >> []
        reportService.findReportForDate(endDate, []) >> [:]

        when:
        boolean canEdit = service.canEditActivity(activity)

        then:
        1 * reportService.isSubmittedOrApproved(_) >> true
        canEdit == false

        when:
        canEdit = service.canEditActivity(activity)

        then:
        1 * reportService.isSubmittedOrApproved(_) >> false
        canEdit == true
    }

    def "Changing the project dates will result in the project reports being re-generated"() {
        setup:
        String projectId = 'project1'
        String endDate = '2016-12-31T13:00:00Z'
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, status:'active', plannedStartDate: '2015-06-30T14:00:00Z', plannedEndDate:'2016-12-31T13:00:00Z', planStatus:ProjectService.PLAN_NOT_APPROVED, status:'active']
        reportService.includesSubmittedOrApprovedReports(_) >> false
        reportService.getReportsForProject(_) >> []

        when:
        service.update(projectId, [plannedStartDate:'2015-06-30T14:00:00Z', plannedEndDate:'2017-06-30T14:00:00Z'])


        then:
        projectConfigurationService.getProjectConfiguration(_) >> meritProjectConfig()
        1 * webService.doPost({it.endsWith('project/'+projectId)}, _) >> [resp:[:]]
        1 * reportService.regenerateReports([], _, {it.id.projectId == projectId})

    }


    def "An RLP project with no reports has no restriction on project end date changes"() {

        setup:
        Map project = [reports:[]]
        Map config = [autogeneratedActivites:true]

        when:
        String endDate = service.minimumProjectEndDate(project, config)

        then:
        endDate == null

        when: "the project report list is null"
        endDate = service.minimumProjectEndDate([:], config)

        then: "the same behaviour is observed"
        endDate == null
    }

    def "An RLP project with unstarted reports has no restriction on end date changes"() {

        setup:
        Map project = [reports:[
                [progress:ActivityService.PROGRESS_PLANNED, fromDate:'2017-06-30T14:00:00Z', toDate:'2017-12-31T13:00:00Z'],
                [progress:ActivityService.PROGRESS_PLANNED, fromDate:'2017-12-31T13:00:00Z', toDate:'2018-06-30T14:00:00Z'],
                [progress:ActivityService.PROGRESS_PLANNED, fromDate:'2018-06-30T14:00:00Z', toDate:'2018-12-31T13:00:00Z']
        ]]
        Map config = [autogeneratedActivites:true]

        when:
        String endDate = service.minimumProjectEndDate(project, config)

        then:
        endDate == null
    }

    def "An RLP project with started reports will not be able to change the end date such that a started report is affected"() {

        setup:
        Map project = [reports:[
                [progress:ActivityService.PROGRESS_FINISHED, fromDate:'2017-06-30T14:00:00Z', toDate:'2017-12-31T13:00:00Z'],
                [progress:ActivityService.PROGRESS_STARTED, fromDate:'2017-12-31T13:00:00Z', toDate:'2018-06-30T14:00:00Z'],
                [progress:ActivityService.PROGRESS_PLANNED, fromDate:'2018-06-30T14:00:00Z', toDate:'2018-12-31T13:00:00Z']
        ]]
        Map config = [autogeneratedActivities:true]

        when:
        String endDate = service.minimumProjectEndDate(project, config)

        then:
        endDate == '2018-06-30T14:00:00Z'
    }

    def "A traditional MERIT project with no activities will not have end date changes restricted"() {

        setup:
        Map project = [activities:[]]
        Map config = [autogeneratedActivities:false]

        when:
        String endDate = service.minimumProjectEndDate(project, config)

        then:
        endDate == null

        when: "the project activity list is null"
        endDate = service.minimumProjectEndDate([:], config)

        then: "the same behaviour is observed"
        endDate == null
    }


    def "A traditional MERIT project cannot change the end date so that it falls before an activity end date"() {

        setup:
        Map project = [activities:[
                [progress:ActivityService.PROGRESS_FINISHED, plannedStartDate:'2017-06-30T14:00:00Z', plannedEndDate:'2017-12-31T13:00:00Z'],
                [progress:ActivityService.PROGRESS_STARTED, plannedStartDate:'2017-12-31T13:00:00Z', plannedEndDate:'2018-06-30T14:00:00Z'],
                [progress:ActivityService.PROGRESS_PLANNED, plannedStartDate:'2018-06-30T14:00:00Z', plannedEndDate:'2018-12-31T13:00:00Z']
        ]]
        Map config = [autogeneratedActivities:false]

        when:
        String endDate = service.minimumProjectEndDate(project, config)

        then:
        endDate == '2018-12-31T13:00:00Z'
    }

    def "if the doesn't use activity based reporting and there are no approved or submitted reports, the project start date can be changed regardless of the meri plan status"() {
        setup:
        Map project = [projectId:'p1', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', planStatus:ProjectService.PLAN_APPROVED]

        webService.getJson(_) >> project
        reportService.getReportsForProject(project.projectId) >> [[reportId:'r1', publicationStatus:ReportService.REPORT_NOT_APPROVED, fromDate:project.plannedStartDate, toDate:project.plannedEndDate]]
        reportService.firstReportWithDataByCriteria(_, _) >> null

        when:
        String result = service.validateProjectStartDate(project.projectId, '2015-07-03T00:00Z')

        then:
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([leniantStartDate:true])
        result == null
    }

    def "if the project doesn't use activity based reporting and there is a submitted report, the start date must not invalidate the submitted report"(reportStatus, date, valid) {
        setup:
        Map project = [projectId:'p1', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', planStatus:ProjectService.PLAN_APPROVED]
        Map r1 = [reportId:'r1', publicationStatus:reportStatus, fromDate:project.plannedStartDate, toDate:'2015-12-31T00:00Z']
        reportService.firstReportWithDataByCriteria(_, _) >> r1

        boolean submittedOrApproved = (reportStatus == ReportService.REPORT_SUBMITTED || reportStatus == ReportService.REPORT_APPROVED)
        webService.getJson(_) >> project
        reportService.getReportsForProject(project.projectId) >> [r1]
        reportService.isSubmittedOrApproved(_) >> submittedOrApproved

        when:
        String result = service.validateProjectStartDate(project.projectId, date)

        then:
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([activityBasedReporting: false])
        (result == null) == valid

        where:
        reportStatus | date | valid
        ReportService.REPORT_APPROVED | '2015-07-01T00:00Z' | true
        ReportService.REPORT_APPROVED | '2015-08-01T00:00Z' | true
        ReportService.REPORT_APPROVED | '2016-01-01T00:00Z' | false
        ReportService.REPORT_APPROVED | '2015-04-01T00:00Z' | false
        ReportService.REPORT_SUBMITTED | '2015-07-01T00:00Z' | true
        ReportService.REPORT_SUBMITTED | '2015-08-01T00:00Z' | true
        ReportService.REPORT_SUBMITTED | '2016-01-01T00:00Z' | false
        ReportService.REPORT_SUBMITTED | '2015-04-01T00:00Z' | false
    }

    def "if there is an empty report before the first report with data, we should be allowed to change the start date as if the first report with data was the only report"(date, valid) {
        setup: "The project has two reports, but the first has had it's data deleted.  This scenario is to simulate projects being loaded before the contract dates are known and the dates not being corrected before reporting begins"
        Map project = [projectId:'p1', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', planStatus:ProjectService.PLAN_APPROVED]
        Map r1 = [reportId:'r1', publicationStatus:'unpublished', fromDate:project.plannedStartDate, toDate:'2015-12-31T00:00Z']
        Map r2 = [reportId:'r2', publicationStatus:'submitted', fromDate:r1.toDate, toDate:project.plannedEndDate]
        reportService.firstReportWithDataByCriteria(_, _) >> r2
        webService.getJson(_) >> project
        reportService.getReportsForProject(project.projectId) >> [r1, r2]

        println "$date, $valid"

        when:
        String result = service.validateProjectStartDate(project.projectId, date)

        then:
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([activityBasedReporting: false])
        (result == null) == valid

        where:
        date | valid
        '2016-07-01T00:00Z' | true  // New start date falls inside r2's reporting period
        '2017-01-01T00:00Z' | false // New start date is after r2 reporting period, invalidating it
        '2015-04-01T00:00Z' | false // New start date is before r2's reporting period begins.  This in theory could be supported but the rules of how to manage this are not defined so we disallow it.

    }

    def "When adjusting a report, the report to be adjusted must belong to the specified project"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        String reason = "testing"

        when: "an attempt is made to adjust a report for a different project"
        Map result = service.adjustReport(projectId, reportId, reason)

        then: "A check will be performed to ensure the report belongs to the project"
        1 * webService.getJson({it.contains("/"+projectId)}) >> [reports:[[reportId:'r2', projectId:'p2', toDate:'2018-06-30T14:00:00Z']]]

        and:"the check will fail so the report will not be adjusted"

        result.success == false
        result.error != null
        0 * reportService._

    }

    def "Adjusting a report involves collaboration with the ReportService"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        String reason = "testing"

        when: "an attempt is made to adjust a report for a different project"
        Map result = service.adjustReport(projectId, reportId, reason)

        then: "A check will be performed to ensure the report belongs to the project"
        1 * webService.getJson({it.contains("/"+projectId)}) >> [projectId:projectId, reports:[[reportId:reportId, projectId:projectId, toDate:'2018-06-30T14:00:00Z']]]
        1 * webService.getJson('permissions/getMembersForProject/'+projectId) >> []
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([:])

        and:"the report service will perform the adjustment"
        1 * reportService.createAdjustmentReport(reportId, reason, [:], {it.projectId == projectId}, _, EmailTemplate.DEFAULT_REPORT_ADJUSTED_EMAIL_TEMPLATE) >> [success:true]
        result.error == null

    }

    private Map meritProjectConfig() {
        Map reportConfig = [reportType: "Activity",
                            reportDescriptionFormat: "Stage Report %d for %4\$s",
                            reportNameFormat: "Stage Report %d",
                            reportingPeriodInMonths: 6,
                            reportsAlignedToCalendar: false]

        [projectReports:[reportConfig], autogeneratedActivities: false, activityBasedReporting:true]
    }


}
