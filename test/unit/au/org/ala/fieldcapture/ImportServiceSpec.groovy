package au.org.ala.fieldcapture

import grails.converters.JSON
import spock.lang.Specification

/**
 * Specification for the InputService.
 */
class ImportServiceSpec extends Specification {

    static def HEADER_ROW = "${GmsMapper.GRANT_ID_COLUMN},${GmsMapper.EXTERNAL_ID_COLUMN},${GmsMapper.DATA_TYPE_COLUMN},${GmsMapper.DATA_SUB_TYPE_COLUMN},PGAT_ACTIVITY_DELIVERABLE_GMS_CODE,UNITS_COMPLETED"

    def importService
    def projectServiceStub = Stub(ProjectService)
    def activitiesModel = JSON.parse(new InputStreamReader(getClass().getResourceAsStream('/resources/activities-model.json')))
    def userService = Mock(UserService)

    def setup() {
        importService = new ImportService()
        importService.cacheService = new CacheService()
        importService.projectService = projectServiceStub
        importService.userService = userService

        def metadataServiceStub = Stub(MetadataService)
        metadataServiceStub.activitiesModel() >> activitiesModel
        importService.metadataService = metadataServiceStub
    }

    def "MERIT should be able to load summary activity score information into a project using CSV formatted data"() {

        setup:
        def score = findScoreByGmsCode('RVA')
        def project = buildTestProject()
        projectServiceStub.list(_) >> [project]
        projectServiceStub.get(_,_) >> project

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
        output.data.scores[0].outputName == score.outputName
        output.data.scores[0].scoreLabel == score.label
        output.data.scores[0].score == 2000

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

    private Map findScoreByGmsCode(String code) {
        def score = null
        activitiesModel.outputs.find { output ->
            score = output.scores?.find{
                it.gmsId?.split('\\s')?.contains(code)
            }
            if (score != null) {
                score.outputName = output.name
            }
            score != null
        }
        score
    }
}
