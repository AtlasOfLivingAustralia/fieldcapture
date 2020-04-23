package pages

import geb.Page
import pages.modules.OrganisationAdminTab

class Organisation extends Page{
    static url = 'organisation/index/test_organisation'

    static at = { waitFor {name.text() !=null}}

    static content = {
        name {$('h2')}
        aboutTab{$('a#about-tab',0)}
        adminTab{$('a#admin-tab')}
        adminTabContent { module OrganisationAdminTab }
    }

    void edit() {
        adminTab.click()
        waitFor { adminTabContent.displayed }
        waitFor { adminTabContent.editButton.displayed }
        adminTabContent.editButton.click()
    }

}
class EditOrganisation extends Page{
    static url = 'organisation/edit' // requires a program id parameter

    static at = { title.startsWith('Edit | Test Organisation | Field Capture')}

    static content = {
        details { module AddOrEditOrganisation }
    }
}
