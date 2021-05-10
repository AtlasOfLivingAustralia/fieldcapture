package pages

import pages.modules.DatasetPageModule
import pages.modules.DocumentsTab
import pages.modules.EditableMeriPlan
import pages.modules.MeriPlanTabContent
import pages.modules.ProjectAdminTab
import pages.modules.ProjectReports
import pages.modules.RlpOverviewTab
import pages.modules.RlpSitesTab
import pages.modules.TimeoutModal

class RlpProjectPage extends ReloadablePage {

    static url = 'project/index' // requires a project id parameter
    static at = { title.endsWith('| Project | MERIT') }

    static content = {

        name { $('h1[data-bind*=name]') }
        overviewTab { $('#overview-tab') }
        documentsTab(required: false) { $('#documents-tab') }
        dashboardTab(required: false) { $('#serviceDelivery-tab') }

        meriPlanTab(required: false) { $('#details-tab') }
        sitesTab(required: false) { $('#site-tab') }
        reportingTab(required: false) { $('#reporting-tab') }
        adminTab(required: false) { $('#admin-tab') }

        overview { module RlpOverviewTab }
        adminContent(required: false) { module ProjectAdminTab }
        documents(required: false) { module DocumentsTab }
        projectReports(required: false) { module ProjectReports }
        sitesTabContent(required: false) { module RlpSitesTab }

        timeoutModal(required: false) { $('div.bootbox.modal').module TimeoutModal }
        unsavedEdits(required: false) { $('.unsaved-changes') }

        datasetTab(required: false) {$('#datasets-tab')}
        datasetDetails(required: false) {module DatasetPage}
        addNewDataset(required: false) {$('.btn-primary')}

        meriPlanTabContent {module MeriPlanTabContent }
    }

    def openDocumentDialog() {
        adminTab.click()
        waitFor { adminContent.displayed }
        adminContent.attachDocument()
    }

    def regenerateReports() {
        adminTab.click()
        waitFor { adminContent.displayed }
        adminContent.projectSettingsTab.click()
        waitFor { adminContent.projectSettings.displayed }
        adminContent.projectSettings.regenerateReports()
        waitFor { hasBeenReloaded() }
    }

    def openAdminTab() {
        adminTab.click()
        waitFor { adminContent.displayed }
    }

    def openMeriPlanEditTab() {
        openAdminTab()
        adminContent.openMeriPlan()
    }

    def openMERIPlanTab() {
        meriPlanTab.click()
        waitFor {meriPlanTabContent.displayed }

        return meriPlanTabContent
    }

    def openReadOnlyMeriPlan() {
        openMERIPlanTab()
    }
}
