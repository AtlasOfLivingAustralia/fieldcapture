package au.org.ala.fieldcapture

class SearchController {
    def webService
    def commonService

    def index(String query) {
        params.offset = params.offset?:0
        params.max = params.max?:10
        def url = grailsApplication.config.ecodata.baseUrl + 'search' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = " + url
        def resp = webService.getJson(url)
        log.debug "response = " + resp
        [results: resp]
    }
}
