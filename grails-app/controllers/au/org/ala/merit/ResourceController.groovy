package au.org.ala.merit

import au.org.ala.ecodata.forms.EcpWebService
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import org.apache.http.HttpStatus

@Slf4j
class ResourceController {

    EcpWebService webService
    CommonService commonService
    GrailsApplication grailsApplication

    def viewer() {}

    def imageviewer() {}

    def videoviewer() {}

    def audioviewer() {}

    def error() {}

    // proxy this request to work around browsers (firefox) that don't follow redirects properly :(
    def pdfUrl() {

        // Note that this will only work for public documents as the callback will fail otherwise.
        String docUrl = params.file
        try {
            URI uri = new URI(docUrl)
            if (!uri.isAbsolute()) {
                docUrl = grailsApplication.config.getProperty('grails.serverURL')+uri.getPath()
            }
            else if (!webService.isValidDomain(uri.getHost())) {
                render status: HttpStatus.SC_BAD_REQUEST, view:'/error'
                return
            }
        }
        catch (URISyntaxException e) {
            log.warn("Invalid document URL for PDF generation: ${docUrl}")
            render status: HttpStatus.SC_BAD_REQUEST, view:'/error'
            return
        }

        String url = grailsApplication.config.getProperty('pdfgen.baseURL')+'api/pdf'+commonService.buildUrlParamsFromMap(docUrl:docUrl, cacheable:false)
        Map result
        try {
            result = webService.proxyGetRequest(response, url, false, false, 10*60*1000)
        }
        catch (Exception e) {
            log.error("Error generating a PDF", e)
            result = [error:"Error generating a PDF"]
        }
        if (result.error) {
            render status: HttpStatus.SC_INTERNAL_SERVER_ERROR, view:'/error'
        }

    }
}
