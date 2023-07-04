package au.org.ala.merit.command

import au.org.ala.merit.ReportService

class EditManagementUnitReportCommand extends ManagementUnitReportCommand {

    @Override
    ReportService.ReportMode getMode() {
        return ReportService.ReportMode.EDIT
    }
}
