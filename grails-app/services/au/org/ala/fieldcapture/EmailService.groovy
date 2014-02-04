package au.org.ala.fieldcapture
/**
 * Sends email messages on behalf of MERIT users to notify interested parties of project lifecycle changes.
 * These include changes to project plan status and when reports are submitted, approved or rejected.
 */
class EmailService {

    def projectService, userService, mailService, settingService, grailsApplication

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

    def createAndSend(mailSubjectTemplate, mailTemplate, model, recipient, sender, ccList) {
        try {
            def subjectLine = settingService.getSettingText(mailSubjectTemplate, model)
            def body = settingService.getSettingText(mailTemplate, model).markdownToHtml()

            // This is to prevent spamming real users while testing.
            def emailFilter = grailsApplication.config.emailFilter
            if (emailFilter) {
                if (!recipient instanceof Collection) {
                    recipient = [recipient]
                }
                if (!ccList instanceof Collection) {
                    ccList = [ccList]
                }

                recipient = recipient.findAll {it ==~ emailFilter}
                if (!recipient) {
                    // The email won't be sent unless we have a to address - use the submitting user since
                    // the purpose of this is testing.
                    recipient = [userService.getUser().userName]
                }
                ccList = ccList.findAll {it ==~ emailFilter}
            }
            log.info("Sending email: ${subjectLine} to: ${recipient}, from: ${sender}, cc:${ccList}, body: ${body}")

            mailService.sendMail {
                to recipient
                if (ccList) {cc ccList}
                from sender
                subject subjectLine
                html body

            }
        }
        catch (Exception e) {
            log.error("Failed to send email: ", e)
        }
    }

    def getProjectEmailAddresses(projectId) {
        def members = projectService.getMembersForProjectId(projectId)
        def user = userService.getUser()
        def caseManagerEmails = members.findAll{it.role == RoleService.GRANT_MANAGER_ROLE}.collect{it.userName}
        def adminEmails = members.findAll{it.role == RoleService.PROJECT_ADMIN_ROLE && it.userName != user.userName}.collect{it.userName}

        if (!caseManagerEmails) {
            caseManagerEmails = grailsApplication.config.merit.support.email
        }

        [userEmail:user.userName, grantManagerEmails:caseManagerEmails, adminEmails:adminEmails]
    }

    def addDefaultsToCC(ccEmails, emailAddresses) {
        if (!ccEmails instanceof Collection) {
            ccEmails = [ccEmails]
        }
        ccEmails << grailsApplication.config.merit.support.email

        return ccEmails
    }
}
