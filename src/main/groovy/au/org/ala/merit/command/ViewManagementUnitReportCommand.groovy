package au.org.ala.merit.command

import au.org.ala.merit.ReportService

class ViewManagementUnitReportCommand extends ManagementUnitReportCommand {

    @Override
    ReportService.ReportMode getMode() {
        return ReportService.ReportMode.VIEW
    }
}
