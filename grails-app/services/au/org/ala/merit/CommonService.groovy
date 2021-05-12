package au.org.ala.merit

import grails.converters.JSON
import grails.web.mapping.LinkGenerator
import org.springframework.context.MessageSource

import javax.xml.bind.DatatypeConverter
import java.text.SimpleDateFormat

class CommonService {

    LinkGenerator grailsLinkGenerator
    MessageSource messageSource

    def buildUrlParamsFromMap(map) {
        if (!map) return ''
        def params = '?'
        map.eachWithIndex { k,v,i ->
            def vL = [v].flatten().findAll { it != null } // String[] and String both converted to List
            params += (i?'&':'') + k + '=' + vL.collect { URLEncoder.encode(String.valueOf(it), "UTF-8") }.join("&${k}=")
        }
        params
    }

    def simpleDateLocalTime(String dateStr) {
        if (!dateStr) { return '' }
        def cal = DatatypeConverter.parseDateTime(dateStr)
        def date = cal.getTime()
        new SimpleDateFormat("dd/MM/yy").format(date)
    }

    /**
     * Returns json that describes in a generic fashion the features to be placed on a map that
     * will represent the site's locations.
     *
     * @param project
     */
    def getMapFeatures(project) {
        def featuresMap = [zoomToBounds: true, zoomLimit: 12, highlightOnHover: true, features: []]
        project.sites.each { site ->
            Map feature = site.extent?.geometry
            if (feature) {
                feature.siteId = site.siteId
            }
            featuresMap.features << feature
        }
        return featuresMap as JSON
    }

    def i18n(Locale locale) {
        messageSource.getMergedProperties(locale)?.properties
    }
}
