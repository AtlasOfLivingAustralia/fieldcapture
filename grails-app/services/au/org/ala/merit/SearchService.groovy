package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import groovy.json.JsonSlurper
import org.apache.commons.lang.StringUtils

import javax.annotation.PostConstruct
import java.math.RoundingMode

/**
 * Service for ElasticSearch running on ecodata
 */
class SearchService {
    def webService, commonService, cacheService, metadataService, projectService, documentService
    def grailsApplication
    def elasticBaseUrl
    def userService

    private static final int FACET_LIMIT = 1500

    @PostConstruct
    private void init() {
        elasticBaseUrl = grailsApplication.config.ecodata.baseUrl + 'search/elastic'
    }

    def addDefaultFacetQuery(params) {
        def defaultFacetQuery = SettingService.getHubConfig().defaultFacetQuery
        if (defaultFacetQuery) {
            params.hubFq = defaultFacetQuery
        }
    }

    def fulltextSearch(originalParams, boolean applyDefaultFacetQuery = true) {
        def params = originalParams.clone()
        if (applyDefaultFacetQuery) {
            addDefaultFacetQuery(params)
        }
        handleDateFilters(params)
        params.offset = params.offset?:0
        params.max = params.max?:10
        params.query = params.query?:"*:*"
        params.highlight = params.highlight?:true
        params.flimit = FACET_LIMIT
        params.fsort = "term"
        def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        webService.getJson(url)
    }

    def allGeoPoints(params) {
        addDefaultFacetQuery(params)
        params.max = 9999
        params.flimit = FACET_LIMIT
        params.fsort = "term"
        params.offset = 0
        params.query = "geo.loc.lat:*"
        params.facets = "stateFacet,nrmFacet,lgaFacet,mvgFacet"
        def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        log.debug "allGeoPoints - $url with $params"
        webService.getJson(url)
    }

    def allProjects(params, String searchTerm = null) {
        configureProjectQuery(params)
        if (searchTerm) {
            params.query += " AND (" + searchTerm + ")"
        }

        params.facets = "statesFacet,lgasFacet,nrmsFacet,organisationFacet,mvgsFacet"
        //def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        def url = grailsApplication.config.ecodata.baseUrl + 'search/elasticHome' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = $url"
        Map response = webService.getJson2(url)
        // For compatibility of the return value with getJson which the client is expecting.
        if (response?.resp) {
            response = response.resp
        }
        response
    }

    def allProjectsWithSites(searchParams, String searchTerm = null, boolean reducePrecision) {
        configureProjectQuery(searchParams)
        if (searchTerm) {
            searchParams.query += " AND " + searchTerm
        }

        def url = grailsApplication.config.ecodata.baseUrl + 'search/elasticGeo' + commonService.buildUrlParamsFromMap(searchParams)
        log.debug "url = $url"
        Map result = webService.getJson2(url)

        Map geoData = result.resp
        // Reduce precision of coordinates to 1 decimal place.
        if (reducePrecision) {
            reducePrecisionOfPoints(1, geoData)
        }
        geoData
    }

    private void reducePrecisionOfPoints(int numberOfDecimalPlaces, Map geoData) {
        geoData?.projects?.each {
            it.geo?.each { site ->
                if (site.loc) {
                    // Truncate precision to 1 decimal place.
                    site.loc.lon = (site.loc.lon as BigDecimal).setScale(numberOfDecimalPlaces, RoundingMode.HALF_UP)
                    site.loc.lat = (site.loc.lat as BigDecimal).setScale(numberOfDecimalPlaces, RoundingMode.HALF_UP)
                }
            }
        }
    }

    def allSites(params) {
        addDefaultFacetQuery(params)
        //params.max = 9999
        params.flimit = FACET_LIMIT
        params.fsort = "term"
        //params.offset = 0
//        params.query = "docType:site"
        params.fq = "docType:site"
        //def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
        def url = grailsApplication.config.ecodata.baseUrl + 'search/elasticHome' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = $url"
        webService.getJson(url)
    }

    def HomePageFacets(originalParams) {

        def params = originalParams.clone()
        configureProjectQuery(params)
        HubSettings settings = SettingService.getHubConfig()
        params.facets = params.facets ?: StringUtils.join(settings.availableFacets, ',')

        def url = grailsApplication.config.ecodata.baseUrl + 'search/elasticHome' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = $url"
        def jsonstring = webService.get(url)
        try {
            def jsonObj = new JsonSlurper().parseText(jsonstring)
            jsonObj
        } catch(Exception e){
            log.error(e.getMessage(), e)
            [error:'Problem retrieving home page facets from: ' + url]
        }
    }

