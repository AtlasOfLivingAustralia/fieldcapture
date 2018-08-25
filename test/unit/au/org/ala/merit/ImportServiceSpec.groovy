package au.org.ala.merit

import grails.converters.JSON
import org.apache.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import spock.lang.Specification

/**
 * Specification for the InputService.
 */
class ImportServiceSpec extends Specification {

    static def HEADER_ROW = "${GmsMapper.GRANT_ID_COLUMN},${GmsMapper.EXTERNAL_ID_COLUMN},${GmsMapper.DATA_TYPE_COLUMN},${GmsMapper.DATA_SUB_TYPE_COLUMN},PGAT_ACTIVITY_DELIVERABLE_GMS_CODE,UNITS_COMPLETED"

    ImportService importService
    ProjectService projectService = Mock(ProjectService)
    def activitiesModel = JSON.parse(new InputStreamReader(getClass().getResourceAsStream('/resources/activities-model.json')))
    UserService userService = Mock(UserService)
    SiteService siteService = Mock(SiteService)

    def setup() {
        importService = new ImportService()
        importService.cacheService = new CacheService()
        importService.projectService = projectService
        importService.userService = userService
        importService.siteService = siteService

        def metadataServiceStub = Stub(MetadataService)
        metadataServiceStub.activitiesModel() >> activitiesModel
        metadataServiceStub.getOutputTargetScores() >> [[externalId:'RVA', scoreId:1, label:'label 1']]
        importService.metadataService = metadataServiceStub
    }

    def "MERIT should be able to load summary activity score information into a project using CSV formatted data"() {

        setup:
        def score = [externalId:'RVA', scoreId:1, label:'label 1']
        def project = buildTestProject()
        projectService.get(_,_) >> project
        projectService.search(_) >> [resp:[projects:[project]]]

        def data = "${project.grantId},${project.externalId},${GmsMapper.ACTIVITY_DATA_TYPE},${GmsMapper.ACTIVITY_DATA_SUB_TYPE},RVA,2000"
        def input = new ByteArrayInputStream((HEADER_ROW+"\n"+data).getBytes('UTF-8'))

        when: "loading data containing progress towards a single output target"
        def results = importService.populateAggregrateProjectData(input, true, 'UTF-8')

        then: "we create a single activity containing a single output that records progress towards the specified target"
        results.activities.size() == 1
        def activity = results.activities[0]
        activity.type == ImportService.SUMMARY_ACTIVITY_NAME
        activity.plannedStartDate == project.plannedStartDate
        activity.plannedEndDate == project.plannedEndDate
        activity.startDate == project.plannedStartDate
        activity.endDate == project.plannedEndDate
        activity.outputs.size() == 1

        def output = activity.outputs[0]
        output.name == ImportService.SUMMARY_OUTPUT_NAME
        output.data.scores.size() == 1
        output.data.scores[0].scoreId == score.scoreId
        output.data.scores[0].scoreLabel == score.label
        output.data.scores[0].score == 2000

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
