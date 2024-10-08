package pages.modules

import geb.Module
import geb.module.FormElement
import org.openqa.selenium.StaleElementReferenceException

class ProjectReports extends Module {

    static content = {
        contentSection { $('#reporting-content') }
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
        projectStartDate(required:false) {$('#startDate')}
        projectEndDate(required:false) {$('#endDate')}
        generateButton(required:false, wait: 4){ $('#generateReports') }

        reasonModal { $('#reason-modal') }
        notRequiredReason { $('#reason-modal [id="reason"]') }
        overDeliveryModal(required: false) { $('div.bootbox')}
    }

    def cancellationReason() {
        waitFor { notRequiredReason.displayed }
        notRequiredReason.value('test reason')
    }

    def confirmCancellation() {
        waitFor 10, { canSubmitDeclaration() }
        $('#reason-modal [data-bind*="submit"]').click()
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
