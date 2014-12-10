package au.org.ala.merit

import au.org.ala.fieldcapture.PreAuthorise
import grails.converters.JSON
import org.joda.time.Period
import org.springframework.web.multipart.MultipartHttpServletRequest

@PreAuthorise(accessLevel = 'officer', redirectController = "home")
class AdminController extends au.org.ala.fieldcapture.AdminController {

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
}
