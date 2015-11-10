package au.org.ala.merit

import au.com.bytecode.opencsv.CSVReader
import au.org.ala.fieldcapture.PreAuthorise
import grails.converters.JSON
import org.joda.time.Period
import org.springframework.web.multipart.MultipartHttpServletRequest

@PreAuthorise(accessLevel = 'officer', redirectController = "home")
class AdminController extends au.org.ala.fieldcapture.AdminController {

    OrganisationService organisationService
    BlogService blogService

    def gmsProjectImport() {
        render(view:'import', model:[:])
    }

    /**
     * Accepts a CSV file (as a multipart file upload) and validates and loads project, site & institution data from it.
     * @return an error message if the CSV file is invalid, otherwise writes a CSV file describing any validation
     * errors that were encountered.
     */
    def importProjectData() {

        if (params.newFormat) {
            gmsImport()
            return
        }
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('projectData')

            if (file) {

                def results = importService.importProjectsByCsv(file.inputStream, params.importWithErrors)

                if (results.error) {
                    render contentType: 'text/json', status:400, text:"""{"error":"${results.error}"}"""
                }
                else {
                    // Make sure the new projects are re-indexed.
                    //adminService.reIndexAll()
                }

                // The validation results are current returned as a CSV file so that it can easily be sent back to
                // be corrected at the source.  It's not great usability at the moment.
                response.setContentType("text/csv")
                PrintWriter pw = new PrintWriter(response.outputStream)
                results.validationErrors.each {
                    pw.println('"'+it.join('","')+'"')
                }
                pw.flush()
                return null
            }

        }

