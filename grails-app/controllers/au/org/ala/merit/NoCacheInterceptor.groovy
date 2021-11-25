package au.org.ala.merit

import grails.config.Config
import grails.core.support.GrailsConfigurationAware
import groovy.transform.CompileStatic

/**
 * Adds cache control headers to all requests to prevent caching of the responses.
 */
@CompileStatic
class NoCacheInterceptor implements GrailsConfigurationAware {

    private static final String HEADER_PRAGMA = "Pragma";
    private static final String HEADER_EXPIRES = "Expires";
    private static final String HEADER_CACHE_CONTROL = "Cache-Control";
    private String applyCachingHeaders

    NoCacheInterceptor() {
        matchAll().excludes(controller: "species")
    }

    @Override
    void setConfiguration(Config config) {
        applyCachingHeaders = config.getProperty('app.view.nocache', Boolean, true)
    }

    boolean before() {
        if (applyCachingHeaders) {
            response.setHeader(HEADER_PRAGMA, "no-cache");
            response.setDateHeader(HEADER_EXPIRES, 1L);
            response.setHeader(HEADER_CACHE_CONTROL, "no-cache");
            response.addHeader(HEADER_CACHE_CONTROL, "no-store");
        }
        true
    }

    boolean after() { true }

    void afterView() { }
}
