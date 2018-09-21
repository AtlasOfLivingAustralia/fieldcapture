package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.ReportService
import au.org.ala.merit.SiteService
import grails.validation.Validateable
import org.apache.http.HttpStatus

/**
 * Handles the process of updating the activity and site data for a Report.
 */
@Validateable
class SaveReportDataCommand {

    SiteService siteService
    ActivityService activityService
    ReportService reportService


    String reportId
    String activityId
    Map activity
    Map photoPoints
    Map site

    /** Caches the report after it is retrieved from ecodata via the reportId */
    private transient Map report
    /** Caches the saved version of the activity after it is retrieved from ecodata via the activityId */
    private transient Map savedActivity

    static constraints = {
        reportId validator: { String reportId, SaveReportDataCommand cmd ->
            cmd.validateReportStatusAndActivity()
        }
        site validator: { Map site, SaveReportDataCommand cmd ->
            cmd.validateSite()
        }
        photoPoints nullable: true
        site nullable: true

        savedActivity bindable: false
        report bindable: false

    }

    /**
     * Ensures that the report is in a state where it can be updated, and that the activityId being
     * updated matches that of the report.
     * @return an error code if the report cannot be updated, null otherwise.
     */
    String validateReportStatusAndActivity() {
        String errorCode = null
        Map report = getReport()

        if (reportService.isSubmittedOrApproved(report)) {
            errorCode = 'submittedOrApprovedReport'
        }
        // This would have to be via a handcrafted request as the MERIT UI won't allow this
        else if (report.activityId != activityId) {
            errorCode = 'activityIdMismatch'
        }
        return errorCode
    }

    /**
     * This method ensures that if a siteId is supplied it matches the site already associated with the
     * report activity.
     * If site data, but no siteId is supplied and the report activity has an associated site, the associated site will
     * be used for updates.
     * @return an errorCode if the validation fails, null otherwise.
     */
    String validateSite() {

        String errorCode = null
        if (site && site.siteId) {
            if (getSavedActivity().siteId != site.siteId) {
                errorCode = 'siteIdMismatch'
            }
        }
        return errorCode
    }

    Map getSavedActivity() {
        if (!savedActivity) {
            savedActivity = activityService.get(activityId)
        }
        savedActivity
    }

    /** Do nothing setter to prevent data binding of this property. */
    void setSavedActivity(Map activity) {}

    Map getReport() {
        if (!report) {
            report = reportService.get(reportId)
        }
        report
    }

    /** Do nothing setter to prevent data binding of this property */
    void setReport(Map report) {}

    Map save() {

        Map result
        if (hasErrors()) {
            result = [status: HttpStatus.SC_BAD_REQUEST, error:errors.toString()]
        }
        else {
            if (site) {
                result = saveReportSite(site.siteId, getReport())

                if (result?.resp?.siteId) {
                    activity.siteId = result.resp.siteId
                    activity.activityId = activityId // ecodata uses this value to determine whether to update the activity or just the outputs, if we have assigned a site we need to update the activity to include that site.
                }

            }

            result = activityService.update(activityId, activity)
        }

        result
    }

    /**
     * Saves the site data supplied by the client.
     * @param siteId the siteId of the site.  If null, a value will be obtained from the current activity.  If
     * still none, a new site will be created and assigned to the activity.
     * @param report the report that is being updated.  Used to set defaults for the site name.
     * @return the result of updating the site.  New sites will return the siteId.
     */
    private Map saveReportSite(String siteId, Map report) {

        if (!siteId) {
            Map activity = getSavedActivity()
            if (activity.siteId) {
                siteId = activity.siteId
            }
        }
        if (siteId) {
            site.siteId = siteId
        }

        if (report.projectId) {
            site.projects = [report.projectId]
        }
        site.name = report.description
        site.type = SiteService.SITE_TYPE_COMPOUND


        siteService.update(siteId ?:'', site)
    }


}