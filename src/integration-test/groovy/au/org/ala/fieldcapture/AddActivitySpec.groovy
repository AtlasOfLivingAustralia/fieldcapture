package au.org.ala.fieldcapture

import pages.AddActivityPage
import pages.AdminTools
import pages.EditActivityPage
import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
class AddActivitySpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset1')
    }

    def cleanupSpec() {
        logout(browser)
    }

    def projectId = "activityProject"

    def "Clear the cache to ensure activity forms are loaded"() {
        setup:
        loginAsAlaAdmin(browser)

        when:
        to AdminTools

        waitFor {$("#btnClearMetadataCache").displayed}
        $("#btnClearMetadataCache").click()

        then:
        waitFor {hasBeenReloaded()}
    }

    def "Generate a Activities"(){

        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, projectId

        then:
        waitFor{at ProjectIndex}
        adminTab.click()
        waitFor {admin.displayed}


        when:
        admin.projectSettingsTab.click()
        waitFor {
            admin.projectSettings.displayed
        }
        admin.projectSettings.regenerateReports()
        waitFor {
            hasBeenReloaded()
        }
        waitFor 10, {admin.projectSettings.displayed}

        then:
        activitiesTab.click()
        waitFor 10,{plansAndReports.displayed}

        and:
        plansAndReports.size() == 1
    }

    def "Edit Activity Forms and timing out issue"() {
        setup: "log in as userId=1 who is an editor for this project"
        loginAsUser('1', browser)

        when:
        to ProjectIndex, projectId
        activitiesTab.click()
        waitFor 10,{plansAndReports.displayed}

        $(".icon-link")[0].click()

        then:
        waitFor { at EditActivityPage }

        when: "Make an edit after the session times out and attempt to save"
        activityDetails.description = "Checking the local storage"

        simulateTimeout(browser)
        submit()


        then: "The save will fail an a dialog is displayed to explain the situation"
        waitFor 20, { timeoutModal.displayed }

        Thread.sleep(1500) // Wait  for the  modal animation to finish.

        when: "Click the re-login link and log back in"
        timeoutModal.loginLink.click()
        // Our stubs are automatically logging us in here.

        then:
        waitFor 20, {
            hasBeenReloaded()
        }
        at EditActivityPage

        and: "A dialog is displayed to say there are unsaved edits"
        waitFor {unsavedEdits.displayed}

        when:
        okBootbox()

        then: "the unsaved edits are present"
        activityDetails.description == "Checking the local storage"

        when:
        submit()

        then:
        waitFor {at ProjectIndex}
        activitiesTab.click()
        waitFor 10,{plansAndReports.displayed}
        plansAndReports.activities[0].description == "Checking the local storage"
    }


    def "No permission to add an activity"() {

        // This user has no permissions on the project
        logout(browser)
        loginAsUser('3', browser)
        when: "go to new activity page"
        via AddActivityPage, projectId:projectId

        then:
        at ProjectIndex
    }

    def "Add an activity"() {

        logout(browser)
        loginAsUser('2', browser)

        when: "go to new activity page"

        to AddActivityPage, projectId:projectId, returnTo: 'project'

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
        activitiesTab.click()

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
        waitFor 100, {at ProjectIndex}

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
        okBootbox()

        then: "the activity is no longer available on the page"
        waitFor 20, {
            hasBeenReloaded()
        }

        waitFor {

            plansAndReports.activities.size() == 1 && plansAndReports.activities.find { it.description == 'Test activity [edited]' } == null
        }
    }


}

