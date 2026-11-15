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
        MERI,
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
        String configuredTemplate = config.projectTemplate
        if (configuredTemplate) {
            try {
                template = ProjectTemplate.valueOf(configuredTemplate.toUpperCase())
            }
            catch (IllegalArgumentException e) {
                log.warn("Invalid projectTemplate specified in configuration: "+configuredTemplate+". Using default")
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



    /*
     * Note: configuration items are stored in the delegate Map.  Since Groovy 5, declared fields/getters take
     * precedence over map entries during property access on classes implementing Map, so configuration items
     * are exposed as getters that delegate to the map (and return null if the item is not configured).
     * Items without a setter must be modified using put(key, value) rather than property assignment
     * (which will throw a ReadOnlyPropertyException).
     *
     * The projectTemplate configuration item is exposed as a ProjectTemplate via getProjectTemplate() above.
     */

    Boolean getProjectsMustStartAndEndOnContractDates() {
        config.projectsMustStartAndEndOnContractDates
    }

    /** A list of activities that can be undertaken by projects run under this program */
    List getActivities() {
        config.activities
    }

    void setActivities(List activities) {
        config.activities = activities
    }

    String getSpeciesConfiguration() {
        config.speciesConfiguration
    }


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

    Boolean getActivitiesRequireLocking() {
        config.activitiesRequireLocking
    }

    /** stay on page or return */
    String getActivityNavigationMode() {
        config.activityNavigationMode
    }

    void setActivityNavigationMode(String activityNavigationMode) {
        config.activityNavigationMode = activityNavigationMode
    }

    boolean includesContent(ProjectContent content) {
        !config.excludes || !config.excludes.contains(content.toString())
    }

    /**
     * This flag controls whether a grant/project manager can return a meri plan to a project officer for further work
     * or whether a MERIT admin needs to return it. */
    Boolean getRequireMeritAdminToReturnMeriPlan() {
        config.requireMeritAdminToReturnMeriPlan
    }

    /** This flag controls whether projects under this program are visible by users without directly assigned access or an elevated role in the MERIT hub ("public" or "private") */
    String getVisibility() {
        config.visibility
    }

    /** This flag controls whether a user with the MERIT read only role can view projects when the visibility is set to "private" */
    Boolean getReadOnlyUsersCanViewWhenPrivate() {
        config.readOnlyUsersCanViewWhenPrivate
    }

    /** This flag controls whether the project is using the new meri plan template(2023) */
    Boolean getSupportsMeriPlanComparison() {
        config.supportsMeriPlanComparison
    }

    boolean supportsOutcomeTargets() {
        Map template = config.meriPlanContents?.find{ it.template?.startsWith("serviceOutcomeTargets")}
        template != null
    }

    /** This flag controls whether the invoice field in the dashboard is shown */
    Boolean getShowsDashboardInvoiceField() {
        config.showsDashboardInvoiceField
    }

    String riskModel()  {
        config?.riskModel ?: getProjectTemplate() == ProjectTemplate.RLP ? "rlp" : "merit"
    }

    boolean excludeShortTermOutcomesIfReportNotRequired() {
        config?.excludeShortTermOutcomesIfReportNotRequired ?: false
    }

    boolean generateReportsOnMeriPlanApproval() {
        config?.generateReportsOnMeriPlanApproval ?: false
    }

    Boolean getShowReportDueDates() {
        config.showReportDueDates
    }

}



