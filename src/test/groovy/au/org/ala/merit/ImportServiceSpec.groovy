package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import au.org.ala.merit.reports.ReportGenerationOptions
import grails.converters.JSON
import grails.testing.services.ServiceUnitTest
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification

/**
 * Specification for the InputService.
 */
class ImportServiceSpec extends Specification implements ServiceUnitTest<ImportService> {

    def scores = [
            [scoreId:'1', label:'Area of revegetation works (Ha)', units:'Ha', externalId:'RVA', isOutputTarget:true],
            [scoreId:'2', label:'Number of plants planted', units:'', externalId:'RVN', isOutputTarget:true],
            [scoreId:'3', label:'Total new area treated for weeds (Ha)', units:'Ha', externalId:'WDT', isOutputTarget:true],
            [scoreId:'4', label:'Total No. of plants grown and ready for planting', units:'', externalId:'PPRP', isOutputTarget:true]

    ]
    GmsMapper mapper
    ProjectService projectService = Mock(ProjectService)
    def activitiesModel = JSON.parse(new InputStreamReader(getClass().getResourceAsStream('/activities-model.json')))
    UserService userService = Mock(UserService)
    SiteService siteService = Mock(SiteService)
    ManagementUnitService managementUnitService = Mock(ManagementUnitService)
    MetadataService metadataService = Mock(MetadataService)
    ProgramService programService = Mock(ProgramService)
    AbnLookupService abnLookupService = Mock(AbnLookupService)

    def setup() {
        service.cacheService = new CacheService()
        service.projectService = projectService
        service.userService = userService
        service.siteService = siteService
        service.managementUnitService = managementUnitService
        service.metadataService = metadataService
        service.programService = programService
        service.abnLookupService = abnLookupService

        metadataService.activitiesModel() >> activitiesModel
        metadataService.getOutputTargetScores() >> [[externalId:'RVA', scoreId:1, label:'label 1']]

        SettingService.setHubConfig(new HubSettings(hubId:'merit'))
    }

    def "The import service can bulk import sites for a set of projects"() {
        setup:
        MockMultipartFile shapefile = new MockMultipartFile("shapefile", "test.zip", "application/zip", new byte[0])
        String shapefileId = 's1'

        when:
        Map result = service.bulkImportSites(shapefile, false)

        then:
        1 * siteService.uploadShapefile(shapefile) >> [statusCode: HttpStatus.SC_OK, resp:[shp_id:shapefileId, "0":["GRANT_ID":"g1", "EXTERNAL_I":"e1"]]]
        1 * projectService.search([grantId:"g1", externalId:"e1"]) >> [resp:[projects:[[projectId:"p1", grantId: "g1"]]]]
        1 * projectService.get('p1', _) >> [name:'p1 name', description:'p1 description']
        1 * siteService.createSiteFromUploadedShapefile(shapefileId, "0", shapefileId+'-0', "g1 - Site 1", _, "p1", false) >> [success:true, siteId:'s1']
        result.success == true
        result.message.sites.size() == 1
    }

    def "When importing sites, if the external id doesn't match, matching a single unique grant id will suffice"() {

        setup:
        MockMultipartFile shapefile = new MockMultipartFile("shapefile", "test.zip", "application/zip", new byte[0])
        String shapefileId = 's1'

        when: "The shapefile matches a single project grant id, but not external id"
        Map result = service.bulkImportSites(shapefile, false)

        then: "The shapefile can be loaded"
        1 * siteService.uploadShapefile(shapefile) >> [statusCode: HttpStatus.SC_OK, resp:[shp_id:shapefileId, "0":["GRANT_ID":"g1", "EXTERNAL_I":"e1"]]]
        1 * projectService.search([grantId:"g1", externalId:"e1"]) >> [resp:[projects:[]]]
        1 * projectService.search([grantId:"g1"]) >> [resp:[projects:[[projectId:"p1", grantId: "g1"]]]]
        1 * projectService.get('p1', _) >> [name:'p1 name', description:'p1 description']
        1 * siteService.createSiteFromUploadedShapefile(shapefileId, "0", shapefileId+'-0', "g1 - Site 1", _, "p1", false) >> [success:true, siteId:'s1']
        result.success == true
        result.message.sites.size() == 1

        when: "The shapefile matches two projects with the same grant id"
        result = service.bulkImportSites(shapefile, false)

        then: "The shapefile cannot be loaded"
        1 * siteService.uploadShapefile(shapefile) >> [statusCode: HttpStatus.SC_OK, resp:[shp_id:shapefileId, "0":["GRANT_ID":"g1", "EXTERNAL_I":"e1"]]]
        1 * projectService.search([grantId:"g1", externalId:"e1"]) >> [resp:[projects:[]]]
        1 * projectService.search([grantId:"g1"]) >> [resp:[projects:[[projectId:"p1", grantId: "g1"], [projectId:'p2', grantId:'g1']]]]
        0 * projectService.get('p1', _) >> [name:'p1 name', description:'p1 description']
        0 * siteService.createSiteFromUploadedShapefile(shapefileId, "0", shapefileId+'-0', "g1 - Site 1", _, "p1", false) >> [success:true, siteId:'s1']
        result.success == true
        result.message.sites.size() == 0
        result.message.errors.size() == 1
    }

