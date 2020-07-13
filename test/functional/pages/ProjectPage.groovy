package pages

import geb.Module
import geb.Page
import pages.modules.SiteTabContent
import pages.modules.SitesTableContents

class ProjectPage extends Page {
    static url = "project/index/project_10"
    static at = { title.startsWith("General Projects | Project | Field Capture") }

    static content = {
        overviewTab {$("#overview-tab")}
        dashboardTab{$("#serviceDelivery-tab")}
        documentTab { $("#documents-tab")}
        meriPlanTab{ $("#details-tab")}
        siteTab {$("#site-tab")}

        siteTabContents{module SiteTabContent}
        tableContents { $("#sites-table tbody td").moduleList(SitesTableContents)}
        mapMarker{ $('#map img[src*="marker-icon.png"]')}

        reporting{$("#reporting-tab")}
        adminTab{$("#admin-tab")}

    }

    void clickAddSiteButton(){
        siteTab.click()
        waitFor {siteTabContents.displayed}
        waitFor {siteTabContents.addSites.displayed}
        siteTabContents.addSites.click()
    }
}
//
//class siteTabContent extends Module{
//    static content = {
//        addSites{$(".addSite")}
//        uploadSites{$(".uploadSite")}
//        tableContents { $("#sites-table").moduleList(tableContent)}
//
//    }
//}

//}
