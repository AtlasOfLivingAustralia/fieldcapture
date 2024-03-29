package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import groovy.transform.CompileStatic

/**
 * The LoginRecordingInterceptor records logins to MERIT.
 * The way to get a login notification from CAS appears to be to override
 * the ticket authentication servlet filter, so we are using a simpler method.
 * We intercept requests, and the first time a user is detected we record the
 * time with ecodata, then save a flag in the session to let us know it's done.
 */
@CompileStatic
class LoginRecordingInterceptor {

    UserService userService

    // Must be after the HubConfigurationInterceptor as we need to record
    // the hubId as well as the userId.
    int order = HIGHEST_PRECEDENCE + 10

    /** Key to store that we already recorded the login for this session */
    private static final String LOGIN_RECORDED = 'loginRecord'

    /** Key to store that will be passed/used in HomeController */
    static final String EXPIRY_DATE = 'expiryDate'

    LoginRecordingInterceptor() {
        matchAll()
    }

    boolean before() {
        if (!session.getAttribute(LOGIN_RECORDED)) {
            String userId = userService.getCurrentUserId()
            HubSettings hub = SettingService.hubConfig
            // Only record a login if a user is logged in and we have a hubId
            if (userId && hub) {
                boolean success = userService.recordUserLogin(userId, hub.hubId)
                session.setAttribute(LOGIN_RECORDED, success)
                String expiryDate = userService.checkUserExpirationDetails(userId, hub.hubId)
                session.setAttribute(EXPIRY_DATE, expiryDate)
            }
        }
        true
    }

    boolean after() { true }

    void afterView() {}
}
