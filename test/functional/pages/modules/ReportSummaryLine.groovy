package pages.modules

import geb.Module

class ReportSummaryLine extends Module {

    static content = {
        name { $('.report-name span').text() }
        editLink { $('td.report-actions [data-bind*=editUrl]')}
        submitButton { $('button[data-bind*="submitReport"]') }
    }

    def edit() {
        editLink.click()
    }

    def markedAsComplete() {
        $('.badge[data-bind*="finished"]').displayed
    }

    def canBeSubmitted() {
        submitButton.displayed
    }

    def isSubmitted() {
        $('[data-bind*="approvalTemplate"]').displayed
    }

    def submit() {
        submitButton.click()
    }
}
