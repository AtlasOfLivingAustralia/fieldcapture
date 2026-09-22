package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ReportConfig
import org.joda.time.DateTime
import spock.lang.Specification
import spock.lang.Unroll

/**
 * Tests the ReportReminderEmailJob.
 */
class ReportReminderEmailTaskSpec extends Specification {

    ReportService reportService = Mock(ReportService)
    ProjectService projectService = Mock(ProjectService)
    OrganisationService organisationService = Mock(OrganisationService)
    ProjectConfigurationService projectConfigurationService = Mock(ProjectConfigurationService)

    ReportReminderEmailTask job = new ReportReminderEmailTask(
            reportService: reportService,
            projectService: projectService,
            organisationService: organisationService,
            projectConfigurationService: projectConfigurationService)

    private static final String ACTIVITY_TYPE = 'Test Report'

    private static Map report(Map overrides = [:]) {
        [reportId:'r1', projectId:'p1', activityType:ACTIVITY_TYPE, dueDate:DateUtils.format(DateUtils.now().plusDays(3))] + overrides
    }

    private static ProgramConfig programConfig(boolean sendReportReminderEmails) {
        new ProgramConfig([projectReports:[[activityType:ACTIVITY_TYPE, sendReportReminderEmails:sendReportReminderEmails]]])
    }

    /** Stubs the project configuration lookup so that reminder emails are enabled/disabled as specified */
    private void stubProjectConfiguration(boolean sendReportReminderEmails, String projectId = 'p1') {
        Map project = [projectId:projectId]
        projectService.get(projectId) >> project
        projectConfigurationService.getProjectConfiguration(project) >> programConfig(sendReportReminderEmails)
    }

    /** Stubs the organisation configuration lookup so that reminder emails are enabled/disabled as specified */
    private void stubOrganisationConfiguration(boolean sendReportReminderEmails, String organisationId = 'o1') {
        Map organisation = [organisationId:organisationId]
        organisationService.get(organisationId) >> organisation
        organisationService.findOrganisationReportConfigurationForReport(organisation, _) >>
                new ReportConfig(activityType:ACTIVITY_TYPE, sendReportReminderEmails:sendReportReminderEmails)
    }

    def "No emails are sent when no reports are due"() {
        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> []
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    @Unroll
    def "A reminder email is sent to project members when a project report is #description"() {
        setup:
        Map r = report(dueDate:DateUtils.format(dueDate(DateUtils.now())))
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        1 * projectService.sendReportReminderEmail(r, expectedTemplate)
        1 * reportService.update({ it.reportId == 'r1' && it[expectedSentDateProperty] })
        0 * organisationService.sendReportReminderEmail(_, _)

        where:
        description | dueDate                                       | expectedTemplate                                              | expectedSentDateProperty
        "overdue"   | { DateTime now -> now.minusDays(1) }          | EmailTemplate.PROJECT_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE  | "overDueEmailSentDate"
        "due today" | { DateTime now -> now.plusHours(2) }          | EmailTemplate.PROJECT_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE| "dueTodayEmailSentDate"
        "due soon"  | { DateTime now -> now.plusDays(3) }           | EmailTemplate.PROJECT_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE | "dueSoonEmailSentDate"
    }

    @Unroll
    def "A reminder email is sent to organisation members when an organisation report is #description"() {
        setup:
        Map r = report(projectId:null, organisationId:'o1', dueDate:DateUtils.format(dueDate(DateUtils.now())))
        stubOrganisationConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        1 * organisationService.sendReportReminderEmail(r, expectedTemplate)
        1 * reportService.update({ it.reportId == 'r1' && it[expectedSentDateProperty] })
        0 * projectService.sendReportReminderEmail(_, _)

        where:
        description | dueDate                              | expectedTemplate                                                   | expectedSentDateProperty
        "overdue"   | { DateTime now -> now.minusDays(1) } | EmailTemplate.ORGANISATION_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE  | "overDueEmailSentDate"
        "due today" | { DateTime now -> now.plusHours(2) } | EmailTemplate.ORGANISATION_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE| "dueTodayEmailSentDate"
        "due soon"  | { DateTime now -> now.plusDays(3) }  | EmailTemplate.ORGANISATION_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE | "dueSoonEmailSentDate"
    }

    @Unroll
    def "No reminder email is sent for a project report when the report configuration has reminder emails disabled (#description)"() {
        setup:
        Map r = report(dueDate:DateUtils.format(dueDate(DateUtils.now())))
        stubProjectConfiguration(false)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)

        where:
        description | dueDate
        "overdue"   | { DateTime now -> now.minusDays(1) }
        "due today" | { DateTime now -> now.plusHours(2) }
        "due soon"  | { DateTime now -> now.plusDays(3) }
    }

    @Unroll
    def "No reminder email is sent for an organisation report when the report configuration has reminder emails disabled (#description)"() {
        setup:
        Map r = report(projectId:null, organisationId:'o1', dueDate:DateUtils.format(dueDate(DateUtils.now())))
        stubOrganisationConfiguration(false)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)

