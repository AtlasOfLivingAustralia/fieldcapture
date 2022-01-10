package au.org.ala.merit


import grails.testing.web.interceptor.InterceptorUnitTest
import spock.lang.Specification

class NoCacheInterceptorSpec extends Specification implements InterceptorUnitTest<NoCacheInterceptor> {


    def "The no cache interceptor should not apply no-cache headers to document downloads or species lookups"() {

        when:
        withRequest(controller: "document", action: "download")

        then:
        !interceptor.doesMatch()

        when:
        withRequest(controller: "species")

        then:
        !interceptor.doesMatch()

        when:
        withRequest(controller: "project")

        then:
        interceptor.doesMatch()
    }


    def "The NoCacheInterceptor applies no-cache headers to the response"() {
        setup:
        NoCacheInterceptor noCacheInterceptor = new NoCacheInterceptor()
        noCacheInterceptor.setConfiguration(grailsApplication.config)

        when:
        noCacheInterceptor.before()

        then:
        response.getHeader("Cache-Control") == "no-cache"
    }
}
