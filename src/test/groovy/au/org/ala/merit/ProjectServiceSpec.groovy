package au.org.ala.merit

import au.org.ala.ecodata.forms.TermsService
import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.hub.HubSettings
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.converters.JSON
import grails.testing.services.ServiceUnitTest
import groovy.json.JsonSlurper
import org.apache.http.HttpStatus
import org.grails.web.converters.marshaller.json.CollectionMarshaller
import org.grails.web.converters.marshaller.json.MapMarshaller
import org.joda.time.Period
import spock.lang.Specification
import spock.lang.Unroll
/**
 * Tests the ProjectService class.
 */
class ProjectServiceSpec extends Specification implements ServiceUnitTest<ProjectService> {

    WebService webService = Mock(WebService)
    ReportService reportService = Mock(ReportService)
    UserService userService = Stub(UserService)
    MetadataService metadataService = Stub(MetadataService)
    ActivityService activityService = Mock(ActivityService)
    DocumentService documentService = Mock(DocumentService)
    EmailService emailService = Mock(EmailService)
    AuditService auditService = Mock(AuditService)
    ProjectConfigurationService projectConfigurationService = Mock(ProjectConfigurationService)
    ProgramConfig projectConfig = new ProgramConfig([activityBasedReporting: true, reportingPeriod:6, reportingPeriodAlignedToCalendar: true, weekDaysToCompleteReport:43])
    ProgramService programService = Mock(ProgramService)
    CacheService cacheService = Mock(CacheService)
    LockService lockService = Mock(LockService)
    TermsService termsService = Mock(TermsService)

    Map reportConfig = [
            weekDaysToCompleteReport:projectConfig.weekDaysToCompleteReport,
            reportType:ReportService.REPORT_TYPE_STAGE_REPORT,
            reportingPeriodInMonths: projectConfig.reportingPeriod,
            reportsAlignedToCalendar: projectConfig.reportingPeriodAlignedToCalendar,
            reportNameFormat: "Stage %1d",
            reportDescriptionFormat: "Stage %1d"
    ]

    def setup() {
        JSON.registerObjectMarshaller(new MapMarshaller())
        JSON.registerObjectMarshaller(new CollectionMarshaller())
        service.webService = webService
        // Delegate activity description to the implementation in the ActivityService while retaining the ability to mock other methods.
        au.org.ala.merit.ActivityService realService = new au.org.ala.merit.ActivityService()
        activityService.defaultDescription(_ as Map) >> {Map activity -> realService.defaultDescription(activity) }
        grailsApplication.config.ecodata.baseUrl = ''
        service.reportService = reportService
        service.userService = userService
        service.metadataService = metadataService
        service.activityService = activityService
        service.documentService = documentService
        service.emailService = emailService
        service.projectConfigurationService = projectConfigurationService
        service.auditService = auditService
        service.programService = programService
        service.lockService = lockService
        service.speciesService = new SpeciesService()
        service.termsService = termsService
        userService.userIsAlaOrFcAdmin() >> false
        metadataService.getProgramConfiguration(_,_) >> [reportingPeriod:6, reportingPeriodAlignedToCalendar: true, weekDaysToCompleteReport:43]
        projectConfigurationService.getProjectConfiguration(_) >> projectConfig
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
        activities[0].description == 't1 (January - March 2014)'
        activities[1].plannedStartDate == '2014-04-01T00:00:00Z'
        activities[1].plannedEndDate == '2014-06-30T00:00:00Z'
        activities[1].type == 't1'
        activities[1].projectId == projectId
        activities[1].description == 't1 (April - June 2014)'
        activities[2].plannedStartDate == '2014-07-01T00:00:00Z'
        activities[2].plannedEndDate == '2014-09-30T00:00:00Z'
        activities[2].type == 't1'
        activities[2].projectId == projectId
        activities[2].description == 't1 (July - September 2014)'
        activities[3].plannedStartDate == '2014-10-01T00:00:00Z'
        activities[3].plannedEndDate == '2014-12-29T00:00:00Z'  // Last activity end date should not be after the project end date.
        activities[3].type == 't1'
        activities[3].projectId == projectId
        activities[3].description == 't1 (October - December 2014)'

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
        activities[0].description == 't1 (January 2014)'
        activities[5].plannedStartDate == '2014-06-01T00:00:00Z'
        activities[5].plannedEndDate == '2014-06-30T00:00:00Z'
        activities[5].type == 't1'
        activities[5].projectId == projectId
        activities[5].description == 't1 (June 2014)'

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
        activities[0].description == 't1 (February 2014)'
        activities[1].plannedStartDate == '2014-03-01T00:00:00Z'
        activities[1].plannedEndDate == '2014-03-31T00:00:00Z'
        activities[1].type == 't1'
        activities[1].projectId == projectId
        activities[1].description == 't1 (March 2014)'
        activities[2].plannedStartDate == '2014-04-01T00:00:00Z'
        activities[2].plannedEndDate == '2014-04-30T00:00:00Z'
        activities[2].type == 't1'
        activities[2].projectId == projectId
        activities[2].description == 't1 (April 2014)'
        activities[3].plannedStartDate == '2014-06-01T00:00:00Z'
        activities[3].plannedEndDate == '2014-06-30T00:00:00Z'
        activities[3].type == 't1'
        activities[3].projectId == projectId
        activities[3].description == 't1 (June 2014)'


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
        def result = service.approvePlan(projectId, [:])

        then:
        result.error == "Invalid plan status"
    }

    def "plan should not be approved if an internal order number is not supplied"(){
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_SUBMITTED
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus, externalIds:null]

        when:
        def result = service.approvePlan(projectId, [:])

        then:
        result.error == "A SAP internal order or TechOne code must be supplied before the MERI Plan can be approved"
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

    def "A plan cannot be rejected a project manager if the program is configured to require a MERIT admin to return a plan"() {
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_APPROVED
        webService.getJson(_) >> [projectId:projectId, planStatus:planStatus]

        when:
        def result = service.rejectPlan(projectId)

        then:
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([requireMeritAdminToReturnMeriPlan:true])
        userService.userIsAlaOrFcAdmin() >> false
        result.error == 'Only MERIT admins can return MERI plans for this program'
        0 * webService.doPost(_, _)
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
        1 * emailService.sendEmail(EmailTemplate.DEFAULT_PLAN_SUBMITTED_EMAIL_TEMPLATE,_,projectRoles, RoleService.PROJECT_ADMIN_ROLE, null)
    }

