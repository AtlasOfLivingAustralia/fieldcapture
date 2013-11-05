package au.org.ala.fieldcapture

import au.com.bytecode.opencsv.CSVReader
import org.apache.commons.lang.StringUtils

import java.text.DecimalFormat
import java.text.SimpleDateFormat

/**
 * Handles data import into ecodata.
 */
class ImportService {

    static int INSTITUTION_DIFFERENCE_THRESHOLD = 4
    public static final List CSV_HEADERS = ['Grant ID', 'Grant External ID', 'Grant Name', 'Grant Description', 'Grantee Organisation Legal Name', 'Location Description', 'Grant Original Approved Amount', 'Round Name', 'Start', 'Finish']

    private static final String PROJECTS_CACHE_KEY = 'ImportService-AllProjects'

    static outputDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ")
    static inputDateFormat = new SimpleDateFormat("dd/MM/yyyy")


    /** The current format location data is supplied in */
    def locationRegExp = /lat. = ([\-0-9\.]*)\nlong. = ([\-0-9\.]*)\nLocation Description = (.*)lat\. =.*/

    def projectService, siteService, metadataService, cacheService


    /**
     * Validates and imports project, site and institution data supplied by the GMS as a CSV file.
     */
    def importProjectsByCsv(InputStream csv,  importWithErrors = false) {
        CSVReader csvReader = new CSVReader(new InputStreamReader(csv));
        def headerIndexes = validateHeader(csvReader.readNext());

        if (headerIndexes.missing) {
            return [success:false, error:"Invalid CSV file - missing header fields: ${headerIndexes.missing}"]
        }

        def results = [success:false, validationErrors:[]]

        def projectsCreated = 0, projectsUpdated = 0, sitesCreated = 0, sitesUpdated = 0, ignored = 0

        // Clear the cache before importing to ensure we get fresh data. (in particular because I keep dropping the database)
        cacheService.clear(PROJECTS_CACHE_KEY)

        String[] csvLine = csvReader.readNext();
        // Used to detect duplicate grantIds (as it is used as the key)
        def grantIds = []
        while (csvLine) {
            // This is to handle blank lines and subheadings which have appeared in the latest version
            if (csvLine.size() < CSV_HEADERS.size()) {
                log.warn("CSV line encountered with too few columns: ${csvLine}")
                csvLine = csvReader.readNext()
                continue
            }
            def grantId = csvLine[headerIndexes['Grant ID']]
            // This is to handle duplicate header columns and other formatting lines which appear through the latest version
            if (grantId.size() != 12) {
                log.debug("Invalid line encountered: ${csvLine}")
                csvLine = csvReader.readNext()
                continue
            }

            def project = validateProjectDetails(findHeaderColumns(headerIndexes, csvLine), grantIds)
            grantIds << project.grantId
            if (project.errors.size() > 0 || project.warnings.size() > 0) {
                writeErrors(results.validationErrors, project.errors, project.warnings, csvLine)
            }
            if (project.errors.size() == 0 || importWithErrors) {
                project.remove('errors')
                def status = importProject(project)
                if (status.project == 'created') {
                    projectsCreated++
                }
                else if (status.project == 'updated') {
                    projectsUpdated++
                }
                if (status.site == 'created') {
                    sitesCreated++
                }
                else if (status.site == 'updated') {
                    sitesUpdated++
                }

            }
            else {
                ignored++
            }

            csvLine = csvReader.readNext()
        }
        results.projectsCreated = projectsCreated
        results.projectsUpdated = projectsUpdated
        results.sitesCreated = sitesCreated
        results.sitesUpdated = sitesUpdated
        results.ignored = ignored

        // Clear the cache again to free up memory and also in case old project data has been cached.
        cacheService.clear(PROJECTS_CACHE_KEY)
        println "Created: ${results.projectsCreated}, Updated: ${results.projectsUpdated}, Errors: ${ignored}"
        return results

    }

