package pages.modules

import geb.Module

class DocumentDialog extends Module {
    static content = {
        title { $('#documentName') }
        attribution { $('#documentAttribution') }
        type { $('#documentRole') }
        license { $('#documentLicense') }
        publiclyViewable { $('#public') }
        privacyDeclaration { $('#thirdPartyConsentCheckbox') }
        file { $('#documentFile') }
        mainProjectImage { $('#mainImage') }
        saveButton { $('#attachDocument [data-bind*=save]') }
        cancelButton { $('#attachDocument [data-bind*=cancel]') }

    }

    def attachFile(String filename) {
        File toAttach = new File(getClass().getResource(filename).toURI())
        file = toAttach
    }

    def save() {
        saveButton.click()
    }

    def saveEnabled() {
        !saveButton.@disabled
    }


    def uploadComplete() {
        $('#successMessage').displayed
    }
}
