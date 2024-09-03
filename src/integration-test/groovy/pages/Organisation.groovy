package pages

import geb.Page
import pages.modules.OrganisationReports
import pages.modules.OrganisationAdminTab

class Organisation extends ReloadablePage {
    static url = 'organisation/index'

    static at = { $('#organisationDetails').displayed }

    static content = {
        name {$('h2')}
        aboutTab{$('a#about-tab',0)}
        adminTab(required: false) { $('#admin-tab') }
        adminTabContent(required: false)  { module OrganisationAdminTab }
        orgName { $('.header-text') }
        orgDescription { $('span#orgDescription') }
        orgAbn {$('span#orgAbn')}
        projectContent {$("#projects .projects-wrapper tbody tr td")}
        reportingTab(required: false) { $('#projects-tab') }
        sitesTab {$("#sites-tab")}
        reportsTabPane(required:false) { module(OrganisationReports)}
        reportDeclaration { $('#declaration') }
    }

    void openAboutTab() {
        waitFor { aboutTab.displayed }
        aboutTab.click()
        waitFor { orgDescription.displayed }
    }

    void edit() {
        openAdminTab()
        adminTabContent.viewEditSection()

        adminTabContent.editButton.click()
    }

    def openAdminTab() {
        waitFor {adminTab.displayed}
        adminTab.click()
        waitFor 10, { adminTabContent.displayed }
    }

    void openDocumentDialog() {
        adminTab.click()
        waitFor { adminTabContent.displayed }
        adminTabContent.attachDocument()
    }

    void displayReportsTab() {
        waitFor {reportingTab.displayed}
        reportingTab.click()
        waitFor 60, { reportsTabPane.displayed }
        reportsTabPane
    }

    def acceptTerms() {
        $('#declaration [name="acceptTerms"]').value(true)
    }

    def submitDeclaration() {
        $('#declaration [data-bind*="submitReport"]').click()
    }
}
class EditOrganisation extends Page{
    static url = 'organisation/edit' // requires a program id parameter

    static at = { title.startsWith('Edit')}

    static content = {
        details { module AddOrEditOrganisation }
    }
}
