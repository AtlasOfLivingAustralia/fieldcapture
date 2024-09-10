package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import io.micronaut.context.annotation.Value
import org.springframework.beans.factory.annotation.Autowired

import javax.servlet.http.HttpServletResponse

/**
 * Interface to the BDR system - used to retrieve data submitted for MERIT projects via the Monitor application.
 */
@Slf4j
class BdrService {

    GrailsApplication grailsApplication
    WebService webService

    TokenService bdrTokenService

    void downloadDataSet(String dataSetId, String format, HttpServletResponse response) {
        String bdrBaseUrl = grailsApplication.config.getProperty('bdr.api.url')
        format = format ?: 'json'
        String url = bdrBaseUrl+'/'+dataSetId+'/items'

        //String token = bdrTokenService.getAuthToken(false)

        log.info("Downloading data set from BDR: $url")

        webService.proxyGetRequest(response, url, false)
    }
}

