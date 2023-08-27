package pages

import geb.Page

class AdminReportsPage extends Page {

    static url = "admin/adminReports"

    static at = { waitFor { title.startsWith("Admin Reports")}}

    static content = {
        period {$('select#reportPeriodOfManagementUnit',0)}
        downloadReportBtn(required:false) {$('a#muReportDownload')}
        downloadReportSummaryBtn(required:false) {$('a#muReportDownloadSummary')}
        showDownloadDetailsIcon(required:false) { $('i.showDownloadDetailsIcon')}
        muReportDownloadLink(required:false) {$('a#muReportDownloadLink')}
        startDate{$("#fromDate")}
        endDate{$("#toDate")}
        reportFormats { $('#reportFormats')}
        viewReportBtn(required:false) {$('#viewReportBtn')}

    }

    def selectedPeriod(){
        period.value()
    }

    def downloadMuReport(String fromDate, String toDate) {
        startDate = fromDate
        endDate = toDate
        downloadReportBtn.click()
    }

    def downloadMuReportSummary(String fromDate, String toDate) {
        startDate = fromDate
        endDate = toDate
        downloadReportSummaryBtn.click()
    }

    def generateReef2050Pdf() {
        reportFormats = "pdf"
        viewReportBtn.click()
    }

}
