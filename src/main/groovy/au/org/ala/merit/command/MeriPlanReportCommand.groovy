package au.org.ala.merit.command


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
class MeriPlanReportCommand implements Validateable{

    static String RLP_MERI_PLAN_TEMPLATE = "rlpMeriPlan"

    @Transient
    ProjectService projectService

    @Transient
    MetadataService metadataService

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
    Map meriPlanReportModel() {
        if (!validate()) {
            return [statusCode:HttpStatus.SC_UNPROCESSABLE_ENTITY, error:getErrors()]
        }
        Map project, content
        if (documentId) {
            content = projectService.getApprovedMeriPlanProject(documentId)
            project = content?.project
        }
        else {
            project = projectService.get(id, 'all')
            if (project != null){
                project.remove("sites")
            }
        }

        Map model
        if (!project) {
            errors.reject("Project not found")
            model = [statusCode: HttpStatus.SC_NOT_FOUND, error:getErrors()]
        }
        else {
            Map config = projectService.getProgramConfiguration(project)

            project?.referenceDocument = content?.referenceDocument
            project?.dateApproved = content?.dateApproved
            /*
              Pre-2020 the project template was determined differently,
              the historical MERI plan function was only enabled on RLP projects during that time.
              For this issue(github 2748) it is sensible to default the RLP template.
            */
            String meriPlanTemplate = config?.meriPlanTemplate ?: RLP_MERI_PLAN_TEMPLATE
            model = [project:project,
                     config:config,
                     headerTemplate:'/project/'+meriPlanTemplate+'Header',
                     meriPlanTemplate:'/project/'+meriPlanTemplate+'View',
                     themes:metadataService.getThemesForProject(project),
                     user:[isAdmin:true]]
        }

        model
    }

}