    def "an email should be sent and an approval document created when a plan is approved"() {
        given:
        def projectId = 'project1'
        def planStatus = ProjectService.PLAN_SUBMITTED
        List projectRoles = []
        Map project = [projectId:projectId, planStatus:planStatus, grantId:'g1', reports:null, externalIds: [[idType:"INTERNAL_ORDER_NUMBER", externalId:'12345']]]
        webService.getJson(_) >> project
        String expectedName = 'g1 MERI plan approved 2019-07-01T00:00:00Z'
        String expectedFilename = 'meri-approval-project1-1561939200000.txt'
        Map approvalDetails = [dateApproved:'2019-07-01T00:00:00Z', approvedBy:'1234', reason:'reason', comment:'comment']
        Map expectedDocumentContent = [project:project] + approvalDetails



        when:
        def result = service.approvePlan(projectId, [dateApproved:'2019-07-01T00:00:00Z', reason:'reason', comment:'comment'])

        then:
        result.message == 'success'
        1 * webService.doPost({it.endsWith("project/"+projectId)}, [planStatus:ProjectService.PLAN_APPROVED]) >> [resp:[status:'ok']]
        1 * documentService.createTextDocument([projectId:projectId, type:'text', role:ProjectService.DOCUMENT_ROLE_APPROVAL, filename: expectedFilename, name:expectedName, readOnly:true, public:false, labels:['MERI']], {compareDocuments(it, expectedDocumentContent)})
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> projectRoles
        1 * emailService.sendEmail(EmailTemplate.DEFAULT_PLAN_APPROVED_EMAIL_TEMPLATE,_,projectRoles, RoleService.GRANT_MANAGER_ROLE, null)
        userService.getCurrentUserId() >> '1234'
    }
    private boolean compareDocuments(actual, expected) {
        new JsonSlurper().parseText(actual) == expected
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
        1 * emailService.sendEmail(EmailTemplate.DEFAULT_PLAN_RETURNED_EMAIL_TEMPLATE,_,projectRoles, RoleService.GRANT_MANAGER_ROLE,  null)
    }

    @Unroll
    def "the email template for the plan workflow can be specified by the program configuration"(String initialState, Closure action, EmailTemplate expectedTemplate, String expectedRole) {
        given:
        def projectId = 'project1'
        def planStatus = initialState
        List projectRoles = []
        Map project =  [projectId:projectId, planStatus:planStatus, externalIds:[[idType:'INTERNAL_ORDER_NUMBER', externalId:'12345']]]
        ProgramConfig programConfig = new ProgramConfig([
                emailTemplates:[
                        (ProgramConfig.PLAN_SUBMITTED_EMAIL_TEMPLATE_CONFIG_ITEM): EmailTemplate.RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE.name(),
                        (ProgramConfig.PLAN_APPROVED_EMAIL_TEMPLATE_CONFIG_ITEM) : EmailTemplate.RLP_PLAN_APPROVED_EMAIL_TEMPLATE.name(),
                        (ProgramConfig.PLAN_RETURNED_EMAIL_TEMPLATE_CONFIG_ITEM) : EmailTemplate.RLP_PLAN_RETURNED_EMAIL_TEMPLATE.name()
                ]
        ])
        webService.getJson(_) >> project
        Map results = [:]
        1 * emailService.sendEmail(_,_,_,_,_) >> {actualTemplate, p , roles, actualRole, sender -> results.actualEmailTemplate = actualTemplate; results.actualRole = actualRole}

        when:
        projectConfigurationService.getProjectConfiguration(project) >> programConfig
        action(service, projectId)

        then:

        1 * webService.doPost({it.endsWith("project/"+projectId)}, _) >> [resp:[status:'ok']]
        1 * webService.getJson({it.endsWith("permissions/getMembersForProject/"+projectId)}) >> projectRoles
        userService.getCurrentUserId() >> '1234'
        results.actualEmailTemplate == expectedTemplate
        results.actualRole == expectedRole

        where:
        initialState                     | action                       | expectedTemplate                                | expectedRole
        ProjectService.PLAN_NOT_APPROVED | {s, id -> s.submitPlan(id)}  | EmailTemplate.RLP_PLAN_SUBMITTED_EMAIL_TEMPLATE | RoleService.PROJECT_ADMIN_ROLE
        ProjectService.PLAN_SUBMITTED    | {s, id -> s.approvePlan(id, [:])} | EmailTemplate.RLP_PLAN_APPROVED_EMAIL_TEMPLATE  | RoleService.GRANT_MANAGER_ROLE
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
        1 * webService.doPost( {it.endsWith('project/projectMetrics/'+projectId)}, _) >> [resp:[]]
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
        Map reportDetails = [reportId: reportId, activityIds: ['a1', 'a2'], reason:'Testing', categories:['Other']]
        reportService.getReportsForProject(_) >> [report]


        when:
        def result = service.rejectReport(projectId, reportDetails)

        then:
        result.success == true

        1 * projectConfigurationService.getProjectConfiguration(project) >> new ProgramConfig([:])
        1 * webService.getJson({ it.endsWith("permissions/getMembersForProject/" + projectId) }) >> projectRoles
        1 * reportService.rejectReport(reportId, reportDetails.activityIds, reportDetails.reason, reportDetails.categories, project, projectRoles, EmailTemplate.DEFAULT_REPORT_RETURNED_EMAIL_TEMPLATE) >> [success:true]
    }

    def "the project service should delegate to the report service to cancel a report"() {
        given:
        def projectId = 'project1'
        List projectRoles = []
        Map project = [projectId: projectId, planStatus: ProjectService.PLAN_APPROVED]
        webService.getJson(_) >> project
        String reportId = 'r1'
        Map report = [reportId: reportId]
        Map reportDetails = [reportId: reportId, activityIds: ['a1', 'a2'], reason:'paper based report']
        reportService.getReportsForProject(_) >> [report]


        when:
        def result = service.cancelReport(projectId, reportDetails)

        then:
        result.success == true

        1 * projectConfigurationService.getProjectConfiguration(project) >> new ProgramConfig([:])
        1 * webService.getJson({ it.endsWith("permissions/getMembersForProject/" + projectId) }) >> projectRoles
        1 * reportService.cancelReport(reportId, reportDetails.activityIds, reportDetails.reason, project, projectRoles) >> [success:true]
    }


    def "a project's start date cannot be changed if the project has a submitted MERI plan"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-06-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> false
        reportService.getReportsForProject(_) >> []
        Map project = [projectId:projectId, planStatus:ProjectService.PLAN_SUBMITTED, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2017-06-30T00:00Z']
        webService.getJson(_) >> project

        when:
        def result = service.changeProjectDates(projectId, newStartDate, project.plannedEndDate)

        then:
        result.resp.error != null
    }

