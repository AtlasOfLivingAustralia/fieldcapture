package pages.modules

import geb.Module

class ProjectAdminTab extends Module {
    static content = {

        projectSettingsTab {$('#settings-tab')}
        meriPlanTab {$('#projectDetails-tab')}
        risksAndThreatsTab(required:false) {$('#risks-tab')}
        newsAndEventsTab(required:false) {$('#editNewsAndEvents-tab')}
        projectStoriesTab(required:false) {$('#editProjectStories-tab')}
        projectAccessTab {$('#permissions-tab')}
        speciesOfInterestTab(required:false) { $('#species-tab') }
        documentsTab { $('#edit-documents-tab') }
        configOverrideTab(required:false) { $('#configuration-tab')}

        documents { module AdminDocumentsTab }
        projectSettings { module AdminProjectSettingsTab }
        meriPlan { $('#edit-meri-plan').module EditableMeriPlan }
        risksAndThreats(required:false) { $('#risks').module RisksAndThreats }
        projectAccess { $('#permissions').module PermissionsAdminModule }
        configOverride(required:false) { $('#configuration').module ProjectConfigModule }

    }

    def attachDocument() {
        documentsTab.click()
        waitFor { documents.displayed }
        documents.attachDocumentButton.click()
        documents.attachDocumentDialog
    }

    def openMeriPlan() {
        meriPlanTab.click()
        waitFor { meriPlan.displayed }

        return meriPlan
    }

    def openRisksAndThreats() {
        risksAndThreatsTab.click()
        waitFor { risksAndThreats.displayed }
        return risksAndThreats
    }

    def openProjectSettings() {
        projectSettingsTab.click()
        waitFor { projectSettings.displayed }
        return projectSettings
    }

    def openProjectAccess() {
        projectAccessTab.click()
        waitFor { projectAccess.displayed }
    }

    def openConfig() {
        configOverrideTab.click()
        waitFor { configOverride.displayed }
    }
}
