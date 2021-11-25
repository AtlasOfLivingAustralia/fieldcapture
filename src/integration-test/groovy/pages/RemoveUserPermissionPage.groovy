package pages

import geb.Page
import pages.modules.AdminModule

class RemoveUserPermissionPage extends Page {
    static url = "admin/removeUserPermission"
    static at = { title.startsWith("Remove User Permission")}


    static content = {
        adminContent {module AdminModule}

    }
}
