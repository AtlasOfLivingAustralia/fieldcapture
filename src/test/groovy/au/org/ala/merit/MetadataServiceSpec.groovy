package au.org.ala.merit

import grails.testing.spring.AutowiredTest
import spock.lang.Specification

class MetadataServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service MetadataService
    }}

    MetadataService service
    SettingService settingService
    WebService webService = Mock(WebService)
    CacheService cacheService = new CacheService()

    void setup() {
        service.cacheService = cacheService
        service.webService = webService
        service.grailsApplication = grailsApplication
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
