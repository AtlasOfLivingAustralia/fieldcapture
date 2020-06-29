package au.org.ala.fieldcapture

import pages.AdminTools
import pages.HomePage
import pages.ProjectExplorer

class HomeIndexPageSpec extends StubbedCasSpec {

    def setup (){
        useDataSet("data_static_score")
    }
    def cleanup() {
        logout(browser)
    }

    def "Display total number of projects and scores Ha in the homepage"(){

        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to AdminTools

        then:
        at AdminTools

        when: "Reindex to ensure the project explorer will have predictable data"
        reindex()
        logout(browser)

        boolean empty = true
        while (empty) {
            to ProjectExplorer
            empty = emptyIndex()
        }

        then:
       to HomePage

        and:
        box1[0].statTitle.text() == "THREATENED SPECIES STRATEGY"
        box1[0].statValue.text() =="3"
        box1[0].statUnit.text() =="Projects"
        box1[0].statLabel.text() =="PROTECTING THREATENED SPECIES"
        box2[0].statTitle.text() == "NATIONAL LANDCARE PROGRAMME"
        box2[0].statValue.text() =="3"
        box2[0].statUnit.text() =="Projects"
        box2[0].statLabel.text() =="SUPPORTING SUSTAINABLE AGRICULTURE"
        box3[0].statTitle.text() == "NATIONAL LANDCARE PROGRAMME"
        box3[0].statValue.text() =="3"
        box3[0].statUnit.text() =="Projects"
        box3[0].statLabel.text() =="THAT SUPPORT WORLD HERITAGE AREAS"
        box4[0].statTitle.text() == "NATIONAL LANDCARE PROGRAMME"
        box4[0].statValue.text() =="10"
        box4[0].statUnit.text() =="Ha"
        box4[0].statLabel.text() =="TARGETED FOR WEED CONTROL"
        box5[0].statTitle.text() == "NATIONAL LANDCARE PROGRAMME"
        box5[0].statValue.text() =="1,800"
        box5[0].statUnit.text() =="Ha"
        box5[0].statLabel.text() =="TARGETED FOR PEST ANIMAL CONTROL"
        box6[0].statTitle.text() == "ALL PROGRAMMES"
        box6[0].statValue.text() =="30"
        box6[0].statUnit.text() =="Ha"
        box6[0].statLabel.text() =="MANAGED FOR INVASIVE WEEDS"
    }
}
