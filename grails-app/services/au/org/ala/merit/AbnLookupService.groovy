package au.org.ala.merit

import groovy.json.JsonSlurper
import grails.core.GrailsApplication
import org.apache.commons.lang3.StringUtils

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
        Map abnDetails

        if (!validateABN(organisationABN)) {
            abnDetails = [error:"The supplied ABN is invalid", abn:'']
        } else {
            String abnLookupToken = grailsApplication.config.getProperty('abn.abnLookupToken')
            String url = grailsApplication.config.getProperty('abn.abnUrl')
            String abnLookupUrlString =  url + organisationABN + "&guid=" + abnLookupToken

            Map resp  = webService.getString(abnLookupUrlString, false)


            if (resp.resp) {
                String responseText = resp.resp
                String results = removeCallback(responseText)
                JsonSlurper slurper = new JsonSlurper()
                Map map = slurper.parseText(results)
                abnDetails = [abn: map.Abn, entityName: map.EntityName]
            }
            else {
                abnDetails = [error:resp.error]
            }
        }

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

    /**
     * Validates the ABN format and will do a calculation based on the ABN validation algorithm https://abr.business.gov.au/Help/AbnFormat
     *
     * @param abnString
     * @return
     */
    private static Boolean validateABN(String abnString) {
        abnString = getNonBlankNumericStringWithoutWhitespace(abnString);
        if(abnString == null) {
            return false;
        }

        if(abnString.length() != 11) {
            return false;
        }

        if(abnString.substring(0,1) == '0') {
            return false;
        }

        String subtract1 = String.valueOf(Long.valueOf(abnString.substring(0,1))-1);
        String modifiedABN = String.valueOf(subtract1 + abnString.substring(1));
        Long abnWeightingSum = calcWeightingSum(modifiedABN);
        Long modEightyNineRemainder = Math.floorMod(abnWeightingSum, 89);

        if(modEightyNineRemainder != 0) {
            return false;
        }

        return true;
    }

    /**
     * The 11 digit ABN is structured as a 9 digit identifier with two leading check digits.
     * The leading check digits are derived using a modulus 89 (remainder after dividing by 89) calculation.
     *
     * @param theNumString
     * @return
     */
    private static Long calcWeightingSum(String theNumString) {
        List<Integer> weightList =  [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        Long weightingSum = 0;

        Integer startIndex = 0;
        Integer endIndex = 10;

        for(Integer i = startIndex; i <= endIndex; i++) {
            weightingSum +=
                    ( Long.valueOf(theNumString.substring(i,i+1) ) * weightList[i]);
        }

        return weightingSum;
    }

    /**
     * Validates if the parameter is blank and will remove whitespaces
     *
     * @param theString
     * @return
     */
    private static String getNonBlankNumericStringWithoutWhitespace(String theString) {
        if(StringUtils.isBlank(theString)) {
            return null;
        }

        theString = StringUtils.deleteWhitespace(theString)

        if(!StringUtils.isNumeric(theString)) {
            return null;
        }

        return theString;
    }
}