        where:
        description | dueDate
        "overdue"   | { DateTime now -> now.minusDays(1) }
        "due today" | { DateTime now -> now.plusHours(2) }
        "due soon"  | { DateTime now -> now.plusDays(3) }
    }

    def "No reminder email is sent if no report configuration can be found for a project report"() {
        setup:
        Map r = report()
        Map project = [projectId:'p1']
        projectService.get('p1') >> project
        projectConfigurationService.getProjectConfiguration(project) >> new ProgramConfig([projectReports:[[activityType:'Another Report']]])

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    def "No reminder email is sent if no report configuration can be found for an organisation report"() {
        setup:
        Map r = report(projectId:null, organisationId:'o1')
        Map organisation = [organisationId:'o1']
        organisationService.get('o1') >> organisation
        organisationService.findOrganisationReportConfigurationForReport(organisation, _) >> null

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    def "The report configuration is only looked up once per project, regardless of how many reports are processed"() {
        setup:
        List reports = (1..3).collect { report(reportId:"r${it}") }
        Map project = [projectId:'p1']

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> reports
        1 * projectService.get('p1') >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> programConfig(true)

        and:
        3 * projectService.sendReportReminderEmail(_, EmailTemplate.PROJECT_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE)
        3 * reportService.update(_)
    }

    def "The report configuration is only looked up once per organisation, regardless of how many reports are processed"() {
        setup:
        List reports = (1..3).collect { report(reportId:"r${it}", projectId:null, organisationId:'o1') }
        Map organisation = [organisationId:'o1']

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> reports
        1 * organisationService.get('o1') >> organisation
        1 * organisationService.findOrganisationReportConfigurationForReport(organisation, _) >>
                new ReportConfig(activityType:ACTIVITY_TYPE, sendReportReminderEmails:true)

        and:
        3 * organisationService.sendReportReminderEmail(_, EmailTemplate.ORGANISATION_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE)
        3 * reportService.update(_)
    }

    def "Reports owned by different projects each have their own configuration applied"() {
        setup:
        Map enabledReport = report(reportId:'r1', projectId:'p1')
        Map disabledReport = report(reportId:'r2', projectId:'p2')
        stubProjectConfiguration(true, 'p1')
        stubProjectConfiguration(false, 'p2')

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [enabledReport, disabledReport]
        1 * projectService.sendReportReminderEmail(enabledReport, EmailTemplate.PROJECT_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE)
        0 * projectService.sendReportReminderEmail(disabledReport, _)
        1 * reportService.update({ it.reportId == 'r1' && it.dueSoonEmailSentDate })
        0 * reportService.update({ it.reportId == 'r2' })
    }

    def "An error retrieving the report configuration doesn't prevent the remaining reports from being processed"() {
        setup:
        Map r1 = report(reportId:'r1', projectId:'p1')
        Map r2 = report(reportId:'r2', projectId:'p2')
        projectService.get('p1') >> { throw new RuntimeException("Project lookup failed") }
        stubProjectConfiguration(true, 'p2')

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r1, r2]
        0 * projectService.sendReportReminderEmail(r1, _)
        0 * reportService.update({ it.reportId == 'r1' })

        and: "the second report is still processed"
        1 * projectService.sendReportReminderEmail(r2, _)
        1 * reportService.update({ it.reportId == 'r2' && it.dueSoonEmailSentDate })
    }

    @Unroll
    def "A reminder email is not sent twice when the #sentDateProperty has already been recorded"() {
        setup:
        Map r = report((sentDateProperty):DateUtils.format(DateUtils.now().minusDays(1)), dueDate:DateUtils.format(dueDate(DateUtils.now())))
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)

        where:
        sentDateProperty       | dueDate
        "overDueEmailSentDate" | { DateTime now -> now.minusDays(1) }
        "dueTodayEmailSentDate"| { DateTime now -> now.plusHours(2) }
        "dueSoonEmailSentDate" | { DateTime now -> now.plusDays(3) }
    }

    def "No email is sent if the report isn't due in the next 7 days"() {
        setup:
        Map r = report(dueDate:DateUtils.format(DateUtils.now().plusDays(8)))
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    def "No email is sent or recorded if the report has no project or organisation owner"() {
        setup:
        Map r = report(projectId:null)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.get(_)
        0 * organisationService.get(_)
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    def "An error sending an email for one report doesn't prevent the remaining reports from being processed"() {
        setup:
        Map r1 = report(reportId:'r1')
        Map r2 = report(reportId:'r2')
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r1, r2]
        1 * projectService.sendReportReminderEmail(r1, _) >> { throw new RuntimeException("Email failed") }
        0 * reportService.update({ it.reportId == 'r1' })

        and: "the second report is still processed"
        1 * projectService.sendReportReminderEmail(r2, _)
        1 * reportService.update({ it.reportId == 'r2' && it.dueSoonEmailSentDate })
    }

    def "Reports are processed a page at a time until a partial page is returned"() {
        setup:
        List page1 = (1..100).collect { report(reportId:"r${it}") }
        List page2 = [report(reportId:'r101')]
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> page1
        1 * reportService.findReportsDueInTheNext7Days(100, 100, _) >> page2
        0 * reportService.findReportsDueInTheNext7Days(200, 100, _)

        and:
        101 * projectService.sendReportReminderEmail(_, EmailTemplate.PROJECT_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE)
        101 * reportService.update(_)
    }

    def "The configuration cache is shared between pages of reports processed by a single run"() {
        setup:
        List page1 = (1..100).collect { report(reportId:"r${it}") }
        List page2 = [report(reportId:'r101')]
        Map project = [projectId:'p1']

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> page1
        1 * reportService.findReportsDueInTheNext7Days(100, 100, _) >> page2
        1 * projectService.get('p1') >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> programConfig(true)
        101 * projectService.sendReportReminderEmail(_, _)
    }

    def "The same date is used for all pages of reports processed by a single run"() {
        setup:
        List<DateTime> dates = []
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        2 * reportService.findReportsDueInTheNext7Days(_, 100, _) >> { int offset, int max, DateTime now ->
            dates << now
            offset == 0 ? (1..100).collect { report(reportId: "r${it}", dueDate: DateUtils.format(DateUtils.now().plusDays(30))) } : []
        }

        and:
        dates.size() == 2
        dates[0] == dates[1]
    }
}
