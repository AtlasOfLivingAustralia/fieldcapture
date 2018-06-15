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

    Map getProjectConfiguration(Map project) {
        Map programConfig

        if (project.programId) {
            Map program = programService.get(project.programId)
            programConfig = program.inheritedConfig ?: [:]
            programConfig.services = metadataService.getProjectServices()
            programConfig.optionalProjectContent = ['MERI Plan', 'Risks and Threats']
            programConfig.priorities = program.priorities ?: []
            programConfig.outcomes = program.outcomes ?: []
            programConfig.themes = program.themes ?: []
            programConfig.program = program
        }
        else {
            programConfig = metadataService.getProgramConfiguration(project.associatedProgram, project.associatedSubProgram)

            // Default configuration for project stage reports.

            Integer reportingPeriodInMonths = 6 // Default period
            try {
                reportingPeriodInMonths = Integer.parseInt(programConfig.period)
            }
            catch (Exception e) {
                log.warn("Invalid period specified in program: "+programConfig.reportingPeriodInMonths)
            }

            programConfig.projectReports = [
                    [
                            reportType:ReportService.REPORT_TYPE_STAGE_REPORT,
                            reportingPeriodInMonths: reportingPeriodInMonths,
                            reportsAlignedToCalendar: Boolean.valueOf(programConfig.alignToCalendar),
                            reportNameFormat: "Stage %1d",
                            reportDescriptionFormat: "Stage %1d for ${project.name}"
                    ]
            ]

        }

        programConfig
    }
}
