package pages

import geb.Module
import pages.modules.DatasetPageModule

class DataSetSummaryRow extends Module {
    static content = {
        title { $('td', 0) }
        progress { $('[data-bind*="text: progress"]').text() }
        statusColumn(required: false) { $('.dataset-progress') }
        editButton(required: false) { $('.fa-edit') }
        viewButton(required: false) { $('.fa-eye') }
    }

    void edit() {
        editButton.click()
    }

    void view() {
        viewButton.click()
    }
}
/** Represents the content on the Data Set Summary tab of a project page.
 * TODO this only works for a zero or one data sets - needs fixing */
class DataSetSummary extends Module {

    static content = {
        addNewDataset(required: false) {$('#project-data-sets .btn-primary')}
        summaryTable(required: false) {$('#project-data-sets')}
        tableEmptyMessage(required:false) {$('#project-data-sets td.dataTables_empty')}
        summaryRows(required: false) {$('#project-data-sets tbody tr').moduleList DataSetSummaryRow}
    }

    void cancel() {
        $('#cancel').click()
    }

    int dataSetSummaryCount() {
        tableEmptyMessage.displayed ? 0 : summaryTable.find('tbody tr').size()
    }

}
