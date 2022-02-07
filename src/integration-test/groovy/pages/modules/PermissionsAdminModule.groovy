package pages.modules

import geb.Module

class PermissionsAdminModule extends Module {

    static content = {
        email {$("#emailAddress")}
        searchButton {$("#addUserRoleBtn")}
        permissionToAdd {$("#addUserRole")}
        messageRow(required:false) { $("#messageRow")}

        permissions { $('tr.cloned.permission').moduleList(PermissionsTableRow) }
    }

    def addPermission(String emailToAdd, String permission) {
        email.value(emailToAdd)
        permissionToAdd.value(permission)
        searchButton.click()
    }

    PermissionsTableRow findPermissionForUser(String userId) {
        permissions.find{it.userId == userId}
    }
}
