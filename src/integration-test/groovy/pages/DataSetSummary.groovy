package pages

import geb.Module
import pages.modules.DatasetPageModule


/** Represents the content on the Data Set Summary tab of a project page.
 * TODO this only works for a zero or one data sets - needs fixing */
class DataSetSummary extends Module {

    static content = {
        addNewDataset(required: false) {$('#project-data-sets .btn-primary')}
        statusColumn(required: false) { $('#project-data-sets .dataset-progress') }
        status(required: false) {$('[data-bind*="text: progress"]')}

    }

    void cancel() {
        $('#cancel').click()
    }

    int dataSetSummaryCount() {
        $('#project-data-sets tbody tr').size()
    }

}
