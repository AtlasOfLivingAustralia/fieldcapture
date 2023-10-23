package pages


import geb.Page

class ProjectDownloadReport extends Page {
    static at = { title.startsWith("Year 2018/2019 - Quarter 1 Outputs Report") }
    static url = "project/printableReport"

    static content = {
        groundCoverPercentage { $("span[data-bind*=groundCoverPercent]") }
        printInstructions { $("#print-instructions") }
    }

    def closePrintInstructions() {
        $("#print-instructions .btn-secondary").click()
    }
}
