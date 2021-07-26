package pages.modules

import geb.Module

class ViewReef2050PlanReport extends Module {

    static content = {

        dashboardType (required: false) { $("#dashboardType") }
        reefReportContent (required: false) { $("#reportContents") }
    }
}
