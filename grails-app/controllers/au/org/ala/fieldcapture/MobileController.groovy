package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONArray

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream


/**
 * Handles requests from the mobile application.  Uses the mobile auth key services for authentication rather than
 * the usual CAS tickets.
 */
class MobileController {


    static String MOBILE_AUTH_BASE_URL = "https://m.ala.org.au"
    static String MOBILE_AUTH_GET_KEY_URL = MOBILE_AUTH_BASE_URL+"/mobileauth/mobileKey/generateKey"
    static String MOBILE_AUTH_CHECK_KEY_URL = MOBILE_AUTH_BASE_URL+"/mobileauth/mobileKey/checkKey"

    def metadataService, webService, grailsApplication, userService, projectService

    def jsRegexp = /(?m)script src="\/(.*)" type="text\/javascript"/
    def cssRegexp = /(?m)link href="\/(.*)" type="text\/css"/

    /**
     * Bundles activity forms into a zip file for use offline by the mobile applications.
     * @return an application/zip stream contain the activity forms and supporting script/css files.
     */
    def bundle() {

        def activities = metadataService.activitiesModel().activities

        response.setContentType('application/zip')

        boolean first = true
        ZipOutputStream zip = new ZipOutputStream(response.outputStream)
        activities.each {
            def type = it.name
            def enterActivityDataHtml = activityHtml(type)
            if (first) {
                addExternalFiles(zip, jsRegexp, enterActivityDataHtml)
                addExternalFiles(zip, cssRegexp, enterActivityDataHtml)
                first = false
            }
            // replace absolute references with relative ones to enable loading from file.
            enterActivityDataHtml = enterActivityDataHtml.replaceAll(jsRegexp, /script src="$1" type="text\/javascript"/)
            enterActivityDataHtml = enterActivityDataHtml.replaceAll(cssRegexp, /link href="$1" type="text\/css"/)

            zip.putNextEntry(new ZipEntry(type.replaceAll(' ', '_')+'.html'))

            byte[] page = enterActivityDataHtml.getBytes('UTF-8')
            zip.write(page, 0, page.length)
            zip.closeEntry()
        }

        zip.finish()

        return null
    }

    /**
     * Follows links identified by the supplied regular expression and adds them to the supplied zip file.
     * @param zip the file being produced.
     * @param regexp used to match URLs to follow and add.
     * @param html the html to search.
     */
    private def addExternalFiles(ZipOutputStream zip, regexp, String html) {
        def urls = []
        def results = html =~ regexp
        while (results.find()) {
            urls << results.group(1)
        }

        urls.each {
            try {
                def page = webService.get(grailsApplication.config.serverName +'/'+ it)

                zip.putNextEntry(new ZipEntry(it))

                byte[] pageBytes = page.getBytes('UTF-8')
                zip.write(pageBytes, 0, pageBytes.length)
                zip.closeEntry()
            }
            catch (Exception e) {
                println e
            }
        }

    }


    String activityHtml(type) {
        def url = g.createLink(controller:'mobile', action:'activityForm', id:type, absolute: true)

        def result = webService.get(url)
        return result
    }

    def activityForm(String id) {

        println "rendering ${id}"


        def model = [:]
        model.speciesLists = new JSONArray()
        model.metaModel = metadataService.getActivityModel(id)
        // the array of output models
        model.outputModels = model.metaModel?.outputs?.collectEntries {
            [it, metadataService.getDataModelFromOutputName(it)]
        }

        render view:'/activity/mobile', model:model
    }

    /**
     * Performs a login operation using m.ala.org.au and returns auth key.
     * @return JSON containing the auth key produced by m.ala.org.au
     */
    def login() {
        def username = params.userName.encodeAsURL()
        def password = params.password.encodeAsURL()
        def loginUrl = MOBILE_AUTH_GET_KEY_URL+"?userName=${username}&password=${password}"
        def result = webService.getJson(loginUrl)
        if (result.statusCode) {
            response.setStatus(result.statusCode)
        }
        render result as JSON
    }

    /**
     * @return the projects for the supplied user.
     */
    def userProjects() {
        def username = params.userName
        def authKey = params.authKey

        // validate with mobile auth.
        UserDetails user = authorize(username, authKey)

        if (user) {
            render userService.getProjectsForUserId(user.userId) as JSON
        }
        else  {
            response.status = 401
            def message = [error:'Invalid credentials supplied']
            render message as JSON

        }
    }

    def projectDetails(String id) {
        def username = params.userName
        def authKey = params.authKey

        // validate with mobile auth.
        UserDetails user = authorize(username, authKey)

        if (!projectService.canUserEditProject(user.userId, id)) {
            def error = [error:"Access denied: User does not have <b>editor</b> permission for project:'${id}'}"]
            response.status = 401
            render error as JSON
        }

        render projectService.get(id, 'all') as JSON
    }

    UserDetails authorize(username, key) {
        // validate auth key.
        def url = MOBILE_AUTH_CHECK_KEY_URL
        def params = [userName:username, authKey:key]
        def result = webService.doPostWithParams(url,params)
        if (!result.statusCode && result.resp?.status == 'success') {
            // success!
            params = [userName:username]
            url = grailsApplication.config.userDetails.url+"getUserDetails"
            result = webService.doPostWithParams(url, params)
            if (!result.statusCode && result.resp) {
                return new UserDetails(result.resp.firstName+result.resp.lastName, result.resp.userName, result.resp.userId)
            }
        }
        return null

    }
}
