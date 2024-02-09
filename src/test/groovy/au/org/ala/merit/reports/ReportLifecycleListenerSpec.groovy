package au.org.ala.merit.reports

import au.org.ala.ecodata.forms.ActivityFormService
import groovy.json.JsonSlurper
import spock.lang.Specification

class ReportLifecycleListenerSpec extends Specification {

    ReportLifecycleListener reportData = new ReportLifecycleListener()
    ActivityFormService activityFormService = Mock(ActivityFormService)

    def setup() {
        reportData.activityFormService = activityFormService
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
        entities == [[entityType:"au.org.ala.ecodata.DataSetSummary", entityIds:["e4e3f304-5ee7-458b-ad7e-0e3ee0cbb202", "0d2d2b6c-50ce-46f8-a8f0-5f9238d84120", "144ca417-43a8-4eab-94c3-f857263bbc06"]]]
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
