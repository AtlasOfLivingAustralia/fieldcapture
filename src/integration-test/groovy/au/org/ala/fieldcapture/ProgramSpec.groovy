package au.org.ala.fieldcapture

import pages.ProgramPage

class ProgramSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "As a user, I can view a RLP program "() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ProgramPage

        and:
        //force to overview tab
        overviewTab().click()
        //MUST show hidden div first, otherwise WebBrowser selector cannot find hidden elements
        interact {
            moveToElement(showAllStatesMuButton.first())
            showAllStatesMuButton.click()
        }


        then:
        waitFor(10d,{at ProgramPage})

        when:
        interact {
            moveToElement(grantIdsTable.last())
        }
        then:

        projectNames().size() == 3
        //grantIds().containsAll(['RLP-Test-Program-Project-1','RLP-Test-Program-Project-2','RLP-Test-Program-Project-3'])
        grantIds().size()==3
        //muInStates().containsAll(['test mu', 'test mu 2'])
    }

}
