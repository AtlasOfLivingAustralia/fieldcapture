package au.org.ala.merit

import au.org.ala.merit.reports.ReportConfig
import au.org.ala.merit.reports.ReportOwner;
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.web.json.JSONArray
import org.joda.time.DateTime

import java.util.Map

class ProgramService {

    private static final String PROGRAM_DOCUMENT_FILTER = "className:au.org.ala.ecodata.Program"

    GrailsApplication grailsApplication
    WebService webService
    MetadataService metadataService
    UserService userService
    SearchService searchService
    DocumentService documentService
    ReportService reportService
    ProjectService projectService
    EmailService emailService


    Map get(String id, String view = '') {

        String url = "${grailsApplication.config.ecodata.baseUrl}program/$id?view=" + view.encodeAsURL()
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

    Map getByName(String name) {


        String url = "${grailsApplication.config.ecodata.baseUrl}program/findByName?name=" + name.encodeAsURL()
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
            String url = "${grailsApplication.config.ecodata.baseUrl}program/$id"
            result = webService.doPost(url, program)
        }
        result

    }

    List serviceScores(String programId, boolean approvedActivitiesOnly = true) {
        List<Map> allServices = metadataService.getProjectServices()
        List scoreIds = allServices.collect{it.scoreIds}.flatten()

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

                copy.scores << copiedScore
            }
            deliveredServices << copy
        }

        deliveredServices
    }


    void regenerateReports(String id) {
        regenerateProgramReports(id)
        regenerateActivityReports(id)
    }

    void regenerateProgramReports(String id) {
        Map program = get(id)
        List programReportConfig = program.config?.programReports
        ReportOwner owner = new ReportOwner(
                id:[programId:program.programId],
                name:program.name,
                periodStart:program.startDate,
                periodEnd:program.endDate
        )
        programReportConfig?.each {
            ReportConfig reportConfig = new ReportConfig(it)
            List relevantReports = program.reports?.findAll{it.category == reportConfig.category}
            reportService.regenerateReports(relevantReports, reportConfig, owner)
        }
    }

    void regenerateActivityReports(String id) {
        Map program = get(id)
        Map activityReportConfig = program.config?.projectReports?.find{it.reportType==ReportService.REPORT_TYPE_STAGE_REPORT}
        if (activityReportConfig) {
            Map projects = getProgramProjects(id)
            projects?.projects?.each{ project ->
                project.reports = reportService.getReportsForProject(project.projectId)
                projectService.generateProjectReports(activityReportConfig, project)
            }
        }
    }

    Map getProgramProjects(String id) {
        String url = "${grailsApplication.config.ecodata.baseUrl}program/$id/projects"
        Map resp = webService.getJson(url)
        return resp
    }

    Map submitReport(String programId, String reportId) {

        Map program = get(programId)
        List members = getMembersOfProgram(programId)

        return reportService.submitReport(reportId, program, members, SettingPageType.RLP_REPORT_SUBMITTED_EMAIL_SUBJECT, SettingPageType.RLP_REPORT_SUBMITTED_EMAIL_BODY)
    }

    Map approveReport(String programId, String reportId, String reason) {
        Map program = get(programId)
        List members = getMembersOfProgram(programId)

        return reportService.approveReport(reportId, reason, program, members, SettingPageType.RLP_REPORT_APPROVED_EMAIL_SUBJECT, SettingPageType.RLP_REPORT_APPROVED_EMAIL_BODY)
    }

    def rejectReport(String programId, String reportId, String reason, String category) {
        Map program = get(programId)
        List members = getMembersOfProgram(programId)

        return reportService.rejectReport(reportId, reason, program, members, SettingPageType.RLP_REPORT_RETURNED_EMAIL_SUBJECT, SettingPageType.RLP_REPORT_RETURNED_EMAIL_BODY
        )
    }

    List getMembersOfProgram(String programId) {
        Map resp = userService.getMembersOfProgram(programId)

        resp?.members ?: []
    }

}
