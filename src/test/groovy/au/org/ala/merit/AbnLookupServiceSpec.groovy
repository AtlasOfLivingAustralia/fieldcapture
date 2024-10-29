package au.org.ala.merit


import grails.testing.spring.AutowiredTest
import org.apache.http.HttpStatus
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
class AbnLookupServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service AbnLookupService
    }}

    AbnLookupService service
    WebService webService = Mock(WebService)
    def configuration = [abn:[abnLookupToken:"1234", abnUrl:"https://abr.business.gov.au/json/AbnDetails.aspx?abn="]]


    def setup() {
        service.grailsApplication = grailsApplication
        grailsApplication.getConfig() >> configuration
        service.webService = webService
    }

    def cleanup() {
    }

    void "valid ABN Number"() {
        setup:
        String abn = "51824753556"

        when:
        def result = service.validateABN(abn)

        then:
        result == true
    }

    void "blank ABN"() {
        setup:
        String abn = ""

        when:
        def result = service.validateABN(abn)

        then:
        result == false
    }

    void "ABN Number length is less than 11 digits"() {
        setup:
        String abn = "1824753556"

        when:
        def result = service.validateABN(abn)

        then:
        result == false
    }

    void "invalid ABN Number"() {
        setup:
        String abn = "01824753556"

        when:
        def result = service.validateABN(abn)

        then:
        result == false
    }

    void "ABN Number validates blank value"() {
        setup:
        String abn = ""

        when:
        def result = service.validateABN(abn)

        then:
        result == false
    }

    void "get ABN Details from correct ABN Number"() {
        setup:
        String abn = "41687119230"
        String abnValue = "callback({\"Abn\":\"41687119230\",\n" +
                "             \"AbnStatus\":\"Active\",\n" +
                "             \"Acn\":\"\",\n" +
                "             \"AddressDate\":\"2017-05-22\",\n" +
                "             \"AddressPostcode\":\"2601\",\n" +
                "             \"AddressState\":\"ACT\",\n" +
                "             \"BusinessName\":[\"DEEP SPACE CAFE\",\"CSIRO\",\"CENTRE FOR LIVEABILITY REAL ESTATE\",\"DATA61\"],\n" +
                "             \"EntityName\":\"COMMONWEALTH SCIENTIFIC AND INDUSTRIAL RESEARCH ORGANISATION\",\n" +
                "             \"EntityTypeCode\":\"CGE\",\n" +
                "             \"EntityTypeName\":\"Commonwealth Government Entity\",\n" +
                "             \"Gst\":\"2000-07-01\",\"Message\":\"\"})"

        Map expected = [abn:"41687119230", entityName:"COMMONWEALTH SCIENTIFIC AND INDUSTRIAL RESEARCH ORGANISATION", abnStatus:"Active", businessNames:["DEEP SPACE CAFE", "CSIRO", "CENTRE FOR LIVEABILITY REAL ESTATE", "DATA61"], state:"ACT", postcode:2601, entityType:"CGE", entityTypeName:"Commonwealth Government Entity"]
        Map wsResponse = [resp:abnValue, statusCode: HttpStatus.SC_OK]

        String abnLookupToken = grailsApplication.config.getProperty('abn.abnLookupToken')
        String url = grailsApplication.config.getProperty('abn.abnUrl')
        String abnLookupUrlString = url + abn + "&guid=" + abnLookupToken

        when:
        Map actual = service.lookupOrganisationDetailsByABN(abn)

        then:
        1 * webService.getString(abnLookupUrlString, false) >> wsResponse

        expect:
        expected == actual
    }


    void "Providing a Wrong ABN Number will ot invoke the webservice"() {
        setup:
        String abn = "41687119231"

        String abnLookupToken = grailsApplication.config.getProperty('abn.abnLookupToken')
        String url = grailsApplication.config.getProperty('abn.abnUrl')
        String abnLookupUrlString = url + abn + "&guid=" + abnLookupToken
        Map wsResponse = [error:"Error", statusCode: HttpStatus.SC_BAD_REQUEST]

        when:
        Map actual = service.lookupOrganisationDetailsByABN(abn)

        then:
        0 * webService.getString(abnLookupUrlString, false) >> wsResponse

        expect:
        actual.abn == ''
        actual.entityName == null
    }

}

