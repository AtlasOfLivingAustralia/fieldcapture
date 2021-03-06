package pages

import geb.Page
import pages.modules.ProgramAdminTab
import pages.modules.subProgramContent

class ProgramPage extends Page {

    static url = 'program/index'

    static at = { waitFor {name.text() != null } }

    static content = {
        name {$('h2')}
        description {$('span[data-bind*=description]')}

    }

}

class RLPProgramPage extends Page{

    static url = 'rlp/index/test_program'

    static at = { waitFor {name.text() !=null}}

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
}

class RLPEditPageWithNoParent extends Page{
    static url = 'rlp/index/test_programId'

    static at = { waitFor {name.text() !=null}}

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

    }

    void edit() {
        adminTab.click()
        waitFor { adminTabContent.displayed }
        adminTabContent.editTab.click()
        waitFor { adminTabContent.editButton.displayed}
        adminTabContent.editButton.click()
    }

}
