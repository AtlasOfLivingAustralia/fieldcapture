package au.org.ala.merit.command

import au.org.ala.merit.ReportService

class PrintProgramReportCommand extends OrganisationReportCommand {

    @Override
    ReportService.ReportMode getMode() {
        return ReportService.ReportMode.PRINT
    }
}
