package pages


import geb.Page

class Reef2050PlanActionDownloadReport extends Page {
    static at = { title.startsWith("Reef 2050 Plan Action Reporting") }
    static url = "report/reef2050PlanActionReport"

    static content = {
        groundCoverPercentage { $("span[data-bind*=groundCoverPercent]") }
        printInstructions { $("#print-instructions") }
    }

    def closePrintInstructions() {
        $("#print-instructions .btn-secondary").click()
    }
}
