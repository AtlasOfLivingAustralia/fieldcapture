package au.org.ala.merit

import au.org.ala.merit.reports.ReportConfig
import au.org.ala.merit.reports.ReportOwner
import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(ReportService)
class ReportServiceSpec extends Specification {

    def webService = Mock(WebService)
    def projectService = Stub(ProjectService)
    def metadataService = Stub(MetadataService)
    def activityService = Mock(ActivityService)
    def emailService = Mock(EmailService)

    def setup() {

        service.webService = webService
        service.projectService = projectService
        service.metadataService = metadataService
        service.activityService = activityService
        service.emailService = emailService
    }

    /**
     * This method supports automatically creating reporting activities for a project that re-occur at defined intervals.
     * e.g. a stage report once every 6 months or a green army monthly report once per month.
     * Activities will only be created when no reporting activity of the correct type exists within each period.
     * @param projectId identifies the project.
     */
    private void regenerateAllStageReportsForProject(String projectId, Integer periodInMonths = 6, boolean alignToCalendar = false, Integer weekDaysToCompleteReport = null) {
        Map project = projectService.get(projectId, 'all')

        ReportConfig reportConfig = new ReportConfig(
                reportingPeriodInMonths: periodInMonths,
                reportsAlignedToCalendar: alignToCalendar,
                reportNameFormat:"Stage %1\$d",
                reportDescriptionFormat: "Stage %1\$d for %4\$s",
                reportType:'Activity',
                category:"Stage reports",
                weekDaysToCompleteReport: weekDaysToCompleteReport
        )
        ReportOwner reportOwner = new ReportOwner(
                id:[projectId:projectId],
                name:project.name,
                periodStart:project.plannedStartDate,
                periodEnd:project.plannedEndDate
        )

        service.regenerateReports(project.reports ?: [], reportConfig, reportOwner)
    }

    def project(plannedStartDate = '2014-12-31T13:00:00Z', plannedEndDate = '2016-12-31T23:59:59Z') {
        [plannedStartDate:plannedStartDate, plannedEndDate:plannedEndDate, name:'project', projectId:'p1']
    }

