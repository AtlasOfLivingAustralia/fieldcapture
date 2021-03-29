package au.org.ala.merit

/**
 * The ProjectConfigurationService is responsible for obtaining the configuration used to present a project in MERIT.
 *
 * The configuration specifies things like the template used to render the project page, the type and frequency of
 * project reporting and how activity / report data entry behaves.
 *
 * It is mostly based on the program under which the project is being run.
 */
class ProjectConfigurationService {

    ProgramService programService
    MetadataService metadataService
    ManagementUnitService managementUnitService

    ProgramConfig getProjectConfiguration(Map project) {
        ProgramConfig programConfig

        if (project.programId) {
            programConfig = buildConfigFromProgram(project)
        }
        else {
            programConfig = buildDefaultConfig(project)
        }

        programConfig.autogeneratedActivities = hasAutogeneratedActivities(programConfig)
        programConfig
    }

    private ProgramConfig buildConfigFromProgram(Map project) {
        Map program = programService.get(project.programId)
        ProgramConfig programConfig = new ProgramConfig(program.inheritedConfig ?: [:])
        if (!programConfig.activityBasedReporting) {
            programConfig.services = metadataService.getProjectServices()
            if (programConfig.supportedServiceIds) {
                List supportedServiceIds = programConfig.supportedServiceIds?.collect{it as Integer}
                programConfig.services = programConfig.services.findAll{it.id in supportedServiceIds}
            }
        }
        // Outcomes are defined by the program
        programConfig.outcomes = program.outcomes ?: []
        programConfig.priorities = program.priorities ?: []
        programConfig.themes = program.themes ?: []
        programConfig.program = program

        // The project configuration is mostly derived from the program it is run
        // under, but if it is delivered by the management unit arrangement, some
        // some of the configuration can be supplied by the management unit.
        if (project.managementUnitId) {
            Map managementUnit = managementUnitService.get(project.managementUnitId)
            Map config = managementUnit.config

            // There may be only a subset of the program assets/priorities that
            // actually exist within the boundary of the management unit.
            // (e.g. threatened species may be known to exist within some
            // management units but not others)
            if (managementUnit.priorities) {
                programConfig.priorities = managementUnit.priorities
            }
            // If the program doesn't define outcomes, use ones for the management unit.
            if (!programConfig.outcomes && managementUnit.outcomes) {
                programConfig.outcomes = managementUnit.outcomes
            }

            // Allow management units to override project reporting frequency
            List extraReports = []
            if (!programConfig.projectReports) {
                programConfig.projectReports = []
            }
            config.projectReports?.each { Map configuration ->
                Map programReport = programConfig.projectReports?.find {
                    return it.category == configuration.category && it.activityType == configuration.activityType
                }
                if (programReport) {
                    // Both the frequency and start date are required so the report dates
                    // align correctly.
                    programReport.reportingPeriodInMonths = configuration.reportingPeriodInMonths
                    programReport.firstReportingPeriodEnd = configuration.firstReportingPeriodEnd
                }
            }
            programConfig.projectReports?.addAll(extraReports)
        }
        programConfig
    }

    /**
     * This creates a configuration from the legacy MERIT programsModel.
     */
    private ProgramConfig buildDefaultConfig(Map project) {
        Map config = metadataService.getProgramConfiguration(project.associatedProgram, project.associatedSubProgram)
        ProgramConfig programConfig = new ProgramConfig(config)
        programConfig.activityBasedReporting = true

        // Default configuration for project stage reports.

        Integer reportingPeriodInMonths = 6 // Default period
        try {
            reportingPeriodInMonths = Integer.parseInt(programConfig.reportingPeriod)
        }
        catch (Exception e) {
            log.warn("Invalid period specified in program: "+programConfig.reportingPeriod)
        }

        programConfig.projectReports = [
                [
                        weekDaysToCompleteReport:programConfig.weekDaysToCompleteReport,
                        reportType:ReportService.REPORT_TYPE_STAGE_REPORT,
                        reportingPeriodInMonths: reportingPeriodInMonths,
                        reportsAlignedToCalendar: Boolean.valueOf(programConfig.reportingPeriodAlignedToCalendar),
                        reportNameFormat: "Stage %1d",
                        reportDescriptionFormat: "Stage %1d for ${project.name}"
                ]
        ]
        // The original MERIT project template required content be included (excluded by default) but we've
        // moved to an included by default model.
        programConfig.excludes = [ProgramConfig.ProjectContent.DATA_SETS.toString(), ProgramConfig.ProjectContent.MERI_PLAN.toString(), ProgramConfig.ProjectContent.RISKS_AND_THREATS.toString()]
        Map mapping = [
                'MERI Plan':  ProgramConfig.ProjectContent.MERI_PLAN.toString(),
                'Risks and Threats': ProgramConfig.ProjectContent.RISKS_AND_THREATS.toString()
        ]

        config.optionalProjectContent?.each { String content ->
            programConfig.excludes.remove(mapping[content])
        }

        programConfig.activities = config.activities
        programConfig
    }

    /**
     * A configuration consists of autogenerated activities if every report configuration specifies an activityType.
     * (Specifying an activity type will result in an activity being auto-generated for each report type).
     * @param config the project configuration to check.
     */
    private boolean hasAutogeneratedActivities(Map config) {

        boolean autogeneratedActivities = false
        if (config.projectReports) {
            autogeneratedActivities = config.projectReports.every{it.activityType != null}
        }

        autogeneratedActivities
    }
}
