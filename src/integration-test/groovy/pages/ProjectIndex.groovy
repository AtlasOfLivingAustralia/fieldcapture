package pages

import geb.Module
import pages.modules.*

/**
 * Represents a project index page.
 */
class ProjectIndex extends ReloadablePage {
    static url = 'project/index' // requires a project id parameter
    static at = { waitFor { title.contains('| Project |') } }

    static content = {

        overviewTab {$('#overview-tab')}
        documentsTab {$('#documents-tab')}
        meriPlanTab(required:false) {$('#details-tab')}
        activitiesTab {$('#plan-tab')}
        sitesTab {$('#site-tab')}
        dashboardTab {$('#serviceDelivery-tab')}
        adminTab {$('#admin-tab')}
        reportingTab(required: false) { $('#reporting-tab') }

        projectName { $('h1') }
        overview { module OverviewTab }
        plansAndReports(wait:true) { module PlansAndReportsTab }
        sites { module SitesTab }
        dashboard { $("#services-dashboard div.dashboard-section").moduleList ( ProjectDashboardSection) }
        admin { module ProjectAdminTab }
        projectReports(required: false) { module ProjectReports }

        addSites{ module AddSites }
        editDocumentForm {module DocumentDialog}

        editMap {$('button[data-bind*="editSite"]')}
        siteTabContents { module SiteTabContent }
        editSite {module EditSiteContent}
        mapMarker{ $('#map img[src*="marker-icon.png"]')}

    }

    void openActivitiesTab() {
        activitiesTab.click()
        waitFor { plansAndReports.displayed }
    }

    void openAdminTab() {
        adminTab.click()
        waitFor { admin.displayed }
    }

    void clickAddSiteButton(){
        sitesTab.click()
        waitFor {siteTabContents.displayed}
        waitFor {siteTabContents.addSites.displayed}
        siteTabContents.addSites.click()
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
        programName {$(".programName")}
        managementUnit {$(".managementUnitName")}
        projectStatus {$('span[data-bind*=status]')}
        terminationReason {$('.terminationReason')}
    }
}

class PlansAndReportsTab extends Module {

    static base = { $('#plan') }
    static content = {
        activities {
            $('#tablePlan tbody tr:not([data-bind])').moduleList(ActivityRow)
        }
        risksAndThreats(required:false) { $('#risk-validation').module(RisksAndThreats)}
    }
}

class ActivityRow extends Module {
    static content = {
        cell { i ->
            def index = $('td').size() == 8?i:i-1 // The stage column spans rows so only exists for the first activity of the stage.
            $('td', index)
        }

        stage { cell(0).text()  }

        actionEdit { cell(1).find('[data-bind*=editActivity]') }
        actionView { cell(1).find('[data-bind*=viewActivity]') }
        actionPrint { cell(1).find('[data-bind*=printActivity]') }
        actionDelete { cell(1).find('[data-bind*=del]') }

        fromDate { cell(2).text() }
        toDate { cell(3).text() }
        description { cell(4).text() }
        type { cell(5).text() }
        site { cell(6).text() }
        status { cell(7).text() }
    }

    def edit() {
        actionEdit.click()
    }

}

class AddSites extends Module{

    static content = {
        name{$('#name')}
        externalId{$("#externalId")}
        type{$("#siteType")}
        context{$("#siteContext")}
        description{$("#description")}
        notes{$("#notes")}
        defineExtent{$("#extentSource")}
        latitude {$("input",'data-bind':'value:geometry().decimalLatitude')}
        longitude { $("input", 'data-bind':"value:geometry().decimalLongitude")}
        chooseLayer{$("#chooseLayer")}
        chooseShape {$("#chooseShape")}
        saveButton{$("#save")}
        cancel{$("#cancel")}

    }

     def save() {
        saveButton.click()
    }
}

class DashboardTab extends Module {
    static  content = {
        serviceTitle{ $(".serviceTitle") }
        serviceHelpText{ $(".helpText")  }
        progresslabel{ $(".progress-label")}

    }
}



