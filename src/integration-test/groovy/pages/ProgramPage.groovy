package pages

import geb.Module
import geb.Page
import groovy.util.logging.Slf4j
import pages.modules.ProgramAdminTab
import pages.modules.subProgramContent

class ProjectRow extends Module {
    static content = {
        grantId { $('td.grantId') }
        grantIdLink { $('td.grantId a') }
        name { $('td.projectName') }
        description { $('td.description') }
        startDate { $('td.startDate') }
        endDate { $('td.endDate') }
    }

    def openProject() {

        // Chrome in the CI environment suddenly decided the data in the table was not displayed, even
        // after scrolling, so this is a workaround.
        if (grantIdLink.displayed) {
            grantIdLink.click()
        }
        else {
            println("WARNING: Grant id link not clickable")
            browser.go(grantIdLink.attr('href'))
        }
    }
}

class ProgramPage extends Page {

    static url = 'program/index'

    static at = {
        $('.program-view').displayed
    }

    static content= {
        name {$('h2')}
        grantIdsTable{$('td.grantId')}
        projectNameTable{$('td.projectName')}
        muInStatesTable{$('div[id^=state-mu-] li a')}
        showAllStatesMuButton {$('#showAllStatesMu')}
        overviewTab{$('a#about-tab',0)}
        adminTab { $('a#admin-tab') }
        adminTabContent { module ProgramAdminTab }
        visitUs {$('#weburl span')}
        description {$('.row .col-md-4 span[data-bind*="html:description"] p')}
        subProgramTabContent(required:false) {$("div#subProgramWrapper").moduleList(subProgramContent)}
        projectRows(required:false) { $('#projectOverviewList tbody tr').moduleList(ProjectRow) }
        projectTable { $('#projectOverviewList')}
        programBlogSection(required: false) { $('div.program-blog') }
    }

    List grantIds() {
        grantIdsTable.collect{it.text()}
    }

    List projectNames() {
        projectNameTable.collect{it.text()}
    }

    List muInStates(){
        muInStatesTable.collect{it.text()}
    }

    void edit() {
        adminTab.click()
        waitFor { adminTabContent.displayed }
        adminTabContent.editTab.click()
        waitFor { adminTabContent.editButton.displayed}
        adminTabContent.editButton.click()
    }

    void addSubProgram() {
        adminTab.click()
        waitFor { adminTabContent.displayed }
        adminTabContent.editTab.click()
        waitFor { adminTabContent.addSubProgramButton.displayed }
        adminTabContent. addSubProgramButton.click()
    }

    /** Clicks the grant id link in the project table */
    void openProjectByGrantId(String grantId) {
        def project = waitFor 60, {
            // .text() is returning an empty string so we've switched to 'textContent"
            projectRows.find{it.grantIdLink.attr('textContent') == grantId}
        }
        project.openProject()
    }
}

