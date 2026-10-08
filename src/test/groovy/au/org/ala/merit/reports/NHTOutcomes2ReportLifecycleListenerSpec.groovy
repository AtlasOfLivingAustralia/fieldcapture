package au.org.ala.merit.reports


import au.org.ala.merit.ProjectConfigurationService
import au.org.ala.merit.PublicationStatus
import au.org.ala.merit.config.ProgramConfig
import spock.lang.Specification

class NHTOutcomes2ReportLifecycleListenerSpec extends Specification {

    NHTOutcomes2ReportLifecycleListener reportData = new NHTOutcomes2ReportLifecycleListener()

    ProjectConfigurationService projectConfigurationService = Mock(ProjectConfigurationService)
    def setup() {
        reportData.projectConfigurationService = projectConfigurationService
    }

    def "returns both shortTermOutcomes and midTermOutcomes if no previous report exists"() {
        setup:
        Map project = [
            custom: [details: [outcomes: [
                shortTermOutcomes: [[code: 'ST1', description: 'Short']],
                midTermOutcomes: [[code: 'MT1', description: 'Mid']]
            ]]]
        ]
        Map report = [:]
        Map activity = [:]

        when:
        Map contextData = reportData.getContextData(project, report, activity)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> Mock(ProgramConfig) {
            excludeShortTermOutcomesIfReportNotRequired() >> false
        }
        contextData.projectOutcomes.size() == 2
        contextData.projectOutcomes[0].code == 'ST1'
        contextData.projectOutcomes[1].code == 'MT1'
    }

    def "returns only midTermOutcomes if previous NHT Outcomes 1 Report exists and is not cancelled"() {
        setup:
        Map project = [
            reports: [[activityType: 'NHT Outcomes 1 Report', publicationStatus: 'ACTIVE']],
            custom: [details: [outcomes: [
                shortTermOutcomes: [[code: 'ST1', description: 'Short']],
                midTermOutcomes: [[code: 'MT1', description: 'Mid']]
            ]]]
        ]
        Map report = [:]
        Map activity = [:]

        when:
        Map contextData = reportData.getContextData(project, report, activity)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> Mock(ProgramConfig) {
            excludeShortTermOutcomesIfReportNotRequired() >> false
        }
        contextData.projectOutcomes.size() == 1
        contextData.projectOutcomes[0].code == 'MT1'
    }

    def "returns both midTermOutcomes and shortTermOutcomes if previous NHT Outcomes 1 Report exists and is cancelled"() {
        setup:
        Map project = [
                reports: [[activityType: 'NHT Outcomes 1 Report', publicationStatus: PublicationStatus.CANCELLED]],
                custom: [details: [outcomes: [
                        shortTermOutcomes: [[code: 'ST1', description: 'Short']],
                        midTermOutcomes: [[code: 'MT1', description: 'Mid']]
                ]]]
        ]
        Map report = [:]
        Map activity = [:]

        when:
        Map contextData = reportData.getContextData(project, report, activity)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> Mock(ProgramConfig) {
            excludeShortTermOutcomesIfReportNotRequired() >> false
        }
        contextData.projectOutcomes.size() == 2
        contextData.projectOutcomes[0].code == 'ST1'
        contextData.projectOutcomes[1].code == 'MT1'
    }

    def "returns only midTermOutcomes if the NHT Outcomes 1 Report is cancelled and the config specifies the short term outcomes should be excluded"() {
        setup:
        Map project = [
                reports: [[activityType: 'NHT Outcomes 1 Report', publicationStatus: PublicationStatus.CANCELLED]],
                custom: [details: [outcomes: [
                        shortTermOutcomes: [[code: 'ST1', description: 'Short']],
                        midTermOutcomes: [[code: 'MT1', description: 'Mid']]
                ]]]
        ]
        Map report = [:]
        Map activity = [:]

        when:
        Map contextData = reportData.getContextData(project, report, activity)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> Mock(ProgramConfig) {
            excludeShortTermOutcomesIfReportNotRequired() >> true
        }
        contextData.projectOutcomes.size() == 1
        contextData.projectOutcomes[0].code == 'MT1'
    }

    def "returns only midTermOutcomes if shortTermOutcomes is missing"() {
        setup:
        Map project = [
            custom: [details: [outcomes: [
                midTermOutcomes: [[code: 'MT1', description: 'Mid']]
            ]]]
        ]
        Map report = [:]
        Map activity = [:]

        when:
        Map contextData = reportData.getContextData(project, report, activity)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> Mock(ProgramConfig) {
            excludeShortTermOutcomesIfReportNotRequired() >> false
        }
        contextData.projectOutcomes.size() == 1
        contextData.projectOutcomes[0].code == 'MT1'
    }

    def "returns empty list if neither outcome type is present"() {
        setup:
        Map project = [custom: [details: [outcomes: [:]]]]
        Map report = [:]
        Map activity = [:]

        when:
        Map contextData = reportData.getContextData(project, report, activity)

        then:
        1 * projectConfigurationService.getProjectConfiguration(project) >> Mock(ProgramConfig) {
            excludeShortTermOutcomesIfReportNotRequired() >> false
        }
        contextData.projectOutcomes == []
    }
}
