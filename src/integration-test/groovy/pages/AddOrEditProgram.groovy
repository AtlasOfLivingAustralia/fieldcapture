package pages

import geb.Module

class AddOrEditProgram extends Module {

    static content = {
        parentProgram{ $('#parentProgramId') }
        newParentProgramId { $('.select2-selection')}
        name { $('#name') }
        description { $('#description') }
        url { $('#url') }
        socialMediaDropdown { $('#addSocialMedia') }
        attachProgramLogoButton { $('[data-role=logo]') }
        attachFeatureGraphicFileInput { $('[data-role=mainImage]') }

        saveButton { $('#save') }
        cancelButton { $('#cancel') }
    }

    def save() {
        interact {
            moveToElement(saveButton)
        }
        saveButton.click()
    }

    def cancel() {
        interact {
            moveToElement(saveButton)
        }
        cancelButton.click()
    }
}
