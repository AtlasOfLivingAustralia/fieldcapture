package au.org.ala.merit

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import org.jsoup.Jsoup
import org.jsoup.helper.W3CDom

import javax.annotation.PostConstruct


class PdfConverterService {
    def grailsApplication

    @PostConstruct
    void init() {
        // PDF converter initialisation
        System.setProperty('pdfbox.fontcache', grailsApplication.config.getProperty('pdfbox.fontcache'))
    }

    def convertToPDF(String page, OutputStream out) {
        PdfRendererBuilder builder = new PdfRendererBuilder()
        org.w3c.dom.Document document = html5ParseDocument(page)
        builder.withW3cDocument(document, grailsApplication.config.getProperty('grails.serverURL')).toStream(out).run()
    }

    private org.w3c.dom.Document html5ParseDocument(String page) throws IOException {

        org.jsoup.nodes.Document doc = Jsoup.parse(page, "UTF-8")
        return new W3CDom().fromJsoup(doc)
    }
}
