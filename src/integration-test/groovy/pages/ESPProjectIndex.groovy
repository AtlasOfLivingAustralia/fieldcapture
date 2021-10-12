package pages

import geb.Module
import geb.Page

class ESPProjectIndex extends Page {
    static url = 'project/index' // requires a project id parameter
    static at = { waitFor { title.contains('| Project | ') } }

    static content = {

        downloadReportTab { $("#stage-report-pdf-tab") }
        downloadReportContent { module DownloadReportContent }
    }
}


class DownloadReportContent extends Module {

    static content = {
        generateHTML { $("button[data-bind*=generateProjectReportHTML]").first() }
        generatePDF { $("button[data-bind*=generateProjectReportPDF]").first() }
    }

}
