package pages

import geb.Page

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

}
