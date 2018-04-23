package au.org.ala.merit;

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.web.json.JSONArray

import java.util.Map

class ProgramService {

    private static final String PROGRAM_DOCUMENT_FILTER = "className:au.org.ala.ecodata.Program"

    GrailsApplication grailsApplication
    WebService webService
    MetadataService metadataService
    ProjectService projectService
    UserService userService
    SearchService searchService
    DocumentService documentService
    ReportService reportService


    Map get(String id, String view = '') {


        String url = "${grailsApplication.config.ecodata.baseUrl}program/" + id + "?view=" + view.encodeAsURL()
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


        String url = "${grailsApplication.config.ecodata.baseUrl}program/?name=" + name.encodeAsURL()
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

}
