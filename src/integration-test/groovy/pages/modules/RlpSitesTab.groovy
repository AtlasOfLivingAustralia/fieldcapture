package pages.modules

import geb.Module

class RlpSitesTab extends Module {
    static content = {
        sites { $('#sites-table tbody tr').moduleList(SitesTableRow) }
        map { $('#map') }
    }

    int markerCount() {
        $('#map .leaflet-marker-pane').size()
    }
}
