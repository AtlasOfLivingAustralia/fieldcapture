package pages

import geb.Page


class ManagementUnitPage extends Page {

    static url = 'managementUnit/index/test_mu'

    static at = { waitFor {name.text() != null } }

    static content = {
        name {$('div#managementUnitName h2')}
        grantIdsTable{$('td.grantId')}
        gotoProgramLinks{$('a.gotoProgram')}
    }

    List grantIds() {
        grantIdsTable.collect{it.text()}
    }

    List gotoProgram(){
        gotoProgramLinks.collect{it}
    }

}
