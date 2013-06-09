package au.org.ala.fieldcapture

import static org.junit.Assert.*

import grails.test.mixin.*
import grails.test.mixin.support.*
import org.junit.*

/**
 * See the API for {@link grails.test.mixin.support.GrailsUnitTestMixin} for usage instructions
 */
@TestMixin(GrailsUnitTestMixin)
@TestFor(SiteService)
class SiteServiceTests {

    void setUp() {
        // Setup logic here
    }

    void tearDown() {
        // Tear down logic here
    }

    void testGetFirstPointLocationOneMatch() {
        def site = [name:'test',
            location:[[name:'centre',
            decimalLatitude: '-35.31299775',
            decimalLongitude:'138.7801159',
            type:'locationTypePoint']]]
        def point = service.getFirstPointLocation(site)
        assertEquals 'centre', point.name
    }

    void testGetFirstPointLocationNoMatch() {
        def site = [name:'test',
                location:[[name:'centre',
                        decimalLatitude: '-35.31299775',
                        decimalLongitude:'138.7801159',
                        type:'locationTypeShape']]]
        assertNull service.getFirstPointLocation(site)
    }

    void testGetFirstPointLocationNoLocation() {
        assertNull service.getFirstPointLocation([name:'test'])
    }

    void testGetFirstPointLocationMultiLocation() {
        def site = [name:'test',
                location:[
                        [name:'outline',
                        pid: '71',
                        type:'locationTypePid'],
                        [name:'centre',
                        decimalLatitude: '-35.31299775',
                        decimalLongitude:'138.7801159',
                        type:'locationTypePoint']
                ]
        ]
        def point = service.getFirstPointLocation(site)
        assertEquals 'centre', point.name
    }

    /*void testGetLocationMetadataForPoint() {
        def webService = mockFor(WebService)
        service.webService = webService
        def md = service.getLocationMetadataForPoint('-29.911','132.769')
        assertEquals 'South Australia', md.state
        assertEquals 'Alinytjara Wilurara', md.nrm
    }*/
}
