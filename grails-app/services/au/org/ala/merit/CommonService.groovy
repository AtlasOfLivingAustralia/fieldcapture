package au.org.ala.merit

import grails.converters.JSON
import grails.web.mapping.LinkGenerator

class CommonService {

    LinkGenerator grailsLinkGenerator
    WebService webService

    def buildUrlParamsFromMap(map) {
        if (!map) return ''
        def params = '?'
        map.eachWithIndex { k,v,i ->
            def vL = [v].flatten().findAll { it != null } // String[] and String both converted to List
            params += (i?'&':'') + k + '=' + vL.collect { URLEncoder.encode(String.valueOf(it), "UTF-8") }.join("&${k}=")
        }
        params
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

    /**
     * Validate redirect URL.
     * If returnTo is relative, then it is valid.
     * If returnTo is absolute, then host name should be in the allowed list.
     * @param returnTo
     * @return
     */
    boolean isRedirectSafe(String returnTo) {
        if (returnTo) {
            try {
                URI uri = new URI(returnTo)
                if (uri.isAbsolute())
                    return ['http', 'https'].contains(uri.scheme?.toLowerCase()) &&
                            uri.host != null && webService.isValidDomain(uri.host)
                return uri.rawAuthority == null && !returnTo.startsWith('//')
            } catch (Exception ex) {
                return false
            }
        }

        return false
    }
}
