package au.org.ala.fieldcapture

import groovy.text.GStringTemplateEngine

/**
 * Sends email messages on behalf of MERIT users to notify interested parties of project lifecycle changes.
 * These include changes to project plan status and when reports are submitted, approved or rejected.
 */
class EmailService {

    def projectService, userService, mailService, settingService, grailsApplication

    def sendReportSubmittedEmail(projectId, stageDetails) {

        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.adminEmails, emailAddresses)

        createAndSend(
                SettingPageType.REPORT_SUBMITTED_EMAIL,
                stageDetails,
                emailAddresses.grantManagerEmails,
                emailAddresses.userEmail,
                ccEmails,
                "A MERIT Activity Report has been submitted for your approval"
        )
    }


    def sendReportApprovedEmail(projectId, stageDetails) {
        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)


        createAndSend(
                SettingPageType.REPORT_APPROVED_EMAIL,
                stageDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails,
                "A MERIT Activity Report has been approved."
        )

    }

    def sendReportRejectedEmail(projectId, stageDetails) {

        def emailAddresses = getProjectEmailAddresses(projectId)
        def ccEmails = addDefaultsToCC(emailAddresses.grantManagerEmails, emailAddresses)

        createAndSend(
                SettingPageType.REPORT_REJECTED_EMAIL,
                stageDetails,
                emailAddresses.adminEmails,
                emailAddresses.userEmail,
                ccEmails,
                "A MERIT Activity Report has been rejected."
        )
    }

    def createAndSend(mailTemplate, model, to, from, cc, subject) {
        try {
            def body = createEmailBodyText(mailTemplate, model)

            // This is to prevent spamming real users while testing.
            def emailFilter = grailsApplication.config.emailFilter
            if (emailFilter) {
                if (!to instanceof Collection) {
                    to = [to]
                }
                if (!cc instanceof Collection) {
                    cc = [cc]
                }

                to = to.find {it ==~ emailFilter}
                if (!to) {
                    // The email won't be sent unless we have a to address - use the submitting user since
                    // the purpose of this is testing.
                    to = userService.getUser().userName
                }
                cc = cc.find {it ==~ emailFilter}
            }
            mailService.sendMail {
                to to
                cc cc
                from from
                subject subject
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
        def caseManagerEmails = members.findAll{it.role == 'caseManager'}.collect{it.userName}
        def adminEmails = members.findAll{it.role == 'admin' && it.userName != user.userName}.collect{it.userName}

        if (!caseManagerEmails) {
            caseManagerEmails =  MERIT_EMAIL
        }

        [userEmail:user.userName, grantManagerEmails:caseManagerEmails, adminEmails:adminEmails]
    }

    def addDefaultsToCC(ccEmails, emailAddresses) {
        if (!ccEmails instanceof Collection) {
            ccEmails = [ccEmails]
        }
        ccEmails << grailsApplication.config.merit.support.email
        if (!ccEmails.contains(emailAddresses.userEmail)) {
            ccEmails << emailAddresses.userEmail
        }
        return ccEmails
    }

    def createEmailBodyText(template, model) {
        String templateText = settingService.getSettingText(template)
        GStringTemplateEngine templateEngine = new GStringTemplateEngine();
        return templateEngine.createTemplate(templateText).make(model).toString()
    }

}
