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
        plansAndReportsTab {$('#plan-tab')}
        sitesTab {$('#site-tab')}
        dashboardTab {$('#dashboard-tab')}
        adminTab {$('#admin-tab')}

        projectName { $('h1') }
        overview { module OverviewTab }
        plansAndReports { module PlansAndReportsTab }
        sites { module SitesTab }
        dashboard { module DashboardTab }
        admin { module AdminTab }

        iAmSure { $('div modal a[data-handler~=1]') }
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

    static content = {
        activities {
            $('#tablePlan tbody').collect {
                module ActivityRow, it
            }
        }
    }
}

class ActivityRow extends Module {
    static content = {
        cell { i-> $('td', i)}
        stage { cell(0).text() }

        actionEdit { cell(1).find('[data-bind*=editActivity]') }
        actionView {  cell(1).find('[data-bind*=viewActivity]') }
        actionPrint {  cell(1).find('[data-bind*=printActivity]') }
        actionDelete {  cell(1).find('[data-bind*=del]') }

        fromDate { cell(2).text() }
        toDate { cell(3).text() }
        description { cell(4).text() }
        type { cell(5).text() }
        site { cell(6).text() }
        status { cell(7).text() }
    }
}

class SitesTab extends Module {

}

class DashboardTab extends Module {

}

class AdminTab extends Module {

}
