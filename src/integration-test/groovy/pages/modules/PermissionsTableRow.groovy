package pages.modules

import geb.Module

class PermissionsTableRow extends Module {
    static content = {
        userIdCell(required:false) {$(".memUserId")}
        userName{ $(".memUserName")}
        role { $ (".memUserRole")}
        emailAddress(required: false) { $(".emailAddress")}
        removeButton {$(".memRemoveRole")}
        editButton { $('.memEditRole') }

        editRole(required:false) { $('select[name=role]')}
    }
    String getUserId() {
        userIdCell.text()
    }
    String getDisplayName() {
        userName.text()
    }

    String getRoleText() {
        role.text()
    }

    void updateRole(String newRole) {
        editButton.click()
        waitFor{ editRole.displayed }
        editRole.value(newRole)
    }

    void remove() {
        removeButton.click()
    }

}
