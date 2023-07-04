package au.org.ala.merit.command

import au.org.ala.merit.ReportService

class EditOrganisationReportCommand extends OrganisationReportCommand {

    @Override
    ReportService.ReportMode getMode() {
        return ReportService.ReportMode.EDIT
    }
}
