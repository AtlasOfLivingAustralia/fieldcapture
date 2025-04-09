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
        stage { $('select#associatedReport') }
        report { $('select#associatedReport') }
        saveButton { $('#attachDocument [data-bind*=save]') }
        cancelButton { $('#attachDocument [data-bind*=cancel]') }

        reportOptions {$('select#associatedReport option')}
        firstReportOption {$('select#associatedReport option',1)}

        labels(required:false) {$('.labels input[type="search"]')}

    }

    def attachFile(String filename) {
        File toAttach = new File(getClass().getResource(filename).toURI())
        file = toAttach
        Thread.sleep(1000) // Wait for preview, save button to be enabled.
    }

    def save() {
        waitFor{saveEnabled()} // Often this is called immediately after modifying the data in the dialog
        saveButton.click()
    }

    def saveEnabled() {
        !saveButton.@disabled
    }

    def availableStages() {
        stage.find('option')
    }


    def uploadComplete() {
        $('#successMessage').displayed
    }

    def cancel() {
        cancelButton.click()
        Thread.sleep(500) // Wait for the modal to animate closed.
    }

    def addLabel(String label) {
        $('.labels .select2-selection').click()// Wait for the input to be displayed
        waitFor {labels.displayed}
        labels << label << "\n"
        Thread.sleep(1000) // Wait for the label to be added
    }
}
