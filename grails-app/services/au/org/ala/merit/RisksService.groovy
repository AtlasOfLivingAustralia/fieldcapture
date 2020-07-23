package au.org.ala.merit

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler

/**
 * Manages the scheduling of a task to periodically check for changes to project risks and threats.
 */
class RisksService {

    GrailsApplication grailsApplication
    SearchService searchService
    SettingService settingService
    ProjectService projectService
    ThreadPoolTaskScheduler threadPoolTaskScheduler

    private int getScheduleCheckPeriod() {
        grailsApplication.config.risks.scheduleCheckingPeriod
    }

    private DateTime getLastCheckTime() {

        String isoDate = settingService.getSettingText(SettingPageType.RISKS_LAST_CHECK_TIME)

        DateTime lastCheckTime
        if (isoDate) {
            lastCheckTime = DateUtils.parse(isoDate)
        }
        else {
            lastCheckTime = approximatelyNow().minusDays(getScheduleCheckPeriod())
        }
        lastCheckTime
    }

    private void updateLastCheckTime(DateTime checkTime) {
        String isoDate =  DateUtils.format(checkTime)
        settingService.setSettingText(SettingPageType.RISKS_LAST_CHECK_TIME, isoDate)
    }

    /** We round the time off to 2am to avoid having to deal with how the processing time will affect checks */
    private DateTime approximatelyNow() {
        DateUtils.now().withTime(2, 0, 0, 0).withZone(DateTimeZone.UTC)
    }

    @Scheduled(cron="0 2 0 * * *")
    /**
     * Runs every day at 2am.
     * If it has been <config> days or more since the last time the system has checked projects for changes
     * to risks and threats, it will:
     * 1. Find all projects for which the risks and threats have been modified since the last time we checked.
     * 2. For each project, send an email to all registered grant managers notifying them of the change.
     */
    void checkAndSendEmail() {
        // We are deliberately ignoring the time here to prevent having to deal with small gaps created
        // by processing.
        DateTime now = approximatelyNow()
        DateTime lastCheckTime = getLastCheckTime()

        if (needsCheck(now,  lastCheckTime)) {
            List projects = findProjectsWithChangedRisksAndThreatsBetween(lastCheckTime, now)
            notifyGrantManagers(projects)

            updateLastCheckTime(now)
        }
    }

    /** Returns true if we last checked <config> days ago or more */
    private boolean needsCheck(DateTime now, DateTime lastCheckTime) {
        int periodInDays = getScheduleCheckPeriod()
        DateTime checkThreshold = now.minusDays(periodInDays)
        lastCheckTime.isBefore(checkThreshold) || lastCheckTime.isEqual(checkThreshold)
    }

    /**
     * Sends an email for each supplied project to all grant managers registered for that project notifying
     * them of a change to the risks and threats.
     * @param projects the list of changed projects.
     */
    private void notifyGrantManagers(List projects) {
        projects.each { Map project ->
            // Using the PROJECT_ADMIN_ROLE as the initiator has the effect of sending the email to grant managers.
            projectService.sendEmail({EmailTemplate.RISKS_AND_THREATS_CHANGED_EMAIL}, project, RoleService.PROJECT_ADMIN_ROLE)
        }
    }

    /**
     * Queries ecodata for projects where the risks and threats have been edited within the supplied period.
     */
    List<Map> findProjectsWithChangedRisksAndThreatsBetween(DateTime changedAfter, DateTime changedBefore) {

        String fromDate = DateUtils.format(changedAfter)
        String toDate = DateUtils.format(changedBefore)

        // Find all projects modified since the last time this job was run. (maybe just one week ago by default?)
        String query = "_query:(risks.dateUpdated:[${fromDate} TO ${toDate}])"
        Map results = searchService.allProjects([fq:query])

        List projects = results?.hits?.hits?.collect { it._source }

        projects
    }
}
