package pages

import geb.Page

class MyProjects extends Page {

    static url = 'project/mine'

    static at = { title.startsWith("My Projects") }

    static content = {
        name {$('h2')}
        projectTable{$('#report')}
        organisations{$('.organisation-list')}
        managementUnits{$('.management-unit-list')}
        programs{$('.program-list')}
    }

    List projectNames() {
        projectTable.find('td span[data-bind*=name]').collect{it.text()}
    }
    List managementUnitNames() {
        managementUnits.find('li>a').collect{it.text()}
    }
    List programNames() {
        programs.find('li>a').collect{it.text()}
    }
}
