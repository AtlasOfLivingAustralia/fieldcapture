package pages.modules

import geb.Module

class SitesTableContents extends Module {
    static content = {
        siteName { $("a#siteName") }
        mapMarker {$(".leaflet-marker-pane")}
    }
}
