package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import au.org.ala.merit.config.ReportConfig
import au.org.ala.merit.reports.ReportGenerationOptions
import au.org.ala.merit.reports.ReportOwner;
import grails.core.GrailsApplication
import grails.plugin.cache.Cacheable
import groovy.util.logging.Slf4j
import org.grails.web.json.JSONArray

@Slf4j
class ProgramService {

    private static final String PROGRAM_DOCUMENT_FILTER = "className:au.org.ala.ecodata.Program"
    public static final String OUTCOME_TYPE_PRIMARY_ONLY = 'primary'
    public static final String OUTCOME_TYPE_SECONDARY_ONLY = 'secondary'


    GrailsApplication grailsApplication
    WebService webService
    MetadataService metadataService
    UserService userService
    SearchService searchService
    DocumentService documentService
    ReportService reportService
    ProjectService projectService

    Map get(String id) {
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}program/$id"
        Map program = webService.getJson(url)
        Map results = documentService.search(programId:id)
        if (results && results.documents) {
            List categorisedDocs = results.documents.split{it.type == DocumentService.TYPE_LINK}

            program.links = new JSONArray(categorisedDocs[0])
            program.documents = new JSONArray(categorisedDocs[1])
        }

        program.reports = reportService.findReportsForProgram(id)
        program
    }

    List get(String[] ids) {
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}programs"
        Map result  = webService.doPost(url,[programIds:ids])
        List programs
        if(result.resp){
            programs = result.resp
        }else if(result.error){
            log.error(result.error)
        }
        programs
    }

    Map getByName(String name) {

        String encodedName = URLEncoder.encode(name, 'UTF-8')
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}program/findByName?name=$encodedName"
        Map program = webService.getJson(url)

        if(program && program.statusCode == 404) {
            program = [:]
        }

        return program
    }

    String validate(Map props, String programId) {
        String error = null
        boolean creating = !programId

        if (!creating) {
            Map existingProgram = get(programId)
            if (existingProgram?.error) {
                return "invalid programId"
            }
        }

        if (creating && !props?.description) {
            //error, no description
            return "description is missing"
        }

        if (props.containsKey("name")) {
            Map existingProgram = getByName(props.name)
            if ((existingProgram as Boolean) && (creating || existingProgram?.programId != programId)) {
                return "name is not unique"
            }
        } else if (creating) {
            //error, no project name
            return "name is missing"
        }

        error
    }

    Map update(String id, Map program) {
        Map result = [:]

        def error = validate(program, id)
        if (error) {
            result.error = error
            result.detail = ''
        } else {
            if (!id) {
                // Assign the MERIT hubId to the program when creating a new program
                program.hubId = SettingService.hubConfig?.hubId
            }
            String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}program/$id"
            result = webService.doPost(url, program)
        }
        result

    }

    List serviceScores(String programId, boolean approvedActivitiesOnly = true) {
        List<Map> allServices = metadataService.getProjectServices()
        List scoreIds = allServices.collect{it.scores?.collect{score -> score.scoreId}}.flatten()

        Map scoreResults = reportService.targetsForScoreIds(scoreIds, ["programId:${programId}"], approvedActivitiesOnly)

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

        deliveredServices
    }


    void regenerateReports(String id, List<String> programReportCategories = null, List<String> projectReportCategories = null) {
        Map program = get(id)

        regenerateProgramReports(program, programReportCategories)
        regenerateProjectReports(program, projectReportCategories)
    }

    private void regenerateProgramReports(Map program, List<String> reportCategories = null) {

        List programReportConfig = program.config?.programReports?.collect{new ReportConfig(it)}
        ReportOwner owner = new ReportOwner(
                id:[programId:program.programId],
                name:program.name,
                periodStart:program.startDate,
                periodEnd:program.endDate
        )
        reportService.regenerateAll(program.reports, programReportConfig, owner, reportCategories)
    }

    private void regenerateProjectReports(Map program, List<String> reportCategories = null) {

        Map projects = getProgramProjects(program.programId)
        projects?.projects?.each{ project ->
            project.reports = reportService.getReportsForProject(project.projectId)
            if (projectService.canBulkRegenerateReports(project)) {
                projectService.generateProjectStageReports(project.projectId, new ReportGenerationOptions(), reportCategories)
            }
        }

    }

    Map getProgramProjects(String id) {
        String url = "${grailsApplication.config.getProperty('ecodata.baseUrl')}program/$id/projects?view=flat"
        Map resp = webService.getJson(url)
        return resp
    }

    Map submitReport(String programId, String reportId) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)
        return reportService.submitReport(reportId, reportData.reportActivities, reportData.program, reportData.members, EmailTemplate.RLP_CORE_SERVCIES_REPORT_SUBMITTED_EMAIL_TEMPLATE)
    }

    Map approveReport(String programId, String reportId, String reason) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)
        return reportService.approveReport(reportId, reportData.reportActivities, reason, reportData.program, reportData.members, EmailTemplate.RLP_CORE_SERVICES_REPORT_APPROVED_EMAIL_TEMPLATE)
    }

    def rejectReport(String programId, String reportId, String reason, List categories) {
        Map reportData = setupReportLifeCycleChange(programId, reportId)

        return reportService.rejectReport(reportId, reportData.reportActivities, reason, categories, reportData.program, reportData.members, EmailTemplate.RLP_CORE_SERVICES_REPORT_RETURNED_EMAIL_TEMPLATE)
    }

    /**
     * Performs the common setup required for a report lifecycle state change (e.g. submit/approve/return)
     * @param programId the ID of the program that owns the report
     * @param reportId The report about to undergo a change.
     * @return a Map with keys [program, reportActivities, programMembers]
     */
    private Map setupReportLifeCycleChange(String programId, String reportId) {
        Map program = get(programId)
        List members = getMembersOfProgram(programId)
        Map report = reportService.get(reportId)
        // All program reports are of type "Single Activity" at the moment.
        List reportActivities = [report.activityId]

        [program:program, reportActivities:reportActivities, members:members]
    }


    List getMembersOfProgram(String programId) {
        Map resp = userService.getMembersOfProgram(programId)

        resp?.members ?: []
    }

    /**
     * Adds a user with the supplied role to the identified program.
     *
     * @param userId the id of the user to add permissions for.
     * @param programId the program to add permissions for.
     * @param role the role to assign to the user.
     */
    Map addUserAsRoleToProgram(String userId, String programId, String role) {
        userService.addUserAsRoleToProgram(userId, programId, role)
    }

    /**
     * Removes the user access with the supplied role from the identified program.
     *
     * @param userId the id of the user to remove permissions for.
     * @param programId the program to remove permissions for.

     */
    def removeUserWithRoleFromProgram(String userId, String programId, String role) {
        userService.removeUserWithRoleFromProgram(userId, programId, role)
    }

    /**
     * Returns true if a Program is either equal to or a child of another program.
     * @param program The Program to check.
     * @param programId The Program to compare against.
     */
    boolean isInProgramHierarchy(Map program, String programId) {
        if (program.programId == programId) {
            return true
        }
        Map parent = program.parent
        while (parent && parent.programId != programId) {
            parent = parent.parent
        }
        parent && parent.programId == programId
    }

    boolean canViewProgram(Map program) {
        program.config?.visibility != 'private' || userService.userIsSiteAdmin()
    }

    List<Map> getPrimaryOutcomes(Map program) {
        program?.outcomes.findAll {it.type == OUTCOME_TYPE_PRIMARY_ONLY || !it.type}
    }
    List<Map> getSecondaryOutcomes(Map program) {
        program?.outcomes.findAll {it.type == OUTCOME_TYPE_SECONDARY_ONLY || !it.type}
    }

    @Cacheable("programList")
    List<Map> listOfAllPrograms(){
        return webService.getJson("${grailsApplication.config.getProperty('ecodata.baseUrl')}program/listOfAllPrograms")
    }

     Map reindexProjects(String programId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl')+"admin/reindexProjects"
        Map params = [programId:programId]

        Map resp = webService.doPost(url, params)
         resp
    }

}