        render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
    }

    def gmsImport() {

        def file
        if (params.preview) {
            if (request instanceof MultipartHttpServletRequest) {
                def tmp = request.getFile('projectData')
                file = File.createTempFile(tmp.originalFilename, '.csv')
                tmp.transferTo(file)
                file.deleteOnExit()

                session.gmsFile = file
            }
        }
        else {
            file = session.gmsFile
            session.gmsFile = null
        }

        if (file) {
            def status = [finished: false, projects: []]
            session.status = status
            def fileIn = new FileInputStream(file)
            try {
                def result = importService.gmsImport(fileIn, status.projects, params.preview)
                status.finished = true
                status.error = result.error
            }
            finally {
                fileIn.close()
            }
            def statusJson = status as JSON
            render contentType: 'text/plain', status: 200, text: statusJson

        }
        else {
            render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
        }
    }

    def importStatus() {
        render session.status as JSON
    }

    /**
     * Accepts a CSV file (as a multipart file upload) and validates and bulk loads activity plan data for multiple projects.
     * @return an error message if the CSV file is invalid, otherwise writes a CSV file describing any validation
     * errors that were encountered.
     */
    def importPlanData() {
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('planData')

            if (file) {

                def results = importService.importPlansByCsv(file.inputStream, params.overwriteActivities)

                render results as JSON
            }

        }

        render contentType: 'text/json', status:400, text:'{"error":"No file supplied"}'
    }


    def populateAggregrateProjectData() {
        def result = [:]
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('activityData')

            if (file) {
                result = importService.populateAggregrateProjectData(file.inputStream, params.preview)
            }
        }

        def resultJSON = result as JSON
        // Write to file as the request will likely time out for a large load
        new File('/data/fieldcapture/biofundload.json').withWriter {it << resultJSON.toString(true)}

        render resultJSON
    }

    def nlpMigrate() {

        def results = []
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('nlpData')
            if (file) {
                def preview = params.preview == 'on'
                results = importService.doNlpMigration(file.inputStream, preview)
            }

        }
        render results as JSON
    }

    def generateProjectReports() {
        def projectId = params.projectId
        def activityType = params.activityType
        def period = params.period


        if (!projectId || !activityType || !period) {
            flash.errorMessage = 'Invalid inputs, no parameters may be null'
        }
        else {
            def result = projectService.createReportingActivitiesForProject(projectId, [[type:activityType, period:Period.months(period as Integer)]])
            flash.errorMessage = result.message
        }

        render view:'tools'
    }


    @PreAuthorise(accessLevel = 'alaAdmin')
    def bulkUploadSites() {

        if (request.respondsTo('getFile')) {
            def f = request.getFile('shapefile')

            def result =  importService.bulkImportSites(f)

            flash.message = result.message
            render view:'tools'


        } else {
            flash.message = 'No shapefile attached'
            render view:'tools'
        }
    }

    def allScores() {
        def scores = []
        def activityModel = metadataService.activitiesModel()
        activityModel.outputs.each { output ->
            def outputScores = output.scores.findAll{it.isOutputTarget}
            outputScores.each {
                scores << [output:output.name] + it
            }
        }

        render scores as JSON


    }


    def createMissingOrganisations() {

        def results = [errors:[], messages:[]]
        if (request instanceof MultipartHttpServletRequest) {
            def file = request.getFile('orgData')
            if (file) {
                CSVReader reader = new CSVReader(new InputStreamReader(file.inputStream, 'UTF-8'))
                String[] line = reader.readNext()
                line = reader.readNext() // Discard header line
                while (line) {

                    def currentOrgName = line[0]
                    def correctOrgName = line[3]

                    def orgResults = createOrg(currentOrgName, correctOrgName)
                    results.errors += orgResults.errors
                    results.messages += orgResults.messages

                    line = reader.readNext()
                }
            }

        }

        render results as JSON
    }
    def createOrg(String existingOrgName, String correctOrgName) {

        def errors = []
        def messages = []
        def existingOrganisations = metadataService.organisationList()

        def orgName = correctOrgName ?: existingOrgName

        def organisationId
        def organisation = existingOrganisations.list.find{it.name == orgName}
        if (!organisation) {
            def resp = organisationService.update('', [name:orgName])

            organisationId = resp?.resp?.organisationId
            if (!organisationId) {
                errors << "Error creating organisation ${orgName} - ${resp?.error}"
                return [errors:errors]
            }
            else {
                messages << "Created organisation with name: ${orgName}"
            }

        }
        else {
            organisationId = organisation.organisationId
            messages << "Organisation with name: ${orgName} already exists"
        }


        def projectsResp = projectService.search([organisationName:existingOrgName])
        if (projectsResp?.resp.projects) {
            def projects = projectsResp.resp.projects
            messages << "Found ${projects.size()} projects with name ${existingOrgName}"
            projects.each { project ->
                if (project.organisationId != organisationId || project.organisationName != orgName) {
                    def resp = projectService.update(project.projectId, [organisationName:orgName, organisationId:organisationId])
                    if (!resp || resp.error) {
                        errors << "Error updating project ${project.projectId}"
                    }
                    else {
                        messages << "Updated project ${project.projectId} organisation to ${orgName}"
                    }
                }
                else {
                    messages << "Project ${project.projectId} already had correct organisation details"
                }

            }
        }
        else {
            if (projectsResp?.resp?.projects?.size() == 0) {
                messages << "Organisation ${existingOrgName} has no projects"
            }
            else {
                errors << "Error retreiving projects for organisation ${existingOrgName} - ${projectsResp.error}"
            }
        }
        return [errors:errors, messages:messages]

    }

    def createReports() {
        def offset = 0
        def max = 100

        def projects = searchService.allProjects([max:max, offset:offset])

        while (offset < projects.hits.total) {

            offset+=max
            projects = searchService.allProjects([max:max, offset:offset])

            projects.hits?.hits?.each { hit ->
                def project = hit._source
                if (!project.timeline) {
                    projectService.generateProjectStageReports(project.projectId)
                    println "Generated reports for project ${project.projectId}"
                }
            }
            println offset

        }

    }

    def editSiteBlog() {
        List<Map> blog = blogService.getSiteBlog()
        [blog:blog]
    }


    def selectHomePageImages() {
    }


}
