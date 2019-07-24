package au.org.ala.merit

import grails.converters.JSON
import org.apache.commons.io.FilenameUtils
import org.springframework.http.HttpHeaders
import org.springframework.web.multipart.MultipartFile

import java.text.DecimalFormat
import java.text.SimpleDateFormat

class ImageController {

    WebService webService
    ImageService imageService

    static defaultAction = "get"

    private isoDateStrToDate(date) {
        if (date) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy")
            return sdf.format(date)
        }
        return ""
    }

    private isoDateStrToTime(date) {
        if (date) {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm")
            return sdf.format(date)
        }
        return ""
    }

    private doubleToString(d) {
        if (d) {
            DecimalFormat df = new DecimalFormat("0.0000000")
            return df.format(d)
        }
        return ""
    }

    def upload() {
        log.debug "-------------------------------upload action"
        params.each { log.debug it }
        def result = []
        if (request.respondsTo('getFile')) {
            MultipartFile file = request.getFile('files')
            //println "file is " + file
            if (file?.size) {  // will only have size if a file was selected
                def filename = file.getOriginalFilename().replaceAll(' ', '_')
                def ext = FilenameUtils.getExtension(filename)
                filename = imageService.nextUniqueFileName(FilenameUtils.getBaseName(filename) + '.' + ext)

                def thumbFilename = FilenameUtils.removeExtension(filename) + "-thumb." + ext
                def colDir = new File(grailsApplication.config.upload.images.path as String)
                colDir.mkdirs()
                File f = new File(imageService.fullPath(filename))
                //println "saving ${filename} to ${f.absoluteFile}"
                file.transferTo(f)
                def exifMd = imageService.getExifMetadata(f)

                File tnFile = new File(colDir, thumbFilename)

                boolean thumbCreated = imageService.createThumbnail(f, tnFile, request.contentType)

                def md = [
                        name             : filename,
                        size             : file.size,
                        isoDate          : exifMd.date,
                        contentType      : file.contentType,
                        date             : isoDateStrToDate(exifMd.date) ?: 'Not available',
                        time             : isoDateStrToTime((exifMd.date)),
                        decimalLatitude  : doubleToString(exifMd.decLat),
                        decimalLongitude : doubleToString(exifMd.decLng),
                        decimalBearing   : doubleToString(exifMd.decBearing),
                        verbatimLatitude : exifMd.latitude,
                        verbatimLongitude: exifMd.longitude,
                        bearing          : exifMd.bearing,
                        bearingRef       : exifMd.bearingRef,
                        url              : imageService.encodeImageURL(grailsApplication.config.upload.images.url, filename),
                        thumbnail_url    : imageService.encodeImageURL(grailsApplication.config.upload.images.url, thumbCreated ? thumbFilename : filename),
                        delete_url       : imageService.encodeImageURL(grailsApplication.config.grails.serverURL + "/image/delete?filename=", filename),
                        delete_type      : 'DELETE']
                result = [files: [md]]
            }
        }
        log.debug result
        render result as JSON
    }

    def delete = {
        log.debug "deleted " + params.filename
        render '{"deleted":true}'
    }

    /**
     * The content type of the file is derived purely from the file extension.
     */
    def get() {
        File f = new File(imageService.fullPath(params.id))
        if (!f.exists()) {
            response.status = 404
            return
        }

        def ext = FilenameUtils.getExtension(params.id)

        long ONE_WEEK_IN_SECONDS = 60*60*24*7
        response.setHeader(HttpHeaders.PRAGMA, "")
        response.setDateHeader(HttpHeaders.EXPIRES, ONE_WEEK_IN_SECONDS*1000+System.currentTimeMillis())
        response.setHeader(HttpHeaders.CACHE_CONTROL, "max-age="+ONE_WEEK_IN_SECONDS)
        response.contentType = 'image/' + ext
        response.outputStream << new FileInputStream(f)
        response.outputStream.flush()

    }


}
