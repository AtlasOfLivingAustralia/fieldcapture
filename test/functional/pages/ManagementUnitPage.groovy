package pages

import geb.Page


class ManagementUnitPage extends Page {

    static url = 'managementUnit/index/test_mu'

    static at = { waitFor {name.text() != null } }

    static content = {
        //name {$('h2')}
        name {$('#managementUnitName')}
        //description {$('span[data-bind*=description]')}
        grantIdsTable{$('td.grantId')}
    }

    List grantIds() {
        grantIdsTable.collect{it.text()}
    }

}
