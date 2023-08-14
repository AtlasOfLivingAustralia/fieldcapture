package au.org.ala.merit.util

import au.org.ala.merit.MetadataService
import au.org.ala.merit.ProgramService
import au.org.ala.merit.ProjectService
import au.org.ala.merit.ReportService
import org.apache.tools.ant.Project
import spock.lang.Specification

class ProjectGroupingHelperSpec extends Specification {

    ProjectGroupingHelper projectGroupingHelper = new ProjectGroupingHelper()
    ProgramService programService = Mock(ProgramService)
    ProjectService projectService = Mock(ProjectService)
    MetadataService metadataService = Mock(MetadataService)
    ReportService reportService = Mock(ReportService)
    def setup() {
        projectGroupingHelper.programService = programService
        projectGroupingHelper.metadataService = metadataService
        projectGroupingHelper.reportService = reportService
        projectGroupingHelper.projectService = projectService

    }

    def "The management unit can specify the program groupings for producing the aggregate displays of outcomes, projects and dashboards"() {
        setup:
        Map p1 = [programId:'p1']
        Map p2 = [programId:'p2', parent:p1]
        Map p3 = [programId:'p3']
        Map p4 = [programId:'p4'] // This program will be uncategorized as it doesn't fall into the p1 or p3 hierarchy

        List projects = [[projectId:'p1', programId:'p1'], [projectId:'p2', programId:'p2'], [projectId:'p3', programId:'p3'], [projectId:'p4', programId:'p4']]
        programService.canViewProgram(_) >> true

        when: "We group the programs by the configured groupings"
        Map<String, List> groupedPrograms = projectGroupingHelper.groupPrograms([p1, p2, p3, p4], [p1.programId, p3.programId])

        then:
        1 * programService.isInProgramHierarchy(p1, 'p1') >> true
        1 * programService.isInProgramHierarchy(p2, 'p1') >> true
        1 * programService.isInProgramHierarchy(p3, 'p1') >> false
        1 * programService.isInProgramHierarchy(p3, 'p3') >> true
        1 * programService.isInProgramHierarchy(p4, 'p1') >> false
        1 * programService.isInProgramHierarchy(p4, 'p3') >> false

        and:
        groupedPrograms == ['p1':[p1, p2], 'p3':[p3], 'p4':[p4]]

        when: "We group the projects by the configured groupings"
        Map<String, List> groupedProjects = projectGroupingHelper.groupProjects(projects, groupedPrograms)

        then:
        groupedProjects == ['p1':[projects[0], projects[1]], 'p3':[projects[2]], 'p4':[projects[3]]]

    }

}
