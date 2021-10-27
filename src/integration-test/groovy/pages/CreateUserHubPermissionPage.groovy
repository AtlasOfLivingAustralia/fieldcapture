package pages

import geb.Page
import pages.modules.AdminModule

class CreateUserHubPermissionPage extends Page {
    static url = "admin/createUserHubPermission"
    static at = { title.startsWith("User Permission for MERIT")}


    static content = {
        adminContent {module AdminModule}

    }
}
