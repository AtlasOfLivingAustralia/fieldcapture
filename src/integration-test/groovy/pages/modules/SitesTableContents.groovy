package pages.modules

import geb.Module

class SitesTableContents extends Module {
    static content = {
        siteName { $("#siteName") }
        mapMarker {$(".leaflet-marker-pane")}
    }
}
