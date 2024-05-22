package au.org.ala.merit

import au.org.ala.ws.tokens.TokenService
import grails.core.GrailsApplication
import io.micronaut.context.annotation.Value
import org.springframework.beans.factory.annotation.Autowired

import javax.servlet.http.HttpServletResponse

/**
 * Interface to the BDR system - used to retrieve data submitted for MERIT projects via the Monitor application.
 */

class BdrService {

    @Value('${bdr.api.url}')
    String bdrBaseUrl

    GrailsApplication grailsApplication
    WebService webService
    @Autowired
    TokenService bdrTokenService

    void downloadDataSet(String dataSetId, HttpServletResponse response) {
        String url = bdrBaseUrl+'/'+dataSetId

        String token = bdrTokenService.getAuthToken(false)
        println token
        webService.proxyGetRequest(response, url, false)
    }





}

