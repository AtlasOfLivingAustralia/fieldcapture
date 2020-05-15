package au.org.ala.merit

import groovy.json.JsonSlurper
import org.codehaus.groovy.grails.commons.GrailsApplication

/**
 * Using ABN: ABR Web Services API to get abn details
 */

class AbnLookupService {

    GrailsApplication grailsApplication
    WebService webService

/**
 * This method will return abn details based abn number provided.
 * this method is used my GMSMapper
 * @param organisationABN
 * @return abnDetails
 */
    Map lookupOrganisationNameByABN(String organisationABN){
        String abnLookupToken = grailsApplication.config.abnLookupToken
        String abnLookupUrlString = "https://abr.business.gov.au/json/AbnDetails.aspx?abn=" + organisationABN + "&guid=" + abnLookupToken

        String resp = webService.get(abnLookupUrlString)

        String results = removeCallback(resp)

        JsonSlurper slurper = new JsonSlurper()
        Map map  = slurper.parseText(results)
        Map abnDetails = [abn: map.Abn, entityName: map.EntityName]
        return abnDetails
    }

    private static String removeCallback(String resp){
        def result
        def callback ='callback('
        def endBracket = ')'
        if(resp.startsWith(callback) && resp.endsWith(endBracket)){
            result = resp.substring(callback.size())
            result = result.substring(0,result.length()-1)
        }else{
            result = resp
        }
        return result
    }
}
