package pages.modules

import geb.Module

class SiteTabContent extends Module {
    static content = {
        addSites{$(".addSite")}
        uploadSites{$(".uploadSite")}
        markers{$('.leaflet-marker-pane img')}

        sitesTableRows { $("#sites-table tbody tr").moduleList(SitesTableContents)}
    }
}

class EditSiteContent extends  Module{
    static content = {
        name{$('input[data-bind*="name"]')}
        saveBtn {$("#save")}
    }

    void save(){
        saveBtn.click()
    }
}
