package au.org.ala.merit

import grails.core.GrailsApplication
import groovy.util.logging.Slf4j

@Slf4j
class ResourceController {

    def webService, commonService
    GrailsApplication grailsApplication

    def viewer() {}

    def imageviewer() {}

    def videoviewer() {}

    def audioviewer() {}

    def error() {}

    // proxy this request to work around browsers (firefox) that don't follow redirects properly :(
    def pdfUrl() {

        String url = grailsApplication.config.pdfgen.baseURL+'api/pdf'+commonService.buildUrlParamsFromMap(docUrl:params.file, cacheable:false)
        Map result
        try {
            result = webService.proxyGetRequest(response, url, false, false, 10*60*1000)
        }
        catch (Exception e) {
            log.error("Error generating a PDF", e)
            result = [error:"Error generating a PDF"]
        }
        if (result.error) {
            render view:'error'
        }

    }
}
