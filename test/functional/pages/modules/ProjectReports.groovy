package pages.modules

import geb.Module

class ProjectReports extends Module {

    static content = {
        reports { $('#reporting-content tbody tr').moduleList(ReportSummaryLine) }
    }

}
