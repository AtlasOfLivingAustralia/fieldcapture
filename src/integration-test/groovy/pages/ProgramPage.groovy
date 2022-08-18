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
        grantId.find('a').click()
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
        // .text() has started returning an empty string, trying to make sure it's in the viewport before
        // calling .text()
        interact {
            moveToElement(programBlogSection())
        }
        def project = waitFor 60, {
            projectRows.find{it.grantIdLink.text() == grantId}
        }
        project.openProject()
    }
}

