package au.org.ala.merit

import grails.testing.spring.AutowiredTest

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
class CommonServiceTests implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service CommonService
    }}

    CommonService service

    void testBuildUrlParamsFromMap() {
        assertEquals '',service.buildUrlParamsFromMap([:])
        assertEquals '?key=value',service.buildUrlParamsFromMap([key:'value'])
        assertEquals '?key1=value1&key2=value2',service.buildUrlParamsFromMap([key1:'value1',key2:'value2'])
    }
}
