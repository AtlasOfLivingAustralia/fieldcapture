package pages.modules

import geb.Module
import geb.module.FormElement
import org.openqa.selenium.StaleElementReferenceException

class ProjectReports extends Module {

    static content = {
        reports {
            try {
                $('#reporting-content tbody tr').moduleList(ReportSummaryLine)
            }
            catch (StaleElementReferenceException e) {
                return []
            }
        }
        reportsByCategory { $('#reporting-content .report-category').moduleList(ReportCategory)}

        reportDeclaration { $('#declaration') }
        acceptTermsCheckBox { $('#declaration [name="acceptTerms"]') }
        projectStartDate(required:false) { $('#projectStartDate') }
        generateButton(required:false){ $('[data-bind*="generateProjectReports"]') }
    }

    def acceptTerms() {
        waitFor { acceptTermsCheckBox.displayed }
        acceptTermsCheckBox.value(true)
    }
    def submitDeclaration() {
        waitFor 10, { canSubmitDeclaration() }
        $('#declaration [data-bind*="submitReport"]').click()
    }
    def canSubmitDeclaration() {
        Thread.sleep(5000)
        $('#declaration [data-bind*="submitReport"]').module(FormElement).enabled
    }

    List<String> getReportCategories() {
        reportsByCategory.collect{it.category}
    }

    List<ReportSummaryLine> getReportsForCategory(String category) {
        getReportCategorySection(category)?.reports
    }
    ReportCategory getReportCategorySection(String category) {
        reportsByCategory.find{it.category == category }
    }


}
