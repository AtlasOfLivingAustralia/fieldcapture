package au.org.ala.merit

import grails.config.Config
import grails.core.GrailsApplication
import spock.lang.Specification

class CheckRisksAndThreatsTaskSpec extends Specification {


    SettingService settingService = Mock(SettingService)
    RisksService risksService = Mock(RisksService)
    UserService userService = new UserService()


    void "The CheckRisksAndThreatsTask sets up necessary user and hub context, then delegates to the riskService"() {
        setup:
        CheckRisksAndThreatsTask task = new CheckRisksAndThreatsTask()
        Config config = Mock(Config)
        task.settingService = settingService
        task.risksService = risksService
        task.userService = userService
        task.grailsApplication = Mock(GrailsApplication)

        when:
        task.checkForRisksAndThreatsChanges()

        then:
        1 * task.grailsApplication.getConfig() >> config
        1 * config.getProperty("fieldcapture.system.email.address") >> "test@test.com"
        1 * settingService.withDefaultHub(_) >> { Closure closure -> closure() }
        1 * risksService.checkAndSendEmail()
    }

}
