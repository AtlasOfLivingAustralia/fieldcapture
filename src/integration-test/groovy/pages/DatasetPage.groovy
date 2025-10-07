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
        saveButton { $('#save') }
        cancelButton { $('#cancel') }
    }

    void cancel() {
        interact {
            moveToElement(cancelButton)
        }
        cancelButton.click()
    }

    void save() {
        interact {
            moveToElement(saveButton)
        }
        saveButton.click()
    }

    void markCompleted() {
        interact {
            moveToElement(datasetContent.markCompleted)
        }
        datasetContent.markCompleted.click()
    }

}
