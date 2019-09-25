package pages

import geb.Page


class ManagementUnitPage extends Page {

    static url = 'managementUnit/index/test_mu'

    static at = { waitFor {name.text() != null } }

    static content = {
        name {$('div#managementUnitName h2')}
        grantIdsTable{$('td.grantId')}
        projectLinksTd{$('td.grantId a')}
        gotoProgramLinks{$('a.gotoProgram')}
    }

    List grantIds() {
        grantIdsTable.collect{it.text()}
    }

    List projectLinks(){
        projectLinksTd.collect{it.attr('href')}
    }

    List gotoProgram(){
        gotoProgramLinks.collect{it}
    }

}
