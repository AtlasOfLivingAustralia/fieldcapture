package au.org.ala.fieldcapture

import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin

import static org.junit.Assert.assertEquals
import static org.junit.Assert.assertNull

/**
 * See the API for {@link grails.test.mixin.support.GrailsUnitTestMixin} for usage instructions
 */
@TestMixin(GrailsUnitTestMixin)
@TestFor(SiteService)
@Mock(UserService)
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

    def kml = "<?xml version='1.0' encoding='UTF-8'?>\n" +
            "<kml xmlns='http://www.opengis.net/kml/2.2'>\n" +
            "\t<Document>\n" +
            "\t\t<name>Untitled map</name>\n" +
            "\t\t<description><![CDATA[]]></description>\n" +
            "\t\t<Folder>\n" +
            "\t\t\t<name>Layer 1</name>\n" +
            "\t\t\t<Placemark>\n" +
            "\t\t\t\t<styleUrl>#poly-000000-1-76</styleUrl>\n" +
            "\t\t\t\t<name>Polygon 1</name>\n" +
            "\t\t\t\t<ExtendedData>\n" +
            "\t\t\t\t</ExtendedData>\n" +
            "\t\t\t\t<description><![CDATA[Description of polygon 1]]></description>\n" +
            "\t\t\t\t<Polygon>\n" +
            "\t\t\t\t\t<outerBoundaryIs>\n" +
            "\t\t\t\t\t\t<LinearRing>\n" +
            "\t\t\t\t\t\t\t<tessellate>1</tessellate>\n" +
            "\t\t\t\t\t\t\t<coordinates>149.11253929138184,-35.27747178213701,0.0 149.1130542755127,-35.277191505062774,0.0 149.11307573318481,-35.27698129662057,0.0 149.1126036643982,-35.2767535701925,0.0 149.1119384765625,-35.277121435642655,0.0 149.11253929138184,-35.27747178213701,0.0</coordinates>\n" +
            "\t\t\t\t\t\t</LinearRing>\n" +
            "\t\t\t\t\t</outerBoundaryIs>\n" +
            "\t\t\t\t</Polygon>\n" +
            "\t\t\t</Placemark>\n" +
            "\t\t\t<Placemark>\n" +
            "\t\t\t\t<styleUrl>#poly-000000-1-76</styleUrl>\n" +
            "\t\t\t\t<name>Polygon 2</name>\n" +
            "\t\t\t\t<ExtendedData>\n" +
            "\t\t\t\t</ExtendedData>\n" +
            "\t\t\t\t<description><![CDATA[Description of Polygon 2]]></description>\n" +
            "\t\t\t\t<Polygon>\n" +
            "\t\t\t\t\t<outerBoundaryIs>\n" +
            "\t\t\t\t\t\t<LinearRing>\n" +
            "\t\t\t\t\t\t\t<tessellate>1</tessellate>\n" +
            "\t\t\t\t\t\t\t<coordinates>149.11404132843018,-35.274633931954114,0.0 149.11376237869263,-35.27568499917104,0.0 149.11537170410156,-35.275474786818805,0.0 149.11524295806885,-35.2747215214098,0.0 149.11404132843018,-35.274633931954114,0.0</coordinates>\n" +
            "\t\t\t\t\t\t</LinearRing>\n" +
            "\t\t\t\t\t</outerBoundaryIs>\n" +
            "\t\t\t\t</Polygon>\n" +
            "\t\t\t</Placemark>\n" +
            "\t\t</Folder>\n" +
            "\t\t<Folder>\n" +
            "\t\t\t<name>Untitled layer</name>\n" +
            "\t\t</Folder>\n" +
            "\t\t<Style id='poly-000000-1-76'>\n" +
            "\t\t\t<LineStyle>\n" +
            "\t\t\t\t<color>ff000000</color>\n" +
            "\t\t\t\t<width>1</width>\n" +
            "\t\t\t</LineStyle>\n" +
            "\t\t\t<PolyStyle>\n" +
            "\t\t\t\t<color>4C000000</color>\n" +
            "\t\t\t\t<fill>1</fill>\n" +
            "\t\t\t\t<outline>1</outline>\n" +
            "\t\t\t</PolyStyle>\n" +
            "\t\t</Style>\n" +
            "\t</Document>\n" +
            "</kml>"
    void testKml() {

        def userServiceMock = mockFor(UserService)
        userServiceMock.demand.getUser {->[userId:'1234']}
        service.userService = userServiceMock.createMock()

        service.createSitesFromKml(kml, '1234')

    }
    /*void testGetLocationMetadataForPoint() {
        def webService = mockFor(WebService)
        service.webService = webService
        def md = service.getLocationMetadataForPoint('-29.911','132.769')
        assertEquals 'South Australia', md.state
        assertEquals 'Alinytjara Wilurara', md.nrm
    }*/
}
