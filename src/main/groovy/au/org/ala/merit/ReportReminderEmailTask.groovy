package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ReportConfig
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled

/**
 * This class is responsible for sending email reminders for reports
 * that are due soon, due today, or overdue. It runs as a scheduled task every day at 1:02am.
 */
@Slf4j
class ReportReminderEmailTask {

    @Autowired
    ReportService reportService

    @Autowired
    ProjectService projectService

    @Autowired
    OrganisationService organisationService

    @Autowired
    ProjectConfigurationService projectConfigurationService

    @Autowired
    UserService userService

    @Autowired
    SettingService settingService

    @Autowired
    GrailsApplication grailsApplication

    @Scheduled(cron = '${app.reportReminderTask.cronExpression}') // Runs every day at 1:02am by default
    void runReportReminderEmailTask() {
        log.info("Starting Report Reminder Email Task")
        try {
            String systemEmail = grailsApplication.config.getProperty("fieldcapture.system.email.address")
            UserDetails user = new UserDetails("reportReminderTask", systemEmail, "merit")
            userService.withUser(user) {
                settingService.withDefaultHub {
                    checkForReportEmailsToSend()
                }
            }
        } catch (Exception e) {
            log.error("Error occurred while checking for report emails to send: ${e.message}", e)
        }
        log.info("Finished Report Reminder Email Task")
    }
    void checkForReportEmailsToSend() {
        DateTime now = DateUtils.now()
        DateTime from = now.minusDays(2)
        DateTime to = now.plusDays(7)

        int offset = 0
        int max = 100
        List<Map> reports
        Map configurationCache = [:] // Cache for program/organisation configurations to avoid repeated lookups
        do {
            reports = reportService.findReportsDueInRange(offset, max, from, to)
            reports.each { report ->
                try {
                    checkAndSendReportReminderEmail(report, now, configurationCache)
                } catch (Exception e) {
                    log.error("Error sending report email for report ${report.reportId}: ${e.message}", e)
                }
            }
            offset += max
        } while (reports.size() == max)


    }

    /**
     * Report reminder emails can be enabled or disabled in the report configuration for a
     * project or organisation. This method checks the configuration for the report's project or organisation
     * to determine if reminder emails should be sent.
     * @param report The report for which to check the configuration
     * @param configurationCache A cache of previously retrieved configurations to avoid repeated lookups
     * @return true if reminder emails are enabled for the report's project or organisation, false otherwise
     */
    private boolean isReportReminderEmailEnabled(Map report, Map configurationCache) {
        String configKey = report.projectId ? "project_${report.projectId}" : "organisation_${report.organisationId}"
        if (!configurationCache.containsKey(configKey)) {
            if (report.projectId) {
                Map project = projectService.get(report.projectId)
                ProgramConfig programConfig = projectConfigurationService.getProjectConfiguration(project)
                ReportConfig reportConfig = programConfig.findProjectReportConfigForReport(report)
                configurationCache[configKey] = [sendReportReminderEmails: reportConfig?.sendReportReminderEmails]
            }
            else if (report.organisationId) {
                Map organisation = organisationService.get(report.organisationId)
                ReportConfig reportConfig = organisationService.findOrganisationReportConfigurationForReport(organisation, report)
                configurationCache[configKey] = [sendReportReminderEmails: reportConfig?.sendReportReminderEmails]
            }
        }
        Map config = configurationCache[configKey]
        return config?.sendReportReminderEmails ?: false
    }

    private void checkAndSendReportReminderEmail(Map report, DateTime now, Map configurationCache) {
        // Check if the report is overdue, due today, or due in the next 7 days
        // Due today means the due date is 24 hours or less from now.

        if (!isReportReminderEmailEnabled(report, configurationCache)) {
            log.debug("Report ${report.reportId} is not configured to send reminder emails. Skipping.")
            return
        }

        // Due dates are stored as midnight on the day they are due so when we
        // are checking if a report is overdue we need to check if the due date is before yesterday.
        // Similarly reports due today will have the same date as today, but the time
        // will be 00:00 so we need to check if the due date is before now (but not a full
        // day before now).
        DateTime dueDate = DateUtils.parse(report.dueDate)
        if (dueDate.plusDays(1).isBefore(now)) {
            if (!report.overDueEmailSentDate) {
                log.info("Report ${report.reportId} is overdue. Sending email.")
                sendReportReminderEmail(report, getOverdueEmailTemplate(report))
                reportService.update([reportId: report.reportId, overDueEmailSentDate: DateUtils.format(now.withZone(DateTimeZone.UTC))])
            }

        } else if (dueDate.isBefore(now)) {
            if (!report.dueTodayEmailSentDate) {
                log.info("Report ${report.reportId} is due today.  Sending email.")
                sendReportReminderEmail(report, getDueTodayEmailTemplate(report))
                reportService.update([reportId: report.reportId, dueTodayEmailSentDate: DateUtils.format(now.withZone(DateTimeZone.UTC))])
            }
        } else if (dueDate.minusDays(7).isBefore(now)) {
            if (!report.dueSoonEmailSentDate) {
                log.info("Report ${report.reportId} is due in the next 7 days. Sending email.")
                sendReportReminderEmail(report, getDueSoonEmailTemplate(report))
                reportService.update([reportId: report.reportId, dueSoonEmailSentDate: DateUtils.format(now.withZone(DateTimeZone.UTC))])
            }
        } else {
            log.info("Report ${report.reportId} is not due in the next 7 days. Not sending email.")
        }
    }

    private static EmailTemplate getOverdueEmailTemplate(Map report) {
        report.projectId ? EmailTemplate.PROJECT_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE : EmailTemplate.ORGANISATION_REPORT_OVERDUE_REMINDER_EMAIL_TEMPLATE
    }

    private static EmailTemplate getDueTodayEmailTemplate(Map report) {
        report.projectId ? EmailTemplate.PROJECT_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE : EmailTemplate.ORGANISATION_REPORT_DUE_TODAY_REMINDER_EMAIL_TEMPLATE
    }

    private static EmailTemplate getDueSoonEmailTemplate(Map report) {
        report.projectId ? EmailTemplate.PROJECT_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE : EmailTemplate.ORGANISATION_REPORT_DUE_SOON_REMINDER_EMAIL_TEMPLATE
    }

    private void sendReportReminderEmail(Map report, EmailTemplate emailTemplate) {
        if (report.projectId) {
            projectService.sendReportReminderEmail(report, emailTemplate)
        } else if (report.organisationId) {
            organisationService.sendReportReminderEmail(report, emailTemplate)
        }
    }

}
