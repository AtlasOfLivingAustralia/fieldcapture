package pages.modules

import geb.Module

class AddOrEditManagementUnit extends Module{

    static content = {
        name { $('#name') }
        description { $('#description') }
        url { $('#url') }
        socialMediaDropdown { $('#addSocialMedia') }
        attachProgramLogoButton { $('[data-role=logo]') }
        attachFeatureGraphicFileInput { $('[data-role=mainImage]') }

        saveButton { $('#save') }
        cancelButton { $('#cancel') }
    }
    def save(){
        saveButton.click()
    }
}