    def reports() {
        [[reportId:'1', fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', submissionDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'],
         [reportId:'2', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'],
         [reportId:'3', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'],
         [reportId:'4', fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T13:00:00Z', submissionDate: '2016-12-31T13:00:00Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1', category:'Stage reports']]

    }

    def cleanup() {
    }

    void "reports can be generated correctly for a new project"() {

        setup:
        def project = project()
        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', submissionDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T23:59:59Z', submissionDate: '2016-12-31T23:59:59Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1', category:'Stage reports'])
        0 * webService._
    }

    void "reports can be regenerated correctly when a project start date is moved back"() {
        setup:
        def project = project('2014-06-30T14:00:00Z')
        project.reports = reports()
        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [reportId:'1', fromDate: '2014-06-30T14:00:00Z', toDate: '2014-12-31T13:00:00Z', submissionDate: '2014-12-31T13:00:00Z', dueDate: '2015-02-12T13:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', submissionDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'4', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T23:59:59Z', submissionDate: '2016-12-31T23:59:59Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', category:'Stage reports'])
        0 * webService._
    }

    void "reports can be regenerated correctly when a project start date is moved forward"() {
        setup:
        def project = project('2015-08-01T00:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        1 * webService.doPost(_, [reportId:'1', fromDate: '2015-08-01T00:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T23:59:59Z', submissionDate: '2016-12-31T23:59:59Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._

    }

    void "reports can be added correctly when a project end date is moved forward"() {
        setup:
        def project = project('2014-12-31T13:00:00Z', '2017-07-01T00:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report should be added at the end of the project"

        1 * webService.doPost(_, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-07-01T00:00:00Z', submissionDate: '2017-07-01T00:00:00Z', dueDate: '2017-08-12T14:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', category:'Stage reports'])
        0 * webService._

    }

    void "reports can be removed correctly when a project end date is moved backwards"() {
        setup:
        def project = project('2014-12-31T13:00:00Z', '2016-06-30T14:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "the last report should be deleted"
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._
    }

    void "reports can be changed correctly if there is one approved report"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-07-01T00:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report should be added to the end"
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-07-01T00:00:00Z', submissionDate:'2017-07-01T00:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', dueDate: '2017-08-12T14:00:00Z', category:'Stage reports'])

        0 * webService._
    }

    void "no reports should be changed if all reports are approved"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-01-01T00:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[1].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[2].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[3].publicationStatus = ReportService.REPORT_APPROVED

        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "no reports should not be changed"
        0 * webService._

    }

    void "Can add a report to the end of a project with all approved reports when an extension to the end date is granted"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-01-07T00:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[1].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[2].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[3].publicationStatus = ReportService.REPORT_APPROVED

        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report is added to the end of the schedule"
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-01-07T00:00:00Z', submissionDate: '2017-01-07T00:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", dueDate:'2017-08-12T14:00:00Z', projectId: 'p1', category:'Stage reports'])

        and: "no other reports should not be changed"
        0 * webService._

    }

    void "no approved or submitted reports can be deleted regardless of the new end date"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2015-12-31T13:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[1].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[2].publicationStatus = ReportService.REPORT_SUBMITTED

        projectService.get(_, _) >> project

        when:
        regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "only the non-approved or submitted report should be removed."
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._
    }


    void "no stage overlap should occur when an existing approved report exists with misaligned times"() {

        // Reproducing a bug where existing reports (one approved) aligned to 00:00 UTC were regenerated due to a project
        // extension resulted in a slight overlap due to the new report times being aligned to midnight Australian east coast time
        // (i.e. stage 1 remained ending at 2016-07-01T00:00:00Z and stage 2 was regenerated to start at 2016-06-30T14:00:00Z)
        setup:
        def project = project('2016-04-15T00:00:00Z', '2017-06-29T14:00:00Z') // End date extended by 6 months
        project.reports = [
                [reportId:'1', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', submissionDate: '2016-07-01T00:00:00Z', dueDate: '', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports', publicationStatus:ReportService.REPORT_APPROVED],
                [reportId:'2', fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', submissionDate: '2017-01-01T00:00:00Z', dueDate: '', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports']]
        projectService.get(_, _) >> project

        when: "reports are regenerated"
        regenerateAllStageReportsForProject('p1', 6, true)

        then: "report 2 is realigned with a from date matching report 1 end date and an end date aligned to australian time"
        1 * webService.doPost({it.endsWith('/report/2')}, [fromDate: '2016-07-01T00:00:00Z', toDate: '2016-12-31T13:00:00Z', submissionDate: '2016-12-31T13:00:00Z', type: 'Activity', name: 'Stage 2', description: 'Stage 2 for project', projectId: 'p1', reportId:'2', category:'Stage reports'])

        and: "a new report is added to cover the project end date extension"
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-06-29T14:00:00Z', submissionDate: '2017-06-29T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])

        and: "the first report is not modified because it is approved"
        0 * webService._

    }

    def "when a report is submitted, all associated activities should be marked as submitted and an email sent"() {

        setup:
        String reportId = 'r1'
        List activities = [[activityId:'a1', progress:ActivityService.PROGRESS_FINISHED], [activityId:'a2', progress:ActivityService.PROGRESS_FINISHED]]
        List activityIds = activities.collect{it.activityId}
        EmailTemplate template = EmailTemplate.DEFAULT_REPORT_SUBMITTED_EMAIL_TEMPLATE
        List roles = []

        when:
        Map result = service.submitReport(reportId, activityIds, [:], roles, template)

        then:
        result.success == true
        1 * activityService.search([activityId:activityIds]) >> [resp:[activities:activities]]
        1 * webService.getJson({it.endsWith('report/'+reportId)}) >> [reportId:reportId]
        1 * webService.doPost({it.endsWith('report/submit/'+reportId)}, [:]) >> [:]
        1 * activityService.submitActivitiesForPublication(activityIds)
        1 * emailService.sendEmail(template, [reportOwner:[:], report:[reportId:reportId]], roles, RoleService.PROJECT_ADMIN_ROLE)

    }

    def "when a report is approved, all associated activities should be marked as approved and an email sent"() {

        setup:
        String reportId = 'r1'
        List activityIds = ['a1', 'a2']
        EmailTemplate template = EmailTemplate.DEFAULT_REPORT_APPROVED_EMAIL_TEMPLATE
        List roles = []
        String reason = ''

        when:
        Map result = service.approveReport(reportId, activityIds, reason, [:], roles, template)

        then:
        result.success == true
        1 * webService.getJson({it.endsWith('report/'+reportId)}) >> [reportId:reportId]
        1 * webService.doPost({it.endsWith('report/approve/'+reportId)}, [comment:reason]) >> [:]
        1 * activityService.approveActivitiesForPublication(activityIds)
        1 * emailService.sendEmail(template, [reportOwner:[:], reason:reason, report:[reportId:reportId]], roles, RoleService.GRANT_MANAGER_ROLE)

    }

    def "when a report is returned, all associated activities should be marked as not published and an email sent"() {

        setup:
        String reportId = 'r1'
        List activityIds = ['a1', 'a2']
        EmailTemplate template = EmailTemplate.DEFAULT_REPORT_RETURNED_EMAIL_TEMPLATE
        List roles = []
        String reason = ''
        String category = ''

        when:
        Map result = service.rejectReport(reportId, activityIds, reason, [:], roles, template)

        then:
        result.success == true
        1 * webService.getJson({it.endsWith('report/'+reportId)}) >> [reportId:reportId]
        1 * webService.doPost({it.endsWith('report/returnForRework/'+reportId)}, [comment:reason, category:category]) >> [:]
        1 * activityService.rejectActivitiesForPublication(activityIds)
        1 * emailService.sendEmail(template, [reportOwner:[:], reason:reason, report:[reportId:reportId]], roles, RoleService.GRANT_MANAGER_ROLE)

    }

    def "A report cannot be submitted if the activities are not all finished, deferred or cancelled"(String progress) {
        setup:
        String reportId = 'r1'
        List activities = [[activityId:'a1', progress:progress], [activityId:'a2', progress:ActivityService.PROGRESS_FINISHED]]
        List activityIds = activities.collect{it.activityId}

        when:
        Map result = service.submitReport(reportId, activityIds, [:], [], EmailTemplate.DEFAULT_REPORT_SUBMITTED_EMAIL_TEMPLATE)

        then:
        1 * activityService.search([activityId:activityIds]) >> [resp:[activities:activities]]

        result.success == false
        result.error != null
        0 * webService._
        0 * activityService._
        0 * emailService._

        where:
        progress | _
        ActivityService.PROGRESS_PLANNED | _
        ActivityService.PROGRESS_STARTED | _
    }

    def "An adjustment report can only be created if the report is configured to allow it"() {
        setup:
        String reportId = 'r1'
        ProgramConfig programConfig = new ProgramConfig([:])
        Map project = [projectId:'p1']
        EmailTemplate template = EmailTemplate.DEFAULT_REPORT_ADJUSTED_EMAIL_TEMPLATE
        List roles = []

        when:
        Map result = service.createAdjustmentReport(reportId, "", programConfig, project, roles, template)

        then:
        1 * webService.getJson({it.endsWith('report/'+reportId)}) >> [reportId:reportId, activityType:'type']
        0 * emailService._
        result.error != null

    }

    def "when a report is adjusted, an adjustment report needs to be created and an email sent"() {
        setup:
        String reportId = 'r1'
        ProgramConfig programConfig = new ProgramConfig(projectReports:[[activityType:'type', adjustmentActivityType:'adjustment']])
        Map project = [projectId:'p1']
        EmailTemplate template = EmailTemplate.DEFAULT_REPORT_ADJUSTED_EMAIL_TEMPLATE
        List roles = []
        String reason = "testing"

        when:
        Map result = service.createAdjustmentReport(reportId, reason, programConfig, project, roles, template)

        then:
        1 * webService.getJson({it.endsWith('report/'+reportId)}) >> [reportId:reportId, activityType:'type']
        1 * webService.doPost({it.endsWith("report/adjust/"+reportId)}, _) >> [resp:[reportId:'r11'], statusCode:200]
        1 * emailService.sendEmail(template, [reportOwner:project, reason:reason, report:[reportId:reportId, activityType:'type'], adjustmentReport:[reportId:'r11']], roles, RoleService.GRANT_MANAGER_ROLE)
        result.error == null
    }

    def "only an approved report can be adjusted"() {
        setup:
        String reportId = 'r1'
        ProgramConfig programConfig = new ProgramConfig(projectReports:[[activityType:'type', adjustmentActivityType:'adjustment']])
        Map project = [projectId:'p1']
        EmailTemplate template = EmailTemplate.DEFAULT_REPORT_ADJUSTED_EMAIL_TEMPLATE
        List roles = []
        String reason = "testing"

        when:
        Map result = service.createAdjustmentReport(reportId, reason, programConfig, project, roles, template)

        then:
        1 * webService.getJson({it.endsWith('report/'+reportId)}) >> [reportId:reportId, activityType:'type']
        1 * webService.doPost({it.endsWith("report/adjust/"+reportId)}, _) >> [error:"report is approved"]
        0 * emailService._

        result.error != null
    }

    def "the report service can interact with the activity service to override a lock for a report"() {
        when:
        service.overrideLock("r1", "report/url")

        then:
        1 * webService.getJson({it.endsWith('report/r1')}) >> [reportId:'r1', activityId:'a1']
        1 * activityService.stealLock('a1', 'report/url')

    }
}
