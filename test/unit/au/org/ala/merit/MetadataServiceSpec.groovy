package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(MetadataService)
class MetadataServiceSpec extends Specification {

    WebService webService = Mock(WebService)
    CacheService cacheService = new CacheService()

    void setup() {
        service.cacheService = cacheService
        service.webService = webService
    }

    def "A list of categories can be returned for the dashboard report"() {
        setup:
        List scores = [[name:'test', category:'Category 1'], [name:'test 2', category:'Category 1'], [name:'test 3', category: 'Category 2']]

        when:
        Set categories = service.getReportCategories()

        then:
        1 * webService.getJson{it.endsWith("/metadata/scores")} >> scores

        and:
        categories == ['Category 1', 'Category 2'] as LinkedHashSet
    }


}
