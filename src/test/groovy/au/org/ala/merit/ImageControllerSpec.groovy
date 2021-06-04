package au.org.ala.merit

import org.apache.http.HttpStatus
import spock.lang.Specification
import grails.testing.web.controllers.ControllerUnitTest

class ImageControllerSpec extends Specification implements ControllerUnitTest<ImageController>{

    File uploadPath
    File temp

    void setup() {

        controller.imageService = new ImageService() // to use the fullPath method without needing to mock it
        controller.imageService.grailsApplication = controller.grailsApplication
        temp = File.createTempDir("tmp", "")
        uploadPath = new File(temp, "upload")
        uploadPath.mkdir()

        controller.grailsApplication.config.upload.images.path = uploadPath.getAbsolutePath()

        // Setup two files, one that should be accessible, and one that should not.
        File validFile =  new File(uploadPath, "validFile.png")
        validFile.createNewFile()

        File privateFile = new File(temp, "privateFile.png")
        privateFile.createNewFile()
    }

    void "Files can be retrieved from the temporary upload directory by filename"() {
        when:
        params.id = "validFile.png"
        controller.get()

        then:
        response.contentType == "image/png"
        response.status == HttpStatus.SC_OK
    }

    void "If a file doesn't exist, a 404 will be returned"() {
        when:
        params.id = "missingFile.png"
        controller.get()

        then:
        response.status == HttpStatus.SC_NOT_FOUND
    }

    void "A file cannot be retrieved from outside the designated uploads directory"() {
        when:
        params.id = "../privateFile.png"
        controller.get()

        then:
        new File(uploadPath, params.id).exists()
        response.status == HttpStatus.SC_NOT_FOUND
    }
}
