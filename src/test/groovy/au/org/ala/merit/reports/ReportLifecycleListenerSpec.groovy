package au.org.ala.merit.reports

import au.org.ala.ecodata.forms.ActivityFormService
import au.org.ala.merit.MetadataService
import groovy.json.JsonSlurper
import spock.lang.Specification

class ReportLifecycleListenerSpec extends Specification {

    ReportLifecycleListener reportData = new ReportLifecycleListener()
    ActivityFormService activityFormService = Mock(ActivityFormService)
    MetadataService metadataService = Mock(MetadataService)

    def setup() {
        reportData.activityFormService = activityFormService
        reportData.metadataService = metadataService
    }


    def "The context data doesn't need project data sets to exist"() {
        setup:
        Map data = [
                prop1: [prop2: [
                        [prop3:[
                                [prop4: 'value1'],
                                [prop4: 'value2']
                        ]],
                        [prop3:[
                                [prop4: 'value3'],
                                [prop4: 'value4']
                        ]],
                        [prop5: 'value5']
                ]]
        ]

        when:
        List result = ReportLifecycleListener.getValueFromPath('prop1.prop2.prop3.prop4', data)

        then:
        result == ['value1', 'value2', 'value3', 'value4']


    }


    def "Project data sets will be filtered to only finished data sets"() {

    }

    def "Referenced entities in the saved data can be found"() {
        setup:
        Map activityData = nhtActivityData()

        when:
        List<Map> entities = reportData.findReferencedEntities(activityData)

        then:
        1 * activityFormService.findActivityForm(_) >> nhtActivityForm()
        entities == [
                [entityType:"au.org.ala.ecodata.DataSetSummary", entityIds:["297cbf04-b8b1-43d5-a1b4-e833ef00a718", "0847b4c6-aba9-425c-a3e4-a07035d40b9b"]],
                [entityType:"au.org.ala.ecodata.DataSetSummary", entityIds:["e4e3f304-5ee7-458b-ad7e-0e3ee0cbb202", "0d2d2b6c-50ce-46f8-a8f0-5f9238d84120", "144ca417-43a8-4eab-94c3-f857263bbc06"]],
                [entityType:"au.org.ala.ecodata.DataSetSummary", entityIds:["5b1255a4-3b91-4fae-a243-02bd4d163898"]]]
    }

    def "getTargetForReportPeriod should return the correct target for the report period"() {
        setup:
        Map report = [toDate: '2023-12-31']
        String scoreId = 'score1'
        List<Map> values = [
                [scoreId: 'score1', periodTargets: [
                        [period: '2023-01-01', target: 10],
                        [period: '2023-12-31', target: 20],
                        [period: '2024-01-01', target: 30]
                ]],
                [scoreId: 'score2', periodTargets: [
                        [period: '2023-01-01', target: 5],
                        [period: '2023-12-31', target: 15]
                ]]
        ]

        when:
        def result = reportData.getTargetsForReportPeriod(report, values)

        then:
        result == [score1:20, score2: 15]
    }

    private static Map nhtActivityForm() {
        File file = new File('forms/nht/nhtOutputReport.json')

        Map report = null
        file.withInputStream {
            report = new JsonSlurper().parse(it)
        }
        report
    }

    private static Map nhtActivityData() {

        File file = new File("src/test/resources/nhtOutputReportData.json")

        Map report = null
        file.withInputStream {
            report = new JsonSlurper().parse(it)
        }
        report
    }

}
