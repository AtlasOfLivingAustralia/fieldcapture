package pages

import geb.Module
import geb.Page

/**
 * Represents a project index page.
 */
class ProjectIndex extends ReloadablePage {
    static url = 'project/index' // requires a project id parameter
    static at = { title.endsWith('| Project | Field Capture')}

    static content = {

        overviewTab {$('#overview-tab')}
        documentsTab {$('#documents-tab')}
        meriPlanTab(required:false) {$('#details-tab')}
        activitiesTab {$('#plan-tab')}
        sitesTab {$('#site-tab')}
        dashboardTab {$('#dashboard-tab')}
        adminTab {$('#admin-tab')}

        projectName { $('h1') }
        overview { module OverviewTab }
        plansAndReports(wait:true) { module PlansAndReportsTab }
        sites { module SitesTab }
        dashboard { module DashboardTab }
        admin { module AdminTab }

        iAmSure(wait: true) { $('.modal a', text:'OK') }


        adminTab {$('#admin-tab')}
        admin {module AdminTab}

        editDocumentForm {module AttachDocumentForm}

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

    static base = { $('#plan') }
    static content = {
        activities {

            def tableRows = $('#tablePlan tbody tr')
            def activities = []
            if (tableRows.size() > 0) {
                activities = tableRows.collect {
                    module ActivityRow, it
                }
            }
            activities
        }
        risksAndThreats(required:false) { $('#risk-validation')}
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

}

class SitesTab extends Module {

}

class DashboardTab extends Module {

}
class AdminTab extends Module {
    static content = {
        fist_attached_document {$('div.attached_document', 0 )}
        attached_documents {$('div.attached_document')}
        editDocumentTab {$('a#edit-documents-tab')}
        attachDocumentBtn {$('button.project-document-action#doAttach')}
        editDocumentBtns {$('.document-edit-buttons')}
        deleteDocumentBtns {$('button.deleteDocument')}
    }
}


class AttachDocumentForm extends Module {
    static at = {$('div#attachDocument')}
    static content = {
        reportOptions {$('select#associatedReport option')}
        firstReportOption {$('select#associatedReport option',1)}

        reportSelect {$('select#associatedReport', 0)}
        documentNameInput {$('input#documentName', 0)}
        uploadingFile {$('input#documentFile', 0)}
        saveBtn {$('button.btn[name=uploadingDocument]')}

    }
}