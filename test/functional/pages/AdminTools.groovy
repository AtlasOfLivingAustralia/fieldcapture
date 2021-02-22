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
    }

    void reindex() {
        reindexButton().click()
    }

    void clearCache() {
        waitFor { $("#btnClearMetadataCache").displayed }
        $("#btnClearMetadataCache").click()
    }

}
