package pages

import geb.Page
import pages.modules.ReadOnlyMeriPlan

class MeriPlanChangesPage extends Page {
    static url = 'project/viewMeriPlanChanges'

    static at = { title.startsWith("MERI Plan -") }

    static content = {
        printInstructions(required:false) { $("#print-instructions") }
        meriPlan { $('.meri-plan').module ReadOnlyMeriPlan }
    }

    def closePrintInstructions() {
        waitFor {
            printInstructions.displayed
        }

        $("#print-instructions .btn-secondary").click()
    }
}
