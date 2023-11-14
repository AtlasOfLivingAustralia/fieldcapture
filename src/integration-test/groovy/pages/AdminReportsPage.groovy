package pages

import geb.Page

class AdminReportsPage extends Page {

    static url = "admin/adminReports"

    static at = { waitFor { title.startsWith("Admin Reports")}}

    static content = {
        period {$('select#reportPeriodOfManagementUnit',0)}
        downloadReportBtn(required:false) {$('a#muReportDownload')}
        downloadReportSummaryBtn(required:false) {$('a#muReportDownloadSummary')}
        orgDownloadReportBtn(required:false) {$('a#muReportDownload')}
        orgDownloadReportSummaryBtn(required:false) {$('a#muReportDownloadSummary')}
        showDownloadDetailsIcon(required:false) { $('i.showDownloadDetailsIcon')}
        muReportDownloadLink(required:false) {$('a#entityReportDownloadLink')}
        startDate{$("#muFromDate")}
        endDate{$("#muToDate")}
        orgStartDate{$("#orgFromDate")}
        orgEndDate{$("#orgToDate")}
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

    def downloadOrgReport(String fromDate, String toDate) {
        orgStartDate = fromDate
        orgEndDate = toDate
        orgDownloadReportBtn.click()
    }

    def downloadOrgReportSummary(String fromDate, String toDate) {
        orgStartDate = fromDate
        orgEndDate = toDate
        orgDownloadReportSummaryBtn.click()
    }

    def generateReef2050Pdf() {
        reportFormats = "pdf"
        viewReportBtn.click()
    }

}
