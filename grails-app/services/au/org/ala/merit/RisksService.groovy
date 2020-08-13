package au.org.ala.merit

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.joda.time.DateTime
import org.joda.time.DateTimeZone

/**
 * Manages the scheduling of a task to periodically check for changes to project risks and threats.
 */
class RisksService {

    GrailsApplication grailsApplication
    SearchService searchService
    SettingService settingService
    ProjectService projectService

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

    private DateTime approximatelyNow() {
        DateUtils.now().withZone(DateTimeZone.UTC)
    }

    /**
     * Runs every day at 2am.
     * If it has been <config> days or more since the last time the system has checked projects for changes
     * to risks and threats, it will:
     * 1. Find all projects for which the risks and threats have been modified since the last time we checked.
     * 2. For each project, send an email to all registered grant managers notifying them of the change.
     */
    void checkAndSendEmail() {
        DateTime now = approximatelyNow()
        DateTime lastCheckTime = getLastCheckTime()

        if (needsCheck(now,  lastCheckTime)) {
            log.info("Checking for changes to risks and threats")
            List projects = findProjectsWithChangedRisksAndThreatsBetween(lastCheckTime, now)
            notifyGrantManagers(projects)

            updateLastCheckTime(now)
        }
    }

    /** Returns true if we last checked <config> days ago or more */
    private boolean needsCheck(DateTime now, DateTime lastCheckTime) {
        int periodInDays = getScheduleCheckPeriod()
        // Round dates to the day to avoid issues with minor changes when the schedule runs.
        DateTime checkThreshold = now.withTime(0, 0, 0, 0).minusDays(periodInDays)
        DateTime lastCheckRounded  = lastCheckTime.withTime(0, 0, 0, 0)
        lastCheckRounded.isBefore(checkThreshold) || lastCheckRounded.isEqual(checkThreshold)
    }

    /**
     * Sends an email for each supplied project to all grant managers registered for that project notifying
     * them of a change to the risks and threats.
     * @param projects the list of changed projects.
     */
    private void notifyGrantManagers(List projects) {
        String systemEmail = grailsApplication.config.merit.support.email
        log.info("Found ${projects.size()} projects with modified risks and threats")
        projects.each { Map project ->
            // Using the PROJECT_ADMIN_ROLE as the initiator has the effect of sending the email to grant managers.
            log.info("Sending risks and threats email for project: ${project.projectId}")
            projectService.sendEmail({EmailTemplate.RISKS_AND_THREATS_CHANGED_EMAIL}, project, RoleService.PROJECT_ADMIN_ROLE, systemEmail)
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

        projects ?: []
    }
}
