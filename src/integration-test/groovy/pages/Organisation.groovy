package pages

import geb.Page
import pages.modules.OrganisationAdminTab

class Organisation extends Page{
    static url = 'organisation/index'

    static at = { $('#organisationDetails').displayed }

    static content = {
        name {$('h2')}
        aboutTab{$('a#about-tab',0)}
        adminTab{$('a#admin-tab')}
        adminTabContent { module OrganisationAdminTab }
        orgName { $('.header-text') }
        orgDescription { $('span#orgDescription') }
        orgAbn {$('span#orgAbn')}
        projectTab {$("#projects-tab")}
        projectContent {$("#projectList tbody tr td")}
    }

    void edit() {
        waitFor {adminTab.displayed}
        adminTab.click()
        waitFor 10, { adminTabContent.displayed }
        waitFor 10, { adminTabContent.editButton.displayed }
        adminTabContent.editButton.click()
    }

}
class EditOrganisation extends Page{
    static url = 'organisation/edit' // requires a program id parameter

    static at = { title.startsWith('Edit')}

    static content = {
        details { module AddOrEditOrganisation }
    }
}
