package pages

import geb.Module
import geb.Page
import geb.module.FormElement

class SiteUpload extends Page {
    static url = '/site/siteUpload'
    static at = { title.startsWith("Upload | Sites") }
    static content = {
        file { $('#shapefile') }
        uploadButton { $('#uploadShapeFile') }

        sites(required:false) { $('#sites-container tbody tr').moduleList(SiteToUpload) }
        uploadProgress(required:false) { $('#uploadProgress').module(SiteUploadProgressDialog) }
    }

    /** Attaches a file from the classpath and presses the Upload Shapefile button */
    void uploadShapefile(String filename) {
        File toAttach = new File(getClass().getResource(filename).toURI())
        file = toAttach

        waitFor { uploadButton.module(FormElement).enabled }
        uploadButton.click()
    }

    def createSites() {
        $('[data-bind*=save').click()
        waitFor { uploadProgress.displayed }
    }
}

class SiteToUpload extends Module {
    static content = {
        siteName {$('input[data-bind*="site.name"]')}
        description({$('[data-bind*=description]') })
        id { $('[data-bind*=externalId]') }
    }
}

class SiteUploadProgressDialog extends Module {
    static content = {
        ok { $('.btn[data-bind*="click:finish"]') }
        cancel { $('.btn[data-bind*=cancelUpload]')}
    }
}