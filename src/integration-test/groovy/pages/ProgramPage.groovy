package pages

import geb.Module
import geb.Page
import pages.modules.ProgramAdminTab
import pages.modules.subProgramContent

class ProjectRow extends Module {
    static content = {
        grantId { $('td.grantId') }
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

    static at = { $('.program-view').displayed }

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
            projectRows.find{ it.grantId.text() == grantId}
        }
        project.openProject()
    }
}