    private void configureProjectQuery(params, boolean useDefaultFacetQuery = true) {
        params.flimit = FACET_LIMIT
        params.fsort = "term"
        //params.offset = 0
        params.query = params.query ?: "docType:project"
        handleDateFilters(params)
        if (useDefaultFacetQuery) {
            addDefaultFacetQuery(params)
        }

    }

    private void handleDateFilters(params) {
        if (params.fromDate || params.toDate) {
            List fq = params.getList('fq')
            if (!params.fromDate) {
                fq += "_query:(plannedStartDate:[* TO ${params.toDate}])"
            } else if (!params.toDate) {
                fq += "_query:(plannedEndDate:[${params.fromDate} TO *])"
            } else {
                fq += "_query:(plannedEndDate:[${params.fromDate} TO *] AND plannedStartDate:[* TO ${params.toDate}])"
            }
            params.fq = fq
        }
    }

    private handleActivityDateFilters(params) {
        if (params.fromDate || params.toDate) {
            List fq = params.getList('fq')
            if (!params.fromDate) {
                fq += "_query:(plannedEndDate:[* TO ${params.toDate}])"
            } else if (!params.toDate) {
                fq += "_query:(plannedEndDate:[${params.fromDate} TO *])"
            } else {
                fq += "plannedEndDate:[${params.fromDate} TO ${params.toDate}]"
            }
            params.fq = fq
        }
    }

    def getProjectsForIds(params) {
        addDefaultFacetQuery(params)
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
            params.facets = "stateFacet,nrmFacet,lgaFacet,mvgFacet"
            def url = grailsApplication.config.ecodata.baseUrl + 'search/elasticPost'
            webService.doPost(url, params)
        } else if (params.query) {
            def url = elasticBaseUrl + commonService.buildUrlParamsFromMap(params)
            webService.getJson(url)
        } else {
            [error: "required param ids not provided"]
        }
    }

    def dashboardReport(params) {
        cacheService.get("dashboard-"+params, {
            addDefaultFacetQuery(params)
            params.query = params.query ?: 'docType:project'
            handleActivityDateFilters(params)
            def url = grailsApplication.config.ecodata.baseUrl + 'search/dashboardReport' + commonService.buildUrlParamsFromMap(params)
            webService.getJson(url, 1200000)
        })


    }

    def outputTargetsReport(params) {
        addDefaultFacetQuery(params)
        handleDateFilters(params)
        def url = grailsApplication.config.ecodata.baseUrl + 'search/targetsReport' + commonService.buildUrlParamsFromMap(params)

        def results = cacheService.get("outputTargets-"+params, {
            webService.getJson(url, 300000)
        })
        results
    }

    def reportOnScores(List<String> scoreLabels, List<String> facets) {
        def reportParams = [scores:scoreLabels]
        if (facets) {
            reportParams.fq = facets
        }
        def url = grailsApplication.config.ecodata.baseUrl + 'search/scoresByLabel' + commonService.buildUrlParamsFromMap(reportParams)
        webService.getJson(url, 1200000)
    }

    def downloadAllData(params) {
        def path = "search/downloadAllData"

        if (params.view == 'xlsx' || params.view == 'json') {
            path += ".${params.view}"
        }else{
            path += ".json"
        }

        configureProjectQuery(params)
        List facets = params.getList("fq")
        facets += "className:au.org.ala.ecodata.Project"

        def url = grailsApplication.config.ecodata.baseUrl + path +  commonService.buildUrlParamsFromMap(params)
        webService.doPostWithParams(url, [:]) // POST because the URL can get long.
    }

    def downloadSummaryData(params, response) {

        def path = "search/downloadSummaryData"

        if (params.view == 'xlsx' || params.view == 'json') {
            path += ".${params.view}"
        }else{
            path += ".json"
        }

        configureProjectQuery(params)
        def url = grailsApplication.config.ecodata.baseUrl + path + commonService.buildUrlParamsFromMap(params)
        webService.proxyGetRequest(response, url, true, true,960000)
    }

    def downloadShapefile(params, response) {

        configureProjectQuery(params)

        def path = "search/downloadShapefile"
        def url = grailsApplication.config.ecodata.baseUrl + path + commonService.buildUrlParamsFromMap(params)
        webService.proxyGetRequest(response, url, true, true,960000)
    }
}
