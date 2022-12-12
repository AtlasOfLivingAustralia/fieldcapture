package pages

import geb.Module
import geb.Page

class DownloadReport extends Page {
    static url = "report/projectReportCallback"
    static at = { title.startsWith("Project Summary | Project") }

    static content = {
        groundCoverPercentage { $("span[data-bind*=groundCoverPercent]") }
        printInstructions { $("#print-instructions") }
    }

    def closePrintInstructions() {
        $("#print-instructions .btn-secondary").click()
    }
}
