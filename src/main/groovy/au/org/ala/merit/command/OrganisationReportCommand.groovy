package au.org.ala.merit.command

import au.org.ala.merit.OrganisationService

abstract class OrganisationReportCommand extends EditOrViewReportCommand {

    OrganisationService organisationService
    Map organisation

    String getEntityType() {
        'organisation'
    }

    Map getEntity() {
        if (!organisation) {
            organisation = organisationService.get(id)
        }
        organisation
    }

    String getHeaderTemplate() {
        '/organisation/organisationReportHeader'
    }
}
