package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
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

    ReportReminderEmailTask job = new ReportReminderEmailTask(
            reportService: reportService,
            projectService: projectService,
            organisationService: organisationService)

    private static Map report(Map overrides = [:]) {
        [reportId:'r1', projectId:'p1', dueDate:DateUtils.format(DateUtils.now().plusDays(3))] + overrides
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
    def "A reminder email is not sent twice when the #sentDateProperty has already been recorded"() {
        setup:
        Map r = report((sentDateProperty):DateUtils.format(DateUtils.now().minusDays(1)), dueDate:DateUtils.format(dueDate(DateUtils.now())))

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

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        0 * reportService.update(_)
    }

    def "No email is sent if the report has no project or organisation owner, but the sent date is still recorded"() {
        setup:
        Map r = report(projectId:null)

        when:
        job.checkForReportEmailsToSend()

        then:
        1 * reportService.findReportsDueInTheNext7Days(0, 100, _) >> [r]
        0 * projectService.sendReportReminderEmail(_, _)
        0 * organisationService.sendReportReminderEmail(_, _)
        1 * reportService.update({ it.reportId == 'r1' && it.dueSoonEmailSentDate })
    }

    def "An error sending an email for one report doesn't prevent the remaining reports from being processed"() {
        setup:
        Map r1 = report(reportId:'r1')
        Map r2 = report(reportId:'r2')

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

    def "The same date is used for all pages of reports processed by a single run"() {
        setup:
        List<DateTime> dates = []

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
