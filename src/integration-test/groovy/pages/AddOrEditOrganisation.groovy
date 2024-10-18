package pages

import geb.Module
import geb.module.FormElement

class AddOrEditOrganisation extends Module {
    static content = {
        abnStatus { $('#abnStatus') }
        name { $('#name') }
        acronym{$('#acronym')}
        abn{$('#abnSelector')}
        description { $('#description') }
        url { $('#url') }
        socialMediaDropdown { $('#addSocialMedia') }
        attachProgramLogoButton { $('[data-role=logo]') }
        attachFeatureGraphicFileInput { $('[data-role=mainImage]') }
        prePopulateABN { $("#prepopulateFromABN") }

        saveButton { $('#save') }
        cancelButton { $('#cancel') }
    }

    boolean isNameReadOnly() {
        name.module(FormElement).readOnly
    }

    def save() {
        saveButton.click()
    }

    def cancel() {
        cancelButton.click()
    }
}
