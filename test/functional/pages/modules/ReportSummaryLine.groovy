package pages.modules

import geb.Module

class ReportSummaryLine extends Module {

    static content = {
        name { $('.report-name span').text() }
        editLink { $('td.report-actions [data-bind*=editUrl]')}
    }

    def edit() {
        editLink.click()
    }
}
