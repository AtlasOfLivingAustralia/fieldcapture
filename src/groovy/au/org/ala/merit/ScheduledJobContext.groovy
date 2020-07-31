package au.org.ala.merit


import org.springframework.web.context.request.AbstractRequestAttributes
import org.springframework.web.context.request.RequestContextHolder

import javax.servlet.*
import javax.servlet.http.*
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
        private HttpServletRequest request

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
        Principal getUserPrincipal() {
            return principal
        }

        HttpServletRequest getRequest() {
            return request
        }

        void setUserAttributes(Map attributes) {
            principal = new BackgroundThreadPrincipal(attributes)
            request =  new BackgroundThreadRequest(principal)
        }
    }

    /**
     * Implements on the methods of HttpServletRequest that allows the background thread to not throw exceptions
     * during security checks
     */
    static class BackgroundThreadRequest implements HttpServletRequest {

        BackgroundThreadPrincipal principal
        BackgroundThreadRequest(BackgroundThreadPrincipal principal) {
            this.principal = principal
        }

        @Override
        String getAuthType() {
            return null
        }

        @Override
        Cookie[] getCookies() {
            return new Cookie[0]
        }

        @Override
        long getDateHeader(String s) {
            return 0
        }

        @Override
        String getHeader(String s) {
            return null
        }

        @Override
        Enumeration<String> getHeaders(String s) {
            return null
        }

        @Override
        Enumeration<String> getHeaderNames() {
            return null
        }

        @Override
        int getIntHeader(String s) {
            return 0
        }

        @Override
        String getMethod() {
            return null
        }

        @Override
        String getPathInfo() {
            return null
        }

        @Override
        String getPathTranslated() {
            return null
        }

        @Override
        String getContextPath() {
            return null
        }

        @Override
        String getQueryString() {
            return null
        }

        @Override
        String getRemoteUser() {
            return null
        }

        @Override
        boolean isUserInRole(String role) {
            return principal.attributes.roles?.contains(role)
        }

        @Override
        Principal getUserPrincipal() {
            return principal
        }

        @Override
        String getRequestedSessionId() {
            return null
        }

        @Override
        String getRequestURI() {
            return null
        }

        @Override
        StringBuffer getRequestURL() {
            return null
        }

        @Override
        String getServletPath() {
            return null
        }

        @Override
        HttpSession getSession(boolean b) {
            return null
        }

        @Override
        HttpSession getSession() {
            return null
        }

        @Override
        boolean isRequestedSessionIdValid() {
            return false
        }

        @Override
        boolean isRequestedSessionIdFromCookie() {
            return false
        }

        @Override
        boolean isRequestedSessionIdFromURL() {
            return false
        }

        @Override
        boolean isRequestedSessionIdFromUrl() {
            return false
        }

        @Override
        boolean authenticate(HttpServletResponse httpServletResponse) throws IOException, ServletException {
            return false
        }

        @Override
        void login(String s, String s1) throws ServletException {

        }

        @Override
        void logout() throws ServletException {

        }

        @Override
        Collection<Part> getParts() throws IOException, ServletException {
            return null
        }

        @Override
        Part getPart(String s) throws IOException, ServletException {
            return null
        }

        @Override
        Object getAttribute(String s) {
            return null
        }

        @Override
        Enumeration<String> getAttributeNames() {
            return null
        }

        @Override
        String getCharacterEncoding() {
            return null
        }

        @Override
        void setCharacterEncoding(String s) throws UnsupportedEncodingException {

        }

        @Override
        int getContentLength() {
            return 0
        }

        @Override
        String getContentType() {
            return null
        }

        @Override
        ServletInputStream getInputStream() throws IOException {
            return null
        }

        @Override
        String getParameter(String s) {
            return null
        }

        @Override
        Enumeration<String> getParameterNames() {
            return null
        }

        @Override
        String[] getParameterValues(String s) {
            return new String[0]
        }

        @Override
        Map<String, String[]> getParameterMap() {
            return null
        }

        @Override
        String getProtocol() {
            return null
        }

        @Override
        String getScheme() {
            return null
        }

        @Override
        String getServerName() {
            return null
        }

        @Override
        int getServerPort() {
            return 0
        }

        @Override
        BufferedReader getReader() throws IOException {
            return null
        }

        @Override
        String getRemoteAddr() {
            return null
        }

        @Override
        String getRemoteHost() {
            return null
        }

        @Override
        void setAttribute(String s, Object o) {

        }

        @Override
        void removeAttribute(String s) {

        }

        @Override
        Locale getLocale() {
            return null
        }

        @Override
        Enumeration<Locale> getLocales() {
            return null
        }

        @Override
        boolean isSecure() {
            return false
        }

        @Override
        RequestDispatcher getRequestDispatcher(String s) {
            return null
        }

        @Override
        String getRealPath(String s) {
            return null
        }

        @Override
        int getRemotePort() {
            return 0
        }

        @Override
        String getLocalName() {
            return null
        }

        @Override
        String getLocalAddr() {
            return null
        }

        @Override
        int getLocalPort() {
            return 0
        }

        @Override
        ServletContext getServletContext() {
            return null
        }

        @Override
        AsyncContext startAsync() throws IllegalStateException {
            return null
        }

        @Override
        AsyncContext startAsync(ServletRequest servletRequest, ServletResponse servletResponse) throws IllegalStateException {
            return null
        }

        @Override
        boolean isAsyncStarted() {
            return false
        }

        @Override
        boolean isAsyncSupported() {
            return false
        }

        @Override
        AsyncContext getAsyncContext() {
            return null
        }

        @Override
        DispatcherType getDispatcherType() {
            return null
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
