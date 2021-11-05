package pages.modules

import geb.Module

class SiteTabContent extends Module {
    static content = {
        addSites{$(".addSite")}
        uploadSites{$(".uploadSite")}
        markers{$('.leaflet-marker-pane img')}

        firstSiteAdded{$('.addSite')} // this is for the sites page where there is not associate sites for that projects
        newsiteupload{$(".uploadSite")}  // this is for the sites page where there is not associate sites for that projects
        addSite { $( '#addSite' )}
        siteUpload{ $('#siteUpload')}
        siteDownload{ $('#siteDownload')}
        siteDeleted{ $('#siteDeleted')}

        lastupdated{$("#lastUpdated")}

        sitesTableRows { $("#sites-table tbody tr").moduleList(SitesTableRow)}
        map { $('#map') }
    }

    int markerCount() {
        $('#map .leaflet-marker-pane').size()
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
