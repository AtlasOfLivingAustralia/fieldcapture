package pages

import geb.Module
import geb.Page

class AdminPage extends Page {
    static url = "admin/index"
    static at = { title.startsWith("Admin | MERIT") }

    static content = {
        staticTab { module AdminTabContent}
    }
}

class AdminTabContent extends Module {

    static content = {
        adminTab { $("#admin li") }
    }

}
