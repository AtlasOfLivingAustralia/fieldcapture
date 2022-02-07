package pages.modules

import geb.Module

class HubPermissionsTableRow extends Module {
    static content = {
        userIdCell {$(".hubUserId")}
        role { $ (".hub-form")}
        emailAddress(required: false) { $(".emailAddress")}
        removeButton {$("#removeIcon")}


    }
    String getUserId() {
        userIdCell.text()
    }

    String getRoleText() {
        role.text()
    }

    void updateRole(String newRole) {
        role.value(newRole)
    }

    void remove() {
        removeButton.click()
    }

    String getSortRoleSelection() {
        String selectedValue = role.value()
        return role.find('option', value: selectedValue)?.text()
    }

}
