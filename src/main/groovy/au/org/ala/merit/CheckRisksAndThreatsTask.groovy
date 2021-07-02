package au.org.ala.merit

import groovy.util.logging.Slf4j
import org.apache.log4j.Logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled

import static au.org.ala.merit.ScheduledJobContext.withUser

/**
 * Task to be scheduled by the spring scheduler.
 */
@Slf4j
class CheckRisksAndThreatsTask {

    @Autowired
    RisksService risksService

    @Autowired
    SettingService settingService

    @Scheduled(cron="0 0 2 * * ?")
    void checkForRisksAndThreatsChanges() {

        withUser([name:"risksAndThreatsTask"]) {
            settingService.withDefaultHub {
                log.info("Running scheduled risks and threats task")
                risksService.checkAndSendEmail()
            }
        }
    }
}
