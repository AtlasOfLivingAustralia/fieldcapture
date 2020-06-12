package au.org.ala.merit

import groovy.json.JsonSlurper
import org.codehaus.groovy.grails.commons.GrailsApplication

/**
 * Using ABN: ABR Web Services API to get abn, and EntityName
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
        String url = grailsApplication.config.abnUrl
        String abnLookupUrlString =  url + organisationABN + "&guid=" + abnLookupToken
        String resp
        Map abnDetails

        try{
            resp = webService.get(abnLookupUrlString)
        }catch(Exception e){
            abnDetails.error = "Failed calling web service"
            abnDetails.details = e
            return abnDetails
        }

        String results = removeCallback(resp)

        JsonSlurper slurper = new JsonSlurper()
        Map map  = slurper.parseText(results)

         abnDetails = [abn: map.Abn, entityName: map.EntityName]

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
