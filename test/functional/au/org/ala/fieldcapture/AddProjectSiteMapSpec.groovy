///*
//package au.org.ala.fieldcapture
//
//import pages.ProjectIndex
//
//class AddProjectSiteMapSpec extends StubbedCasSpec {
//    def projectId = 'project_10'
//
//    void setup() {
//        useDataSet('data_static_score')
//    }
//
//    void cleanup() {
//        logout(browser)
//    }
//    // Adding site when there no sites associate with projects
//    def"I can Add Sites in the projects as FC_ADMIN "() {
//        setup:
//        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)
//
//        when:
//        to ProjectIndex, projectId
//
//        then:
//        at ProjectIndex
//
//        and:
//        waitFor {sitesTab.displayed}
//        then:
//        sitesTab.click()
//
//        and:
//        waitFor {sites.displayed}
//
//        when:
//        sites.firstSiteAdded.click()
//
//        then:
//        waitFor {addSites.displayed}
//
//        when:
//        addSites.name = "Adding another map"
//
//        waitFor {$("select", name:"extentSource").displayed}
//        $("select", name:"extentSource").value("pid")
//        waitFor {$("select", name:"chooseLayer").displayed}
//        $("select", name:"chooseLayer").value("cl22")
//        waitFor { $("select", name:"chooseShape").click()}
//        $("select")[4].find("option").find {it.text() == "Tasmania"}
//
////        addSites.chooseShape.click()
////        addSites.chooseShape.find("option").find {it.value() == "3742610"}
//
//        $("button", id:"save").click()
//
//       // addSites.save()
//
//
//        waitFor (10000) {
//            hasBeenReloaded()
//        }
//
//        then:
//        waitFor{sitesTab.displayed}
//        sitesTab.click()
//     //   waitFor(20) {sites.displayed}
//
//
//        and:
//        waitFor(50000) {sites.displayed}
//        waitFor{sites.siteName.displayed}
//        sites.siteName.text() == "Adding another map"
////        waitFor{sites.lastupdated.displayed}
////        sites.lastupdated.text() =="07-07-2020"
//    }
//
//}
//*/
