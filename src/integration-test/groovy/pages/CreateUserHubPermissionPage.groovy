package pages

import geb.Page
import org.openqa.selenium.Keys
import pages.modules.HubPermissionsTableRow

class CreateUserHubPermissionPage extends Page {
    static url = "admin/createUserHubPermission"
    static at = { title.startsWith("User Permissions for MERIT")}


    static content = {
        submitButton{$("#addUserRoleBtn")}
        emailAddress {$("#emailAddress")}
        permission {$("#addUserRole")}
        expiryDate { $("#expiryDate")}
        hubEmail { $("#email")}
        permissions { $("tr.odd, tr.even").moduleList(HubPermissionsTableRow) }


    }

    def addHubPermission(String email, String perm, String exDate) {
        emailAddress.value(email)
        permission.value(perm)
        expiryDate.value(exDate)
        submitButton.click()
    }

    HubPermissionsTableRow findPermissionForUser(String userId) {
        permissions.find{it.userId == userId}
    }

    def searchHubUser(String email) {
        hubEmail.value(email)
        hubEmail << Keys.chord(Keys.ENTER)
    }
}
