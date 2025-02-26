package au.org.ala.merit

import grails.core.GrailsApplication

import javax.servlet.http.HttpServletResponse

class DownloadController {

    private List DOWNLOAD_EXTENSIONS = ['xls', 'xlsx', 'zip', 'json', 'xml', 'pdf', 'csv']

    GrailsApplication grailsApplication
    WebService webService
    UserService userService

    /**
     * Deliberately not add .format in urlMapping to support file.extension on purpose
     * @param id - including extension
     * @return
     */
    def get(String id) {
        if (!userService.userIsSiteAdmin() && !userService.userHasReadOnlyAccess()) {
            redirect(controller:'home')
            return
        }
        if (!id) {
            response.setStatus(400)
            render "A download ID is required"
        } else {
            String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}" +'download/'+id

            String extension = params.fileExtension ?: params.format
            if (fileExtensionValid(extension)) {
                url += "."+extension
            }
            def resp = webService.proxyGetRequest(response, url, true, true, 120000)
            if (resp.status != 200) {
                render view:'/error', model:[error:resp.error]
            }
            else {
                return null
            }
        }
    }

    private boolean fileExtensionValid(String fileExtension) {
        fileExtension in DOWNLOAD_EXTENSIONS
    }
}
