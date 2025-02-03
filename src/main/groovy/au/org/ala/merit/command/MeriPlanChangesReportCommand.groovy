package au.org.ala.merit.command

import au.org.ala.merit.DocumentService
import au.org.ala.merit.MetadataService
import au.org.ala.merit.ProjectService
import grails.validation.Validateable
import org.apache.http.HttpStatus

import javax.persistence.Transient

/**
 * The MeriPlanReportCommand assembles the necessary data to display the MERI plan for a project.
 * It can use the current project information or retrieve project data from an audit message if the audit
 * message id is supplied.
 */
class MeriPlanChangesReportCommand implements Validateable{

    static String RLP_MERI_PLAN_TEMPLATE = "rlpMeriPlan"

    @Transient
    ProjectService projectService

    @Transient
    MetadataService metadataService

    @Transient
    DocumentService documentService

    /** The project id to display the MERI Plan report for */
    String id

    /** The document id if a previous MERI plan is requested */
    String documentId


    static constraints = {
        projectService nullable: true
        metadataService nullabe: true
        documentId nullable: true
    }

    /**
     * Returns a model suitable for rendering a MERI plan from either a project id or audit message id (for a
     * historical MERI plan).
     * If validation fails or the project is not found a map with keys statusCode:<int>, error:<errors object>
     * will be returned.
     */
    Map meriPlanChangesReportModel() {

        if (!validate()) {
            return [statusCode:HttpStatus.SC_UNPROCESSABLE_ENTITY, error:getErrors()]
        }

        Map project, content, changed, model
        if (documentId) {
            content = projectService.getApprovedMeriPlanProject(documentId)
            project = content?.project
        } else {
            Map result = documentService.search(projectId:id, role:'approval', labels:'MERI')
            List documents = result?.documents ?: []
            def res = documents.get(documents.size()-1)
            content = projectService.getApprovedMeriPlanProject(res.documentId)
            project = content?.project
        }

        if (!project) {
            errors.reject("Project not found")
            model = [statusCode: HttpStatus.SC_NOT_FOUND, error:getErrors()]
        } else {
            project.remove("sites")
            project.remove('activities')

            Map config = projectService.getProgramConfiguration(project)
            changed = projectService.get(id, 'all')

            if (changed) {
                changed.remove("sites")
                changed.remove('activities')
            }
            project?.referenceDocument = content?.referenceDocument
            project?.dateApproved = content?.dateApproved

            [project:content?.project,
                     config:config,
                     headerTemplate:'/project/configurableMeriPlanHeader',
                     meriPlanChangesTemplate:'/project/configurableMeriPlanChangesView',
                     changed:changed,
                     user:[isAdmin:true]]

        }

    }

}
