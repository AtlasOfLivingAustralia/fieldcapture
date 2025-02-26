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
        String query = (projectQuery    (projectId) as JSON).toString()
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
        String url = bdrBaseUrl+'/cql?_mediatype='+URLEncoder.encode(format, 'UTF-8')
        String encodedQuery = URLEncoder.encode(query, "UTF-8")

        String fileNameWithExtension = buildFileName(fileName, format)

        url+="&_profile="+"bdr-feature-human"
        url+="&limit=$limit"
        url+="&filter="+encodedQuery

        log.info("Downloading data set from BDR: $url")


        Map headers = [
                'Content-Disposition': 'attachment; filename="'+fileNameWithExtension+'"',
        ]
        webService.proxyGetRequest(response, url, WebService.AUTHORIZATION_HEADER_TYPE_EXTERNAL_TOKEN, readTimeout, azureToken, headers)
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

