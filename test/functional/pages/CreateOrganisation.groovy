package pages

import geb.Page

/**
 * Represents the create organisation page.
 */
class CreateOrganisation extends Page {
    static url = "organisation/create"

    static at = { title == "Create | Organisation | Field Capture"}

    static content = {
        name { $('#name') }
        type { $('#orgType') }
        description { $('#description') }
        //websiteUrl { $('') } to we re-worked with the link attachment feature.
        // Images not yet implemented.

        saveButton { $('#save') }
        cancelButton { $('#cancel') }
    }

    def create() {
        save()
    }
    def save() {
        saveButton.click()
    }

    def cancel() {
        cancelButton.click()
    }
}
