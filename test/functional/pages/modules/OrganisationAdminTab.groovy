package pages.modules

import geb.Module

class OrganisationAdminTab extends Module{

    static content = {
        editButton{$('[data-bind="click:editOrganisation"]')}
       deleteButton{ $('[data-bind="click:deleteOrganisation"]')}

    }
}
