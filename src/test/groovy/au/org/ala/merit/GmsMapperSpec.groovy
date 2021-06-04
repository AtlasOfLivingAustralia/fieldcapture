package au.org.ala.merit

import grails.converters.JSON
import grails.plugins.csv.CSVMapReader
import spock.lang.Specification

/**
 * Tests the GmsMapper
 */
class GmsMapperSpec extends Specification{

    def gmsMapper = new GmsMapper()
    AbnLookupService abnLookupService = Mock(AbnLookupService)
    def scores = [
            [scoreId:'1', label:'Area of revegetation works (Ha)', units:'Ha', externalId:'RVA', isOutputTarget:true],
            [scoreId:'2', label:'Number of plants planted', units:'', externalId:'RVN', isOutputTarget:true],
            [scoreId:'3', label:'Total new area treated for weeds (Ha)', units:'Ha', externalId:'WDT', isOutputTarget:true],
            [scoreId:'4', label:'Total No. of plants grown and ready for planting', units:'', externalId:'PPRP', isOutputTarget:true]

    ]
    def activitiesModel
    def setup() {
        activitiesModel = JSON.parse(new InputStreamReader(getClass().getResourceAsStream('/activities-model.json')))
        Map programModel = [programs:[[name:'Green Army']]]
        List organisations = [[ organisationId: "123", name:'Test org 1', abn:'12345678901']]
        gmsMapper = new GmsMapper(activitiesModel, programModel, organisations, abnLookupService,scores)
    }

    /**
     * Tests a project maps correctly.  No errors are present in the test data for this test.
     */
    def "gms data can be mapped to MERIT"() {

        setup:
        CSVMapReader reader = new CSVMapReader(new InputStreamReader(getClass().getResourceAsStream('/gmsMappingTestData1.csv'), 'cp1252'))
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
        '111111' == project.internalOrderId

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
        5 == activities.size()

        def expectedTypes = ['Revegetation', 'Revegetation', 'Revegetation', 'Weed Treatment', 'Plant Propagation']
        def expectedDescriptions = ['Test activity', 'Test activity 2', 'Third revegetation activity', 'Activity 4', 'Activity 5']
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
        def expectedScoreIds = ['1', '2', '3', '4']
        def expectedScores = ['Area of revegetation works (Ha)', 'Number of plants planted', 'Total new area treated for weeds (Ha)', 'Total No. of plants grown and ready for planting']
        def expectedTargets = [400, 1500, 1.5, 500]

        outputTargets.eachWithIndex { outputTarget, i ->
            assert expectedScoreIds[i] == outputTarget.scoreId
            assert expectedScores[i] == outputTarget.scoreLabel
            assert expectedTargets[i] == outputTarget.target

        }

        and: "emails are mapped correctly"
        project.editorEmail == "editor@test.com"
        project.editorEmail2 == "editor2@test.com"
        project.grantManagerEmail == "gm@test.com"
        project.grantManagerEmail2 == "gm2@test.com"

    }

    def "a separate activity will be created per distinct type description and dates"() {

        setup:
        CSVMapReader reader = new CSVMapReader(new InputStreamReader(getClass().getResourceAsStream('/gmsMappingTestData2.csv'), 'cp1252'))
        def rows = reader.readAll()

        when:
        def projectDetails = gmsMapper.mapProject(rows)

        then: "only 2 revegetation activities should be created"
        def activities = projectDetails.activities
        2 == activities.findAll{it.type == 'Revegetation'}.size()

        and: "the output targets from the revegetation activities should be summed where they are the same type"
        // output targets
        def outputTargets = projectDetails.project.outputTargets
        2 == outputTargets.size()
        def expectedScoreIds = ['1', '2']
        def expectedScores = ['Area of revegetation works (Ha)', 'Number of plants planted']
        def expectedTargets = [750, 1500]

        outputTargets.eachWithIndex { outputTarget, i ->
            assert expectedScoreIds[i] == outputTarget.scoreId
            assert expectedScores[i] == outputTarget.scoreLabel
            assert expectedTargets[i] == outputTarget.target

        }
    }

