package pages

import geb.Page

class AdminTools extends ReloadablePage {

    static url = "admin/tools"

    // The sleep at the end is to allow the javascript to initialise the button event handlers after the page loads
    static at = {
        def result = waitFor { title.startsWith("Tools | Admin") }
        if (result) {
            Thread.sleep(300) // If we are on the page, wait for the javascript to run.
        }
        result
    }

    static content = {
        reindexButton { $('#btnReindexAll') }
        clearMetaDataCacheButton { $("#btnClearMetadataCache") }
    }

    void clearMetadata(){
        waitFor {clearMetaDataCacheButton.displayed}
        clearMetaDataCacheButton.click()
        waitFor { hasBeenReloaded() }
    }

    void reindex() {
        reindexButton().click()
        waitFor 60, { hasBeenReloaded() }
    }

    void clearCache() {
        clearMetadata()
    }

}
