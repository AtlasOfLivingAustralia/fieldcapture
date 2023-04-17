package au.org.ala.merit.command

import au.org.ala.merit.OrganisationService

class OrganisationReportCommand extends EditOrViewReportCommand {

    OrganisationService organisationService

    String getEntityType() {
        'organisation'
    }

    Map getEntity() {
        organisationService.get(id)
    }

}
