package pages

import geb.Module
import pages.modules.DatasetPageModule

class DatasetPage extends Module{
    static content = {
        addNewDataset(required: false) {$('#project-data-sets .btn-primary')}
        statusColumn(required: false) { $('#project-data-sets .dataset-progress') }
        status(required: false) {$('[data-bind*="text: progress"]')}
        datasetContent(required: false) {module DatasetPageModule}
    }

    void cancel() {
        $('#cancel').click()
    }

}
