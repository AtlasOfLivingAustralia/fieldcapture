package au.org.ala.merit

import org.codehaus.groovy.grails.commons.GrailsApplication

import javax.servlet.http.HttpServletResponse

//@PreAuthorise(accessLevel = 'siteReadOnly', redirectController = "home")
class DownloadController {
    GrailsApplication grailsApplication
    WebService webService

    /**
     * Deliberately not add .format in urlMapping to support file.extension on purpose
     * @param id - including extension
     * @return
     */
    def get(String id) {
        if (!id) {
            response.setStatus(400)
            render "A download ID is required"
        }else {
            String url = "${grailsApplication.config.ecodata.baseUrl}" +'download/'+id

            def resp = webService.proxyGetRequest(response, url, true, true, 120000)
            if (resp.status != 200) {
                render view:'/error', model:[error:resp.error]
            }
        }

    }

}
