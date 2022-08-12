package au.org.ala.merit

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled

/**
 * Task to be scheduled by the spring scheduler.
 */
@Slf4j
class CheckRisksAndThreatsTask {

    @Autowired
    RisksService risksService

    @Autowired
    SettingService settingService

    @Autowired
    UserService userService

    @Scheduled(cron="0 0 2 * * ?")
    void checkForRisksAndThreatsChanges() {

        UserDetails user = new UserDetails("risksAndThreatsChangesTask", null, "merit")
        userService.withUser(user) {
            settingService.withDefaultHub {
                log.info("Running scheduled risks and threats task")
                risksService.checkAndSendEmail()
            }
        }
    }
}
