package pages

import pages.modules.DocumentsTab
import pages.modules.ReadOnlyMeriPlan
import pages.modules.ProjectAdminTab
import pages.modules.ProjectReports
import pages.modules.RlpOverviewTab
import pages.modules.RlpSitesTab
import pages.modules.SiteTabContent
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
        sitesTabContent(required: false) { module SiteTabContent }

        timeoutModal(required: false) { $('div.bootbox.modal').module TimeoutModal }
        unsavedEdits(required: false) { $('.unsaved-changes') }

        datasetTab(required: false) {$('#datasets-tab')}
        datasetDetails(required: false) {module DataSetSummary}
        addNewDataset(required: false) {$('.btn-primary')}

        meriPlanTabContent { $('#view-meri-plan').module ReadOnlyMeriPlan }
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

    def openDataSetSummaryTab() {
        datasetTab.click()
        waitFor {
            datasetDetails.displayed
        }
        waitFor {
            datasetDetails.summaryTable.displayed
        }
        datasetDetails
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

    def displayOverview() {
        overviewTab.click()
        waitFor{overview.displayed}
    }

    def displayReportingTab() {
        reportingTab.click()
        waitFor 10, {
            projectReports.displayed
        }
    }
}
