package au.org.ala.merit

import com.drew.imaging.ImageMetadataReader
import com.drew.lang.GeoLocation
import com.drew.metadata.Directory
import com.drew.metadata.Metadata
import com.drew.metadata.exif.ExifSubIFDDirectory
import com.drew.metadata.exif.GpsDirectory
import groovyx.net.http.HttpResponseDecorator
import org.codehaus.groovy.grails.commons.GrailsApplication

class ImageService {

    GrailsApplication grailsApplication
    WebService webService

    /**
     * Delegates to ecodata to generate a thumbnail of the supplied image.
     * @param image the file to create a thumbnail of
     * @param tnFile the desired output file
     * @return true if the thumbail was generated.
     */
    boolean createThumbnail(InputStream imageIn, File thumbnailFile, String contentType, int size = 300) {
        Closure saveThumbnail = { HttpResponseDecorator resp, Object parsedData ->
            if (parsedData instanceof InputStream) {
                new FileOutputStream(thumbnailFile).withStream { it << parsedData }
            }
        }

        webService.postMultipart(grailsApplication.config.ecodata.baseUrl + "document/createThumbnail", [size: size], imageIn, contentType, thumbnailFile.name, 'image', saveThumbnail)

        return thumbnailFile.exists()

    }

    boolean createThumbnail(File image, File thumbnailFile, String contentType, int size = 300) {
        image.withInputStream { fileIn ->
            createThumbnail(fileIn, thumbnailFile, contentType, size)
        }
        return thumbnailFile.exists()
    }

    Map getExifMetadata(file) {
        def exif = [:]
        try {
            Metadata metadata = ImageMetadataReader.readMetadata(file);

            Directory directory = metadata.getDirectory(ExifSubIFDDirectory.class)
            if (directory) {
                Date date = directory.getDate(ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL)
                exif.date = date
            }

            Directory gpsDirectory = metadata.getDirectory(GpsDirectory.class)
            if (gpsDirectory) {
                GeoLocation loc = gpsDirectory.getGeoLocation()
                if (loc) {
                    exif.latitude = gpsDirectory.getDescription(GpsDirectory.TAG_GPS_LATITUDE)
                    exif.longitude = gpsDirectory.getDescription(GpsDirectory.TAG_GPS_LONGITUDE)
                    exif.bearing = gpsDirectory.getDescription(GpsDirectory.TAG_GPS_IMG_DIRECTION)
                    exif.bearingRef = gpsDirectory.getDescription(GpsDirectory.TAG_GPS_IMG_DIRECTION_REF)
                    // Avoiding the conversion from magnetic to true north
                    if (exif.bearingRef && exif.bearingRef.startsWith("T")) {
                        if (exif.bearing && exif.bearing.endsWith(" degrees")) {
                            try {
                                exif.decBearing = Double.parseDouble(exif.bearing.substring(0, exif.bearing.indexOf(" degrees")))
                            }
                            catch (Exception e) {
                                log.warn("Non numberic bearing in EXIF: " + exif.bearing)
                            }

                        }
                    }
                    exif.decLat = loc.latitude
                    exif.decLng = loc.longitude
                }
            }
        } catch (Exception e) {
            //this will be thrown if its a PNG....
            log.debug(e.getMessage(), e)
        }

        return exif
    }

    /**
     * We are preserving the file name so the URLs look nicer and the file extension isn't lost.
     * As filename are not guaranteed to be unique, we are pre-pending the file with a counter if necessary to
     * make it unique.
     */
    String nextUniqueFileName(filename) {
        int counter = 0
        String newFilename = filename
        File f = new File(fullPath(newFilename))
        while (f.exists()) {
            newFilename = "${counter}_${filename}"
            counter++
            f = new File(fullPath(newFilename))
        }
        return newFilename
    }

    String fullPath(filename) {

        return grailsApplication.config.upload.images.path + File.separator + filename
    }

    URL encodeImageURL(prefix, filename) {
        def encodedFileName = filename.encodeAsURL().replaceAll('\\+', '%20')
        URI uri = new URI(prefix + encodedFileName)
        return uri.toURL()
    }
}
