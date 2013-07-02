import geb.Browser
import geb.spock.GebReportingSpec
import pages.AddProjectPage
import pages.EntryPage
import spock.lang.Stepwise

@Stepwise
public class ProjectCRUDSpec extends GebReportingSpec {

    def setupSpec() {
        Browser.drive {
            //go "http://${baseUrl}/ecodata/admin/load?drop=true"
        }
    }

    def "add a project"() {
        given:
        to AddProjectPage

        expect:
        at AddProjectPage
    }

    def "enter project details"() {
        when:
        projectDetails.projectName = "New Project"
        submit()
        then:
        // We have to wait because the the submit is actually done via AJAX and the result is used to
        // change the page via javascript.
        waitFor 10, {at EntryPage}
    }


}

