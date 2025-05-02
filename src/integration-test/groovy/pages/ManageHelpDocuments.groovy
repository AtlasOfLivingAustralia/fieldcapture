package pages


import pages.modules.DocumentDialog

class HelpDocument extends geb.Module {
    static content = {
        title { $('td', 1) }
        category { $('td', 2) }
        lastUpdated { $('td', 3) }
    }

    String title() {
        title.text()
    }

}
class ManageHelpDocuments extends ReloadablePage {
    static url = 'admin/manageHelpDocuments'

    static at = { title == 'Manage help documents | MERIT' }

    static content = {
        attachDocumentButton {$('#doAttach')}

        attachDocumentDialog { module DocumentDialog }

        documents {$('#help-documents').moduleList HelpDocument}
    }

    void openDocumentDialog() {
        attachDocumentButton.click()
        Thread.sleep(1000) // Wait for the dialog to animate into view
        int count = 0
        while (!(attachDocumentDialog.title.displayed || attachDocumentDialog.displayed) && count < 10) {
            count++
            try {
                attachDocumentButton.click()
            }
            catch (Exception e) {
                e.printStackTrace()
            }
            Thread.sleep(1000) // Wait for the dialog to animate into view
        }

    }

}
