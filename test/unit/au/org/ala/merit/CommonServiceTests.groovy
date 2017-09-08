package au.org.ala.merit

import grails.test.mixin.*
import org.junit.*

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(CommonService)
class CommonServiceTests {

    void testBuildUrlParamsFromMap() {
        assertEquals '',service.buildUrlParamsFromMap([:])
        assertEquals '?key=value',service.buildUrlParamsFromMap([key:'value'])
        assertEquals '?key1=value1&key2=value2',service.buildUrlParamsFromMap([key1:'value1',key2:'value2'])
    }
}
