package au.org.ala.merit

import com.drew.imaging.ImageMetadataReader
import com.drew.lang.GeoLocation
import com.drew.metadata.Directory
import com.drew.metadata.Metadata
import com.drew.metadata.exif.ExifSubIFDDirectory
import com.drew.metadata.exif.GpsDirectory

import java.text.SimpleDateFormat

/**
 * A delegate to the ecodata admin services.
 */
class AdminService {

    def grailsApplication,webService,outputService,documentService,activityService,siteService

    /**
     * Triggers a full site re-index.
     */
    def reIndexAll() {
        webService.getJson(grailsApplication.config.getProperty('ecodata.baseUrl') + 'admin/reIndexAll')
    }

    static outputDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ")
    static {
        outputDateFormat.setTimeZone(TimeZone.getTimeZone("UTC"))
    }

    def syncCollectoryOrgs() {
        def url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}admin/syncCollectoryOrgs"
        webService.doPost(url, [
                api_key: grailsApplication.config.getProperty('api_key')
        ])
    }

    /**
     *
     * @param userId
     * @return in Map
     */
    def deleteUserPermission(String userId){
       return webService.doPost("${grailsApplication.config.getProperty('ecodata.baseUrl')}permissions/deleteUserPermission/$userId", null)
    }
}
