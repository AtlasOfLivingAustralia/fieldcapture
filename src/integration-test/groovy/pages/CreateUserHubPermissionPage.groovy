package pages

import geb.Page
import pages.modules.PermissionsAdminModule

class CreateUserHubPermissionPage extends Page {
    static url = "admin/createUserHubPermission"
    static at = { title.startsWith("User Permissions for MERIT")}


    static content = {
        adminContent {module PermissionsAdminModule}

    }
}
