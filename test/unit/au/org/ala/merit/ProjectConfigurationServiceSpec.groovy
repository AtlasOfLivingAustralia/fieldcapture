package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification

@TestFor(ProjectConfigurationService)
class ProjectConfigurationServiceSpec extends Specification {


    ProgramService programService = Mock(ProgramService)
    MetadataService metadataService = Mock(MetadataService)
    ManagementUnitService managementUnitService = Mock(ManagementUnitService)

    def setup() {
        service.programService = programService
        service.metadataService = metadataService
        service.managementUnitService = managementUnitService
    }

    def cleanup() {
    }

    void "Projects with a programId will use the associated program as a configuration source"() {

        setup:
        String programId = 'programId'
        Map project = [projectId:'project1', programId:programId]

        when:
        Map config = service.getProjectConfiguration(project)

        then:
        1 * programService.get(programId) >> [inheritedConfig:[projectReports:[], test:'test']]
        1 * metadataService.getProjectServices() >> []
        config.test == 'test'
    }


    void "Projects without a programId will use the metadata service program configuration as a configuration source"() {

        setup:
        Map project = [projectId:'project1', associatedProgram:'p1', associatedSubProgram:'p2']
        Map programConfig = [weekDaysToCompleteReport:42, reportType:ReportService.REPORT_TYPE_STAGE_REPORT, reportingPeriodInMonths:6, reportingPeriodAlignedToCalendar: true]

        when:
        Map config = service.getProjectConfiguration(project)

        then:
        1 * metadataService.getProgramConfiguration(project.associatedProgram, project.associatedSubProgram) >> programConfig
        config.projectReports.size() == 1
        config.projectReports[0].weekDaysToCompleteReport == programConfig.weekDaysToCompleteReport
        config.projectReports[0].reportType == programConfig.reportType
        config.projectReports[0].reportingPeriodInMonths == programConfig.reportingPeriodInMonths
        config.projectReports[0].reportsAlignedToCalendar == programConfig.reportingPeriodAlignedToCalendar
    }

    void "Projects where all reports have an activity type specified have autogenerated activities"() {
        setup:
        String programId = 'programId'
        Map project = [projectId:'project1', programId:programId]
        Map programConfig = [inheritedConfig:[projectReports:[[activityType:'1', reportType:ReportService.REPORT_TYPE_STAGE_REPORT]], test:'test']]

        when:
        Map config = service.getProjectConfiguration(project)

        then:
        1 * programService.get(programId) >> programConfig
        config.autogeneratedActivities == true

    }

    void "Traditional MERIT projects do not have autogenerated activities"() {
        Map project = [projectId:'project1', associatedProgram:'p1', associatedSubProgram:'p2']
        Map programConfig = [weekDaysToCompleteReport:42, reportType:ReportService.REPORT_TYPE_STAGE_REPORT, reportingPeriodInMonths:6, reportingPeriodAlignedToCalendar: true]

        when:
        Map config = service.getProjectConfiguration(project)

        then:
        1 * metadataService.getProgramConfiguration(project.associatedProgram, project.associatedSubProgram) >> programConfig
        config.autogeneratedActivities == false

    }

    void "The project configuration can be partially overridden by the management unit configuration"() {
        setup:
        String programId = 'programId'
        String muId = 'muId'
        Map project = [projectId:'project1', programId:programId, managementUnitId:muId]
        Map programConfig = [inheritedConfig:[projectReports:[[activityType:'1', reportingPeriodInMonths: 6, reportType:ReportService.REPORT_TYPE_STAGE_REPORT]], test:'test']]
        Map mu = [config:[projectReports:[[activityType:'1', reportingPeriodInMonths: 3]]]]

        when:
        Map config = service.getProjectConfiguration(project)

        then: "the reporting period has been derived from the management unit config"
        1 * programService.get(programId) >> programConfig
        1 * managementUnitService.get(muId) >> mu
        config.autogeneratedActivities == true
        config.projectReports[0].reportingPeriodInMonths == 3

        when:
        mu.config.projectReports << [activityType:'2']
        config = service.getProjectConfiguration(project)

        then: "The management unit config has specified an additional report type"
        1 * programService.get(programId) >> programConfig
        1 * managementUnitService.get(muId) >> mu
        config.projectReports.size() == 2
        config.projectReports[1].activityType == '2'

        when: "only the program specifies outcomes and priorities"
        programConfig.priorities = [[category:"Threatened species", priority:"Species 1" ]]
        programConfig.outcomes = [[name:"outcome 1"]]
        config = service.getProjectConfiguration(project)

        then: "the program priorities are used"
        1 * programService.get(programId) >> programConfig
        1 * managementUnitService.get(muId) >> mu
        config.priorities == programConfig.priorities
        config.outcomes == programConfig.outcomes

        when: "The management unit also supplies outcomes and/or priorities"
        mu.priorities = [[category:"Threatened species", priority:"Species 2" ]]
        mu.outcomes = [[name:"outcome 2"]]
        config = service.getProjectConfiguration(project)

        then: "The management unit outcomes and priorities are used"
        1 * programService.get(programId) >> programConfig
        1 * managementUnitService.get(muId) >> mu
        config.priorities == mu.priorities
        config.outcomes == mu.outcomes

    }

}
