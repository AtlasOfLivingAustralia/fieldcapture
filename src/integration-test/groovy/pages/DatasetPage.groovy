package pages

import geb.Module
import geb.Page
import org.openqa.selenium.ElementNotInteractableException
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
        cancelButton.click()
    }

    void save() {
        try {
            saveButton.click()
        }
        // The edit routine can happen too quickly and the calendars
        // and validation errors are still closing when we try
        // and save, preventing the click from landing.
        // Wait and try again
        catch (ElementNotInteractableException e) {
            Thread.sleep(1000)
            saveButton.click()
        }
    }

    void markCompleted() {
        datasetContent.markCompleted.click()
    }

}
