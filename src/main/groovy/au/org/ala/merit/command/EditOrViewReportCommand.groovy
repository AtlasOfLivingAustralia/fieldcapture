package au.org.ala.merit.command

import au.org.ala.merit.ReportService
import grails.artefact.Controller
import grails.core.GrailsApplication
import grails.validation.Validateable
import grails.web.mapping.LinkGenerator

/**
 * The purpose of this class is to manage the duplicated workflows that occur when
 * reports are displayed in various contexts (e.g. organisation, management unit, project).
 */
abstract class EditOrViewReportCommand implements Validateable {

    ReportService reportService
    GrailsApplication grailsApplication

    String id
    String reportId
    Integer formVersion

    Map model = null

    static constraints = {
        formVersion nullable: true
        model validator: { Map model, EditOrViewReportCommand cmd ->
            cmd.validateReportModel()
        }
    }

    def beforeValidate() {
        if (reportId && id) {
            model = reportService.activityReportModel(reportId, ReportService.ReportMode.EDIT, formVersion)
            model.context = entity
            model.config = entity.config ?: [:]

            model.reportHeaderTemplate = '/organisation/organisationReportHeader'
            model.returnTo = linkGenerator.link(controller:entityType, action:'index', id: id)
            model.contextViewUrl = model.returnTo
            model.saveReportUrl = linkGenerator.link(controller:entityType, action:'saveReport', id:id)
        }
    }

    /**
     * Ensures that the report is in a state where it can be updated, and that the activityId being
     * updated matches that of the report.
     * @return an error code if the report cannot be updated, null otherwise.
     */
    String validateReportModel() {
        String errorCode = null
        if (!isOwnedByEntity(model.report)) {
            errorCode = 'report.owner.mismatch'
        }
        return errorCode
    }

    abstract String getEntityType()
    abstract Map getEntity()

    boolean isOwnedByEntity(Map report) {
        String idField = getEntityType()+'Id'
        report[idField] == id
    }

    LinkGenerator getLinkGenerator() {
        grailsApplication.getMainContext().getBean(LinkGenerator)
    }

    Map getReport() {
        model.report
    }

    def processEdit(Controller owner) {
        if (!model.editable) {
            owner.redirect action:'viewReport', id:id, params:[reportId:reportId, attemptedEdit:true]
        }
        else {
            if (model.config.requiresActivityLocking) {
                Map result = reportService.lockForEditing(model.report)
                if (result.error) {
                    owner.redirect action:'viewReport', id:id, params:[reportId:reportId, attemptedEdit:true]
                    return
                }
                model.locked = true
            }
        }
        render model: model, view:'/activity/activityReport'
    }

}
