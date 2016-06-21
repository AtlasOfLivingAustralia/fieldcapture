package au.org.ala.merit

import com.openhtmltopdf.DOMBuilder
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import org.jsoup.Jsoup

class PdfConverterService {
    def grailsApplication

    def convertToPDF(String page, OutputStream out) {
        PdfRendererBuilder builder = new PdfRendererBuilder();
        org.w3c.dom.Document document = html5ParseDocument(page)
        builder.withW3cDocument(document, grailsApplication.config.grails.serverURL).toStream(out).run()
    }

    private org.w3c.dom.Document html5ParseDocument(String page) throws IOException {

        org.jsoup.nodes.Document doc = Jsoup.parse(page, "UTF-8");
        return DOMBuilder.jsoup2DOM(doc);
    }
}
