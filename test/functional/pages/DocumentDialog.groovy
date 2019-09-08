package pages

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
        mainProjectImage { $('#documentRole') }
        saveButton { $('[data-bind*=save]') }
        cancelButton { $('[data-bind*=cancel]') }

    }
}
