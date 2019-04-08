/*
 * Copyright (C) 2013 Atlas of Living Australia
 * All Rights Reserved.
 *
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 */

package au.org.ala.merit

/**
 * Enum class for static content (Setting Page)
 *
 * @author "Nick dos Remedios <Nick.dosRemedios@csiro.au>"
 */
enum SettingPageType {
    TITLE ("title", "Title", "fielddata.title.text"),
    ABOUT ("about","About","fielddata.about.text"),
    DESCRIPTION ("description","Description","fielddata.description.text"),
    FOOTER ("footer","Footer","fielddata.footer.text"),
    ANNOUNCEMENT ("announcement","Announcement","fielddata.announcement.text"),
    HELP ("help","Help","fielddata.help.text"),
    NEWS ("news","News","fielddata.news.text"),
    CONTACTS ("contacts","Contacts","fielddata.contacts.text"),
    INTRO ("intro","User Introduction","fielddata.introduction.text"),
    REEF_2050_PLAN_REPORT("reef2050PlanReport", "Reef 2050 Plan Stage 3 Report Text", "fielddata.reef2050Plan.report"),
    DECLARATION ('declaration', "Legal Declaration", "fielddata.declaration.text"),
    ESP_DECLARATION('espDeclaration', "Legal Declaration", 'fielddata.espDeclaration.text'),
    ORGANISATION_DECLARATION ('organisation-declaration', "Legal Declaration", "fielddata.organisation.declarationText"),
    REPORT_SUBMITTED_EMAIL('reportSubmitted', 'Report has been submitted email body text', 'fielddata.reportSubmitted.emailText'),
    REPORT_APPROVED_EMAIL('reportApproved', 'Report has been approved email body text', 'fielddata.reportApproved.emailText'),
    REPORT_REJECTED_EMAIL('reportRejected', 'Report has been rejected email body text', 'fielddata.reportRejected.emailText'),
    REPORT_SUBMITTED_EMAIL_SUBJECT_LINE('reportSubmittedSubject', 'Subject line for the \'Report has been submitted\' email', 'fielddata.reportSubmitted.emailSubject'),
    REPORT_APPROVED_EMAIL_SUBJECT_LINE('reportApprovedSubject', 'Subject line for the \'Report has been approved\' email', 'fielddata.reportApproved.emailSubject'),
    REPORT_REJECTED_EMAIL_SUBJECT_LINE('reportRejectedSubject', 'Subject line for the \'Report has been rejected\' email', 'fielddata.reportRejected.emailSubject'),
    PLAN_SUBMITTED_EMAIL('planSubmitted', 'Project plan has been submitted email body text', 'fielddata.planSubmitted.emailText'),
    PLAN_APPROVED_EMAIL('planApproved', 'Project plan has been approved email body text', 'fielddata.planApproved.emailText'),
    PLAN_REJECTED_EMAIL('planRejected', 'Project plan has been rejected email body text', 'fielddata.planRejected.emailText'),
    PLAN_SUBMITTED_EMAIL_SUBJECT_LINE('planSubmittedSubject', 'Subject line for the \'Project plan has been submitted\' email', 'fielddata.planSubmitted.emailSubject'),
    PLAN_APPROVED_EMAIL_SUBJECT_LINE('planApprovedSubject', 'Subject line for the \'Project plan has been approved\' email', 'fielddata.planApproved.emailSubject'),
    PLAN_REJECTED_EMAIL_SUBJECT_LINE('planRejectedSubject', 'Subject line for the \'Project plan has been rejected\' email', 'fielddata.planRejected.emailSubject'), 
    PERFORMANCE_REPORT_SUBMITTED_EMAIL('performanceReportSubmitted', 'Report has been submitted email body text', 'fielddata.performanceReportSubmitted.emailText'),
    PERFORMANCE_REPORT_APPROVED_EMAIL('performanceReportApproved', 'Report has been approved email body text', 'fielddata.performanceReportApproved.emailText'),
    PERFORMANCE_REPORT_REJECTED_EMAIL('performanceReportRejected', 'Report has been rejected email body text', 'fielddata.performanceReportRejected.emailText'),
    PERFORMANCE_REPORT_SUBMITTED_EMAIL_SUBJECT_LINE('performanceReportSubmittedSubject', 'Subject line for the \'Report has been submitted\' email', 'fielddata.performanceReportSubmitted.emailSubject'),
    PERFORMANCE_REPORT_APPROVED_EMAIL_SUBJECT_LINE('performanceReportApprovedSubject', 'Subject line for the \'Report has been approved\' email', 'fielddata.performanceReportApproved.emailSubject'),
    PERFORMANCE_REPORT_REJECTED_EMAIL_SUBJECT_LINE('performanceReportRejectedSubject', 'Subject line for the \'Report has been rejected\' email', 'fielddata.performanceReportRejected.emailSubject'),
    THIRD_PARTY_PHOTO_CONSENT_DECLARATION('thirdPartyPhotoConsent', 'Declaration text for consent from third parties who appear in images', 'fielddata.thirdPartyConsent.text'),
    HELP_LINKS_TITLE('helpLinksTitle', 'Title for the Helpful Links section of the homepage', 'fielddata.helpLinksTitle.text'),
    ORGANISATION_LIST_PAGE_HEADER('organisationListHeader', 'Header content for the organisation list page', 'fielddata.organisationListHeader'),
    HOME_PAGE_STATISTICS('homePageStatistics', 'Configuration for the home page stats', 'statistics.config'),
    SERVICES('services', 'Configuration for project services', 'services.config'),
    DASHBOARD_EXPLANATION('dashboardExplanation', 'Header text under the dashboard report', 'fielddata.dashboardExplanation'),
    UNLOCK_PLAN_DECLARATION('unlockPlanDeclaration', 'Declaration', 'fielddata.unlockPlanDeclaration.text'),
    LOCK_STOLEN_EMAIL_SUBJECT('lockStolenSubject', 'Subject line when someone overrides a lock', 'fielddata.lock.subject'),
    LOCK_STOLEN_EMAIL('lockStolenEmail', 'Email content when someone overrides a lock', 'fielddata.lock.body'),
    RLP_MERI_DECLARATION('rlpMeriDeclaration', 'Declaration when submitting RLP reports or MERI Plan', 'fielddata.rlp.meri.declaration'),
    RLP_PLAN_SUBMITTED_EMAIL('rlpMeriPlanSubmitted', 'Project plan has been submitted email body text', 'fielddata.rlp.meriPlanSubmitted.emailText'),
    RLP_PLAN_APPROVED_EMAIL('rlpMeriPlanApproved', 'Project plan has been approved email body text', 'fielddata.rlp.meriPlanApproved.emailText'),
    RLP_PLAN_REJECTED_EMAIL('rlpMeriPlanRejected', 'Project plan has been rejected email body text', 'fielddata.rlp.meriPlanRejected.emailText'),
    RLP_PLAN_SUBMITTED_EMAIL_SUBJECT_LINE('rlpMeriPlanSubmittedSubject', 'Subject line for the \'Project plan has been submitted\' email', 'fielddata.rlp.meriPlanSubmitted.emailSubject'),
    RLP_PLAN_APPROVED_EMAIL_SUBJECT_LINE('rlpMeriPlanApprovedSubject', 'Subject line for the \'Project plan has been approved\' email', 'fielddata.rlp.meriPlanApproved.emailSubject'),
    RLP_PLAN_REJECTED_EMAIL_SUBJECT_LINE('rlpMeriPlanRejectedSubject', 'Subject line for the \'Project plan has been rejected\' email', 'fielddata.rlp.meriPlanRejected.emailSubject'),
    RLP_REPORT_DECLARATION('rlpReportDeclaration', 'Declaration when submitting RLP reports or MERI Plan', 'fielddata.rlp.report.declaration'),
    RLP_REPORT_SUBMITTED_EMAIL_SUBJECT('rlpReportSubmittedEmailSubject', 'RLP Report submitted email subject line text', 'fielddata.rlp.report.submitted.emailSubject'),
    RLP_REPORT_SUBMITTED_EMAIL_BODY('rlpReportSubmittedEmailBody', 'RLP Report submitted email subject body text', 'fielddata.rlp.report.submitted.emailBody'),
    RLP_REPORT_APPROVED_EMAIL_SUBJECT('rlpReportApprovedEmailSubject', 'RLP Report approved email subject line text', 'fielddata.rlp.report.approved.emailSubject'),
    RLP_REPORT_APPROVED_EMAIL_BODY('rlpReportApprovedEmailBody', 'RLP Report approved email body text', 'fielddata.rlp.report.approved.emailBody'),
    RLP_REPORT_RETURNED_EMAIL_SUBJECT('rlpReportReturnedEmailSubject', 'RLP Report returned email subject line text', 'fielddata.rlp.report.returned.emailSubject'),
    RLP_REPORT_RETURNED_EMAIL_BODY('rlpReportReturnedEmailBody', 'RLP Report returned email subject body text', 'fielddata.rlp.report.returned.emailBody'),
    RLP_CORE_SERVICES_REPORT_SUBMITTED_EMAIL_SUBJECT('rlpCSReportSubmittedEmailSubject', 'RLP Core Services Report submitted email subject line text', 'fielddata.rlp.cs_report.submitted.emailSubject'),
    RLP_CORE_SERVICES_REPORT_SUBMITTED_EMAIL_BODY('rlpCSReportSubmittedEmailBody', 'RLP Core Services Report submitted email body text', 'fielddata.rlp.cs_report.submitted.emailBody'),
    RLP_CORE_SERVICES_REPORT_APPROVED_EMAIL_SUBJECT('rlpCSReportApprovedEmailSubject', 'RLP Core Services Report approved email subject line text', 'fielddata.rlp.cs_report.approved.emailSubject'),
    RLP_CORE_SERVICES_REPORT_APPROVED_EMAIL_BODY('rlpCSReportApprovedEmailBody', 'RLP Core Services Report approved email body text', 'fielddata.rlp.cs_report.approved.emailBody'),
    RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_SUBJECT('rlpCSReportReturnedEmailSubject', 'RLP Core Services Report returned email subject line text', 'fielddata.rlp.cs_report.returned.emailSubject'),
    RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_BODY('rlpCSReportReturnedEmailBody', 'RLP Core Services Report returned email body text', 'fielddata.rlp.cs_report.returned.emailBody'),
    REPORT_ADJUSTED_EMAIL_SUBJECT_LINE('reportAdjustedEmailSubject', 'Report has been adjusted email subject line text', 'fielddata.report.adjusted.emailSubject'),
    REPORT_ADJUSTED_EMAIL_BODY('reportAdjustedEmailBody', 'Report has been adjusted email body text', 'fielddata.report.adjusted.emailBody'),
    REPORT_ADJUSTMENT_INSTRUCTIONS('reportAdjustmentInstructions', 'Instructions for pre-configuring the adjustment report', 'fielddata.report.adjustment.instructions')

    String name
    String title
    String key

    public SettingPageType(name, title, key) {
        this.name = name
        this.title = title
        this.key = key
    }

    public static SettingPageType getForName(String name) {
        for(SettingPageType s : values()){
            if (s.name == name){
                return s
            }
        }
    }

    public static SettingPageType getForKey(String key) {
        for(SettingPageType s : values()){
            if (s.key == key){
                return s
            }
        }
    }
}
