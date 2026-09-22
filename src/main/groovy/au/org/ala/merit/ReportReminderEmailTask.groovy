package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ReportConfig
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

    @Scheduled(cron = '${app.reportReminderTask.cronExpression}') // Runs every day at 1:02am by default
    void checkForReportEmailsToSend() {
        DateTime now = DateUtils.now()

        int offset = 0
        int max = 100
        List<Map> reports
        Map configurationCache = [:] // Cache for program/organisation configurations to avoid repeated lookups
        do {
            reports = reportService.findReportsDueInTheNext7Days(offset, max, now)
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

        DateTime dueDate = DateUtils.parse(report.dueDate)
        if (dueDate.isBefore(now)) {
            if (!report.overDueEmailSentDate) {
                sendReportReminderEmail(report, getOverdueEmailTemplate(report))
                reportService.update([reportId: report.reportId, overDueEmailSentDate: DateUtils.format(now.withZone(DateTimeZone.UTC))])
            }
            log.info("Report ${report.reportId} is overdue. Sending email.")
        } else if (dueDate.isBefore(now.plusDays(1))) {
            if (!report.dueTodayEmailSentDate) {
                sendReportReminderEmail(report, getDueTodayEmailTemplate(report))
                reportService.update([reportId: report.reportId, dueTodayEmailSentDate: DateUtils.format(now.withZone(DateTimeZone.UTC))])
            }
            log.info("Report ${report.reportId} is due today.  Sending email.")
        } else if (dueDate.isBefore(now.plusDays(7))) {
            if (!report.dueSoonEmailSentDate) {
                sendReportReminderEmail(report, getDueSoonEmailTemplate(report))
                reportService.update([reportId: report.reportId, dueSoonEmailSentDate: DateUtils.format(now.withZone(DateTimeZone.UTC))])
            }
            log.info("Report ${report.reportId} is due in the next 7 days. Sending email.")
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
