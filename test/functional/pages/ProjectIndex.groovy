package pages

import geb.Module
import geb.Page

/**
 * Represents a project index page.
 */
class ProjectIndex extends Page {
    static url = '/project/index' // requires a project id parameter
    static at = { title.endsWith('| Project | Field Capture')}

    static content = {

        overviewTab {$('#overview-tab')}
        plansAndReportsTab {${'#plan-tab'}}
        sitesTab {$('#site-tab')}
        dashboardTab {$('#dashboard-tab')}
        adminTab {$('#admin-tab')}

        projectName { $('h1') }
        overview { module OverviewTab }
        plansAndReports { module PlansAndReportsTab }
        sites { module SitesTab }
        dashboard { module DashboardTab }
        admin { module AdminTab }
    }
}

class OverviewTab extends Module {
    static content = {
        grantRecipient {$('')}
        associatedProgram {$('span', 'data-bind' : 'text:associatedProgram')}
        associatedSubProgram {$('')}

        projectStart {$('')}
        projectFinish {$('')}
        grantId {$('')}
        manager {$('')}
        description {$('')}
        newsAndEvents {$('')}
        stories {$('')}
        documents {$('')}

    }
}

class PlansAndReportsTab extends Module {

}

class SitesTab extends Module {

}

class DashboardTab extends Module {

}

class AdminTab extends Module {

}
