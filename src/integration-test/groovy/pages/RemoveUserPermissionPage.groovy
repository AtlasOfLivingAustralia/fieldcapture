package pages


import pages.modules.AdminModule

class RemoveUserPermissionPage extends ReloadablePage {
    static url = "admin/removeUserPermission"
    static at = { title.startsWith("Remove User Permission")}


    static content = {
        adminContent {module AdminModule}

    }
}
