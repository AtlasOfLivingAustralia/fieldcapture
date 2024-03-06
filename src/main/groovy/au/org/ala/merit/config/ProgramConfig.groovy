package au.org.ala.merit.config

import au.org.ala.merit.SettingPageType
import groovy.util.logging.Slf4j

/**
 * Manages the various configuration points that a project can use to specify behaviour.
 * Currently the configuration of a project is owned by the projects program.
 */
@Slf4j
class ProgramConfig implements Map {

    public static final String PLAN_SUBMITTED_EMAIL_TEMPLATE_CONFIG_ITEM = "planSubmittedEmailTemplate"
    public static final String PLAN_APPROVED_EMAIL_TEMPLATE_CONFIG_ITEM = "planApprovedEmailTemplate"
    public static final String PLAN_RETURNED_EMAIL_TEMPLATE_CONFIG_ITEM = "planReturnedEmailTemplate"
    public static final String REPORT_SUBMITTED_EMAIL_TEMPLATE_CONFIG_ITEM = "reportSubmittedEmailTemplate"
    public static final String REPORT_APPROVED_EMAIL_TEMPLATE_CONFIG_ITEM = "reportApprovedEmailTemplate"
    public static final String REPORT_RETURNED_EMAIL_TEMPLATE_CONFIG_ITEM = "reportReturnedEmailTemplate"
    public static final String REPORT_ADJUSTED_EMAIL_TEMPLATE_CONFIG_ITEM = "reportAdjustedEmailTemplate"

    /** Items that can be omitted or included in the default project view */
    enum ProjectContent { MERI_PLAN, RISKS_AND_THREATS, SITES, DASHBOARD, DOCUMENTS, DATA_SETS, REPORTING }

    /** Different project views */
    enum ProjectTemplate {
        ESP,
        RLP,
        DEFAULT
    }

    @Delegate Map config

    /** List of service ids that are supported by this program */
    ProgramServiceConfig getProgramServices() {
        ProgramServiceConfig programServiceConfig = null
        if (config.programServiceConfig) {
            programServiceConfig = new ProgramServiceConfig(config.programServiceConfig)
        }
        programServiceConfig
    }

    ProgramConfig(Map config) {
        this.config = new HashMap(config ?: [:])
    }

    ProjectTemplate getProjectTemplate() {
        ProjectTemplate template = ProjectTemplate.DEFAULT
        if (config.projectTemplate) {
            template = ProjectTemplate.valueOf(config.projectTemplate?.toUpperCase())

            if (!template) {
                log.warn("Invalid projectTemplate specified in configuration: "+config.projectTemplate+". Using default")
                template = ProjectTemplate.DEFAULT
            }
        }
        template
    }

    EmailTemplate getPlanSubmittedTemplate() {
        emailTemplateWithDefault(PLAN_SUBMITTED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_PLAN_SUBMITTED_EMAIL_TEMPLATE)
    }

    EmailTemplate getPlanApprovedTemplate() {
        emailTemplateWithDefault(PLAN_APPROVED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_PLAN_APPROVED_EMAIL_TEMPLATE)
    }

    EmailTemplate getPlanReturnedTemplate() {
        emailTemplateWithDefault(PLAN_RETURNED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_PLAN_RETURNED_EMAIL_TEMPLATE)
    }

    EmailTemplate getReportSubmittedTemplate() {
        emailTemplateWithDefault(REPORT_SUBMITTED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_REPORT_SUBMITTED_EMAIL_TEMPLATE)
    }

    EmailTemplate getReportApprovedTemplate() {
        emailTemplateWithDefault(REPORT_APPROVED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_REPORT_APPROVED_EMAIL_TEMPLATE)
    }

    EmailTemplate getReportReturnedTemplate() {
        emailTemplateWithDefault(REPORT_RETURNED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_REPORT_RETURNED_EMAIL_TEMPLATE)
    }

    EmailTemplate getReportAdjustedTemplate() {
        emailTemplateWithDefault(REPORT_ADJUSTED_EMAIL_TEMPLATE_CONFIG_ITEM, EmailTemplate.DEFAULT_REPORT_ADJUSTED_EMAIL_TEMPLATE)
    }

    private EmailTemplate emailTemplateWithDefault(String name, EmailTemplate defaultTemplate) {
        if (!config.emailTemplates || !config.emailTemplates[name]) {
            return defaultTemplate
        }
        EmailTemplate emailTemplate = EmailTemplate.valueOf(config.emailTemplates[name].toUpperCase())
        if (!emailTemplate) {
            log.warn("Invalid emailTemplate specified in configuration: "+name+". Using default")
            emailTemplate = defaultTemplate
        }
        emailTemplate
    }

    SettingPageType getDeclarationTemplate() {
        return SettingPageType.getForName(config.declarationPageType ?: 'rlpReportDeclaration')
    }



    boolean projectsMustStartAndEndOnContractDates

    String projectTemplate

    /** A list of activities that can be undertaken by projects run under this program */
    List<String> activities
    String speciesConfiguration


    /**
     * If the supplied report was generated via this program configuration, the configuration used to generate
     * the report will be returned.  Otherwise this method returns null.
     * This is currently used to determine if a report is eligible for an adjustment.
     */
    ReportConfig findProjectReportConfigForReport(Map report) {
        findProjectReportConfigForActivityType(report.activityType)
    }

    ReportConfig findProjectReportConfigForActivityType(String activityType) {
        Map reportConfig = config.projectReports?.find{it.activityType == activityType}
        return reportConfig ? new ReportConfig(reportConfig) : null
    }

    boolean activitiesRequireLocking
    String activityNavigationMode // stay on page or return

    boolean includesContent(ProjectContent content) {
        !config.excludes || !config.excludes.contains(content.toString())
    }

    /**
     * This flag controls whether a grant/project manager can return a meri plan to a project officer for further work
     * or whether a MERIT admin needs to return it. */
    boolean requireMeritAdminToReturnMeriPlan = false

    /** This flag controls whether projects under this program are visible by users without directly assigned access or an elevated role in the MERIT hub */
    String visibility = "public"

    /** This flag controls whether a user with the MERIT read only role can view projects when the visibility is set to "private" */
    boolean readOnlyUsersCanViewWhenPrivate = false

    /** This flag controls whether the project is using the new meri plan template(2023) */
    boolean supportsMeriPlanComparison = false

    boolean supportsOutcomeTargets() {
        Map template = config.meriPlanContents?.find{ it.template == "serviceOutcomeTargets"}
        template != null
    }

}



