package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils

import org.joda.time.Period


class ReportService {

    def grailsApplication
    def webService
    def userService
    def projectService
    def authService
    def searchService

    /**
     * This method supports automatically creating reporting activities for a project that re-occur at defined intervals.
     * e.g. a stage report once every 6 months or a green army monthly report once per month.
     * Activities will only be created when no reporting activity of the correct type exists within each period.
     * @param projectId identifies the project.
     * @param config List of [type:<activity type>, period:<period that must have a reporting activity>
     * @return
     */
    def regenerateAllStageReportsForProject(projectId, periodInMonths = 6, alignToCalendar = false) {

        def project = projectService.get(projectId, 'all')
        println periodInMonths

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

        while (periodStartDate < endDate) {
            def periodEndDate = periodStartDate.plus(period)

            def report = [
                    fromDate:DateUtils.format(periodStartDate),
                    toDate:DateUtils.format(periodEndDate),
                    dueDate:DateUtils.format(periodEndDate.plusDays(43)),
                    type:'Activity',
                    projectId:projectId,
                    name:'Stage '+stage,
                    description:'Stage '+stage+' for '+project.name
            ]

            if (reports.size() >= stage) {
                report.reportId = reports[stage-1].reportId
                update(report)
            }
            else {
                create(report)
            }
            stage++
            periodStartDate = periodEndDate
        }

        // Delete any left over reports.
        for (int i=stage-2; i<reports.size(); i++) {
            delete(reports[i].reportId)
        }
    }

    def delete(String reportId) {
        if (!reportId) {
            throw new IllegalArgumentException("Missing parameter reportId")
        }
        webService.doDelete(grailsApplication.config.ecodata.baseUrl+"report/${reportId}")
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
        webService.doPost(grailsApplication.config.ecodata.baseUrl+"report/", report)
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

    def getHighlightedStatistics() {

        //"Number of projects addressing threatened species"
        //searchService.search([fq:'meriPlanAssetFacet:Threatened+Species'])


        //fq:"associatedSubProgram:Reef Rescue 2013/14"
        //score:"Total No. of farming entities adopting sustainable practice change"

//        Reef
//
//        Weight of marine debris removed
//        (Pest Management) Number of Crown of Thorn Starfish removed
//        Length of fences erected
//        Additional info-graphics for Future projects (Reef Trust phase II, III and IV)
//
//        Total Erosion area treated
//        Indigenous
//
//        No employed and no of on country visits for Indigenous
//        National Landcare Programme
//
//        $XXX and no. Project Sustainable ag - If we tell you which budget line is sustainable agriculture could we aggregate this figure?  custom.details.budget.rows.shortLabel:"MERI & Admin"
//                $XXX and no. Projects - to support Indigenous projects (using Asset addressed)
//        $XXX and no. Projects - that help protect threatened species and their habitat (using Asset addressed)
//        $XXX and no. Projects - that support the health of World Heritage Area (using Asset addressed).
//        Pest animals area managed – target for now, moving to delivered down the track?
//                Weeds treated by area, moving to delivered down the track?
//                20MT-number of trees (>2m) planted, also ability to modify this to number of trees surviving as program matures. Display – progress against target of 20 million
//        All programmes:
//
//        Ha of weeds removed
//        All programmes: Area treated for felius catus
//        NLP:
//
//        Ha weed treatment by main activity partner ‘Local Landcare, ‘Friends of’, community, or farmer groups
//        No of volunteers participating in project activities
//        Green Army:
//
//        No. of Participants who commenced projects
//        Green Army: No of teams (projects), active and complete
        [
                [config:'1', programme:'National Landcare Programme', text:'volunteers participating', value:'234', units:''],
                [config:'2', programme:'Green Army', text:'of debris removed', value:'40,149', units:'m<super>2</super>'],
                [config:'3', programme:'Green Army', text:'of weed treatment', value:'5,486', units:'Ha'],
                [config:'4', programme:'Green Army', text:'plants planted', value:'101,641', units:''],
                [config:'5', programme:'Green Army', text:'active & complete teams', value:'128', units:''],
                [config:'6', programme:'20 Million Trees', text:'of 20 million trees contracted', value:'1,123,412', units:'']
        ]


    }
}
