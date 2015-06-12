package au.org.ala.fieldcapture

import pages.AddActivityPage
import pages.EditActivityPage
import pages.ProjectIndex
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
public class AddActivitySpec extends FieldcaptureFunctionalTest {


    @Shared def testConfig
    def setupSpec() {
        def filePath = new File('grails-app/conf/Config.groovy').toURI().toURL()
        testConfig = new ConfigSlurper(System.properties.get('grails.env')).parse(filePath)

        useDataSet('data-set-1')
    }

    def projectId = "cb5497a9-0f36-4fef-9f6a-9ea832c5b68c"

    def "No permission to add an activity"() {

        logout(browser)
        login(browser, "fc-te@outlook.com", "testing!")

        when: "go to new activity page"
        via AddActivityPage, projectId:projectId

        then:
        at ProjectIndex
    }

    def "Add an activity"() {

        logout(browser)
        login(browser,  testConfig.test.user.admin.email , testConfig.test.user.admin.password)

        def returnToUrl = getConfig().baseUrl+ProjectIndex.url+'/'+projectId

        when: "go to new activity page"

        to AddActivityPage, projectId:projectId, returnTo: returnToUrl

        activityDetails.type = 'Revegetation'
        activityDetails.description = 'Test activity'
        setDate(activityDetails.plannedStartDate,'01/01/2015')
        setDate(activityDetails.plannedEndDate,'30/06/2015')
        submit()

        then:
        waitFor 10, {at ProjectIndex}

    }

    def "the new activity is displayed on the project index page"() {
        when: "find the new activity on the project page"
        to ProjectIndex, projectId
        plansAndReportsTab.click()

        def activities = plansAndReports.activities
        def activity = activities.find {
            it.description == 'Test activity'
        }

        then:
        activity.type == 'Revegetation'
        activity.fromDate == '01-01-2015'
        activity.toDate == '30-06-2015'
        activity.site == ''

    }

    def "view the new activity"() {
        when:
        def activities = plansAndReports.activities
        def activity = activities.find {
            it.description == 'Test activity'
        }
        activity.actionEdit.click()

        then:
        at EditActivityPage
        activityDetails.type == 'Revegetation'
        activityDetails.description == 'Test activity'
        activityDetails.plannedStartDate == '01-01-2015'
        activityDetails.plannedEndDate == '30-06-2015'
    }

    def "edit the new activity"() {
        when:
        activityDetails.type = 'Plant Propagation' // We should be allowed to edit the type because we haven't saved any data against the activity
        activityDetails.description = 'Test activity [edited]'
        setDate(activityDetails.plannedStartDate , '02-01-2015')
        setDate(activityDetails.plannedEndDate, '29-06-2015')
        submit()

        then:
        waitFor 10, {at ProjectIndex}

        def activities = plansAndReports.activities
        def activity = activities.find {
            println it.description
            it.description == 'Test activity [edited]'
        }
        activity.type == 'Plant Propagation'
        activity.fromDate == '02-01-2015'
        activity.toDate == '29-06-2015'
        activity.site == ''


    }

    def "delete the new activity"() {
        when:
        def activity = plansAndReports.activities.find {
            it.description == 'Test activity [edited]'
        }
        activity.actionDelete.click()
        waitFor 5, {iAmSure.click()} // this is animated so takes time to be clickable.

        then: "the activity is no longer available on the page"
        waitFor 10, {at ProjectIndex}

        plansAndReports.activities.size() == 0 || plansAndReports.activities.find { it.description == 'Test activity [edited]' } == null
    }
}

