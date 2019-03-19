package pages

import geb.Page

/**
 * Representation of the organisation list page.
 */
class OrganisationList extends Page {

    static url = "organisation/list"

    static at = { title == "Organisations | Field Capture"}

    static content = {
        search { $('#searchText') }
        newOrganisationButton { $('[data-bind*="click:addOrganisation"]') }
        searchByName { $('#searchByName') }
        searchByDescription { $('#searchByDescription') }
        searchByName { $('#searchCaseSensitive') }

        organisationLinks { $('#organisations a[data-bind*="visible:organisationId"]') }
    }
}
