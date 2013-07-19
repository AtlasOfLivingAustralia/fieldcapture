package au.org.ala.fieldcapture

class SearchController {
    def webService
    def commonService

    def indexOld(String query) {
        params.offset = params.offset?:0
        params.max = params.max?:10
        def url = grailsApplication.config.ecodata.baseUrl + 'search' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = " + url
        def resp = webService.getJson(url)
        log.debug "response = " + resp
        [results: resp]
    }

    def index(String query) {
        params.offset = params.offset?:0
        params.max = params.max?:10
        params.query = params.query?:"*:*"
        def url = grailsApplication.config.ecodata.baseUrl + 'search/elastic' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = " + url
        def resp = webService.getJson(url)
        log.debug "response = " + resp
        [results: resp]
    }
}
