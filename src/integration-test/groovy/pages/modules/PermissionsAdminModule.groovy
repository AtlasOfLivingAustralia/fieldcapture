package pages.modules

import geb.Module

class PermissionsAdminModule extends Module {

    static content = {
        email {$("#email")}
        searchButton {$(".searchUserDetails")}
        messageRow(required:false) { $("#messageRow")}

        permissions { $('tr.cloned.permission').moduleList(PermissionsTableRow) }
    }
}
