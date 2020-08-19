package pages

import geb.Page

class AdminTools extends Page {

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

}
