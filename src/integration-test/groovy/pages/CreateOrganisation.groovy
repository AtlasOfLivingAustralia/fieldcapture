package pages

import geb.Page

/**
 * Represents the create organisation page.
 */
class CreateOrganisation extends Page {
    static url = "organisation/create"

    static at = { title == "Create | Organisation | Field Capture" }

    static content = {
        details { module AddOrEditOrganisation }
    }
}
