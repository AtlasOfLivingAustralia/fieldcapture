package au.org.ala.merit.reports

import au.org.ala.merit.ActivityService
import au.org.ala.merit.ProjectService
import spock.lang.Specification

class ReportDataSpec extends Specification {

    ReportData reportData = new ReportData()


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
        List result = ReportData.getValueFromPath('prop1.prop2.prop3.prop4', data)

        then:
        result == ['value1', 'value2', 'value3', 'value4']


    }


    def "Project data sets will be filtered to only finished data sets"() {

    }

}
