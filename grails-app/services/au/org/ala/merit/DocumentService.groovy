package au.org.ala.merit

import grails.converters.JSON
import org.apache.commons.io.FilenameUtils
import org.apache.http.HttpStatus
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.springframework.cache.annotation.Cacheable

import static org.apache.http.HttpStatus.SC_BAD_REQUEST
import static org.apache.http.HttpStatus.SC_OK
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;

/**
 * Proxies to the ecodata DocumentController/DocumentService.
 */
class DocumentService {
    private static final String HELP_DOCUMENTS_CACHE_REGION = 'homePageDocuments'

    public static final String TYPE_LINK = "link"
    public static final String ROLE_LOGO = "logo"
    public static final String ROLE_MAIN_IMAGE = "mainImage"

    public static final List PUBLIC_ROLES = [ROLE_MAIN_IMAGE, ROLE_LOGO]

    WebService webService
    GrailsApplication grailsApplication
    UserService userService

    def get(String id) {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/${id}"
        return webService.getJson(url)
    }

    def delete(String id) {
        if (canDelete(id)) {
            def url = "${grailsApplication.config.ecodata.baseUrl}document/${id}"
            return webService.doDelete(url)
        }
        else {
            return HttpStatus.SC_UNAUTHORIZED
        }
    }

    def createTextDocument(doc, content) {
        doc.content = content
        updateDocument(doc)
    }

    @Cacheable(DocumentService.HELP_DOCUMENTS_CACHE_REGION)
    def findAllHelpResources() {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/search"
        def result = webService.doPost(url, [role:'helpResource'])
        if (result.statusCode == SC_OK) {
            return result.resp.documents
        }
        return []
    }

    def updateDocument(Map doc) {
        Map result
        if (canEdit(doc)) {
            def url = "${grailsApplication.config.ecodata.baseUrl}document/${doc.documentId?:''}"
            result = webService.doPost(url, doc)
        }
        else {
            result = [statusCode:SC_UNAUTHORIZED]
        }
        result

    }

    def updateDocument(Map doc, String filename, String contentType, InputStream inputStream) {
        Map result
        if (!canEdit(doc)) {
            result = [statusCode:SC_UNAUTHORIZED]
        }
        else {
            def extension = FilenameUtils.getExtension(filename)?.toLowerCase()
            if (!extension || grailsApplication.config.upload.extensions.blacklist.contains(extension)) {
                result = [statusCode:SC_BAD_REQUEST, error:"Files with the extension '.${extension}' are not permitted."]
            }
            else {
                def url = grailsApplication.config.ecodata.baseUrl + "document"
                if (doc.documentId) {
                    url+="/"+doc.documentId
                }
                doc.contentType = contentType
                doc.filename = filename
                def params = [document:doc as JSON]
                result = webService.postMultipart(url, params, inputStream, contentType, doc.filename)
            }

        }
        result
    }

    def getDocumentsForSite(id) {
        def url = "${grailsApplication.config.ecodata.baseUrl}site/${id}/documents"
        return webService.doPost(url, [:])
    }

    /**
     * This method saves a document that has been staged (the image uploaded, but the document object not
     * created).  The purpose of this is to support atomic create / edits of objects that include document
     * references, e.g. activities containing photo point photos and organisations.
     * @param document the document to save.
     */
    def saveStagedImageDocument(document) {
        def result
        if (!document.documentId) {
            document.remove('url')
            File file = new File(grailsApplication.config.upload.images.path, document.filename)
            if (file.exists()) {
                // Documents used as logos or banner images should be made public or they won't appear
                // on view pages.
                if (document.role in PUBLIC_ROLES) {
                    document['public'] = true
                }
                // Create a new document, supplying the file that was uploaded to the ImageController.
                result = updateDocument(document, document.filename, document.contentType, new FileInputStream(file))
                if (!result.error) {
                    file.delete()
                }
            }
            else {
                result = updateDocument(document)
            }
        }
        else {

            // Just update the document.
            result = updateDocument(document)
        }
        result
    }

    def saveLink(link) {
        link.public = true
        link.type = "link"
        link.externalUrl = link.remove('url')
        updateDocument(link)
    }

    Map search(Map params) {
        def url = "${grailsApplication.config.ecodata.baseUrl}document/search"
        def resp = webService.doPost(url, params)
        if (resp && !resp.error) {
            return resp.resp
        }
        return resp
    }

    /**
     * Returns true if the current user has permission to edit/update the
     * supplied document.
     * @param document the document to be edited/updated
     */
    boolean canEdit(Map document) {
        if (document.documentId) {
            document = get(document.documentId)
        }
        boolean canEdit = false

        if (document) {
            // Only FC_ADMINS can edit an existing read only document, but
            // other roles can create them.
            if (document.readOnly && document.documentId) {
                canEdit = userService.userIsAlaOrFcAdmin()
            }
            else {
                // Check the permissions that apply to the entity the document is
                // associated with.
                String userId = userService.getCurrentUserId()
                if (document.projectId) {
                    canEdit = userService.canUserEditProject(userId, document.projectId)
                }
                else if (document.programId) {
                    canEdit = userService.canUserEditProgramReport(userId, document.programId)
                }
                else if (document.organisationId) {
                    canEdit = userService.isUserAdminForOrganisation(userId, document.organisationId)
                }
                else if (document.activityId) {
                    canEdit = userService.canUserEditActivity(userId, document.activityId)
                }
                else if (document.managementUnitId) {
                    canEdit = userService.canUserEditManagementUnit(userId, document.managementUnitId)
                }
                else {
                    canEdit = userService.userIsAlaOrFcAdmin()
                }
            }

        }

        canEdit
    }

    /**
     * Returns true if the current user has permission to delete the
     * supplied document.
     * @param documentId the id of the document to be deleted
     */
    boolean canDelete(String documentId) {
        canEdit([documentId:documentId])
    }
}
