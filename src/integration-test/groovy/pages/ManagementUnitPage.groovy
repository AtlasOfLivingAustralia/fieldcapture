package pages

import geb.Page
import pages.modules.AddOrEditManagementUnit
import pages.modules.ManagementUnitAdminTab
import pages.modules.ManagementUnitReports


class ManagementUnitPage extends ReloadablePage {

    static url = 'managementUnit/index'

    static at = { waitFor {name.text() != null } }

    static content = {
        starBtn {$('#starBtn')}
        name {$('div#managementUnitName h2')}
        overviewBtn{$('a#about-tab', 0)}
        grantIdsTable{$('td.grantId')}
        projectLinksTd{$('td.grantId a')}
        gotoProgramLinks{$('a.gotoProgram')}
        editManagementUnitBlogPane{$('div#editManagementUnitBlog')}
        adminTabPane(required: false) { module ManagementUnitAdminTab }
        editMUBlogTab{$('a#editManagementUnitBlog-tab')}
        editManagementUnitButton(required: false) { $('#edit-managementUnit-details .admin-action')}
        adminTab(required: false) { $('#admin-tab') }
        reportsTab(required: false) { $('#projects-tab') }
        reportsTabPane(required: false) { module ManagementUnitReports }
        sitesTab(required:false) { $('#sites-tab') }
        mapInfo { $("#map-info") }
        headerTitle {$("#managementUnitName")}
        visitUs {$("data-bind:'text-url'")}
        description {$('.row .col-md-8 span[data-bind*="html:description"] p')}
    }

    List grantIds() {
        grantIdsTable.collect{it.text()}
    }

    List projectLinks(){
        projectLinksTd.collect{it.attr('href')}
    }

    List gotoProgram(){
        gotoProgramLinks.collect{it}
    }

    List primaryOutcomes() {
        $('div.outcomes.primary .outcome').collect{it.text().trim()}
    }

    List targetedPrimaryOutcomes() {
        $('div.outcomes.primary .outcome.targeted').collect{it.text().trim()}
    }

    List secondaryOutcomes() {
        $('div.outcomes.secondary .outcome').collect{it.text().trim()}
    }

    List targetedSecondaryOutcomes() {
        $('div.outcomes.secondary .outcome.targeted').collect{it.text().trim()}
    }

    void openDocumentDialog() {
        adminTab.click()
        waitFor { adminTabPane.displayed }
        adminTabPane.attachDocument()
    }

    void editManagementUnit(){
        adminTab.click()
        waitFor{editManagementUnitButton.displayed}
        editManagementUnitButton.click()

    }

    void displayAdminReportConfig() {
        adminTab.click()
        waitFor { adminTabPane.displayed }
        adminTabPane.viewReportingSection()
    }

    void displayReportsTab() {
        reportsTab.click()
        waitFor { reportsTabPane.displayed }
        reportsTabPane
    }

    def openAdminTab() {
        adminTab.click()
        waitFor { adminTabPane.displayed }
    }

}

class CreateManagementUnit extends Page {
    static url = "managementUnit/create"
    static at = { title.startsWith("Create | Management Unit") }

    static content = {
        create { module AddOrEditManagementUnit }
    }
}
