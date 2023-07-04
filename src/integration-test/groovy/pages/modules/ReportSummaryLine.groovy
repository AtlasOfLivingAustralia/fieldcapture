package pages.modules

import geb.Module

class ReportSummaryLine extends Module {

    static content = {
        name { $('.report-name a span').text() }
        fromDate { $('.report-start').text() }
        toDate { $('.report-end').text() }
        editLink { $('td.report-actions [data-bind*=editUrl]')}
        viewLink { $('td.report-actions [data-bind*=viewUrl]')}
        submitButton(required:false) { $('button[data-bind*="submitReport"]') }
        approveButton(required:false) { $('button[data-bind*=approveReport]') }
        returnButton(required:false) { $('button[data-bind*=rejectReport]') }
        cancelReport(required:false) { $('button[data-bind*=cancelReport]') }
    }

    def edit() {
        editLink.click()
    }

    def view() {
        viewLink.click()
    }

    def markedAsComplete() {
        $('.badge[data-bind*="finished"]').displayed
    }

    def canBeSubmitted() {
        submitButton.displayed
    }

    def notRequired() {
        cancelReport.displayed
    }

    def hasWithdrawApprovalButton() {
        returnButton.displayed
    }

    def isSubmitted() {
        $('[data-bind*="approvalTemplate"]').displayed
    }

    def isApproved() {
        def approvedBadge = $('.report-status .badge-success')
        approvedBadge.size() && approvedBadge.displayed && approvedBadge.text() == 'Report approved'

    }

    def submit() {
        submitButton.click()
    }

    def approve() {
        approveButton.click()
    }

    def returnReport() {
        returnButton.click()
    }

    def cancelReport() {
        cancelReport.click()
    }
}
