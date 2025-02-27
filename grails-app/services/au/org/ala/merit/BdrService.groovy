package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import grails.converters.JSON
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j

import javax.servlet.http.HttpServletResponse

/**
 * Interface to the BDR system - used to retrieve data submitted for MERIT projects via the Monitor application.
 */
@Slf4j
class BdrService {

    GrailsApplication grailsApplication
    WebService webService
    TokenService tokenService
    CommonService commonService
    BdrTokenService bdrTokenService

    static String BDR_CQL_API_PATH = '/cql'

    static Map FILE_EXTENSION_MAP = [
            'application/geo+json': 'geojson',
            'application/json': 'json',
            'text/turtle': 'ttl',
            'text/csv': 'csv'
    ]

    static private String buildFileName(String fileName, String format) {
        fileName+'.'+FILE_EXTENSION_MAP[format]
    }

    void downloadProjectDataSet(String projectId, String format, String fileName, HttpServletResponse response, int limit=1000) {
        String query = (projectQuery(projectId) as JSON).toString()
        executeBdrQuery(query, format, response, limit, fileName)
    }

    void downloadDataSet(String projectId, String dataSetId, String fileName, String format, HttpServletResponse response, int limit=1000) {
        String query = (dataSetQuery(dataSetId) as JSON).toString()
        executeBdrQuery(query, format, response, limit, fileName)
    }

    private void executeBdrQuery(String query, String format, HttpServletResponse response, int limit, String fileName) {
        String azureToken = bdrTokenService.getBDRAccessToken()

        String bdrBaseUrl = grailsApplication.config.getProperty('bdr.api.url')
        Integer readTimeout = grailsApplication.config.getProperty('bdr.api.readTimeout', Integer, 60000)
        String url = bdrBaseUrl+BDR_CQL_API_PATH

        Map params = [
                _mediatype: format,
                _profile: "bdr-feature-human",
                limit: limit,
                filter: query
        ]

        log.info("Downloading data set from BDR: $url and params: $params")

        String fileNameWithExtension = buildFileName(fileName, format)
        Map headers = [
                'Content-Disposition': 'attachment; filename="'+fileNameWithExtension+'"',
        ]
        webService.proxyGetRequest(response, url, params, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, readTimeout, azureToken, headers)
    }

    private static Map dataSetQuery(String dataSetId) {
        Map query = [
                "op": "and",
                "args": [
                        ["op":"=","args":[["property":"nrm-submission"], dataSetId]],
                        ["op":"=","args":[["property":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"],"http://www.opengis.net/ont/geosparql#Feature"]]
                ]
        ]
        query
    }

    private static Map projectQuery(String projectId) {
        Map query = [
                "op": "and",
                "args": [
                        ["op":"=","args":[["property":"https://schema.org/isPartOf"], "https://linked.data.gov.au/dataset/bdr/"+projectId]],
                        ["op":"=","args":[["property":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"],"http://www.opengis.net/ont/geosparql#Feature"]]
                ]
        ]
        query
    }

}

