package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils

import org.joda.time.Period


class ReportService {

    def grailsApplication
    def webService
    def userService
    def projectService
    def authService

    /**
     * This method supports automatically creating reporting activities for a project that re-occur at defined intervals.
     * e.g. a stage report once every 6 months or a green army monthly report once per month.
     * Activities will only be created when no reporting activity of the correct type exists within each period.
     * @param projectId identifies the project.
     * @param config List of [type:<activity type>, period:<period that must have a reporting activity>
     * @return
     */
    def regenerateStageReportsForProject(projectId, periodInMonths, alignToCalendar) {

        def project = projectService.get(projectId, 'all')
        def period = Period.months(periodInMonths)

        def reports = getReportsForProject(projectId).sort{it.toDate}

        def startDate = DateUtils.parse(project.plannedStartDate)
        def endDate = DateUtils.parse(project.plannedEndDate)

        def periodStartDate = null
        def stage = 1
        for (int i=reports.size()-1; i>0; i--) {
            if (reports[i].publicationStatus == 'submitted' || reports[i].publicationStatus == 'approved') {
                periodStartDate = reports[i].toDate
                stage = i+1
            }
        }

        if (!periodStartDate) {
            periodStartDate = startDate

            if (alignToCalendar) {
                periodStartDate = DateUtils.alignToPeriod(periodStartDate, period)
            }

        }

        def periodEndDate = startDate.plus(period)

        while (periodEndDate < endDate) {

            def report = [
                    fromDate:periodStartDate,
                    toDate:periodEndDate,
                    dueDate:periodEndDate.plusDays(30),
                    type:'Activity',
                    projectId:projectId,
                    name:'Stage '+stage,
                    description:'Stage '+stage+' for '+project.name
            ]
            create(report)
            stage++
            periodStartDate = periodEndDate
            periodEndDate = periodEndDate.plus(period)
        }




    }

    def getReportsForProject(String projectId) {
        webService.getJson(grailsApplication.config.ecodata.baseUrl+"project/${projectId}/reports")
    }

    def getReportingHistoryForProject(String projectId) {
        def reports = getReportsForProject(projectId)

        def history = []
        reports.each { report ->

            report.statusChangeHistory.each { change ->
                def changingUser = authService.getUserForUserId(change.changedBy)
                def displayName = changingUser?changingUser.displayName:'unknown'
                history << [name:report.name, date:change.dateChanged, who:displayName, status:change.status]
            }
        }
        history.sort {it.dateChanged}
        history
    }

    def submit(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/submit/${reportId}", [:])
    }

    def approve(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/approve/${reportId}", [:])
    }

    def reject(String reportId) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/returnForRework/${reportId}", [:])
    }

    def create(report) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report", report)
    }

    def update(report) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/"+report.reportId, report)
    }

    def findReportsForUser(String userId) {

        def reports = webService.doPost(grailsApplication.config.ecodata.baseUrl+"user/${userId}/reports", [:])


        if (reports.resp && !reports.error) {
            return reports.resp.projectReports.groupBy{it.projectId}
        }

    }
}
