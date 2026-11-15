package au.org.ala.merit


import org.apache.commons.logging.LogFactory
import org.joda.time.DateTime

import jakarta.servlet.http.HttpSessionEvent
import jakarta.servlet.http.HttpSessionListener


/**
 * Diagnostics for a session invalidation problem.
 */
class SessionLogger implements HttpSessionListener {

    private static final log = LogFactory.getLog(SessionLogger)


    @Override
    void sessionCreated(HttpSessionEvent httpSessionEvent) {
        log.info("${httpSessionEvent.session.id} created with lastAccessedTime=${new DateTime(httpSessionEvent.session.lastAccessedTime)}")
    }

    @Override
    void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        log.info("${httpSessionEvent.session.id} destroyed with lastAccessedTime=${new DateTime(httpSessionEvent.session.lastAccessedTime)}")
    }
}
