package pages


import geb.Page

class OrganisationDownloadReport extends Page {
    static at = { title.startsWith("Regional capacity report 1") }
    static url = "organisation/printableReport"

    static content = {
        groundCoverPercentage { $("span[data-bind*=groundCoverPercent]") }
        printInstructions { $("#print-instructions") }
    }

    def closePrintInstructions() {
        $("#print-instructions .btn-secondary").click()
    }
}
