package pages


import pages.modules.RemoveUserPermissionsModule

class RemoveUserPermissionPage extends ReloadablePage {
    static url = "admin/removeUserPermission"
    static at = { title.startsWith("Remove User Permission")}


    static content = {
        adminContent {module RemoveUserPermissionsModule}

    }
}
