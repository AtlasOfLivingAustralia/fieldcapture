package au.org.ala.merit

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
}
