package au.org.ala.merit

import au.org.ala.merit.config.ProgramConfig
import spock.lang.Specification

class ProgramConfigSpec extends Specification {

    ProgramConfig programConfig

    void "Project content can be excluded via the excludes configuration"() {
        when:
        programConfig = new ProgramConfig(excludes:[ProgramConfig.ProjectContent.MERI_PLAN.toString()])

        then:
        programConfig.includesContent(ProgramConfig.ProjectContent.MERI_PLAN) == false
        programConfig.includesContent(ProgramConfig.ProjectContent.RISKS_AND_THREATS) == true
        programConfig.includesContent(ProgramConfig.ProjectContent.SITES) == true
        programConfig.includesContent(ProgramConfig.ProjectContent.DASHBOARD) == true

        when:
        programConfig = new ProgramConfig(excludes:[ProgramConfig.ProjectContent.SITES.toString(), ProgramConfig.ProjectContent.DASHBOARD.toString()])

        then:
        programConfig.includesContent(ProgramConfig.ProjectContent.MERI_PLAN) == true
        programConfig.includesContent(ProgramConfig.ProjectContent.RISKS_AND_THREATS) == true
        programConfig.includesContent(ProgramConfig.ProjectContent.SITES) == false
        programConfig.includesContent(ProgramConfig.ProjectContent.DASHBOARD) == false

        when:
        programConfig = new ProgramConfig(excludes:[
                ProgramConfig.ProjectContent.SITES.toString(), ProgramConfig.ProjectContent.DASHBOARD.toString(),
                ProgramConfig.ProjectContent.RISKS_AND_THREATS.toString(), ProgramConfig.ProjectContent.MERI_PLAN.toString()])

        then:
        programConfig.includesContent(ProgramConfig.ProjectContent.MERI_PLAN) == false
        programConfig.includesContent(ProgramConfig.ProjectContent.RISKS_AND_THREATS) == false
        programConfig.includesContent(ProgramConfig.ProjectContent.SITES) == false
        programConfig.includesContent(ProgramConfig.ProjectContent.DASHBOARD) == false

    }

    void "The program risk model depends on the project template if no explicit risk model is configured"() {
        when:
        programConfig = new ProgramConfig(projectTemplate: ProgramConfig.ProjectTemplate.ESP.toString())

        then:
        programConfig.riskModel() == "merit"

        when:
        programConfig = new ProgramConfig(projectTemplate: ProgramConfig.ProjectTemplate.RLP.toString())

        then:
        programConfig.riskModel() == "rlp"

        when:
        programConfig = new ProgramConfig(projectTemplate: ProgramConfig.ProjectTemplate.DEFAULT.toString())

        then:
        programConfig.riskModel() == "merit"

        when:
        programConfig = new ProgramConfig(projectTemplate: ProgramConfig.ProjectTemplate.RLP.toString(), riskModel: "ag")

        then:
        programConfig.riskModel() == "ag"
    }

    void "The project template is parsed case insensitively and defaults if missing or invalid"() {
        expect:
        new ProgramConfig(projectTemplate: configuredTemplate).getProjectTemplate() == expected

        where:
        configuredTemplate | expected
        'esp'              | ProgramConfig.ProjectTemplate.ESP
        'rlp'              | ProgramConfig.ProjectTemplate.RLP
        'meri'             | ProgramConfig.ProjectTemplate.MERI
        'RLP'              | ProgramConfig.ProjectTemplate.RLP
        null               | ProgramConfig.ProjectTemplate.DEFAULT
        ''                 | ProgramConfig.ProjectTemplate.DEFAULT
        'invalid'          | ProgramConfig.ProjectTemplate.DEFAULT
    }
}
