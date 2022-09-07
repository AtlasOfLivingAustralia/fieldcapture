package pages

import geb.Page
import pages.modules.ReportContentModule

/**
 * This page represents a page where a user can view data for an
 * activity or a report.
 * At the moment it is used to represent both activity/index.gsp and activity/activityReportView.gsp
 */
class ViewReportPage extends Page {

    static at = {
        waitFor{ title.startsWith("View | ") } // This is a bit too generic
    }

    static content = {
        reportContent {module ReportContentModule }
        returnButton { $('#cancel') }
        reportLockedMessage (required: false) { $(".report-locked")}
        overDeliveryModal(required: false) { $('div.bootbox')}
    }


    List getFormSections() {
        $('.output-block')*.@id
    }

    def exitReport() {
        returnButton.click()
    }
}
