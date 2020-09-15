package pages

import geb.Page
import pages.modules.AdminModule

class AdminPage extends Page {
    static url = "admin/removeUserPermission"
    static at = { title.startsWith("Remove User Permission From Project | MERIT")}


    static content = {
        adminContent {module AdminModule}

    }
}
