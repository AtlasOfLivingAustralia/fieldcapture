package au.org.ala.merit

import grails.core.GrailsApplication

import javax.servlet.http.HttpServletResponse

/**
 * Responsible for the interface to the Monitor system
 */
class MonitorService {

    static final String MONITOR_PLANT_LABEL_PATH = "/generate-barcode"
    /** Code for the MERIT program in Monitor */
    static final String MERIT_PROGRAM_CODE = "M"

    WebService webService
    GrailsApplication grailsApplication
    CommonService commonService


    /**
     * Sends a request to the Monitor core API to request plant labels for a project and proxies the response
     * (as it is a PDF file)
     * @param response the HTTP response to write the PDF to
     * @param numberOfPages The number of pages of labels the user has requested
     */
    def requestVoucherBarcodeLabels(String projectId, int numberOfPages, HttpServletResponse response) {

        String url = grailsApplication.config.getProperty("monitor.core.baseUrl") + MONITOR_PLANT_LABEL_PATH

        Map params = [
                project_code: projectId,
                num_pages: numberOfPages,
                program: MERIT_PROGRAM_CODE
        ]

        url += commonService.buildUrlParamsFromMap(params)
        println url
        webService.proxyGetRequest(response, url, WebService.AUTHORIZATION_HEADER_TYPE_USER_BEARER_TOKEN)
    }
}
