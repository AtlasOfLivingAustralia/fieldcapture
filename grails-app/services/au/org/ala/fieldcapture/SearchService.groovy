package au.org.ala.fieldcapture

import grails.converters.JSON

import javax.annotation.PostConstruct

/**
 * Service for ElasticSearch running on ecodata
 */
class SearchService {
    def webService, commonService
    def grailsApplication
    def elasticBaseUrl

    @PostConstruct
    private void init() {
        elasticBaseUrl = grailsApplication.config.ecodata.baseUrl + 'search/elastic'
    }

    def fulltextSearch(params) {
        params.offset = params.offset?:0
        params.max = params.max?:10
        params.query = params.query?:"*:*"
        params.highlight = params.highlight?:true
        def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        webService.getJson(url)
    }

    def allGeoPoints(params) {
        params.max = 9999
        params.flimit = 999
        params.fsort = "term"
        params.offset = 0
        params.query = "geo.lat:*"
        params.facets = "stateFacet,nrmFacet,lgaFacet"
        def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        log.debug "allGeoPoints - $url with $params"
        webService.getJson(url)
    }

    def allProjects(params) {
        //params.max = 9999
        params.flimit = 999
        params.fsort = "term"
        //params.offset = 0
        params.query = "docType:project"
        params.facets = ""
        def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        webService.getJson(url)
    }

    def getProjectsForIds(params) {
        //params.max = 9999
        params.remove("action");
        params.remove("controller");
        params.maxFacets = 100
        //params.offset = 0
        def ids = params.ids

        if (ids) {
            params.remove("ids");
            def idList = ids.tokenize(",")
            params.query = "_id:" + idList.join(" OR _id:")
            params.facets = "stateFacet,nrmFacet,lgaFacet"
            def url = grailsApplication.config.ecodata.baseUrl + 'search/elasticPost'
            webService.doPost(url, params)
        } else if (params.query) {
            def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
            webService.getJson(url)
        } else {
            [error: "required param ids not provided"]
        }
    }
}
