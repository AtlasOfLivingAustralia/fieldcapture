package pages.modules

import geb.Module

class PermissionsTableRow extends Module {
    static content = {
        userIdCell {$(".memUserId")}
        userName{ $(".memUserName")}
        role { $ (".memUserRole")}
        emailAddress(required: false) { $(".emailAddress")}
        removeButton {$(".memRemoveRole")}
        editButton { $('.memEditRole') }
    }
    String getUserId() {
        userIdCell.text()
    }

}
