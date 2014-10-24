package au.org.ala.fieldcapture

import geb.spock.GebReportingSpec
import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
public class ProjectIndexSpec extends GebReportingSpec {

    def "check A test project"() {
        given: "go to project index page"
        to ProjectIndex, "cb5497a9-0f36-4fef-9f6a-9ea832c5b68c"

        expect:
        at ProjectIndex

        and:
        projectName.text() == 'A test project'
        overview.associatedProgram.text() == 'None'


    }

}

