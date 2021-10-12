package pages

import geb.Module
import geb.Page
import pages.modules.ProjectSiteModules

class CreateSitesForProjects extends Page {
    static url = "site/createForProject"
    static at = { title.startsWith("New | Sites | Field Capture") }

    static content = {
        site {module ProjectSiteModules }
    }
}
//class sitesModules extends Module{
//    static content = {
//        name{$('#name')}
//        externalId{$("#externalId")}
//        type{$("#siteType")}
//        context{$("#siteContext")}
//        description{$("#description")}
//        notes{$("#notes")}
//        defineExtent{$("#extentSource")}
//        chooseLayer{$("#chooseLayer")}
//        chooseShape {$("#chooseShape")}
//        saveButton{$("#save")}
//        cancel{$("#cancel")}
//    }
//
//    def save() {
//        saveButton.click()
//    }
//}
