package au.org.ala.fieldcapture

import pages.ManageInvestmentPriorities

class InvestmentPrioritySpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def "The Manage Investment Priorities page displays the current list of investment priorities correctly"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ManageInvestmentPriorities
        List visibleInvestmentPriorities = investmentPriorityRows

        then:
        getInvestmentPrioritiesCount() == 22
        visibleInvestmentPriorities.size() == 10

        visibleInvestmentPriorities*.name == [
                'Ginini Flats Wetland Complex',
                "White Box-Yellow Box-Blakely's Red Gum Grassy Woodland and Derived Native Grassland",
                "Soil acidification",
                "Soil Carbon priority",
                "Hillslope erosion priority",
                "Wind erosion priority",
                "Soil carbon",
                "Hillslope erosion",
                "Wind erosion",
                "Native vegetation and biodiversity on-farm"
        ]

        when:
        search("Soil", 5)

        then:
        getInvestmentPrioritiesCount() == 5
        investmentPriorityRows*.name == [
                "Soil acidification",
                "Soil Carbon priority",
                "Hillslope erosion priority",
                "Wind erosion priority",
                "Soil carbon" ]

    }

    def "A new investment priority can be added, but only if a search returns 0 results"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ManageInvestmentPriorities

        then: "The add investment priority button is not visible"
        !addInvestmentPriorityButton.displayed

        when:
        investmentPrioritiesTable.search("New Investment Priority", 0)

        then: "The add investment priority button is visible"
        addInvestmentPriorityButton.displayed

        when: "The button is pressed and we complete a dialog is displayed and pre-populated with the search term"
        addNewInvestmentPriority()

        then:
        addOrEditInvestmentPriority.name == "New Investment Priority"

        when:
        addOrEditInvestmentPriority.type = "species"
        addOrEditInvestmentPriority.categories = ["Threatened Species"]
        addOrEditInvestmentPriority.managementUnits = ["Test management unit"]
        addOrEditInvestmentPriority.save()

        then:
        waitFor{hasBeenReloaded()}

        when:
        investmentPrioritiesTable.search("New Investment Priority", 1)

        then:
        getInvestmentPrioritiesCount() == 1
        investmentPriorityRows[0].name == "New Investment Priority"
        investmentPriorityRows[0].type == "species"
        investmentPriorityRows[0].categories == "Threatened Species"
        investmentPriorityRows[0].managementUnits == "Test management unit"
    }
}