    def "The import service can test the site upload by performing a project match only"() {
        setup:
        MockMultipartFile shapefile = new MockMultipartFile("shapefile", "test.zip", "application/zip", new byte[0])
        String shapefileId = 's1'

        when:
        Map result = service.bulkImportSites(shapefile, true)

        then:
        1 * siteService.uploadShapefile(shapefile) >> [statusCode: HttpStatus.SC_OK, resp:[shp_id:shapefileId, "0":["GRANT_ID":"g1", "EXTERNAL_I":"e1"]]]
        1 * projectService.search([grantId:"g1", externalId:"e1"]) >> [resp:[projects:[[projectId:"p1", grantId: "g1"]]]]
        1 * projectService.get('p1', _) >> [name:'p1 name', description:'p1 description']
        0 * siteService.createSiteFromUploadedShapefile(shapefileId, "0", shapefileId+'-0', "g1 - Site 1", _, "p1", false) >> [success:true, siteId:'s1']
        result.success == true
        result.message.sites.size() == 1
    }

    def "The import service can create projects that have been loaded and mapped via CSV"() {
        setup:
        GmsMapper mapper = new GmsMapper(activitiesModel, [:], [[organisationId:"123", name:"Test organisation"]],abnLookupService, scores, ["Test program":"p1"], ["Test MU":"m1"])
        List projectRows = projectRowData()
        List status = []
        String projectId = 'p1'
        Map projectDetails

        when:
        service.importAll(projectRows, status, mapper, false)

        then:
        1 * projectService.update('', _) >> { id, details -> projectDetails = details; [resp:[projectId:projectId]]}

        and: "Project reports are no longer generated at import time"
        0 * projectService.generateProjectStageReports(projectId, new ReportGenerationOptions())
        projectDetails.grantId == "Grant 1"
        projectDetails.name == "Test project"
        projectDetails.programId == "p1"
        projectDetails.managementUnitId == "m1"
        projectDetails.description == "Test project description"
        projectDetails.externalId == "123"
        projectDetails.associatedOrgs == [[organisationId:"123", name:"Test organisation", organisationName:"Test organisation", description:"Service provider"]]
        !projectDetails.associatedProgram  // We didn't supply a program name in the test.
        !projectDetails.associatedSubProgram
        projectDetails.plannedStartDate == "2019-06-30T14:00:00+0000"
        projectDetails.plannedEndDate == "2023-06-29T14:00:00+0000"
        !projectDetails.contractStartDate
        !projectDetails.contractEndDate
        projectDetails.externalIds[0] == [externalId:"WO1234", idType:'WORK_ORDER']
        projectDetails.funding == 0
        !projectDetails.serviceProviderName
        !projectDetails.tags
        projectDetails.status == "application"
        projectDetails.planStatus == "not approved"
        !projectDetails.fundingType
        projectDetails.origin == 'merit'
        projectDetails.projectType == "works"
        projectDetails.isMERIT == true
        projectDetails.hubId == 'merit'
        projectDetails.projectId == 'p1'

        status.size() == 1
        status[0].grantId == projectRows[0].APP_ID
    }

    def "The service provides the means for the GMSMapper to dynamically lookup management units"() {

        setup:
        def csv = getClass().getResourceAsStream("/projectTestData.csv")

        when:
        List status = []
        Map result = service.gmsImport(csv, status, true, false)

        then:
        1 * metadataService.organisationList() >> [list:[[name:"Test Organisation 2", organisationId:'org2Id', abn:'12345678901']]]
        1 * metadataService.programsModel() >> [programs:[[name:'Green Army', subprograms:[[name:"Green Army Round 1"]]]]]
        1 * managementUnitService.getByName("ACT") >> [managementUnitId:"actId", name:"ACT"]
        1 * programService.getByName("Green Army Round 1") >> null

        and: "The project was processed without errors"
        !result.error
        status.size() == 2 // One column header warning and one project row.
        status[1].success == true
        status[1].grantId == 'B0000000001'
        status[1].externalId == 'GreenArmy-1234567-1'
        !status[1].errors

    }

