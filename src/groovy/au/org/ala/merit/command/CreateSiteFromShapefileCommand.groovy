package au.org.ala.merit.command

import grails.validation.Validateable

/**
 * The CreateSiteFromShapefileCommand is used by feature that allows shapefiles
 * to be uploaded to create sites for a project.
 * @see au.org.ala.merit.SiteController#createSitesFromShapefile()
 */
@Validateable
class CreateSiteFromShapefileCommand {

    /** the id of the uploaded shapefile, as returned by the spatial portal */
    String shapeFileId
    /** identifies the project that will use the new sites */
    String projectId

    /** list of sites to create */
    List sites

    static constraints  = {
        sites minSize: 1
    }
}
