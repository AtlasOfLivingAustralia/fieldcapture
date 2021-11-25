package au.org.ala.fieldcapture

import pages.RlpProjectPage

class OriginalMeriPlanSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }

    def "The MERI Plan objectives and assets can be manipulated and saved"() {

        setup:
        String projectId = 'grants_project'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId // Note we are using the RlpProjectPage here despite it being the original page template because it works and has the content we need

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        then:
        meriPlan != null

        when:
        meriPlan.objectivesAndAssets[0].outcome = "Objective 2"
        meriPlan.objectivesAndAssets[0].assets = ['Threatened Species'];
        meriPlan.objectivesAndAssets[1].outcome = "Objective 3"
        meriPlan.objectivesAndAssets[1].assets = ['Threatened Species'];

        meriPlan.save()

        then:
        waitFor 10, {
            meriPlan.objectivesAndAssets[0].outcome.value() == "Objective 2"
            meriPlan.objectivesAndAssets[0].assets.value() == ['Threatened Species'];
            meriPlan.objectivesAndAssets[1].outcome.value() == "Objective 3"
            meriPlan.objectivesAndAssets[1].assets.value() == ['Threatened Species'];
        }
    }

    def "The MERI Plan objectives remove and assets can be manipulated and saved"() {

        setup:
        String projectId = 'grants_project'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId // Note we are using the RlpProjectPage here despite it being the original page template because it works and has the content we need

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        then:
        meriPlan != null

        when:
        meriPlan.objectivesAndAssets[1].remove()
        meriPlan.save()

        then:
        waitFor {
            meriPlan.objectivesAndAssets.size() == 1
            meriPlan.objectivesAndAssets[0].outcome.value() == "Objective 2"
            meriPlan.objectivesAndAssets[0].assets.value() == ['Threatened Species'];
        }
    }
}
