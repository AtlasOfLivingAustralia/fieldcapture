package pages

import geb.Page

class AdminTools extends ReloadablePage {

    static url = "admin/tools"

    static at = { waitFor { title.startsWith("Tools | Admin")}}

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
        waitFor { hasBeenReloaded() }
    }

    void clearCache() {
        waitFor { $("#btnClearMetadataCache").displayed }
        $("#btnClearMetadataCache").click()
        waitFor { hasBeenReloaded() }
    }

}
