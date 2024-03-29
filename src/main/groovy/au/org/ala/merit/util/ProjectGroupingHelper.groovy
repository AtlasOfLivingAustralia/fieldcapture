package au.org.ala.merit.util

import au.org.ala.merit.MetadataService
import au.org.ala.merit.ProgramService
import au.org.ala.merit.ProjectService
import au.org.ala.merit.ReportService
import au.org.ala.merit.config.ProgramConfig
import au.org.ala.merit.config.ProgramServiceConfig
import au.org.ala.merit.config.ServiceConfig
import org.springframework.beans.factory.annotation.Autowired

/**
 * Utility class to support program based grouping of projects for use
 * by management unit and organisation pages.
 */
class ProjectGroupingHelper {

    @Autowired
    ProgramService programService
    @Autowired
    MetadataService metadataService
    @Autowired
    ReportService reportService
    @Autowired
    ProjectService projectService


    Map groupProjectsByProgram(List projects, List programGroups, List<String> reportQueryFacets, boolean approvedActivitiesOnly) {
        if (!projects) {
            return [programs:null, displayedPrograms:null]
        }
        String[] programIds = (projects.collect{it.programId} + programGroups).unique()
        List programs = programService.get(programIds)
        // This reverse alphabetical order is to satisfy a request to always
        // display the RLP first.
        programs = programs?.sort{it.name}?.reverse()


        LinkedHashMap programsByCategory = groupPrograms(programs, programGroups)
        // Now group the projects according to the program configuration.
        Map projectsByCategory = groupProjects(projects, programsByCategory)

        Map servicesWithScores = serviceScores(reportQueryFacets, programsByCategory, programs, approvedActivitiesOnly)

        List displayedPrograms = []
        // Aggregate the outcomes addressed by all projects in each program group
        projectsByCategory.each { String programId, List projectsInProgramGroup ->
            Map program = programs.find{it.programId == programId}

            List primaryOutcomes = findTargetedPrimaryOutcomes(program, projectsInProgramGroup)
            List secondaryOutcomes = findTargetedSecondaryOutcomes(program, projectsInProgramGroup)
            displayedPrograms << [program:program, projects: projectsInProgramGroup, servicesWithScores:servicesWithScores[programId], primaryOutcomes:primaryOutcomes, secondaryOutcomes:secondaryOutcomes]
        }

        [programs:programs, displayedPrograms: displayedPrograms]
    }

    /**
     * This method will group programs based on whether they or a parent program falls into
     * one of the configured program groups.
     * Programs that don't fall into a group will result in the creation of a new group.
     */
    private LinkedHashMap<String, List> groupPrograms(List programs, List programGroups) {
        Map programsByCategory = new LinkedHashMap().withDefault{[]} // LinkedHashMap is to preserve the order specified by programGroups
        // Group programs according to their hierarchy under the configured groups.
        programs?.each { Map program ->
            boolean categorized = false
            if (programService.canViewProgram(program)) {
                programGroups.each { String programId ->
                    if (programService.isInProgramHierarchy(program, programId)) {
                        programsByCategory[programId] << program
                        categorized = true
                    }
                }
                // This project doesn't fall into a group specified by the config so create a new group for it.
                if (!categorized) {
                    programsByCategory[program.programId] << program
                }
            }

        }
        programsByCategory
    }

    static private Map<String, List> groupProjects(List projects, Map programsByCategory) {

        Map projectsByCategory = [:].withDefault{[]}
        projects.each { Map project ->
            Map.Entry categoryGroup = programsByCategory.find{ String k, List v ->
                v && v.find{project.programId == it.programId}
            }
            // Programs configured as "private" won't have be in the programsByCategory map.
            // Projects in programs configured as "private" should not be displayed.
            if (categoryGroup) {
                projectsByCategory[categoryGroup.key] << project
            }

        }
        projectsByCategory
    }

    /**
     * Returns a list of program primary outcomes, with an extra entry (targeted) specifying whether any project
     * has targeted that outcome as the primary outcome of the project.
     * @param program the program.
     * @param projects all projects run under the program in the management unit
     */
    private List findTargetedPrimaryOutcomes(Map program, List projects) {
        List outcomes = programService.getPrimaryOutcomes(program).collect{[outcome:it.outcome, shortDescription:it.shortDescription]}
        for(Map project in projects){
            String outcome = projectService.getPrimaryOutcome(project)
            if (outcome){
                Map oc =  outcomes.find {it.outcome == outcome}
                if (oc) {
                    oc['targeted'] = true // at least one project is targeting this outcome as the primary outcome.
                }
            }
        }
        outcomes
    }

    /**
     * Returns a list of program primary outcomes, with an extra entry (targeted) specifying whether any project
     * has targeted that outcome as the primary outcome of the project.
     * @param program the program.
     * @param projects all projects run under the program in the management unit
     */
    private List findTargetedSecondaryOutcomes(Map program, List projects) {
        List outcomes = programService.getSecondaryOutcomes(program).collect{[outcome:it.outcome, shortDescription:it.shortDescription]}
        for(Map project in projects){
            List projectOutcomes = projectService.getSecondaryOutcomes(project)
            outcomes.findAll { it.outcome in projectOutcomes }.each {
                it['targeted'] = true
            }
        }
        outcomes
    }

    /**
     * Get scores of each program in the groups
     * @return [programId: serviceScores]
     */
    private Map serviceScores(List reportQueryFacets, Map programGroups, List programs, boolean approvedActivitiesOnly = true) {
        List<Map> allServices = metadataService.getProjectServices()

        def results = [:]

        for(Map.Entry programGroup in programGroups) {
            List programsForGroup = programGroup.value
            List programIdFacets = programsForGroup.collect{"programId:${it.programId}"}

            List programScores = []
            programsForGroup.each { Map program ->
                ProgramServiceConfig config = new ProgramConfig(program.config).getProgramServices()
                println "Processing program ${program.name}"
                for (ServiceConfig serviceConfig in config?.programServices) {
                    if (serviceConfig.serviceTargets) {
                        programScores.addAll(serviceConfig.serviceTargets)
                    }
                    else {
                        Map service = allServices.find({it.id == serviceConfig.serviceId})
                        programScores.addAll(service?.scores?.collect{score -> score.scoreId})
                    }
                }
            }
            programScores = programScores.unique()
            List facets = reportQueryFacets + programIdFacets
            Map scoreResults = reportService.targetsForScoreIds(programScores, facets, approvedActivitiesOnly)

            List deliveredServices = []
            allServices.each { Map service ->
                Map copy = [:]
                copy.putAll(service)
                copy.scores = []
                service.scores?.each { score ->
                    Map copiedScore = [:]
                    copiedScore.putAll(score)
                    Map result = scoreResults?.scores?.find{it.scoreId == score.scoreId}

                    copiedScore.target = result?.target ?: 0
                    copiedScore.result = result?.result ?: [result:0, count:0]

                    // We only want to report on services that are going to be delivered by this program.
                    if (copiedScore.target) {
                        copy.scores << copiedScore
                    }

                }
                if (copy.scores) {
                    deliveredServices << copy
                }

            }

            results[programGroup.key]=deliveredServices
        }
        results

    }
}