    /**
     * Tests a project maps correctly.  No errors are present in the test data for this test.
     */
    def "MERIT data can be mapped to a format understood by GMS"() {

        setup:
        def projectJson = getClass().getResource('/meritMappingTestData1.json').text
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

    def "Management units will be mapped from the supplied name"() {
        setup:
        gmsMapper.managementUnits = ["MU1Name":"mu1id", "MU2Name":"mu2id"]

        when:
        Map result = gmsMapper.mapProject([[MANAGEMENT_UNIT:'MU2Name']])

        then:
        result.project.managementUnitId == "mu2id"

        and: "The mapped property managementUnitName is not assigned to the result as it is not a valid property of a project"
        result.project.managementUnitName == null
    }

    def "An error will be raised if a supplied management unit name cannot be found"() {
        setup:
        gmsMapper.managementUnits = ["MU1Name":"mu1id", "MU2Name":"mu2id"]

        when:
        Map result = gmsMapper.mapProject([[MANAGEMENT_UNIT:'MissingMUName']])

        then:
        result.project.managementUnitId == null
        result.errors.find{it == "No management unit exists with name MissingMUName"}
    }

    def "Management unit is not a compulsory field for a project load"() {
        when:
        Map result = gmsMapper.mapProject([[APP_ID:'g1', PROGRAM_NM:"Green Army", ORG_TRADING_NAME:'Test org 1', ABN:'12345678901', FUNDING_TYPE:"RLP", FUNDING:"1000", START_DT:'2019/07/01', FINISH_DT:'2020/07/01']])

        then:
        !result.errors
    }

    def "Programs can be mapped from the supplied name via the program map"() {
        setup:
        gmsMapper.programs = ["Program name 1":"p1id", "Program name 2":"p2id"]
        Map projectData = [APP_ID:'g1', ORG_TRADING_NAME:'Test org 1', ABN:'12345678901', FUNDING_TYPE:"RLP", FUNDING:"1000", START_DT:'2019/07/01', FINISH_DT:'2020/07/01']

        when:
        Map result = gmsMapper.mapProject([ projectData + [PROGRAM_NM: 'Program name 2'] ])

        then:
        result.project.programId == "p2id"
        !result.errors
    }

    def "Programs can be mapped from the programs model as a fallback if they aren't mapped in the program map"() {
        gmsMapper.programs = ["Program name 1":"p1id", "Program name 2":"p2id"]
        Map projectData = [APP_ID:'g1', ORG_TRADING_NAME:'Test org 1', ABN: '12345678901',FUNDING_TYPE:"RLP", FUNDING:"1000", START_DT:'2019/07/01', FINISH_DT:'2020/07/01']

        when:
        Map result = gmsMapper.mapProject([ projectData + [PROGRAM_NM: 'Green Army'] ])

        then:
        result.project.associatedProgram == "Green Army"
        !result.errors
    }

    def "An error will be raised if the program is unable to be mapped or missing"() {
        gmsMapper.programs = ["Program name 1":"p1id", "Program name 2":"p2id"]
        Map projectData = [APP_ID:'g1', ORG_TRADING_NAME:'Test org 1',ABN:  '12345678901', FUNDING_TYPE:"RLP", FUNDING:"1000", START_DT:'2019/07/01', FINISH_DT:'2020/07/01']

        when:
        Map result = gmsMapper.mapProject([ projectData + [PROGRAM_NM: 'Missing program'] ])

        then:
        result.errors.size() == 1

        when: "No program is supplied"
        result = gmsMapper.mapProject([ projectData] )

        then:
        result.errors.size() == 1
    }

    def "Tags can be mapped by the GMS mapper"() {
        gmsMapper.programs = ["Program name 1":"p1id", "Program name 2":"p2id"]
        Map projectData = [APP_ID:'g1',PROGRAM_NM:'Program name 1', ORG_TRADING_NAME:'Test org 1', ABN: '12345678901',FUNDING_TYPE:"RLP", FUNDING:"1000", START_DT:'2019/07/01', FINISH_DT:'2020/07/01', TAGS:"Fires, Flood, Test"]

        when:
        Map result = gmsMapper.mapProject([ projectData ])

        then:
        result.project.tags == ["Fires", "Flood", "Test"]
        !result.errors
    }

    def "Organisation can be map using organisation name"(){
        setup:
        Map projectData = [APP_ID:'g1', ORG_TRADING_NAME:'Test org 1', FUNDING_TYPE:"RLP", FUNDING:"1000",START_DT:'2019/07/01', FINISH_DT:'2020/07/01']

        when:
        def result = gmsMapper.mapProject([projectData])

        then:
        result.errors[1].toString() != "No organisation exists with organisation name Test org 1"

    }

    def "An Error will raised organisation unable to map using organisation name"(){
        setup:
        Map projectData = [APP_ID:'g1', ORG_TRADING_NAME:'Test org 2',FUNDING_TYPE:"RLP", FUNDING:"1000", START_DT:'2019/07/01', FINISH_DT:'2020/07/01']

        when:
        def result = gmsMapper.mapProject([projectData])

        then:
        result.errors[1].toString() == "No organisation exists with organisation name Test org 2"
    }


    def "organisation to map using abn lookup"(){
        setup:
        Map projectData = [APP_ID:'g1', ABN: '12345678900', START_DT:'2019/07/01', FINISH_DT:'2020/07/01']
        String abn = "12345678900"
        Map abnValue = [abn:"12345678900", entityName:"Test org 1"]

        when:
        def result = gmsMapper.mapProject([projectData])

        then:
        1 * abnLookupService.lookupOrganisationNameByABN(abn) >> abnValue

        and:
        result.errors[1].toString() != "12345678900 is invalid. Please Enter the correct one"
    }

    def "An error is raise when abn number is not provided"(){
        setup:
        Map projectData = [APP_ID:'g1', ABN: '12345678900', START_DT:'2019/07/01', FINISH_DT:'2020/07/01']
        String abn = "12345678900"
        Map abnValue = null

        when:
        def result = gmsMapper.mapProject([projectData])

        then:
        1 * abnLookupService.lookupOrganisationNameByABN(abn) >> abnValue

        and:
        result.errors[1].toString() == "12345678900 is invalid. Please Enter the correct one"
    }

    def "An error is raise when abn number return the empty map"(){
        setup:
        Map projectData = [APP_ID:'g1', ABN: '12345678900', START_DT:'2019/07/01', FINISH_DT:'2020/07/01']
        String abn = "12345678900"
        Map abnValue = [abn: "", entityName: ""]

        when:
        def result = gmsMapper.mapProject([projectData])

        then:
        1 * abnLookupService.lookupOrganisationNameByABN(abn) >> abnValue

        and:
        result.errors[1].toString() == "12345678900 is invalid abn number. Please Enter the correct one"
    }


    def "Assign entity name to the organisation "(){
        setup:
        Map projectData = [APP_ID:'g1', ABN: '12345678900', START_DT:'2019/07/01', FINISH_DT:'2020/07/01']
        String abn = "12345678900"
        Map abnValue = [abn: "12345678900", entityName: "Org name"]

        when:
        def result = gmsMapper.mapProject([projectData])

        then:
        1 * abnLookupService.lookupOrganisationNameByABN(abn) >> abnValue

        and:
        result.errors[1].toString() != "12345678900 is invalid abn number. Please Enter the correct one"
    }
}
