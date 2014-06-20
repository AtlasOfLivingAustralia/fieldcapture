package au.org.ala.fieldcapture

import geb.spock.GebReportingSpec
import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
public class ProjectIndexSpec extends GebReportingSpec {

    def "check Peter Brenton Test Project 2"() {
        given:
        to ProjectIndex, "325f4a71-fa22-46b3-a315-2371f61f6740"

        expect:
        at ProjectIndex

        and:
        projectName.text() == 'P Brenton test project 2'
        overview.associatedProgram.text() == 'Biodiversity Fund'


    }

}

