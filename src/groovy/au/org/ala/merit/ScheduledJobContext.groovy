package au.org.ala.merit

import asset.pipeline.grails.utils.net.HttpServletRequests
import org.springframework.web.context.request.AbstractRequestAttributes
import org.springframework.web.context.request.RequestContextHolder

import javax.servlet.http.HttpServletRequest
import java.security.Principal

/**
 * Helper class to support execution of background threads.
 */
class ScheduledJobContext {

    /**
     * Very simple Map backed attributes with no scope.  Used to serve a user principal to the authService.
     */
    static class BackgroundThreadRequestAttributes extends AbstractRequestAttributes {
        private Map attributes = [:]
        @Override
        protected void updateAccessedSessionAttributes() {}

        @Override
        Object getAttribute(String name, int scope) {
            return attributes[name]
        }

        @Override
        void setAttribute(String name, Object value, int scope) {
            attributes[name] = value
        }

        @Override
        void removeAttribute(String name, int scope) {
            attributes.remove(name)
        }

        @Override
        String[] getAttributeNames(int scope) {
            return attributes.keySet().toArray(new String[attributes.size()])
        }

        @Override
        void registerDestructionCallback(String name, Runnable callback, int scope) {}

        @Override
        Object resolveReference(String key) {}

        @Override
        String getSessionId() {
            return Thread.currentThread().id
        }

        @Override
        Object getSessionMutex() {
            return attributes
        }

        private Principal principal
        public Principal getUserPrincipal() {
            return principal
        }

        public HttpServletRequest getRequest() {
            return null
        }

        public void setUserAttributes(Map attributes) {
            principal = new BackgroundThreadPrincipal(attributes)
        }
    }

    static class BackgroundThreadPrincipal implements Principal {

        private Map attributes
        public BackgroundThreadPrincipal(Map attributes) {
            this.attributes = attributes
        }
        @Override
        String getName() {
            return attributes.name ?: '<anon>'
        }
        Map getAttributes() {
            return attributes
        }
    }

    static void withUser(Map user, Closure closure) {
        if (RequestContextHolder.getRequestAttributes() != null) {
            throw new IllegalStateException("Cannot use this method within the context of a http request")
        }
        BackgroundThreadRequestAttributes attributes = new BackgroundThreadRequestAttributes()
        attributes.setUserAttributes(user)
        RequestContextHolder.setRequestAttributes(attributes)

        try {
            closure()
        }
        finally {
            RequestContextHolder.resetRequestAttributes()
        }

    }

}
