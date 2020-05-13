package au.org.ala.merit

import grails.test.mixin.TestFor
import org.codehaus.groovy.grails.commons.GrailsApplication
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(AbnLookupService)
class AbnLookupServiceSpec extends Specification {
    WebService webService = Mock(WebService)
    GrailsApplication grailsApplication = Mock(GrailsApplication)
    Map config = ['abnLookupToken':"1234"]


    def setup() {
        grailsApplication.getConfig() >> config
        service.grailsApplication = grailsApplication
        service.webService = webService
    }

    def cleanup() {
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

        Map expected = [Abn            :"41687119230",
                        AbnStatus      :"Active", Acn:"",
                        AddressDate    :"2017-05-22",
                        AddressPostcode:"2601",
                        AddressState   :"ACT",
                        BusinessName   :["DEEP SPACE CAFE","CSIRO","CENTRE FOR LIVEABILITY REAL ESTATE","DATA61"],
                        EntityName     : "COMMONWEALTH SCIENTIFIC AND INDUSTRIAL RESEARCH ORGANISATION",
                        EntityTypeCode :"CGE", EntityTypeName:"Commonwealth Government Entity",
                        Gst            :"2000-07-01",
                        Message        :""]



        String abnLookupToken = grailsApplication.config.abnLookupToken
        String abnLookupUrlString = "https://abr.business.gov.au/json/AbnDetails.aspx?abn=" + abn + "&guid=" + abnLookupToken

        when:
        Map actual = service.lookupOrganisationNameByABN(abn)

        then:
        1 * webService.get(abnLookupUrlString) >> abnValue

        expect:
        expected == actual
    }


    void "Providing a Wrong ABN NUmber"() {
        setup:
        String abn = "41687119231"
        String abnValue = "callback({\"Abn\":\"\",\n" +
                "             \"AbnStatus\":\"\",\n" +
                "             \"Acn\":\"\",\n" +
                "             \"AddressDate\":\"\",\n" +
                "             \"AddressPostcode\":\"\",\n" +
                "             \"AddressState\":\"\",\n" +
                "             \"BusinessName\":[],\n" +
                "             \"EntityName\":\"\",\n" +
                "             \"EntityTypeCode\":\"\",\n" +
                "             \"EntityTypeName\":\"\",\n" +
                "             \"Gst\":\"\",\"Message\":\"\"})"

        String abnLookupToken = grailsApplication.config.abnLookupToken
        String abnLookupUrlString = "https://abr.business.gov.au/json/AbnDetails.aspx?abn=" + abn + "&guid=" + abnLookupToken

        when:
        Map actual = service.lookupOrganisationNameByABN(abn)

        then:
        1 * webService.get(abnLookupUrlString) >> abnValue

        expect:
        actual.size()==0
    }

}
