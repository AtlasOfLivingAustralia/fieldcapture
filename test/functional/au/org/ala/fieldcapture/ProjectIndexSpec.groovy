package au.org.ala.fieldcapture

import geb.spock.GebReportingSpec
import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
public class ProjectIndexSpec extends GebReportingSpec {

    def projectId = "cb5497a9-0f36-4fef-9f6a-9ea832c5b68c"

    def "project information should be displayed correctly"() {
        given: "go to project index page"
        to ProjectIndex, projectId

        expect:
        at ProjectIndex

        and:
        projectName.text() == 'MERIT project 1'
        overview.associatedProgram.text() == 'Test'


    }

}