    def "a project's start date cannot be changed if the project has an approved MERI plan"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-06-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> false
        reportService.getReportsForProject(_) >> []
        Map project = [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2017-06-30T00:00Z']
        webService.getJson(_) >> project

        when:
        def result = service.changeProjectDates(projectId, newStartDate, project.plannedEndDate)

        then:
        result.resp.error != null
    }

    def "a project's start date cannot be changed if the project has a submitted or approved report"() {
        given:
        def projectId = 'project1'
        def newStartDate = '2015-06-01T00:00Z'
        reportService.includesSubmittedOrApprovedReports(_) >> true
        reportService.getReportsForProject(_) >> [[publicationStatus:PublicationStatus.APPROVED]]
        Map project = [projectId:projectId, planStatus:ProjectService.PLAN_NOT_APPROVED, plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        webService.getJson(_) >> project

        when:
        def result = service.changeProjectDates(projectId, newStartDate, project.plannedEndDate)

        then:
        result.resp.error != null
    }

    def "a project should only be marked as completed when the final stage report is approved/cancelled"(String reportId, boolean shouldComplete) {
        setup:
        def projectId = 'project1'
        def reason = null
        def activityIds = ['a1', 'a2']
        def stageReportDetails = [activityIds:activityIds, reportId:reportId, stage:'Stage 2', reason:reason]
        reportService.getReportsForProject(projectId) >>[
                [reportId:'r1', publicationStatus:PublicationStatus.APPROVED, name:'Stage 1', fromDate: '2015-07-01T00:00Z', toDate: '2016-01-01T00:00Z'],
                [reportId:'r2', publicationStatus:PublicationStatus.NOT_APPROVED, name:'Stage 2', fromDate: '2016-01-01T00:00Z', toDate: '2017-01-01T00:00Z'],
                [reportId:'r3', publicationStatus:PublicationStatus.CANCELLED, name:'Stage 3', fromDate: '2016-01-01T00:00Z', toDate: '2017-01-01T00:00Z']]
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
        'r3'     | false
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
        reportService.findReportForDate(endDate, []) >> [status:Status.ACTIVE]

        when:
        boolean canEdit = service.canEditActivity(activity)

        then:
        1 * reportService.excludesNotApproved(_) >> true
        canEdit == false

        when:
        canEdit = service.canEditActivity(activity)

        then:
        1 * reportService.excludesNotApproved(_) >> false
        canEdit == true
    }

    def "An activity cannot be edited if it's associated report is marked as read only"() {
        setup:
        String projectId = 'project1'
        String endDate = '2016-12-31T13:00:00Z'
        Map activity = [projectId:projectId, plannedEndDate: endDate]
        webService.getJson(_) >> [projectId:projectId, planStatus:ProjectService.PLAN_APPROVED, status:'active', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z']
        reportService.getReportsForProject(projectId) >> []
        reportService.findReportForDate(endDate, []) >> [status:Status.READ_ONLY]

        when:
        boolean canEdit = service.canEditActivity(activity)

        then:
        1 * reportService.excludesNotApproved(_) >> false
        canEdit == false
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

    def "An RLP project with started reports will not allow to change the end date if the new end date is before the start date of the latest started report."() {

        setup:
        Map project = [reports:[
                [progress:ActivityService.PROGRESS_FINISHED, fromDate:'2020-12-31T13:00:00Z', toDate:'2021-06-30T14:00:00Z'],
                [progress:ActivityService.PROGRESS_STARTED, fromDate:'2021-06-30T14:00:00Z', toDate:'2021-12-31T13:00:00Z'],
                [progress:ActivityService.PROGRESS_STARTED, fromDate:'2021-12-31T13:00:00Z', toDate:'2022-06-30T14:00:00Z'],
                [progress:ActivityService.PROGRESS_PLANNED, fromDate:'2022-06-30T14:00:00Z', toDate:'2022-12-31T13:00:00Z']
        ]]
        Map config = [autogeneratedActivities:true]

        when:
        String endDate = service.minimumProjectEndDate(project, config)

        then:
        endDate == '2021-12-30T13:00:00Z'
    }

    def "Validates if the project's planned end date change is valid against the from date field of the last report with data and also taking account the minimum report length set in the project config"(String plannedEndDate, String fromDate, boolean expectedResult, int minimumReportDurationInDays) {

        setup:
        Map project = [projectId:'p1', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', planStatus:ProjectService.PLAN_APPROVED]

        Map lastReport = [description:"Year 2022/2023 - Quarter 1 Outputs Report", reportId:"888", toDate:"2022-09-30T14:00:00Z", fromDate:fromDate,
                          name:"Year 2022/2023 - Quarter 1 Outputs Report", progress:"started", activityType:"RLP Output Report - Review", category:"Outputs Reporting",
                          projectId:"777", status:"active", activityType:"type"]

        ProgramConfig programConfig = new ProgramConfig([activityBasedReporting: false, projectReports:[[activityType:'type', adjustmentActivityType:'adjustment', minimumReportDurationInDays: minimumReportDurationInDays]]])

        reportService.lastReportWithDataByCriteria(_, _) >> lastReport

        when:
        String result = service.validateProjectEndDate(project, programConfig, plannedEndDate, new ReportGenerationOptions())


        then:
        (result != null) == expectedResult

        where:
        plannedEndDate | fromDate | expectedResult | minimumReportDurationInDays
        '2022-07-01T00:00Z' | '2022-06-30T14:00:00Z' | true | 7
        '2022-07-02T00:00Z' | '2022-06-30T14:00:00Z' | true | 3
        '2022-07-09T00:00Z' | '2022-06-30T14:00:00Z' | false | 1
        '2022-06-30T14:00:00Z' | '2022-06-30T14:00:00Z' | false | 1

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
        reportService.getReportsForProject(project.projectId) >> [[reportId:'r1', publicationStatus:PublicationStatus.NOT_APPROVED, fromDate:project.plannedStartDate, toDate:project.plannedEndDate]]
        reportService.firstReportWithDataByCriteria(_, _) >> null

        when:
        String result = service.validateProjectStartDate(project, new ProgramConfig([activityBasedReporting: false]), '2015-07-03T00:00Z', new ReportGenerationOptions())

        then:
        result == null
    }

    def "if the project doesn't use activity based reporting and there is a submitted report, the start date must not invalidate the submitted report"(reportStatus, date, valid) {
        setup:
        Map project = [projectId:'p1', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', planStatus:ProjectService.PLAN_APPROVED]
        Map r1 = [reportId:'r1', name:'Stage 1', publicationStatus:reportStatus, fromDate:project.plannedStartDate, toDate:'2015-12-31T00:00Z']
        project.reports = [r1]
        reportService.firstReportWithDataByCriteria(_, _) >> r1

        boolean submittedOrApproved = (reportStatus == PublicationStatus.SUBMITTED || reportStatus == PublicationStatus.APPROVED)
        webService.getJson(_) >> project
        reportService.getReportsForProject(project.projectId) >> [r1]
        reportService.excludesNotApproved(_) >> submittedOrApproved

        when:
        String result = service.validateProjectStartDate(project, new ProgramConfig([activityBasedReporting: false, projectReports:[reportConfig]]), date, new ReportGenerationOptions())

        then:
        (result == null) == valid

        where:
        reportStatus | date | valid
        PublicationStatus.APPROVED | '2015-07-01T00:00Z' | true
        PublicationStatus.APPROVED | '2015-08-01T00:00Z' | true
        PublicationStatus.APPROVED | '2016-01-01T00:00Z' | false
        PublicationStatus.APPROVED | '2015-04-01T00:00Z' | false
        PublicationStatus.SUBMITTED | '2015-07-01T00:00Z' | true
        PublicationStatus.SUBMITTED | '2015-08-01T00:00Z' | true
        PublicationStatus.SUBMITTED | '2016-01-01T00:00Z' | false
        PublicationStatus.SUBMITTED | '2015-04-01T00:00Z' | false
    }

    def "if there is an empty report before the first report with data, we should be allowed to change the start date as if the first report with data was the only report"(date, valid) {
        setup: "The project has two reports, but the first has had it's data deleted.  This scenario is to simulate projects being loaded before the contract dates are known and the dates not being corrected before reporting begins"
        Map project = [projectId:'p1', plannedStartDate: '2015-07-01T00:00Z', plannedEndDate:'2016-12-31T00:00Z', planStatus:ProjectService.PLAN_APPROVED]
        Map r1 = [reportId:'r1', name:'Stage 1', publicationStatus:'unpublished', fromDate:project.plannedStartDate, toDate:'2015-12-31T00:00Z']
        Map r2 = [reportId:'r2', name:'Stage 2',publicationStatus:'submitted', fromDate:r1.toDate, toDate:'2016-07-01T00:00:00Z']
        project.reports = [r1,r2]
        reportService.firstReportWithDataByCriteria(_, _) >> r2
        webService.getJson(_) >> project
        reportService.getReportsForProject(project.projectId) >> [r1, r2]

        when:
        String result = service.validateProjectStartDate(project, new ProgramConfig([activityBasedReporting: false, projectReports:[reportConfig]]), date, new ReportGenerationOptions())

        then:
        (result == null) == valid

        where:
        date | valid
        '2016-05-01T00:00Z' | true  // New start date falls inside r2's reporting period
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

    def "The project name is allowed to be updated by project admins in RLP projects if the MERI plan is not submitted or approved"() {
        setup:
        String projectId = 'p1'

        when:
        service.update(projectId, [name:'new name'])

        then: "the update is sent to ecodata"
        2 * webService.getJson({it.contains("/"+projectId)}) >> [projectId:projectId, name:"old name", planStatus:ProjectService.PLAN_NOT_APPROVED]
        2 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([projectTemplate:ProgramConfig.ProjectTemplate.RLP.name(), projectReports:[[reportType:'Activity', category:'test']]])
        1 * webService.doPost({it.endsWith("project/${projectId}")}, [name:'new name'])

    }


    def "Project name changes are not allowed for RLP projects if the MERI plan is submitted or approved"(String planStatus) {
        setup:
        String projectId = 'p1'

        when:
        service.update(projectId, [name:'new name'])

        then:
        1 * webService.getJson({it.contains("/"+projectId)}) >> [projectId:projectId, name:"old name", planStatus:planStatus]
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([projectTemplate:ProgramConfig.ProjectTemplate.RLP.name(), projectReports:[[reportType:'Activity', category:'test']]])
        0 * webService.doPost(_, _)

        and: "reports are regenerated in case they include the name"
        0 * reportService.regenerateReports(_, _, _)

        where:
        planStatus | _
        ProjectService.PLAN_SUBMITTED | _
        ProjectService.PLAN_APPROVED  | _
    }

    def "Project name changes by admins are not allowed for non-RLP projects"(String planStatus, String template) {
        setup:
        String projectId = 'p1'

        when:
        service.update(projectId, [name:'new name'])

        then:
        1 * webService.getJson({it.contains("/"+projectId)}) >> [projectId:projectId, name:"old name", planStatus:planStatus]
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([projectTemplate:template, projectReports:[[reportType:'Activity', category:'test']]])
        0 * webService.doPost(_, _)

        and: "reports are regenerated in case they include the name"
        0 * reportService.regenerateReports(_, _, _)

        where:
        planStatus | template
        ProjectService.PLAN_SUBMITTED     | "default"
        ProjectService.PLAN_APPROVED      | "default"
        ProjectService.PLAN_NOT_APPROVED  | "default"

        ProjectService.PLAN_SUBMITTED     | "esp"
        ProjectService.PLAN_APPROVED      | "esp"
        ProjectService.PLAN_NOT_APPROVED  | "esp"

    }

    def "The MERI plan approval history can be extracted from approval documents"() {
        setup:
        String projectId = 'p1'
        List documents = []
        (1..5).each {
            documents << buildApprovalDocument(it, projectId)
        }
        userService.lookupUser('1234') >> [displayName:'test']

        when:
        List history = service.approvedMeriPlanHistory(projectId)

        then:
        1 * documentService.search([projectId:projectId, role:ProjectService.DOCUMENT_ROLE_APPROVAL, labels:'MERI']) >> [documents:documents]
        1 * webService.getJson2('url1') >> [statusCode: 200,resp:[referenceDocument:"ref doc",dateApproved:"2022-07-01T00:00:1Z",approvedBy:'1234', reason:'r',resp:documents]];
        1 * webService.getJson2('url2') >> [statusCode: 200,resp:[referenceDocument:"ref doc",dateApproved:"2022-07-01T00:00:2Z",approvedBy:'1234', reason:'r',resp:documents]];
        1 * webService.getJson2('url3') >> [statusCode: 200,resp:[referenceDocument:"ref doc",dateApproved:"2022-07-01T00:00:3Z",approvedBy:'1234', reason:'r',resp:documents]];
        1 * webService.getJson2('url4') >> [statusCode: 200,resp:[referenceDocument:"ref doc",dateApproved:"2022-07-01T00:00:4Z",approvedBy:'1234', reason:'r',resp:documents]];
        1 * webService.getJson2('url5') >> [statusCode: 200,resp:[referenceDocument:"ref doc",dateApproved:"2022-07-01T00:00:5Z",approvedBy:'1234', reason:'r',resp:documents]];

        history.size() == 5
        history[0] == [documentId:5, date:'2022-07-01T00:00:5Z', userDisplayName:'test', referenceDocument:'ref doc', reason:'r']
        history[1] == [documentId:4, date:'2022-07-01T00:00:4Z', userDisplayName:'test', referenceDocument:'ref doc', reason:'r']
        history[2] == [documentId:3, date:'2022-07-01T00:00:3Z', userDisplayName:'test', referenceDocument:'ref doc', reason:'r']
        history[3] == [documentId:2, date:'2022-07-01T00:00:2Z', userDisplayName:'test', referenceDocument:'ref doc', reason:'r']
        history[4] == [documentId:1, date:'2022-07-01T00:00:1Z', userDisplayName:'test', referenceDocument:'ref doc', reason:'r']

    }

    def "A cutdown project view will be returned for anonymous users and users without permissions"(Map user) {
        when:
        Map result = service.get("p1", user, "")

        then:
        1 * webService.getJson({it.contains("project/p1?")}) >> [sites:[], reports:[], activities:[], documents:[['public':false, documentId:'d1'], ['public':true, documentId:'d1']]]

        and:
        result.sites == null
        result.activities == null
        result.documents.size() == 1
        result.reports == null

        where:
        user | _
        null | _
        [hasViewAccess:false] | _

    }

    def "The project service can return a list of investment priorities from the MERI plan"() {
        setup:
        String projectId = 'p1'
        List secondaryOutcomes = [ [ "assets" : [ "Investment priority 1" ], "description" : "Outcome 2" ] ]
        Map primaryOutcome = [:]
        Map project = [projectId:projectId, custom:[details:[outcomes:[secondaryOutcomes:secondaryOutcomes, primaryOutcome:primaryOutcome]]]]

        when:
        List priorities = service.listProjectInvestmentPriorities(projectId)

        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> project

        and:
        priorities == ['Investment priority 1']

        when:
        project.custom.details.outcomes.primaryOutcome = [assets:['Investment Priority 2', 'Investment Priority 3'], description:"Outcome 1"]
        priorities = service.listProjectInvestmentPriorities(projectId)

        then:
        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> project

        and:
        priorities == ['Investment Priority 2', 'Investment Priority 3', 'Investment priority 1']

        when:
        project.custom.details.outcomes = null
        priorities = service.listProjectInvestmentPriorities(projectId)

        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> project

        and:
        priorities == []
    }

    def "The service can return a list of activity types nominated by the project"() {
        setup:
        Map project = [custom:[details:[activities:[activities:['a1', 'a2']]]]]
        ProgramConfig programConfig = new ProgramConfig([activities:[[name:'a1', output:'o1'],[name:'a2', output:'o2']]])

        when:
        List activities = service.getProjectActivities(project, programConfig)

        then:
        activities == [[name:'a1', output:'o1'],[name:'a2', output:'o2']]

        when:
        activities = service.getProjectActivities([:], programConfig)

        then:
        activities == []
    }

    def "The service can return the primary outcome for a project"() {
        expect:
        service.getPrimaryOutcome([custom:[details:[outcomes:[primaryOutcome:[description:'Outcome 1']]]]]) == 'Outcome 1'
        service.getPrimaryOutcome([custom:[details:[:]]]) == null
        service.getPrimaryOutcome(null) == null
    }

    def "The service can return the secondary outcomes for a project"() {
        expect:
        service.getSecondaryOutcomes([custom:[details:[outcomes:[secondaryOutcomes:[[description:'Outcome 1'], [description:'Outcome 2']]]]]]) == ['Outcome 1', 'Outcome 2']
        service.getSecondaryOutcomes([custom:[details:[:]]]) == []
        service.getSecondaryOutcomes(null) == []
    }

    def "The getProgramList method will create a program hierarchy from the program list"(){
        setup:
        String programId = "12345"
        List<Map> list = [
                [name: "Test Sub Program", programId: programId, parentId:"programId", parentName:"Test Program"],
                [name: "Test Sub Program 2", programId: "subProgram2", parentId:"programId", parentName:"Test Program"],
                [name: "Test Program", programId: "programId", parentId:"grandParentId1", parentName:"Grant Parent 1"],
                [name:"Grand parent 1", programId:"grandParentId1"],
                [name:"Grand parent 2", programId:"grandParentId2"],
                [name: "Test Program 2", programId: "programId2", parentId:"grandParentId1", parentName:"Grant Parent 1"]
        ]

        when:
        List<Map> programList = service.getProgramList()

        then:
        1 * programService.listOfAllPrograms() >> list

        and:
        programList[0].name == "Grand parent 1"
        programList[0].programId == "grandParentId1"
        programList[1].name == "Grand parent 1 - Test Program"
        programList[1].programId == "programId"
        programList[2].name == "Grand parent 1 - Test Program - Test Sub Program"
        programList[2].programId == programId
        programList[3].name == "Grand parent 1 - Test Program - Test Sub Program 2"
        programList[3].programId == "subProgram2"
        programList[4].name == "Grand parent 1 - Test Program 2"
        programList[4].programId == "programId2"
        programList[5].name == "Grand parent 2"
        programList[5].programId == "grandParentId2"

    }

    def "The program will return program name when parent is null"(){
        setup:
        String programId = "12345"
        Map programDetails = [programId: programId, name: "Test Program", parent: null]
        List<Map> list = [[name: "Test Program", programId: programId]]

        when:
        List<Map> programList = service.getProgramList()

        then:
        1 * programService.listOfAllPrograms() >> list

        and:
        programList[0].name == "Test Program"
        programList[0].programId == "12345"
    }


    private ProgramConfig setupMockServiceProgramConfig(List services) {

        if (!services) {
            services =[[name: "Output Test 1", outputs:[[sectionName: "Output Test 1"]], scores: [[scoreId:"1", label: "Test label 1", isOutputTarget:true]], id: 1, category: null]]
        }
        Map programServiceConfig = [serviceFormName: 'output', programServices:[[serviceId:1, serviceTargets:['1']]]]
        ProgramConfig config = new ProgramConfig([programServiceConfig:programServiceConfig])
        config.services = services.collect {
            [id:it.id, output:it.outputs[0].sectionName, name: it.name, scores:it.scores]}
        config
    }

    def "Convert double value to int for Services"(){
        setup:

        String projectId = "project_10"
        Map project = [projectId: projectId,
                       outputTargets:[
                               [scoreId: "1", target: "10", scoreLabel: "Test Score Label 1", unit: "Ha", scoreName: "areaTreatedHa", outputLabel: "Test Output Label 1"]],
                       custom: [details: [serviceIds:[1.0, 2.0,3.0,4.0]]]]


        when:
        def results = service.getProjectServicesWithTargets(project.projectId)

        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> setupMockServiceProgramConfig()

        and:
        results.size() == 1
        results[0].name == "Output Test 1"
        results[0].scores[0].label == "Test label 1"
        results[0].scores[0].isOutputTarget == true
        results[0].scores[0].target == new BigDecimal("10")
        results[0].scores[0].periodTargets == null

    }

    def "able to collect int for Services"(){
        setup:
        String projectId = "project_10"
        Map project = [projectId: projectId,
                       outputTargets:[
                               [scoreId: "1", target: "10", scoreLabel: "Test Score Label 1", unit: "Ha", scoreName: "areaTreatedHa", outputLabel: "Test Output Label 1"]],
                       custom: [details: [serviceIds:[1, 2,3,4]]]]


        when:
        def results = service.getProjectServicesWithTargets(project.projectId)

        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> setupMockServiceProgramConfig()

        and:
        results.size() == 1
        results[0].name == "Output Test 1"
        results[0].scores[0].label == "Test label 1"
        results[0].scores[0].isOutputTarget == true
        results[0].scores[0].target == new BigDecimal("10")
        results[0].scores[0].periodTargets == null

    }

    def "Check if the servicesIds is null"(){
        setup:
        String projectId = "project_10"
        Map project = [projectId: projectId,
                       outputTargets:[
                               [scoreId: "1", target: "10", scoreLabel: "Test Score Label 1", unit: "Ha", scoreName: "areaTreatedHa", outputLabel: "Test Output Label 1"]]]


        when:
        def results = service.getProjectServicesWithTargets(project.projectId)

        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> setupMockServiceProgramConfig()

        and:
        results.size() == 0
    }


    def "for the output report, only outputs matching the project services will be displayed"() {

        setup:
        List services = setupMockServicesForFilteredOutputModel()
        Map activityModel = setupActivityModelForFiltering(services)
        Map project = [custom:[details:[serviceIds:[1,2,4]]]]

        Map activityData = [:]

        when:
        Map filteredModel = service.filterOutputModel(activityModel, project, activityData)

        then:
        metadataService.getProjectServices() >> services
        1 * projectConfigurationService.getProjectConfiguration(project) >> setupMockServiceProgramConfig(services)
        filteredModel.outputs == ['o1', 'o2', 'o4']
    }


    def "for the output report, outputs that are not service outputs will always be displayed"() {

        setup:

        List services = setupMockServicesForFilteredOutputModel()
        Map activityModel = setupActivityModelForFiltering(services)
        activityModel.outputs << 'non service'

        Map project = [custom:[details:[serviceIds:[1,2,4]]]]

        Map activityData = [:]

        when:
        Map filteredModel = service.filterOutputModel(activityModel, project, activityData)

        then:
        metadataService.getProjectServices() >> services
        1 * projectConfigurationService.getProjectConfiguration(project) >> setupMockServiceProgramConfig(services)
        filteredModel.outputs == ['o1', 'o2', 'o4', 'non service']
    }

    def "When updating the MERI plan or data sets, the contents of the Project custom attribute will NOT be merged"() {
        setup:
        String projectId = 'p1'
        Map meriPlan = [details:[outcomes:[]]]
        Map dataSets = [dataSets:[[dataSetId:1]]]
        Map baseProject = [projectId:'p1', name:'Project 1', description:'Description 1', lock:[userId:'u1', entityId:projectId]]
        Map postData

        when:
        service.update(projectId, [custom:meriPlan], false)

        then:
        1 * lockService.userHoldsLock(_) >> true
        1 * webService.getJson({it.contains("project/"+projectId)}) >> baseProject+[custom:dataSets]
        1 * webService.doPost({it.endsWith('project/'+projectId)}, _) >> { id, data ->
            postData = data
            [status: HttpStatus.SC_OK]
        }
        postData == [custom:meriPlan]

        when:
        service.update(projectId, [custom:dataSets])

        then:
        1 * webService.getJson({it.contains("project/"+projectId)}) >> baseProject+[custom:meriPlan]
        1 * webService.doPost({it.endsWith('project/'+projectId)}, _) >> { id, data ->
            postData = data
            [status: HttpStatus.SC_OK]
        }
        postData == [custom:dataSets]
    }

    def "When updating the MERI plan or data sets, if the user doesn't hold a lock the update will fail with an error returned"() {
        setup:
        String projectId = 'p1'
        Map meriPlan = [details: [outcomes: []]]
        Map baseProject = [projectId: 'p1', name: 'Project 1', description: 'Description 1', lock: [userId: 'u1', entityId: projectId]]

        when:
        Map result = service.update(projectId, [custom: meriPlan], false)

        then:
        1 * lockService.userHoldsLock(_) >> false
        1 * webService.getJson({it.contains("project/"+projectId)}) >> baseProject+[custom:[dataSets:[]]]
        0 * webService.doPost({it.endsWith('project/'+projectId)}, _)
        result.error != null
        result.noLock == true

    }

    def "The project reports can be regenerated, including optionally specifying which categories to regenerate"() {
        when:
        service.generateProjectStageReports('p1', new ReportGenerationOptions())

        then:
        1 * webService.getJson({it.contains("project/p1")}) >> [projectId:'p1', status:'active']
        1 * reportService.getReportsForProject('p1') >> [[reportId:'r1']]
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([projectReports:[[reportType:'Activity', category:'test']]])

        1 * reportService.regenerateReports([], _, _)

        when:
        service.generateProjectStageReports('p1', new ReportGenerationOptions(), ['test'])

        then:
        1 * webService.getJson({it.contains("project/p1")}) >> [projectId:'p1', status:'active']
        1 * reportService.getReportsForProject('p1') >> [[reportId:'r1']]
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([projectReports:[[reportType:'Activity', category:'test']]])

        1 * reportService.regenerateReports([], _, _)


        when:
        service.generateProjectStageReports('p1', new ReportGenerationOptions(), ['test 2'])

        then:
        1 * webService.getJson({it.contains("project/p1")}) >> [projectId:'p1', status:'active']
        1 * reportService.getReportsForProject('p1') >> [[reportId:'r1']]
        1 * projectConfigurationService.getProjectConfiguration(_) >> new ProgramConfig([projectReports:[[reportType:'Activity', category:'test']]])

        0 * reportService.regenerateReports([], _, _)
    }

    def "The project service can determine if a project has unchangable reports that align with the project end date"(String publicationStatus, String lastReportToDate, boolean expectedResult){
        setup:
        def project = [projectId:'p1', plannedStartDate:'2021-06-30T14:00:00Z', plannedEndDate:'2023-06-29T14:00:00Z']
        project.reports = [[
                reportId:"r1",
                category:"c1",
                fromDate:'2021-06-30T14:00:00Z',
                toDate:'2022-06-30T14:00:00Z',
                publicationStatus:'published'
            ],[
               reportId:"r2",
               category:"c1",
               fromDate:'2022-06-30T14:00:00Z',
               toDate:lastReportToDate,
               publicationStatus:publicationStatus]]
        reportService.excludesNotApproved(project.reports[1]) >> new ReportService().excludesNotApproved(project.reports[1])

        when:
        boolean result = service.hasSubmittedOrApprovedFinalReportInCategory(project)

        then:
        result == expectedResult

        where:
        publicationStatus | lastReportToDate | expectedResult
        'unpublished' | '2023-06-29T14:00:00Z' | false
        'pendingApproval' | '2023-06-29T14:00:00Z' | true
        'published' | '2023-06-29T14:00:00Z' | true
        'cancelled' | '2023-06-29T14:00:00Z' | true
        'published' | '2023-06-28T14:00:00Z' | false
        'published' | '2023-06-30T14:00:00Z' | true

    }

    def "The projectMetrics method delegates to ecodata"() {
        setup:
        String projectId = 'p1'

        when:
        Map result = service.summary(projectId)

        then:
        1 * webService.doPost({it.endsWith('project/projectMetrics/'+projectId)}, [approvedOnly:false]) >> [resp:[]]

        result == [targets:[:], other:[:]]
    }

    def "The targetsAndScoresForActivity method delegates to ecodata"() {
        setup:
        String activityId = 'a1'

        when:
        Map result = service.targetsAndScoresForActivity(activityId)

        then:
        1 * webService.getJson2({it.endsWith('project/scoreDataForActivityAndProject/'+activityId)}) >> [resp:[projectScores:[], activityScores:[]], statusCode: HttpStatus.SC_OK]

        result == [resp:[projectScores:[], activityScores:[]], statusCode: HttpStatus.SC_OK]
    }

    def "The projectservice provides checks that a report or activity belongs to a project"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        String activityId = 'a1'

        when:
        boolean result = service.doesReportBelongToProject(projectId, reportId)

        then:
        1 * reportService.get(reportId) >> [projectId: projectId]
        result == true

        when:
        result = service.doesReportBelongToProject(projectId, reportId)

        then:
        1 * reportService.get(reportId) >> [projectId: 'p2']
        result == false

        when:
        result = service.doesActivityBelongToProject(projectId, activityId)

        then:
        1 * activityService.get(activityId) >> [projectId: projectId]
        result == true

        when:
        result = service.doesActivityBelongToProject(projectId, activityId)

        then:
        1 * activityService.get(activityId) >> [projectId: 'p2']
        result == false

    }

    def "The scoresForReport method returns zeros if it cannot obtain scores"() {
        setup:
        String projectId = 'p1'
        String reportId = 'r1'
        List scoreIds = ['1', '2', '3']
        String fromDate = '2022-01-01T00:00:00Z'
        String toDate = '2022-07-01T00:00:00Z'

        when:
        Map result = service.scoresForReport(projectId, reportId, scoreIds)

        then:
        1 * webService.getJson('project/'+projectId+'?includeDeleted=false') >> [reports:[[reportId:reportId, fromDate:fromDate, toDate:toDate]]]
        1 * reportService.dateHistogramForScores(projectId, [fromDate, toDate], 'YYYY-MM', scoreIds) >> [status:500, error:'']
        result == ['1':0, '2':0, '3':0]
    }

    def "The scoresForReport function will return 0s even if scores are missing"() {
        setup:
        String projectId = 'p1'
        List scoreIds = ['1', '2', '3']
        String reportId = 'r1'
        List report = [
                [group:'2020-01 - 2021-06', results:[[scoreId:'1', count: 1, result: [ result: 10 ]]]],
                [group:'2022-01 - 2022-06', results:[[scoreId:'1', count: 1, result: [ result: 1 ]], [scoreId:'2', count: 2, result: [result: 2]]]]
        ]
        Map resp = [status:200, resp:report]
        String fromDate = '2021-12-31T13:00:00Z'
        String toDate = '2022-06-30T14:00:00Z'

        when:
        Map result = service.scoresForReport(projectId, reportId, scoreIds)

        then:
        1 * webService.getJson('project/'+projectId+'?includeDeleted=false') >> [reports:[[reportId:reportId, fromDate:fromDate, toDate:toDate]]]
        1 * reportService.dateHistogramForScores(projectId, [fromDate, toDate], 'YYYY-MM', scoreIds) >> resp

        result == ['1':1, '2':2, '3':0]
    }

    def "Plot Selection / Visits should not be displayed in data sets"() {
        setup:
        List dataSets = [
                [name:'Plot Selection', dataSetId:'d1', protocol:'1'],
                [name:'Plot Layout and Visit', dataSetId:'d2', protocol:'2'],
                [name:'Not a plot selection', dataSetId:'d3', protocol:'3']

        ]

        when:
        service.filterDataSetSummaries(dataSets)

        then:
        1 * activityService.monitoringProtocolForms() >> [[externalId:'1', name:"Plot Selection", tags: ["site"]], [externalId:'2', name: "Plot Layout and Visit", tags: ["site"]], [externalId:'3', name: "Not a plot selection", tags: ["survey"]]]
        and:
        dataSets.size() == 1
        dataSets[0].name == 'Not a plot selection'
    }

    def "Get species records for an activity id and construct species object" (){
        setup:
        String activityId = 'a1'
        def record = [scientificName: "sc1", vernacularName: "vn1", guid: "g1", outputSpeciesId: "o1", individualCount: 1, seedMass: 5]
        when:
        def result = service.getSpeciesRecordsFromActivity(activityId)

        then:
        1 * webService.getJson( {it.contains("record/listForActivity/"+activityId)}) >> [records:[record, record], statusCode: HttpStatus.SC_OK]
        result == [[scientificName: "sc1", vernacularName: "vn1", guid: "g1", outputSpeciesId: "o1", individualCount: 2, seedMass: 10] + [species: [scientificName: "sc1", commonName: "vn1", outputSpeciesId: "o1", guid: "g1", name: "sc1 (vn1)"]]]

        when:
        result = service.getSpeciesRecordsFromActivity(activityId, null, null)

        then:
        1 * webService.getJson( {it.contains("record/listForActivity/"+activityId)}) >> [records:[record, record], statusCode: HttpStatus.SC_OK]
        result.size() == 2
        result[0] == record + [species: [scientificName: "sc1", commonName: "vn1", outputSpeciesId: "o1", guid: "g1", name: "sc1 (vn1)"]]

    }

    def "getProjectTags should retrieve terms for the correct hub and category"() {
        given:
        String hubId = "merit"
        List expectedTags = [[termId: "1", name: "Tag1"], [termId: "2", name: "Tag2"]]
        HubSettings hubSettings = new HubSettings(hubId: hubId, urlPath: "merit")
        SettingService.setHubConfig(hubSettings)

        when:
        List result = service.getProjectTags()

        then:
        1 * termsService.getTerms(hubId, ProjectService.PROJECT_TAGS_CATEGORY) >> expectedTags
        result == expectedTags
    }

    def "addProjectTag should set category and hubId and call termsService.addTerm"() {
        given:
        Map tag = [name: "New Tag"]
        String hubId = "testHubId"
        HubSettings hubSettings = new HubSettings(hubId: hubId, urlPath: "merit")
        SettingService.setHubConfig(hubSettings)

        when:
        Map result = service.addProjectTag(tag)

        then:
        tag.category == ProjectService.PROJECT_TAGS_CATEGORY
        tag.hubId == hubId
        1 * termsService.addTerm(hubId, tag)
    }

    def "updateProjectTag should update the tag and associated projects"() {
        setup:
        Map tag = [termId: "1", term: "UpdatedTag"]
        Map existingTag = [termId: "1", term: "OldTag"]
        List existingTags = [existingTag]
        Map project1 = [projectId: "p1", tags: ["OldTag"]]
        Map project2 = [projectId: "p2", tags: ["OldTag", "AnotherTag"]]
        Map projectsUsingTag = [resp: [projects: [project1, project2]]]
        String hubId = "testHubId"
        HubSettings hubSettings = new HubSettings(hubId: hubId, urlPath: "merit")
        SettingService.setHubConfig(hubSettings)

        and:

        when:
        Map result = service.updateProjectTag(tag)

        then:
        1 * termsService.getTerms(hubId, ProjectService.PROJECT_TAGS_CATEGORY) >> existingTags
        1 * webService.doPost({it.endsWith('project/search')}, [tags: existingTag.term, view: 'flat']) >> projectsUsingTag
        1 * webService.getJson({it.contains('project/p1')}) >> project1
        1 * webService.getJson({it.contains('project/p2')}) >> project2
        1 * webService.doPost({it.endsWith("project/p1")}, [tags: ["UpdatedTag"]]) >> [status: HttpStatus.SC_OK]
        1 * webService.doPost({it.endsWith("project/p2")}, [tags: ["AnotherTag", "UpdatedTag"]]) >> [status: HttpStatus.SC_OK]
        1 * termsService.updateTerm(hubId, tag) >> [success: true]
        result.success == true
        result.errors.isEmpty()
    }

    def "updateProjectTag should handle errors during project updates"() {
        given:
        Map tag = [termId: "1", term: "UpdatedTag"]
        Map existingTag = [termId: "1", term: "OldTag"]
        List existingTags = [existingTag]
        Map project1 = [projectId: "p1", tags: ["OldTag"]]
        Map projectsUsingTag = [resp: [projects: [project1]]]
        String hubId = "testHubId"
        HubSettings hubSettings = new HubSettings(hubId: hubId, urlPath: "merit")
        SettingService.setHubConfig(hubSettings)

        when:
        Map result = service.updateProjectTag(tag)

        then:
        1 * termsService.getTerms(hubId, ProjectService.PROJECT_TAGS_CATEGORY) >> existingTags
        1 * webService.doPost({it.endsWith('project/search')}, [tags: existingTag.term, view: 'flat']) >> projectsUsingTag
        1 * webService.getJson({it.contains('project/p1')}) >> project1

        1 * webService.doPost({it.endsWith("project/p1")}, [tags: ["UpdatedTag"]]) >> [statusCode: HttpStatus.SC_INTERNAL_SERVER_ERROR, error:"An error occurred"]
        1 * termsService.updateTerm(hubId, tag) >> [success: true]
        result.success == false
        result.errors.size() == 1
    }

    def "deleteProjectTag should delete the tag update projects using the tag"() {
        setup:
        Map existingTag = [termId: "1", term: "OldTag"]
        Map project1 = [projectId: "p1", tags: ["OldTag"]]
        Map projectsUsingTag = [resp: [projects: [project1]]]
        String hubId = "testHubId"
        HubSettings hubSettings = new HubSettings(hubId: hubId, urlPath: "merit")
        SettingService.setHubConfig(hubSettings)

        and:

        when:
        Map result = service.deleteProjectTag(existingTag)

        then:
        1 * webService.doPost({it.endsWith('project/search')}, [tags: existingTag.term, view: 'flat']) >> projectsUsingTag
        1 * webService.getJson({it.contains('project/p1')}) >> project1
        1 * webService.doPost({it.endsWith("project/p1")}, [tags: []]) >> [status: HttpStatus.SC_OK]
        1 * termsService.deleteTerm(existingTag.termId) >> [success: true]
        result.success == true
        result.errors.isEmpty()
    }

    private Map setupActivityModelForFiltering(List services) {
        Map activityModel = [name:'output', outputs:[]]
        services.each {
            activityModel.outputs << it.outputs[0].sectionName
        }
        activityModel
    }

    private List setupMockServicesForFilteredOutputModel() {

        List services = [1,2,3,4,5,6,7,8,9,10].collect{
            String output = 'o'+it
            [id:it, outputs:[[formName:'output', sectionName:output]]]
        }
        services
    }

    private Map buildApprovalDocument(int i, String projectId) {
        Map approval = [
                dateApproved:"2019-07-01T00:00:0${i}Z",
                approvedBy:'1234',
                reason:'r',
                referenceDocument: 'c',
                project: [projectId:projectId]
        ]
        Map document = [documentId:i, projectId:projectId, url:'url'+i, content:[statusCode:null]]

        document
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
