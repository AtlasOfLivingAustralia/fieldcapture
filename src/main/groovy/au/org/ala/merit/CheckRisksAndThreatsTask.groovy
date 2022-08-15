package au.org.ala.merit

import grails.core.GrailsApplication
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

    @Autowired
    GrailsApplication grailsApplication

    @Scheduled(cron="0 0 2 * * ?")
    void checkForRisksAndThreatsChanges() {

        String systemEmail = grailsApplication.config.getProperty("fieldcapture.system.email.address")
        UserDetails user = new UserDetails("risksAndThreatsChangesTask", systemEmail, "merit")
        userService.withUser(user) {
            settingService.withDefaultHub {
                log.info("Running scheduled risks and threats task")
                risksService.checkAndSendEmail()
            }
        }
    }
}
