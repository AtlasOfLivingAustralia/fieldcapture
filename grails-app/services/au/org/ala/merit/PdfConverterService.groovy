package au.org.ala.merit

import com.openhtmltopdf.DOMBuilder
import com.openhtmltopdf.log4j.Log4JXRLogger
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import com.openhtmltopdf.util.XRLog
import org.jsoup.Jsoup

import javax.annotation.PostConstruct


class PdfConverterService {
    def grailsApplication

    @PostConstruct
    void init() {
        // PDF converter initialisation
        System.setProperty('pdfbox.fontcache', grailsApplication.config.pdfbox.fontcache)
        XRLog.setLoggingEnabled(true);
        XRLog.setLoggerImpl(new Log4JXRLogger());
    }

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
