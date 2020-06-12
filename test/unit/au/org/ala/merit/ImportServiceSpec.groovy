package au.org.ala.merit

import au.org.ala.merit.reports.ReportGenerationOptions
import grails.converters.JSON
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification

/**
 * Specification for the InputService.
 */
class ImportServiceSpec extends Specification {

    static def HEADER_ROW = "${GmsMapper.GRANT_ID_COLUMN},${GmsMapper.EXTERNAL_ID_COLUMN},${GmsMapper.DATA_TYPE_COLUMN},${GmsMapper.DATA_SUB_TYPE_COLUMN},PGAT_ACTIVITY_DELIVERABLE_GMS_CODE,UNITS_COMPLETED"

    def scores = [
            [scoreId:'1', label:'Area of revegetation works (Ha)', units:'Ha', externalId:'RVA', isOutputTarget:true],
            [scoreId:'2', label:'Number of plants planted', units:'', externalId:'RVN', isOutputTarget:true],
            [scoreId:'3', label:'Total new area treated for weeds (Ha)', units:'Ha', externalId:'WDT', isOutputTarget:true],
            [scoreId:'4', label:'Total No. of plants grown and ready for planting', units:'', externalId:'PPRP', isOutputTarget:true]

    ]
    GmsMapper mapper
    ImportService importService
    ProjectService projectService = Mock(ProjectService)
    def activitiesModel = JSON.parse(new InputStreamReader(getClass().getResourceAsStream('/resources/activities-model.json')))
    UserService userService = Mock(UserService)
    SiteService siteService = Mock(SiteService)
    ManagementUnitService managementUnitService = Mock(ManagementUnitService)
    MetadataService metadataService = Mock(MetadataService)
    ProgramService programService = Mock(ProgramService)
    AbnLookupService abnLookupService = Mock(AbnLookupService)

    def setup() {
        importService = new ImportService()
        importService.cacheService = new CacheService()
        importService.projectService = projectService
        importService.userService = userService
        importService.siteService = siteService
        importService.managementUnitService = managementUnitService
        importService.metadataService = metadataService
        importService.programService = programService
        importService.abnLookupService = abnLookupService

        metadataService.activitiesModel() >> activitiesModel
        metadataService.getOutputTargetScores() >> [[externalId:'RVA', scoreId:1, label:'label 1']]
    }

    def "The import service can bulk import sites for a set of projects"() {
        setup:
        MockMultipartFile shapefile = new MockMultipartFile("shapefile", "test.zip", "application/zip", new byte[0])
        String shapefileId = 's1'

        when:
        Map result = importService.bulkImportSites(shapefile)

        then:
        1 * siteService.uploadShapefile(shapefile) >> [statusCode: HttpStatus.SC_OK, resp:[shp_id:shapefileId, "0":["GRANT_ID":"g1", "EXTERNAL_I":"e1"]]]
        1 * projectService.search([grantId:"g1", externalId:"e1"]) >> [resp:[projects:[[projectId:"p1", grantId: "g1"]]]]
        1 * projectService.get('p1', _) >> [name:'p1 name', description:'p1 description']
        1 * siteService.createSiteFromUploadedShapefile(shapefileId, "0", shapefileId+'-0', "g1 - Site 1", _, "p1", false) >> [success:true, siteId:'s1']
        result.success == true
        result.message.sites.size() == 1
    }

    def "The import service can create projects that have been loaded and mapped via CSV"() {
        setup:
        GmsMapper mapper = new GmsMapper(activitiesModel, [:], [],abnLookupService, scores, [:])
        List projectRows = [[
            APP_ID:'Grant 1',
            MANAGEMENT_UNIT:'Test MU',
            APP_NM:'Test project',
            APP_DESC:'Test project description',
            EXTERNAL_ID:'123',
            ORG_TRADING_NAME:'Test organisation',
            START_DT: '01/07/2019',
            FINISH_DT: '30/06/2023',
            WORK_ORDER_ID: 'WO1234',
            ADMIN_EMAIL: 'admin@test.org',
            GRANT_MGR_EMAIL: 'gm@test.org'
        ]]
        List status = []
        String projectId = 'p1'

        when:
        importService.importAll(projectRows, status, mapper)

        then:
        1 * projectService.update('', _) >> [resp:[projectId:projectId]]

        1 * projectService.generateProjectStageReports(projectId, new ReportGenerationOptions())
        status.size() == 1
        status[0].grantId == projectRows[0].APP_ID
    }

    def "The ImportService provides the means for the GMSMapper to dynamically lookup management units"() {

        setup:
        def csv = getClass().getResourceAsStream("/resources/projectTestData.csv")

        when:
        List status = []
        Map result = importService.gmsImport(csv, status, true)

        then:
        1 * metadataService.organisationList() >> [list:[[name:"Test Organisation 2", organisationId:'org2Id', abn:'12345678901']]]
        1 * metadataService.programsModel() >> [programs:[[name:'Green Army', subprograms:[[name:"Green Army Round 1"]]]]]
        1 * managementUnitService.getByName("ACT") >> [managementUnitId:"actId", name:"ACT"]
        1 * programService.getByName("Green Army") >> null

        and: "The project was processed without errors"
        !result.error
        status.size() == 2 // One column header warning and one project row.
        status[1].success == true
        status[1].grantId == 'B0000000001'
        status[1].externalId == 'GreenArmy-1234567-1'
        !status[1].errors

    }

    def "The ImportService will apply management unit permissions to projects loaded with a defined management unit"() {

        setup:
        def csv = getClass().getResourceAsStream("/resources/projectTestData.csv")

        when:
        List status = []
        Map result = importService.gmsImport(csv, status, false)

        then:
        1 * metadataService.organisationList() >> [list:[[name:"Test Organisation 2", organisationId:'org2Id', abn:'12345678901']]]
        1 * metadataService.programsModel() >> [programs:[[name:'Green Army', subprograms:[[name:"Green Army Round 1"]]]]]
        1 * managementUnitService.getByName("ACT") >> [managementUnitId:"actId", name:"ACT"]
        1 * programService.getByName("Green Army") >> null
        1 * projectService.update('', _) >> [resp:[projectId:'p1']]
        1 * managementUnitService.getMembersOfManagementUnit("actId") >> [[userId:"u1", role:"admin"], [userId:"u2", role:"caseManager"]]
        1 * userService.checkEmailExists('editor@test.com') >> "u3"
        1 * userService.checkEmailExists('editor2@test.com') >> "u4"
        1 * userService.checkEmailExists('gm@test.com') >> "u5"
        1 * userService.checkEmailExists('gm2@test.com') >> "u6"
        2 * userService.checkEmailExists('test@test.com') >> "u7"


        and: "The users with roles for the management unit will have the same roles added to the project"
        1 * userService.addUserAsRoleToProject("u1", 'p1', "admin")
        1 * userService.addUserAsRoleToProject("u2", 'p1', "caseManager")

        and: "The project was processed without errors"
        !result.error
        status.size() == 2 // One column header warning and one project row.
        status[1].success == true
        status[1].grantId == 'B0000000001'
        status[1].externalId == 'GreenArmy-1234567-1'
        !status[1].errors

    }



    private Map buildTestProject() {
        [
                projectId:'project1234',
                grantId:'G1234',
                externalId:'E1234',
                plannedStartDate:'20150101T00:00:00Z',
                plannedEndDate:'20150201T00:00:00Z',
                activities:[]
        ]
    }


}
