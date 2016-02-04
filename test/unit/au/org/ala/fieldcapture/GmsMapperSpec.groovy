package au.org.ala.fieldcapture

import grails.converters.JSON
import grails.test.GrailsUnitTestCase
import grails.web.JSONBuilder
import groovy.json.JsonBuilder
import org.grails.plugins.csv.CSVMapReader
import org.junit.Before
import spock.lang.Specification

/**
 * Tests the GmsMapper
 */
class GmsMapperSpec extends Specification {

    def gmsMapper = new GmsMapper()

    def activitiesModel
    def setup() {
        activitiesModel = JSON.parse(new InputStreamReader(getClass().getResourceAsStream('/resources/activities-model.json')))
        gmsMapper = new GmsMapper(activitiesModel, [:], [])
    }

    /**
     * Tests a project maps correctly.  No errors are present in the test data for this test.
     */
    def "gms data can be mapped to MERIT"() {

        setup:
        CSVMapReader reader = new CSVMapReader(new InputStreamReader(getClass().getResourceAsStream('/resources/gmsMappingTestData1.csv'), 'cp1252'))
        def rows = reader.readAll()

        when:
        def projectDetails = gmsMapper.mapProject(rows)

        then: "Project details are mapped correctly"
        def expectedStartDate = '2014-10-12T13:00:00+0000'
        def expectedEndDate = '2015-03-22T13:00:00+0000'
        def project = projectDetails.project
        
        project.grantId == 'B0000000001'
        'GreenArmy-1234567-1' == project.externalId
        'Test Project Name' == project.name
        'Test Project Description' == project.description
        'Test Organisation 2' == project.organisationName
        'Green Army' == project.associatedProgram
        'Green Army Round 1' == project.associatedSubProgram
        expectedStartDate == project.plannedStartDate
        expectedEndDate == project.plannedEndDate
        0 == project.funding
        'not approved' == project.planStatus

        and: "sites are mapped correctly"
        def sites = projectDetails.sites
        // Ignoring for the moment, not sure how to handle the kml transformation, probably out of scope of the mapper.

        and: "activities are mapped correctly"
        // Input data contains 4 output targets which can be mapped to 3 activities
        def activities = projectDetails.activities
        3 == activities.size()

        def expectedTypes = ['Revegetation', 'Weed Treatment', 'Plant Propagation']
        def expectedDescriptions = ['Test activity', 'Activity 2', 'Activity 3']
        def expectedTheme = "Protect and conserve Australias natural, historic and Indigenous heritage."
        activities.eachWithIndex { activity, i ->
            assert expectedTypes[i] == activity.type
            assert expectedDescriptions[i] == activity.description
            assert expectedStartDate == activity.plannedStartDate
            assert expectedEndDate == activity.plannedEndDate
            assert expectedTheme == activity.mainTheme
        }

        and: "output targets are mapped correctly"
        // output targets
        def outputTargets = project.outputTargets
        4 == outputTargets.size()
        def expectedOutputs = ['Revegetation Details', 'Revegetation Details', 'Weed Treatment Details', 'Plant Propagation Details']
        def expectedScores = ['Area of revegetation works (Ha)', 'Number of plants planted', 'Total new area treated (Ha)', 'Total No. of plants grown and ready for planting']
        def expectedTargets = [150, 1500, 1.5, 500]

        outputTargets.eachWithIndex { outputTarget, i ->
            assert expectedOutputs[i] == outputTarget.outputLabel
            assert expectedScores[i] == outputTarget.scoreLabel
            assert expectedTargets[i] == outputTarget.target

        }

        and: "emails are mapped correctly"
        project.editorEmail == "editor@test.com"
        project.editorEmail2 == "editor2@test.com"
        project.grantManagerEmail == "gm@test.com"
        project.grantManagerEmail2 == "gm2@test.com"

    }

    /**
     * Tests a project maps correctly.  No errors are present in the test data for this test.
     */
    def "MERIT data can be mapped to a format understood by GMS"() {

        setup:
        def projectJson = getClass().getResource('/resources/meritMappingTestData1.json').text
        def project = JSON.parse(projectJson)

        when:
        def gmsRows = gmsMapper.exportToGMS(project)

        then:
        def expectedTargets = [
                ['Weed Treatment Details', 'Total area treated (Ha)', 'Ha', '30', '57'],
                ['Fence Details', 'Total length of fence', 'Km', '3', '0'],
                ['Revegetation Details', 'Area of revegetation works (Ha)', 'Ha', '30', '32']
        ]

        3 == gmsRows.size()

        // These should be duplicated on every row.
        gmsRows.eachWithIndex { row, i ->

             // Project details should be in every row.
            'B001234567G' == row.APP_ID
            'LSP-12345-678' == row.EXTERNAL_ID
            'Biodiversity Fund' == row.PROGRAM_NM
            'Round 1' == row.ROUND_NM
            'Project name test' == row.APP_NM
            'Project test description' == row.APP_DESC
            'Test organisation' == row.ORG_TRADING_NAME
            '01/07/2011' == row.START_DT
            '11/09/2017' == row.FINISH_DT
            '1' == row.FUNDING
            'Environmental Data' == row.DATA_TYPE
            'Activities' == row.ENV_DATA_TYPE


            def expectedTarget = expectedTargets[i]

            expectedTarget[0] == row.PGAT_ACTIVITY_DELIVERABLE
            expectedTarget[1] == row.PGAT_ACTIVITY_TYPE
            expectedTarget[2] == row.PGAT_UOM
            expectedTarget[3] == row.PGAT_ACTIVITY_UNIT
            expectedTarget[4] == row.PGAT_REPORTED_PROGRESS

        }

    }



}
