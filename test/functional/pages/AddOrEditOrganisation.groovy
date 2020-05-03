package pages

import geb.Module

class AddOrEditOrganisation extends Module {
    static content = {
        name { $('#name') }
        acronym{$('#acronym')}
        abn{$('#abn')}
        description { $('#description') }
        url { $('#url') }
        socialMediaDropdown { $('#addSocialMedia') }
        attachProgramLogoButton { $('[data-role=logo]') }
        attachFeatureGraphicFileInput { $('[data-role=mainImage]') }

        saveButton { $('#save') }
        cancelButton { $('#cancel') }
    }

    def save() {
        saveButton.click()
    }

    def cancel() {
        cancelButton.click()
    }
}