    def "The service will apply management unit permissions to projects loaded with a defined management unit"() {

        setup:
        def csv = getClass().getResourceAsStream("/projectTestData.csv")

        when:
        List status = []
        Map result = service.gmsImport(csv, status, false, false)

        then:
        1 * metadataService.organisationList() >> [list:[[name:"Test Organisation 2", organisationId:'org2Id', abn:'12345678901']]]
        1 * metadataService.programsModel() >> [programs:[[name:'Green Army', subprograms:[[name:"Green Army Round 1"]]]]]
        1 * managementUnitService.getByName("ACT") >> [managementUnitId:"actId", name:"ACT"]
        1 * programService.getByName("Green Army Round 1") >> null
        1 * projectService.update('', _) >> [resp:[projectId:'p1']]
        1 * userService.checkEmailExists('editor@test.com') >> "u3"
        1 * userService.checkEmailExists('editor2@test.com') >> "u4"
        1 * userService.checkEmailExists('gm@test.com') >> "u5"
        1 * userService.checkEmailExists('gm2@test.com') >> "u6"
        2 * userService.checkEmailExists('test@test.com') >> "u7"

        and: "The project was processed without errors"
        !result.error
        status.size() == 2 // One column header warning and one project row.
        status[1].success == true
        status[1].grantId == 'B0000000001'
        status[1].externalId == 'GreenArmy-1234567-1'
        !status[1].errors

    }

    def "Projects can be found by grantId and externalId or just grantId"() {
        when:
        service.findProjectByGrantAndExternalId("g1", "e1")

        then:
        1 * projectService.search([grantId:"g1", externalId:"e1"])

        when:
        service.findProjectByGrantAndExternalId("g1", null)

        then:
        1 * projectService.search([grantId:"g1"])
    }

    def "A project won't be imported if update=false and MERIT already has a project with the same grantId/externalId"() {
        setup:
        GmsMapper mapper = new GmsMapper(activitiesModel, [:], [[organisationId:"123", name:"Test organisation"]],abnLookupService, scores, ["Test program":"p1"], ["Test MU":"m1"])
        List projectRows = projectRowData()
        List status = []
        String projectId = 'p1'

        when:
        service.importAll(projectRows, status, mapper, false)

        then:
        1 * projectService.search([grantId:"Grant 1", externalId:'123']) >> [resp:[projects:[[grantId:'Grant 1', projectId: 'p1']]]]
        0 * projectService.update(_, _)

        and:
        status.size() == 1
        status[0].grantId == 'Grant 1'
        status[0].success == false
        status[0].errors
    }

    def "A project won't be updated if update=true and MERIT does not have a project with the same grantId/externalId"() {
        setup:
        GmsMapper mapper = new GmsMapper(activitiesModel, [:], [[organisationId:"123", name:"Test organisation"]],abnLookupService, scores, ["Test program":"p1"], ["Test MU":"m1"])
        List projectRows = projectRowData()
        List status = []
        String projectId = 'p1'

        when:
        service.importAll(projectRows, status, mapper, true)

        then:
        1 * projectService.search([grantId:"Grant 1", externalId:'123']) >> [resp:[projects:[]]]
        0 * projectService.update(_, _)

        and:
        status.size() == 1
        status[0].grantId == 'Grant 1'
        status[0].success == false
        status[0].errors
    }

    private List<Map> projectRowData() {
        [[
                 APP_ID:'Grant 1',
                 MANAGEMENT_UNIT:'Test MU',
                 PROGRAM_NM:'Test program',
                 APP_NM:'Test project',
                 APP_DESC:'Test project description',
                 EXTERNAL_ID:'123',
                 ORG_ID:'123',
                 START_DT: '01/07/2019',
                 FINISH_DT: '30/06/2023',
                 WORK_ORDER_ID: 'WO1234',
                 ADMIN_EMAIL: 'admin@test.org',
                 GRANT_MGR_EMAIL: 'gm@test.org'
         ]]
    }

}
