package au.org.ala.fieldcapture

/**
 * A delegate to the ecodata admin services.
 */
class AdminService {

    def grailsApplication,webService

    /**
     * Triggers a full site re-index.
     */
    def reIndexAll() {
        webService.getJson(grailsApplication.config.ecodata.baseUrl + 'admin/reIndexAll')
    }
}
