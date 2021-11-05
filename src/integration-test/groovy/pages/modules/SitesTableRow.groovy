package pages.modules

import geb.Module

class SitesTableRow extends Module {
    static content = {
        name(required:false) { $('a[data-bind*=name]').text() }
        mapMarker {$(".leaflet-marker-pane")}
    }
}
