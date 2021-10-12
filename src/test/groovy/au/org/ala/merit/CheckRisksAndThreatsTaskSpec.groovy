package au.org.ala.merit

import spock.lang.Specification

class CheckRisksAndThreatsTaskSpec extends Specification {


    SettingService settingService = Mock(SettingService)
    RisksService risksService = Mock(RisksService)


    void "The CheckRisksAndThreatsTask sets up necessary user and hub context, then delegates to the riskService"() {
        setup:
        CheckRisksAndThreatsTask task = new CheckRisksAndThreatsTask()
        task.settingService = settingService
        task.risksService = risksService

        when:
        task.checkForRisksAndThreatsChanges()

        then:
        1 * settingService.withDefaultHub(_) >> { Closure closure -> closure() }
        1 * risksService.checkAndSendEmail()
    }

}
