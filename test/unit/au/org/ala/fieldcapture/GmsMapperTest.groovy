package au.org.ala.fieldcapture

import grails.converters.JSON
import grails.test.GrailsUnitTestCase
import org.grails.plugins.csv.CSVMapReader

/**
 * Tests the GmsMapper
 */
class GmsMapperTest extends GrailsUnitTestCase{



    def gmsMapper = new GmsMapper()

    /**
     * Tests a project maps correctly.  No errors are present in the test data for this test.
     */
    def testGmsToMeritMapping() {

        CSVMapReader reader = new CSVMapReader(new InputStreamReader(getClass().getResourceAsStream('/resources/gmsMappingTestData1.csv'), 'cp1252'))
        def rows = reader.readAll()

        def projectDetails = gmsMapper.createProject(rows)

        def expectedStartDate = '2014-10-12T01:00:00+0000'
        def expectedEndDate = '2015-03-22T01:00:00+0000'

        def project = projectDetails.project
        assertEquals('B0000000001', project.grantId)
        assertEquals('GreenArmy-1234567-1', project.externalId)
        assertEquals('Test Project Name', project.name)
        assertEquals('Test Project Description', project.description)
        assertEquals('Test Organisation 2', project.organisationName)
        assertEquals('Green Army', project.associatedProgram)
        assertEquals('Green Army Round 1', project.associatedSubProgram)
        assertEquals(expectedStartDate, project.plannedStartDate)
        assertEquals(expectedEndDate, project.plannedEndDate)
        assertEquals('', project.funding)
        assertEquals('not approved', project.planStatus)

        // TODO check timeline!

        def sites = projectDetails.sites
        // Ignoring for the moment, not sure how to handle the kml transformation, probably out of scope of the mapper.


        def activities = projectDetails.activities
        assertEquals(3, activities.size())

        def expectedTypes = ['Revegetation', 'Weed Treatment', 'Plant Propagation']
        activities.eachWithIndex { activity, i ->
            assertEquals(expectedTypes[i], activity.type)
            assertEquals("Activity ${i}", activity.description)
            assertEquals(expectedStartDate, activity.plannedStartDate)
            assertEquals(expectedEndDate, activity.plannedEndDate)
            assertEquals('Protect and conserve Australia\u2019s natural, historic and Indigenous heritage.', activity.mainTheme)

        }

        // output targets
        def outputTargets = project.outputTargets
        assertEquals(3, outputTargets.size())
        def expectedOutputs = ['Revegetation Details', 'Weed Treatment Details', 'Plant Propagation Details']
        def expectedScores = ['Number of plants planted', 'Total area treated (Ha)', 'Total No. of plants grown and ready for planting']
        def expectedTargets = [1500, 1.5, 500]

        outputTargets.eachWithIndex { outputTarget, i ->
            assertEquals(expectedOutputs[i], outputTarget.outputLabel)
            assertEquals(expectedScores[i], outputTarget.scoreLabel)
            assertEquals(expectedTargets[i], outputTarget.target)

        }

    }

    /**
     * Tests a project maps correctly.  No errors are present in the test data for this test.
     */
    def testMeritToGmsMapping() {

        def projectJson = getClass().getResource('/resources/meritMappingTestData1.json').text
        def project = JSON.parse(projectJson)

        def gmsRows = gmsMapper.exportToGMS(project)

        def projectDetailsRow = gmsRows[0]
        assertEquals('B001234567G', projectDetailsRow.APP_ID)
        assertEquals('LSP-12345-678', projectDetailsRow.EXTERNAL_ID)
        assertEquals('Biodiversity Fund', projectDetailsRow.PROGRAM_NM)
        assertEquals('Round 1', projectDetailsRow.ROUND_NM)
        assertEquals('Project name test', projectDetailsRow.APP_NM)
        assertEquals('Project test description', projectDetailsRow.APP_DESC)
        assertEquals('Test organisation', projectDetailsRow.ORG_TRADING_NAME)
        assertEquals('01/07/2011', projectDetailsRow.START_DT)
        assertEquals('11/09/2017', projectDetailsRow.FINISH_DT)
        assertEquals('1', projectDetailsRow.FUNDING)



        println gmsRows

    }



}
