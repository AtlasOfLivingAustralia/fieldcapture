package au.org.ala.fieldcapture

import geb.module.FormElement
import pages.DatasetPage
import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class DatasetSpec extends StubbedCasSpec{

    def setupSpec(){
        useDataSet("dataset3")
    }

    def cleanupSpec() {
        logout(browser)
    }


    def "Add new data set in to project"() {
        setup:
        String projectId = 'fdFundProject'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        openDataSetSummaryTab()
        datasetDetails.addNewDataset.click()

        then:
        at DatasetPage

        when:
        def dataSet = datasetContent
        dataSet.title = "Title"
        dataSet.programOutcome = "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        dataSet.investmentPriorities = ["Soil acidification"]
        dataSet.type = "Baseline dataset associated with a project outcome"
        dataSet.protocol = "other"

        then:
        waitFor {dataSet.measurementTypes.module(FormElement).enabled}

        when:
        dataSet.measurementTypes = ["Soil erosion"]
        dataSet.methods = ["Genetic sampling", "Area sampling"]
        dataSet.methodDescription = "Method description"
        dataSet.collectionApp = "Collection App"
        dataSet.location = "Location"
        dataSet.startDate ="21-01-2021"
        dataSet.endDate ="21-01-2022"
        dataSet.addition = "Yes"
        dataSet.threatenedSpeciesIndex = "Yes"
        dataSet.publicationUrl = "url"
        dataSet.format = "JSON"
        dataSet.sensitivities =["Commercially sensitive", "Ecologically sensitive"]

        dataSet.createButton.click()

        then:
        waitFor  { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-eye").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "started"

        when:
        $("#project-data-sets .fa-eye").click()

        then: "user can view the data set details"
        at DatasetPage
        assert title == "View | Data Set Summary | MERIT"

        and:
        def dset = datasetContent
        dset.titleText.text() == "Title"
        dset.programOutcomeText.text() == "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."

        when:
        cancel()

        then: "The data set summary is displayed"
        waitFor { at RlpProjectPage }

        then:
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-edit").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "started"

        when:
        $("#project-data-sets .fa-edit").click()

        then:
        at DatasetPage
        def set = datasetContent
        set.title == "Title"
        set.programOutcome == "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        set.investmentPriorities == ["Soil acidification"]
        set.protocol == "other"
        set.type == "Baseline dataset associated with a project outcome"
        set.measurementTypes == ["Soil erosion"]
        set.methods == ["Area sampling", "Genetic sampling"]
        set.methodDescription == "Method description"
        set.collectionApp == "Collection App"
        set.location == "Location"
        set.startDate =="21-01-2021"
        set.endDate =="21-01-2022"
        set.addition == "Yes"
        set.threatenedSpeciesIndex == "Yes"
        set.format == "JSON"
        set.sensitivities ==["Commercially sensitive", "Ecologically sensitive"]
        !set.dataCollectionOngoing.checked


        when:
        cancel()

        then: "The data set summary is displayed"
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-remove").displayed}

        when: "Delete the data set"
        $("#project-data-sets .fa-remove").click()
        okBootbox()

        then: "The data set is removed"
        waitFor 10, {
            hasBeenReloaded()
        }
        when:
        def dataSetSummary = openDataSetSummaryTab()

        then:
        waitFor 10, {
           dataSetSummary.dataSetSummaryCount() == 0
        }

    }

    def "Test partial and completed data summary"() {
        setup:
        String projectId = 'fdFundProject'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        openDataSetSummaryTab()
        datasetDetails.addNewDataset.click()

        then:
        at DatasetPage

        when:
        def dataSet = datasetContent
        dataSet.title = "Title"

        dataSet.createButton.click()

        then:
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-edit").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "started"

        when:
        $("#project-data-sets .fa-edit").click()

        then:
        at DatasetPage

        def set = datasetContent
        set.title == "Title"
        !set.dataCollectionOngoing.checked

        when:
        set.markCompleted.click()
        set.createButton.click()

        then:
        waitFor {
            $('.programOutcomeformError.parentFormedit-data-set.formError').displayed
        }

        when:
        set.title = "Title"
        set.programOutcome = "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        set.investmentPriorities = ["Soil acidification"]
        set.type = "Baseline dataset associated with a project outcome"
        set.baselines = ['b1']
        set.protocol = 'guid-1'
        set.collectionApp = "Collection App"
        set.location = "Location"
        set.startDate ="21-01-2021"
        set.endDate ="21-01-2022"
        set.addition = "Yes"
        set.threatenedSpeciesIndex = "Yes"
        set.format = "JSON"
        set.sensitivities =["Commercially sensitive", "Ecologically sensitive"]
        set.threatenedSpeciesDateOfUpload = '21-01-2021'
        set.dataSetSize = '200'
        set.publicationUrl = "https://www.ala.org.au"

        set.createButton.click()

        then:
        waitFor {
            // This test is failing sometimes on actions due to what seems to be a validation error - trying to track it down.
            println js.exec("return \$('div.formError')")
            println js.exec("return \$('div.formError').next()")?.collect{[it.getAttribute('name'), it.getAttribute('id'), it.getAttribute('data-bind'), it.value()]}

            at RlpProjectPage
        }
        waitFor {$("#project-data-sets .fa-edit").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "finished"

    }

    /** Note that this test relies on the data set summary inserted in the previous test, as per the @Stepwise annotation */
    def "This is a regression test for issue 2299 - MERI plan updates can clear data set summaries"() {
        setup: "We need to be a merit administrator for this test as it involves updating the project settings"
        String projectId = 'fdFundProject'
        loginAsMeritAdmin(browser)

        when: "We open the project and navigate to the Data Set Summary tab"
        to RlpProjectPage, projectId
        openDataSetSummaryTab()

        then: "We have a single data set summary displayed in the table"
        datasetDetails.dataSetSummaryCount() == 1

        when: "We update and save the MERI plan"
        openMERIPlanTab()
        def meriPlan = openMeriPlanEditTab()
        meriPlan.aquireEditLock()
        waitFor {
            hasBeenReloaded()
        }
        at RlpProjectPage // reset at check time.

        meriPlan = openMeriPlanEditTab()
        meriPlan.save()

        and: "We reload the page and reopen the data set summary tab"
        to RlpProjectPage, projectId
        openDataSetSummaryTab()

        then: "We still have a single data set summary displayed in the table"
        datasetDetails.dataSetSummaryCount() == 1

        when: "We update the project settings"
        openAdminTab()
        adminContent.openProjectSettings()
        adminContent.projectSettings.saveChanges()

        and: "We reload the page and reopen the data set summary tab"
        waitFor {hasBeenReloaded()}
        openDataSetSummaryTab()

        then: "We still have a single data set summary displayed in the table"
        datasetDetails.dataSetSummaryCount() == 1


    }

}
