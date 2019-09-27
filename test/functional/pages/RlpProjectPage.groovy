package pages


import geb.Page
import pages.modules.RlpOverviewTab

class RlpProjectPage extends Page {

    static url = 'project/index' // requires a project id parameter
    static at = { title.endsWith('| Project | Field Capture')}

    static content = {

        name { $('h1[data-bind*=name]') }
        overviewTab { $('#overview-tab') }
        documentsTab { $('#documents-tab') }
        dashboardTab(required:false) { $('#serviceDelivery-tab') }

        meriPlanTab(required:false) { $('#details-tab') }
        sitesTab(required:false) { $('#site-tab') }
        reportingTab(required:false) { $('#reporting-tab') }
        adminTab(required:false) { $('#admin-tab') }

        overview { module RlpOverviewTab }
    }
}