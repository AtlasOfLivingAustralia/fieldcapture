package pages.modules

import geb.Module

class SiteTabContent extends Module {
    static content = {
        addSites{$(".addSite")}
        uploadSites{$(".uploadSite")}
    }
}
//class tableContent extends Module {
//    static content = {
//        siteName { $("#siteName") }
//    }
//}class tableContent extends Module {
//    static content = {
//        siteName { $("#siteName") }
//    }
//}
