package au.org.ala.merit

import groovy.util.logging.Slf4j


/**
 * Sends email messages on behalf of MERIT users to notify interested parties of project lifecycle changes.
 * These include changes to project plan status and when reports are submitted, approved or rejected.
 */
@Slf4j
class EmailService {

    def projectService, userService, mailService, settingService, grailsApplication, organisationService

    def createAndSend(mailSubjectTemplate, mailTemplate, model, recipient, sender, ccList) {
        def systemEmailAddress = grailsApplication.config.fieldcapture.system.email.address
        try {
            def subjectLine = settingService.getSettingText(mailSubjectTemplate, model)
            def body = settingService.getSettingText(mailTemplate, model).markdownToHtml()

            log.info("Sending email: ${subjectLine} to: ${recipient}, from: ${sender}, cc:${ccList}, body: ${body}")
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
                    recipient = [getSenderEmail() ?: grailsApplication.config.merit.support.email]
                }
                ccList = ccList.findAll {it ==~ emailFilter}

                log.info("After filtering, mail will be sent to:  ${recipient}, from: ${sender}, cc:${ccList}")
            }

            mailService.sendMail {
                to recipient
                if (ccList) {cc ccList}
                from systemEmailAddress
                replyTo sender
                subject subjectLine
                html body

            }
        }
        catch (Exception e) {
            log.error("Failed to send email: ", e)
        }
    }

    private String getSenderEmail() {
        def user = userService.getUser()
        user?.userName
    }

    def sortEmailAddressesByRole(List members) {
        String sender = getSenderEmail()
        def grantManagerEmails = members.findAll{it.role == RoleService.GRANT_MANAGER_ROLE}.collect{it.userName}
        def adminEmails = members.findAll{it.role == RoleService.PROJECT_ADMIN_ROLE && it.userName != sender}.collect{it.userName}

        [grantManagerEmails:grantManagerEmails, adminEmails:adminEmails]
    }

    def sendOrganisationReportSubmittedEmail(organisationId, reportDetails) {

        def emailAddresses = getOrganisationEmailAddresses(organisationId)
        def ccEmails = addDefaultsToCC([], emailAddresses)

        createAndSend(
                SettingPageType.PERFORMANCE_REPORT_SUBMITTED_EMAIL_SUBJECT_LINE,
                SettingPageType.PERFORMANCE_REPORT_SUBMITTED_EMAIL,
                reportDetails,
                emailAddresses.grantManagerEmails,
                getSenderEmail(),
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
                getSenderEmail(),
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
                getSenderEmail(),
                ccEmails
        )
    }


    void sendEmail(EmailTemplate emailTemplate, Map substitutionParams, List userEmailsAndRoles, String initiatingRole, String senderEmail = null) {
        def emailAddresses = sortEmailAddressesByRole(userEmailsAndRoles)

        if (!emailAddresses.grantManagerEmails) {
            emailAddresses.grantManagerEmails = [grailsApplication.config.merit.support.email]
        }

        if (!emailAddresses.adminEmails) {
            emailAddresses.adminEmails = [grailsApplication.config.merit.support.email]
        }

        List recipientList
        List ccEmails
        if (initiatingRole == RoleService.PROJECT_ADMIN_ROLE) {
            recipientList = emailAddresses.grantManagerEmails
            ccEmails = []
        }
        else {
            recipientList = emailAddresses.adminEmails
            ccEmails = emailAddresses.grantManagerEmails
        }

        ccEmails = addDefaultsToCC(ccEmails, emailAddresses)

        createAndSend(
                emailTemplate.subjectSettingPage,
                emailTemplate.bodySettingPage,
                substitutionParams,
                recipientList,
                senderEmail ?: getSenderEmail(),
                ccEmails
        )
    }

    def sendLockStolenEmail(Map lock, String url) {
        def currentUser = userService.lookupUser(userService.currentUserId)
        def userHoldingLock = userService.lookupUser(lock.userId)
        createAndSend(
                SettingPageType.LOCK_STOLEN_EMAIL_SUBJECT,
                SettingPageType.LOCK_STOLEN_EMAIL,
                [user:currentUser.displayName, url:url],
                [userHoldingLock.email],
                [currentUser.email],
                []
        )
    }

    def addDefaultsToCC(ccEmails, emailAddresses) {
        if (!ccEmails instanceof Collection) {
            ccEmails = [ccEmails]
        }
        if (grailsApplication.config.email.copy.merit.support) {
            if (!ccEmails.contains(grailsApplication.config.merit.support.email)) {
                ccEmails << grailsApplication.config.merit.support.email
            }
        }

        return ccEmails
    }

    def getOrganisationEmailAddresses(organisationId) {
        def members = organisationService.getMembersOfOrganisation(organisationId)
        def emailAddresses = sortEmailAddressesByRole(members)

        if (!emailAddresses.grantManagerEmails) {
            emailAddresses.grantManagerEmails = [grailsApplication.config.merit.support.email]
        }
        emailAddresses
    }
}
