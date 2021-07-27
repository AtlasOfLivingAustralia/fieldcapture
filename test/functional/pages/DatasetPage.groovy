package pages

import geb.Module
import geb.Page
import pages.modules.DatasetPageModule

class DatasetPage extends Page {

    static at = {
        title.contains("Data Set Summary")
    }

    static content = {
        datasetContent(required: false) {module DatasetPageModule}
    }

    void cancel() {
        $('#cancel').click()
    }

}
