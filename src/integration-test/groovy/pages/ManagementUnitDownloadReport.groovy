package pages


import geb.Page

class ManagementUnitDownloadReport extends Page {
    static at = { title.startsWith("Core services report 1") }
    static url = "managementUnit/printableReport"

    static content = {
        groundCoverPercentage { $("span[data-bind*=groundCoverPercent]") }
        printInstructions { $("#print-instructions") }
    }

    def closePrintInstructions() {
        $("#print-instructions .btn-secondary").click()
    }
}
