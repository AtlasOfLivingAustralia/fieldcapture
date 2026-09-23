package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ReportConfig
import grails.config.Config
import grails.core.GrailsApplication
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
    UserService userService = Mock(UserService)
    SettingService settingService = Mock(SettingService)
    Config config = Mock(Config)
    GrailsApplication grailsApplication = Stub(GrailsApplication) {
        getConfig() >> config
    }

    ReportReminderEmailTask job = new ReportReminderEmailTask(
            reportService: reportService,
            projectService: projectService,
            organisationService: organisationService,
            projectConfigurationService: projectConfigurationService,
            userService: userService,
            settingService: settingService,
            grailsApplication: grailsApplication)

    private static final String ACTIVITY_TYPE = 'Test Report'
    private static final String SYSTEM_EMAIL = 'system@merit.test'

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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> []
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    @Unroll
    /**
     * Report due dates are stored as midnight on the day the report is due, meaning a report due
     * today will have a due date that has already passed by the time the task runs.  A report is
     * therefore only overdue once its due date is more than a day in the past.
     */
    def "A reminder email is sent to project members when a project report is #description"() {
        setup:
        Map r = report(dueDate:DateUtils.format(dueDate(DateUtils.now())))
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        1 * projectService.sendReportReminderEmail(r, expectedTemplate)
        1 * reportService.update({ it.reportId == 'r1' && it[expectedSentDateProperty] })
        0 * organisationService.sendReportReminderEmail(_, _)

        where:
        description | dueDate                                       | expectedTemplate                                              | expectedSentDateProperty
        "overdue"   | { DateTime now -> now.minusDays(2) }          | EmailTemplate.PROJECT_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE  | "overDueEmailSentDate"
        "due today" | { DateTime now -> now.minusHours(2) }          | EmailTemplate.PROJECT_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE| "dueTodayEmailSentDate"
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        1 * organisationService.sendReportReminderEmail(r, expectedTemplate)
        1 * reportService.update({ it.reportId == 'r1' && it[expectedSentDateProperty] })
        0 * projectService.sendReportReminderEmail(_, _)

        where:
        description | dueDate                              | expectedTemplate                                                   | expectedSentDateProperty
        "overdue"   | { DateTime now -> now.minusDays(2) } | EmailTemplate.ORGANISATION_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE  | "overDueEmailSentDate"
        "due today" | { DateTime now -> now.minusHours(2) } | EmailTemplate.ORGANISATION_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE| "dueTodayEmailSentDate"
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)

        where:
        description | dueDate
        "overdue"   | { DateTime now -> now.minusDays(2) }
        "due today" | { DateTime now -> now.minusHours(2) }
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)

        where:
        description | dueDate
        "overdue"   | { DateTime now -> now.minusDays(2) }
        "due today" | { DateTime now -> now.minusHours(2) }
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> reports
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> reports
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [enabledReport, disabledReport]
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r1, r2]
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)

        where:
        sentDateProperty       | dueDate
        "overDueEmailSentDate" | { DateTime now -> now.minusDays(2) }
        "dueTodayEmailSentDate"| { DateTime now -> now.minusHours(2) }
        "dueSoonEmailSentDate" | { DateTime now -> now.plusDays(3) }
    }

    def "No email is sent if the report isn't due in the next 7 days"() {
        setup:
        Map r = report(dueDate:DateUtils.format(DateUtils.now().plusDays(8)))
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    @Unroll
    def "A report due at midnight #daysAgo day(s) ago is treated as #description"() {
        setup:
        Map r = report(dueDate:DateUtils.format(DateUtils.now().withTimeAtStartOfDay().minusDays(daysAgo)))
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
        1 * projectService.sendReportReminderEmail(r, expectedTemplate)
        1 * reportService.update({ it.reportId == 'r1' && it[expectedSentDateProperty] })

        where:
        daysAgo | description | expectedTemplate                                               | expectedSentDateProperty
        0       | "due today" | EmailTemplate.PROJECT_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE | "dueTodayEmailSentDate"
        1       | "overdue"   | EmailTemplate.PROJECT_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE   | "overDueEmailSentDate"
    }

    def "No email is sent or recorded if the report has no project or organisation owner"() {
        setup:
        Map r = report(projectId:null)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r]
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> [r1, r2]
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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> page1
        1 * reportService.findReportsDueInRange(100, 100, _, _) >> page2
        0 * reportService.findReportsDueInRange(200, 100, _, _)

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
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> page1
        1 * reportService.findReportsDueInRange(100, 100, _, _) >> page2
        1 * projectService.get('p1') >> project
        1 * projectConfigurationService.getProjectConfiguration(project) >> programConfig(true)
        101 * projectService.sendReportReminderEmail(_, _)
    }

    def "The same date range is used for all pages of reports processed by a single run"() {
        setup:
        List<DateTime> fromDates = []
        List<DateTime> toDates = []
        stubProjectConfiguration(true)

        when:
        job.checkForReportEmailsToSend()

        then:
        2 * reportService.findReportsDueInRange(_, 100, _, _) >> { int offset, int max, DateTime from, DateTime to ->
            fromDates << from
            toDates << to
            offset == 0 ? (1..100).collect { report(reportId: "r${it}", dueDate: DateUtils.format(DateUtils.now().plusDays(30))) } : []
        }

        and:
        fromDates.size() == 2
        fromDates[0] == fromDates[1]
        toDates.size() == 2
        toDates[0] == toDates[1]
    }

    def "Reports are searched for from 2 days before to 7 days after the current date"() {
        setup:
        DateTime now = DateUtils.now()
        DateTime from = null
        DateTime to = null

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> { int offset, int max, DateTime f, DateTime t ->
            from = f
            to = t
            []
        }

        and: "the search starts 2 days before now so that recently overdue reports are included"
        Math.abs(from.millis - now.minusDays(2).millis) < 60000

        and: "the search ends 7 days after now"
        Math.abs(to.millis - now.plusDays(7).millis) < 60000
    }

    def "The scheduled task runs as the system user against the default hub"() {
        setup:
        UserDetails user = null

        when:
        job.runReportReminderEmailTask()

        then:
        1 * grailsApplication.config.getProperty("fieldcapture.system.email.address") >> SYSTEM_EMAIL
        1 * userService.withUser(_, _) >> { UserDetails u, Closure c ->
            user = u
            c.call()
        }
        1 * settingService.withDefaultHub(_) >> { Closure c -> c.call() }
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> []

        and:
        user.displayName == "reportReminderTask"
        user.userName == SYSTEM_EMAIL
    }

    def "An error during the scheduled task is caught and logged rather than propagated"() {
        when:
        job.runReportReminderEmailTask()

        then:
        1 * grailsApplication.config.getProperty("fieldcapture.system.email.address") >> SYSTEM_EMAIL
        1 * userService.withUser(_, _) >> { UserDetails u, Closure c -> c.call() }
        1 * settingService.withDefaultHub(_) >> { Closure c -> c.call() }
        1 * reportService.findReportsDueInRange(0, 100, _, _) >> { throw new RuntimeException("Search failed") }

        and: "the exception doesn't escape the task"
        noExceptionThrown()
    }
}
