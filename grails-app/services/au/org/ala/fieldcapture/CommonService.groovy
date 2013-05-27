package au.org.ala.fieldcapture

import grails.converters.JSON
import org.codehaus.groovy.grails.web.mapping.LinkGenerator

import javax.xml.bind.DatatypeConverter
import java.text.SimpleDateFormat

class CommonService {

    LinkGenerator grailsLinkGenerator

    def simpleDateLocalTime(String dateStr) {
        if (!dateStr) { return '' }
        def cal = DatatypeConverter.parseDateTime(dateStr)
        def date = cal.getTime()
        new SimpleDateFormat("dd/MM/yy").format(date)
    }

    static locationTypes = [locationTypePoint: 'point', locationTypePolygon: 'polygon', locationTypePid: 'pid']

    /**
     * Returns json that describes in a generic fashion the features to be placed on a map that
     * will represent the site's locations.
     *
     * @param project
     */
    def getMapFeatures(project) {
        def featuresMap = [zoomToBounds: true, zoomLimit: 12, highlightOnHover: true, features: []]
        project.sites.each { site ->
            site.location.each { loc ->
                def location = [type: locationTypes[loc.type], name: site.name + ' - ' + loc.name, id: site.name]
                switch (location.type) {
                    case 'point':
                        location.latitude = loc.data.decimalLatitude
                        location.longitude = loc.data.decimalLongitude
                        break
                    case 'pid':
                        location.polygonUrl = grailsLinkGenerator.link(
                                controller: 'proxy', action: 'geojsonFromPid',
                                params: [pid: loc.data.pid]
                        )
                }
                featuresMap.features << location
            }
        }
        return featuresMap as JSON
    }

}
