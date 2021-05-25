package au.org.ala.merit

import grails.testing.spring.AutowiredTest
import org.joda.time.DateTime
import org.joda.time.DateTimeUtils
import org.joda.time.DateTimeZone
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
class RisksServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service RisksService
    }}

    RisksService service

    ProjectService projectService = Mock(ProjectService)
    SearchService searchService = Mock(SearchService)
    SettingService settingService = Mock(SettingService)

    def setup() {
        service.projectService = projectService
        service.searchService = searchService
        service.settingService = settingService
        service.grailsApplication = grailsApplication

    }

    def cleanup() {
        DateTimeUtils.setCurrentMillisSystem()
    }

    void "The RisksService collaborates with other services to check for projects that have modified their risks and threats"(String lastCheckTime) {
        setup:
        String now = "2020-07-07T16:01:03Z"
        DateTimeUtils.setCurrentMillisFixed(DateUtils.parse(now).getMillis())
        String lastCheckDate = "2020-06-30T16:00:00Z"
        List projects = [[:], [:]]
        Map projectSearchResults = [hits:[hits:projects.collect{[_source:it]}]]

        when:
        service.checkAndSendEmail()

        then:
        1 * settingService.getSettingText(SettingPageType.RISKS_LAST_CHECK_TIME) >> lastCheckDate
        1 * searchService.allProjects([fq:"_query:(risks.dateUpdated:[${lastCheckDate} TO ${now}])"]) >> projectSearchResults
        projects.size() * projectService.sendEmail(_, _, RoleService.PROJECT_ADMIN_ROLE, "MERIT@environment.gov.au",
                [project:[:], reportUrl:"http://devt.ala.org.au:8087/fieldcapture/project/projectReport/null?fromDate=${lastCheckDate}&toDate=${now}&sections=Project+risks+changes&orientation=portrait"])
        1 * settingService.setSettingText(SettingPageType.RISKS_LAST_CHECK_TIME, now)

        where:
        lastCheckTime |  _
        "2020-06-30T16:00:00Z" | _
        "2020-06-29T16:00:00Z" | _

    }

    void "A missing lastCheckTime or a failure to contact ecodata will fall back on a time 7 days ago"() {
        setup:
        String now = "2020-07-07T16:01:03Z"
        DateTimeUtils.setCurrentMillisFixed(DateUtils.parse(now).getMillis())

        String expectedLastCheckDate = "2020-06-30T16:01:03Z"
        List projects = [[:], [:]]
        Map projectSearchResults = [hits:[hits:projects.collect{[_source:it]}]]

        when:
        service.checkAndSendEmail()

        then:
        1 * settingService.getSettingText(SettingPageType.RISKS_LAST_CHECK_TIME) >> ""
        1 * searchService.allProjects([fq:"_query:(risks.dateUpdated:[${expectedLastCheckDate} TO ${now}])"]) >> projectSearchResults
        projects.size() * projectService.sendEmail(_, _, RoleService.PROJECT_ADMIN_ROLE, "MERIT@environment.gov.au",
                [project:[:], reportUrl:"http://devt.ala.org.au:8087/fieldcapture/project/projectReport/null?fromDate=${expectedLastCheckDate}&toDate=${now}&sections=Project+risks+changes&orientation=portrait"])
        1 * settingService.setSettingText(SettingPageType.RISKS_LAST_CHECK_TIME, now)
    }

    void "Nothing will be done if less than the configured number of days has passed since we last checked and sent the emails"() {
        setup:
        String now = "2020-07-06T16:01:03Z"
        DateTimeUtils.setCurrentMillisFixed(DateUtils.parse(now).getMillis())

        when:
        service.checkAndSendEmail()

        then:
        1 * settingService.getSettingText(SettingPageType.RISKS_LAST_CHECK_TIME) >> "2020-06-30T16:00:00Z"
        0 * searchService._
        0 * settingService._
        0 * projectService._
    }
}
