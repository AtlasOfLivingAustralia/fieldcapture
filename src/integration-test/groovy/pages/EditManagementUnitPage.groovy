package pages

import geb.Page
import pages.modules.AddOrEditManagementUnit

class EditManagementUnitPage  extends Page{
    static url = "/managementUnit/edit"
    static at = {title.startsWith("Edit")}
    static content = {
        details {module AddOrEditManagementUnit}
    }
}
