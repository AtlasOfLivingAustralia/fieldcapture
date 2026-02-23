package pages

import geb.Module
import pages.modules.DatasetPageModule

class DataSetRow extends Module {
    static content = {
        actions { $('td', 0) }
        title { $('td', 1).text() }
        service { $('td', 2).text() }
        outcomes { $('td', 3).text() }
        baselineIndiator { $('td', 4).text() }
        status { $('[data-bind*="text: progress"]').text() }
        viewLink { actions.find('.fa-eye') }
        editLink { actions.find('.fa-edit') }
        copyLink { actions.find('.fa-copy') }
        deleteLink { actions.find('.fa-delete') }
    }

    void edit() {
        editLink.click()
    }

    void copy() {
        copyLink.click()
    }

    void view() {
        viewLink.click()
    }
}
/** Represents the content on the Data Set Summary tab of a project page.
 * TODO this only works for a zero or one data sets - needs fixing */
class DataSetSummary extends Module {

    static content = {
        addNewDataset(required: false) {$('#project-data-sets .btn-primary')}
        statusColumn(required: false) { $('#project-data-sets .dataset-progress') }
        status(required: false) {$('[data-bind*="text: progress"]')}
        summaryTable(required: false) {$('#project-data-sets')}
        dataSetRows(required:false) {summaryTable.find('tbody tr').moduleList(DataSetRow)}
        tableEmptyMessage(required:false) {$('#project-data-sets td.dataTables_empty')}
    }

    void cancel() {
        $('#cancel').click()
    }

    int dataSetSummaryCount() {
        tableEmptyMessage.displayed ? 0 : dataSetRows.size()
    }

}
