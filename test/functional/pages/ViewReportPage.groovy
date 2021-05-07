package pages

import geb.Page
import pages.modules.ReportContentModule

class ViewReportPage extends Page {

    static at = {
        waitFor{ title.startsWith("View | ") } // This is a bit too generic
    }

    static content = {
        reportContent {module ReportContentModule }
        returnButton { $('#cancel') }
        reportLockedMessage (required: false) { $(".report-locked")}
    }


    List getFormSections() {
        $('.output-block')*.@id
    }

    def exitReport() {
        returnButton.click()
    }
}