    def validateProjectDetails(projectDetails, grantIds) {

        def project = [:]
        def errors = []
        def warnings = []
        project.errors = errors
        project.warnings = warnings

        CSV_HEADERS.each {
            if (!projectDetails[it]) {
                if (it == 'Grant ID' || it == 'Grant Name') {
                    errors.add("No value for '${it}'")
                }
                else {
                    warnings.add("No value for '${it}'")
                }
            }
        }

        project.name = projectDetails['Grant Name']
        project.description = projectDetails['Grant Description']
        project.grantId = projectDetails['Grant ID']
        project.externalProjectId = projectDetails['Grant External ID']


        def funding = projectDetails['Grant Original Approved Amount']
        try {
            project.funding = new DecimalFormat('$##,###.##').parse(funding)
        }
        catch (Exception e) {
            errors.add("Unable to parse funding: "+funding)
        }
        project.organisationName = projectDetails['Grantee Organisation Legal Name']
        try {
            def startDate = projectDetails['Start']
            if (startDate) {
                project.plannedStartDate = convertDate(startDate)
            }
        }
        catch (Exception e) {
            errors.add("Unable to parse Finish Date: ${endDate}")
        }
        try {
            def endDate = projectDetails['Finish']
            if (endDate) {
                project.plannedEndDate = convertDate(endDate);
            }
        }
        catch (Exception e) {
            errors.add("Unable to parse Finish Date: ${endDate}")
        }

        if (grantIds.contains(project.grantId)) {
            errors.add("Duplicate Grant ID detected: '$project.grantId'")
        }

        if (projectDetails['Application Location Desc']) {
            def locationData = (projectDetails['Application Location Desc'] =~ locationRegExp)
            if (!locationData) {
                errors.add("'Application Location Desc' doesn't match the expected format")
            }
            else {
                project.site = [:]
                project.site.lat = locationData.group(1)
                project.site.lon = locationData.group(2)
                project.site.description = locationData.group(3)
                project.site.name = 'Unnamed site'

            }
        }

        if (projectDetails['Round Name']) {
            String roundDetails = projectDetails['Round Name'];
            // For whatever reason, many/all of the caring for our country programs are coded as "C4OC 2"
            roundDetails = roundDetails.replace("C4OC 2", "Caring for our Country 2")

            def program = metadataService.programsModel().programs.find{ roundDetails.startsWith(it.name)}

            if (!program) {
                warnings.add("'Round Name' does not match a valid program name: ${roundDetails}")
            }
            else {
                project.associatedProgram = program.name
                def subprogram = program.subprograms.find {roundDetails.contains(it.name)}
                if (!subprogram) {
                    warnings.add("'Round Name' does not match a valid subprogram name: ${roundDetails}")
                }
                else {
                    project.associatedSubProgram = subprogram.name
                }
            }

        }

        return project
    }

    def convertDate(date) {
        outputDateFormat.format(inputDateFormat.parse(date))
    }

    def importProject(project) {

        def status = [:]

        // Remove the site from the project as it will be saved separately.
        def site = project.remove('site')

        // The Grant ID is the only best key we can use from the SEWPAC data.
        def p = findProjectByGrantId(project.grantId)
        if (p) {
            project.projectId = p.projectId
            status.project = 'updated'
        }
        else {
            status.project = 'created'
        }

        def result = projectService.update(project.projectId?:'', project)

        // If a project was created the ID will be returned, otherwise use the value retrieved by the original query.
        def projectId = result.resp.projectId?:project.projectId


        if (false && site && site.description) {

            // Get the project details, including any related sites.
            p = projectService.get(projectId)

            def s = findProjectSiteByDescription(p, site.description)


            def siteDetails = [:]
            siteDetails.name = site.name
            siteDetails.description = site.description
            siteDetails.extent = siteService.siteExtentFromPoint(site.lat, site.lon)

            // Under the current data import arrangements each project has one site.
            if (!s) {
                siteDetails.projects = [projectId]
                siteService.create(siteDetails)
                status.site = 'created'
            }
            else {
                siteDetails.siteId = s.siteId
                siteService.update(s.siteId, siteDetails)
                status.site = 'updated'
            }
        }
        status

        // TODO not creating missing institutions in the collectory at this time.
//        def institution = metadataService.getInstitutionByName(project.organisationName)
//        if (!institution) {
//            def potentialMatches = matchInstitution(project.organisationName)
//        }

    }

    def findProjectByGrantId(grantId) {
        // Cache projects temporarily to avoid this query.
        def allProjects = cacheService.get(PROJECTS_CACHE_KEY) { [projects:projectService.list(true)] }
        return allProjects.projects.find{it.grantId?.equalsIgnoreCase(grantId)}
    }

    def findProjectSiteByDescription(project, description) {
        return project.sites?.find{it.description?.equalsIgnoreCase(description)}
    }

    def matchInstitution(String institutionName) {

        def lowerCaseName = institutionName.toLowerCase()
        return metadataService.institutionList().findAll({StringUtils.getLevenshteinDistance(it.name.toLowerCase(), lowerCaseName) < INSTITUTION_DIFFERENCE_THRESHOLD})
    }


    private def writeErrors(results, errors, warnings, String[] line) {
        def errorLine = []
        errorLine << errors.join('\n')
        errorLine << warnings.join('\n')

        line.each{
            // The truncation is because the CSV file is slow because of the large amount of repetition in the
            // location cells in particular
            errorLine << it.substring(0, Math.min(it.length(), 100)).replaceAll('\n', ' ').replaceAll('"', "'")
        }

        results << errorLine
    }

    private def validateHeader(String[] headerTokens) {

        def suppliedHeaders = headerTokens as List
        def missingHeaders = []
        def headerIndicies = [:]
        CSV_HEADERS.each{
            int index = suppliedHeaders.indexOf(it)
            if (index < 0) {
                missingHeaders << it
            }
            headerIndicies << [(it):index]
        }
        if (missingHeaders.size() > 0) {
            headerIndicies.missing = missingHeaders
        }
        headerIndicies

    }

    private def findHeaderColumns(headerDetails, String[] csvLine) {

        def projectDetails = [:]
        headerDetails.each {key, value ->
            projectDetails << [(key):csvLine[value]]

        }
        projectDetails
    }



}
