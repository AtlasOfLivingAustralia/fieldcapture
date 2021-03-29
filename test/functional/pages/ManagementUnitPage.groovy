package pages

import pages.modules.ManagementUnitAdminTab
import pages.modules.ManagementUnitReports


class ManagementUnitPage extends ReloadablePage {

    static url = 'managementUnit/index/test_mu'

    static at = { waitFor {name.text() != null } }

    static content = {
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

}
