package pages

import geb.Module
import geb.Page

class DownloadReportPDF extends Page {
    static url = "report/projectReportCallback"
    static at = {title != null}

    static content = {
        groundCoverPercentage { $("span[data-bind*=groundCoverPercent]")}
    }
}
