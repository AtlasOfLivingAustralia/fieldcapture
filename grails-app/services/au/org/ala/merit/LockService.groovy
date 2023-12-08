package au.org.ala.merit

import grails.core.GrailsApplication

/** Handles locking and unlocking of activities and projects. */
class LockService {

    EmailService emailService
    WebService webService
    GrailsApplication grailsApplication

    Map lock(String entityId) {
        String path = "lock/lock/"+entityId
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl')+path,[:])
    }

    Map unlock(String entityId, Boolean force = false) {
        String path = "lock/unlock/"+entityId
        webService.doPost(grailsApplication.config.getProperty('ecodata.baseUrl')+path,[force:force])
    }

    Map stealLock(String entityId, String url) {
        Map activity = get(entityId)
        Map result = [error:'No lock']
        if (activity.lock) {
            result = unlock(entityId, true)
            emailService.sendLockStolenEmail(activity.lock, url)
        }
        result
    }
}
