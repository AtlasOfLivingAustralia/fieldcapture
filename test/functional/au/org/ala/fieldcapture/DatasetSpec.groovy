package au.org.ala.fieldcapture

import pages.RlpProjectPage

class DatasetSpec extends StubbedCasSpec{

    def setup(){
        useDataSet("dataset3")
    }

    def cleanup() {
        logout(browser)
    }

    def "Add new data set in to project"() {
        setup:
        String projectId = 'fdFundProject'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        datasetTab.click()
        waitFor {
            datasetDetails.displayed
            datasetDetails.statusColumn.displayed
        }
        datasetDetails.addNewDataset.click()
        waitFor{datasetDetails.datasetContent.displayed}
        def dataSet = datasetDetails.datasetContent
        dataSet.title = "Title"
        dataSet.programOutcome = "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        dataSet.investmentPriorities = ["Soil acidification", "Other"]
        dataSet.otherInvestmentPriority = "Other Priority"
        dataSet.term = "Short-term outcome statement"
        dataSet.type = "Baseline dataset associated with a project outcome"
        dataSet.measurementTypes = ["Soil erosion"]
        dataSet.methods = ["Genetic sampling", "Area sampling"]
        dataSet.methodDescription = "Method description"
        dataSet.collectionApp = "Collection App"
        dataSet.location = "Location"
        dataSet.startDate ="21-01-2021"
        dataSet.endDate ="21-01-2022"
        dataSet.addition = "Yes"
        dataSet.collectorType = "University researcher"
        dataSet.qa = "Yes"
        dataSet.published = "Yes"
        dataSet.storageType = "Aurion"
        dataSet.publicationUrl = "url"
        dataSet.format = "JSON"
        dataSet.sensitivities =["Commercially sensitive", "Ecologically sensitive"]
        dataSet.dataOwner = "data owner"
        dataSet.custodian = "custodian"

        dataSet.createButton.click()

        then:
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-edit").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "started"
        $("#project-data-sets .fa-edit").click()

        def set = datasetDetails.datasetContent
        set.title == "Title"
        set.programOutcome == "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        set.investmentPriorities == ["Soil acidification", "Other"]
        set.otherInvestmentPriority == "Other Priority"
        set.term == "Short-term outcome statement"
        set.type == "Baseline dataset associated with a project outcome"
        set.measurementTypes == ["Soil erosion"]
        set.methods == ["Genetic sampling", "Area sampling"]
        set.methodDescription == "Method description"
        set.collectionApp == "Collection App"
        set.location == "Location"
        set.startDate =="21-01-2021"
        set.endDate =="21-01-2022"
        set.addition == "Yes"
        set.collectorType == "University researcher"
        set.qa == "Yes"
        set.published == "Yes"
        set.storageType == "Aurion"
        set.publicationUrl == "url"
        set.format == "JSON"
        set.sensitivities ==["Commercially sensitive", "Ecologically sensitive"]
        set.dataOwner == "data owner"
        set.custodian == "custodian"
        set.dataCollectionOngoing.size() == 1
        set.dataCollectionOngoingChecked.size() == 0

        when:
        datasetDetails.cancel()

        then: "The data set summary is displayed"
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-remove").displayed}

        when: "Delete the data set"
        $("#project-data-sets .fa-remove").click()
        waitFor{ $('.bootbox a.btn-primary').displayed }
        Thread.sleep(1000) // Wait for the animation to finish
        $('.bootbox a.btn-primary').click()

        then: "The data set is removed"
        waitFor 10, {
            hasBeenReloaded()
        }
        waitFor 10, {
           $('#project-data-sets tbody[data-bind*=dataSets] tr').size() == 0
        }

    }

    def "Test partial and completed data summary"() {
        setup:
        String projectId = 'fdFundProject'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        datasetTab.click()
        waitFor {
            datasetDetails.displayed
            datasetDetails.statusColumn.displayed
        }
        datasetDetails.addNewDataset.click()
        waitFor{datasetDetails.datasetContent.displayed}
        def dataSet = datasetDetails.datasetContent
        dataSet.title = "Title"

        dataSet.createButton.click()

        then:
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-edit").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "started"
        $("#project-data-sets .fa-edit").click()

        def set = datasetDetails.datasetContent
        set.title == "Title"
        set.dataCollectionOngoing.size() == 1
        set.dataCollectionOngoingChecked.size() == 0

        set.markCompleted.click()
        set.createButton.click()

        then:
        waitFor {
            $('.programOutcomeformError.parentFormedit-data-set.formError').displayed
        }

        when:
        set.title = "Title"
        set.programOutcome = "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        set.investmentPriorities = ["Soil acidification", "Other"]
        set.otherInvestmentPriority = "Other Priority"
        set.type = "Baseline dataset associated with a project outcome"
        set.measurementTypes = ["Soil erosion"]
        set.methods = ["Genetic sampling", "Area sampling"]
        set.methodDescription = "Method description"
        set.collectionApp = "Collection App"
        set.location = "Location"
        set.startDate ="21-01-2021"
        set.endDate ="21-01-2022"
        set.addition = "Yes"
        set.collectorType = "University researcher"
        set.qa = "Yes"
        set.published = "Yes"
        set.storageType = "Aurion"
        set.publicationUrl = "url"
        set.format = "JSON"
        set.sensitivities =["Commercially sensitive", "Ecologically sensitive"]
        set.dataOwner = "data owner"
        set.custodian = "custodian"

        set.createButton.click()

        then:
        waitFor { at RlpProjectPage }
        waitFor {$("#project-data-sets .fa-edit").displayed}
        $('[data-bind*="text: progress"]').displayed
        $('[data-bind*="text: progress"]').text() == "finished"

    }
}
