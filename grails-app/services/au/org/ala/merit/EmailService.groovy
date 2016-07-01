package au.org.ala.merit

import au.org.ala.fieldcapture.SettingPageType

/**
 * Sends email messages on behalf of MERIT users to notify interested parties of project lifecycle changes.
 * These include changes to project plan status and when reports are submitted, approved or rejected.
 */
class EmailService extends au.org.ala.fieldcapture.EmailService {

    def sendReportSubmittedEmail(projectId, stageDetails) {

        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC([], emailAddresses)

        createAndSend(
                SettingPageType.REPORT_SUBMITTED_EMAIL_SUBJECT_LINE,
                SettingPageType.REPORT_SUBMITTED_EMAIL,
                stageDetails,
                emailAddresses.grantManagerEmails,
                emailAddresses.userEmail,
                ccEmails
        )
    }


    def sendReportApprovedEmail(projectId, stageDetails) {
        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)


        createAndSend(
                SettingPageType.REPORT_APPROVED_EMAIL_SUBJECT_LINE,
                SettingPageType.REPORT_APPROVED_EMAIL,
                stageDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails
        )

    }

    def sendReportRejectedEmail(projectId, stageDetails) {

        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)

        createAndSend(
                SettingPageType.REPORT_REJECTED_EMAIL_SUBJECT_LINE,
                SettingPageType.REPORT_REJECTED_EMAIL,
                stageDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails
        )
    }

    def sendPlanSubmittedEmail(projectId, planDetails) {

        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC([], emailAddresses)

        createAndSend(
                SettingPageType.PLAN_SUBMITTED_EMAIL_SUBJECT_LINE,
                SettingPageType.PLAN_SUBMITTED_EMAIL,
                planDetails,
                emailAddresses.grantManagerEmails,
                emailAddresses.userEmail,
                ccEmails
        )
    }


    def sendPlanApprovedEmail(projectId, planDetails) {
        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)


        createAndSend(
                SettingPageType.PLAN_APPROVED_EMAIL_SUBJECT_LINE,
                SettingPageType.PLAN_APPROVED_EMAIL,
                planDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails
        )

    }

    def sendPlanRejectedEmail(projectId, planDetails) {

        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)

        createAndSend(
                SettingPageType.PLAN_REJECTED_EMAIL_SUBJECT_LINE,
                SettingPageType.PLAN_REJECTED_EMAIL,
                planDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails
        )
    }

    def sendOrganisationReportSubmittedEmail(organisationId, reportDetails) {

        def emailAddresses = getOrganisationEmailAddresses(organisationId)
        def ccEmails = addDefaultsToCC([], emailAddresses)

        createAndSend(
                SettingPageType.PERFORMANCE_REPORT_SUBMITTED_EMAIL_SUBJECT_LINE,
                SettingPageType.PERFORMANCE_REPORT_SUBMITTED_EMAIL,
                reportDetails,
                emailAddresses.grantManagerEmails,
                emailAddresses.userEmail,
                ccEmails
        )
    }


    def sendOrganisationReportApprovedEmail(organisationId, reportDetails) {
        def emailAddresses = getOrganisationEmailAddresses(organisationId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)


        createAndSend(
                SettingPageType.PERFORMANCE_REPORT_APPROVED_EMAIL_SUBJECT_LINE,
                SettingPageType.PERFORMANCE_REPORT_APPROVED_EMAIL,
                reportDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails
        )

    }

    def sendOrganisationReportRejectedEmail(organisationId, reportDetails) {

        def emailAddresses = getOrganisationEmailAddresses(organisationId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)

        createAndSend(
                SettingPageType.PERFORMANCE_REPORT_REJECTED_EMAIL_SUBJECT_LINE,
                SettingPageType.PERFORMANCE_REPORT_REJECTED_EMAIL,
                reportDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails
        )
    }

    def addDefaultsToCC(ccEmails, emailAddresses) {
        if (!ccEmails instanceof Collection) {
            ccEmails = [ccEmails]
        }
        if (grailsApplication.config.email.copy.merit.support) {
            ccEmails << grailsApplication.config.merit.support.email
        }

        return ccEmails
    }

    def getProjectEmailAddresses(projectId) {
        def emailAddresses = super.getProjectEmailAddresses(projectId)

        if (!emailAddresses.grantManagerEmails) {
            emailAddresses.grantManagerEmails = [grailsApplication.config.merit.support.email]
        }
        emailAddresses
    }

    def getOrganisationEmailAddresses(organisationId) {
        def emailAddresses = super.getOrganisationEmailAddresses(organisationId)

        if (!emailAddresses.grantManagerEmails) {
            emailAddresses.grantManagerEmails = [grailsApplication.config.merit.support.email]
        }
        emailAddresses
    }
}
