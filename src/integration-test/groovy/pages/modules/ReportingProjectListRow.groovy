package pages.modules

import geb.Module

class ReportingProjectListRow extends Module {
    static content = {
        projectId { $('.projectId a').text() }
        name { $('.name').text() }
        status { $('.statusCol').text() }
    }

}
