package pages

import geb.Page
import pages.modules.ReadOnlyMeriPlan

class MeriPlanPDFPage extends Page {
    static url = 'report/meriPlanReportCallback'

    static at = { title.startsWith("MERI Plan -") }

    static content = {
        meriPlan { $('.meri-plan').module ReadOnlyMeriPlan }
    }
}
