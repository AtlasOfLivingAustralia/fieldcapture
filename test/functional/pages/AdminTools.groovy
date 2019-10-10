package pages

import geb.Page

class AdminTools extends Page {

    static url = "admin/tools"

    static at = { waitFor { title.startsWith("Tools | Admin")}}

    static content = {
        reindexButton { $('#btnReindexAll') }
    }

    void reindex() {
        reindexButton().click()
    }
}
