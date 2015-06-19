package au.org.ala.fieldcapture

import org.apache.commons.validator.EmailValidator

import java.text.DecimalFormat
import java.text.SimpleDateFormat
/**
 * Knows how to map from the format supplied by the GMS into projects, sites and activities.
 */
class GmsMapper {

    public static final List GMS_COLUMNS = ['PROGRAM_NM',	'ROUND_NM',	'APP_ID', 'EXTERNAL_ID', 'APP_NM', 'APP_DESC',	'START_DT',	'FINISH_DT', 'FUNDING',	'APPLICANT_NAME', 'ORG_TRADING_NAME', 'APPLICANT_EMAIL', 'AUTHORISEDP_CONTACT_TYPE', 'AUTHORISEDP_EMAIL', 'GRANT_MGR_EMAIL', 'GRANT_MGR_EMAIL_2','DATA_TYPE', 'ENV_DATA_TYPE',	'PGAT_PRIORITY', 'PGAT_GOAL_CATEGORY',	'PGAT_GOALS', 'PGAT_OTHER_DETAILS','PGAT_PRIMARY_ACTIVITY','PGAT_ACTIVITY_DELIVERABLE_GMS_CODE','PGAT_ACTIVITY_DELIVERABLE','PGAT_ACTIVITY_TYPE','PGAT_ACTIVITY_UNIT','PGAT_UOM', 'UNITS_COMPLETED', 'EDITOR_EMAIL', 'EDITOR_EMAIL_2']

    // These identify the data contained in the row.
    static final LOCATION_DATA_TYPE = 'Location Data'
    static final REPORTING_THEME_DATA_SUB_TYPE = 'Priorities'
    static final ACTIVITY_DATA_SUB_TYPE = 'Activities'
    static final ACTIVITY_DATA_TYPE = 'Environmental Data'
    static final REPORTING_THEME_DATA_TYPE = 'Environmental Data'
    static final RISK_DATA_TYPE = 'Risk Data'

    static final GRANT_ID_COLUMN = 'APP_ID'
    static final EXTERNAL_ID_COLUMN = 'EXTERNAL_ID'
    static final DATA_TYPE_COLUMN = 'DATA_TYPE'
    static final DATA_SUB_TYPE_COLUMN = 'ENV_DATA_TYPE'
    static final REPORTING_THEME_COLUMN = 'PGAT_PRIORITY'

    static MERIT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ")

    static final GMS_DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy")
    static final SHORT_GMS_DATE_FORMAT = new SimpleDateFormat("dd/MM/yy")

    static final GMS_DECIMAL_FORMAT = new DecimalFormat()

    static {
        MERIT_DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"))
        GMS_DECIMAL_FORMAT.setMaximumFractionDigits(0)
    }

    /** used to support mapping of activities and scores between MERIT and GMS */
    private def activitiesModel

    private def programModel

    private def organisations

    def projectMapping = [
            (GRANT_ID_COLUMN):[name:'grantId', type:'string'],
            APP_NM:[name:'name', type:'string'],
            APP_DESC:[name:'description', type:'string'],
            PROGRAM_NM:[name:'associatedProgram', type:'string'],
            ROUND_NM:[name:'associatedSubProgram', type:'string'],
            EXTERNAL_ID:[name:'externalId', type:'string'],
            ORG_TRADING_NAME:[name:'organisationName', type:'string'],
            START_DT:[name:'plannedStartDate', type:'date', mandatory:true],
            FINISH_DT:[name:'plannedEndDate', type:'date', mandatory:true],
            CONTRACT_START_DT:[name:'contractStartDate', type:'date'],
            CONTRACT_END_DT:[name:'contractEndDate', type:'date'],
            WORK_ORDER_ID:[name:'workOrderId', type:'string'],
            FUNDING:[name:'funding', type:'decimal'],
            AUTHORISEDP_EMAIL:[name:'adminEmail', type:'email'],
            GRANT_MGR_EMAIL:[name:'grantManagerEmail', type:'email'],
            GRANT_MGR_EMAIL_2:[name:'grantManagerEmail2', type:'email'],
            SERVICE_PROVIDER:[name:'serviceProviderName', type:'string'],
            APPLICANT_EMAIL:[name:'applicantEmail', type:'email'],
            ADMIN_EMAIL:[name:'adminEmail2', type:'email'],
            EDITOR_EMAIL:[name:'editorEmail', type:'email'],
            EDITOR_EMAIL_2:[name:'editorEmail2', type:'email']
    ]

    def siteMapping = [
            LOC_DESC:[name:'description', type:'string'],
            LOC_URL:[name:'kmlUrl',type:'url'],
            LOC_LATITUDE:[name:'lat',type:'decimal'],
            LOC_LONGITUDE:[name:'lon',type:'decimal']
    ]

    def activityMapping = [
            PGAT_ACTIVITY_DELIVERABLE:[name:'type', type:'string'],
            PGAT_ACTIVITY_DELIVERABLE_GMS_CODE:[name:'code', type:'string'],
            START_DT:[name:'plannedStartDate',type:'date'],
            FINISH_DT:[name:'plannedEndDate', type:'date']
    ]

    def outputTargetColumnMapping = [
            PGAT_ACTIVITY_DELIVERABLE:[name:'type', type:'string'],
            PGAT_ACTIVITY_DELIVERABLE_GMS_CODE:[name:'code', type:'string'],
            PGAT_ACTIVITY_TYPE:[name:'gmsScore',type:'string'],
            PGAT_ACTIVITY_UNIT:[name:'target', type:'decimal'],
            UNITS_COMPLETED:[name:'progressToDate', type:'decimal'],
            PGAT_UOM:[name:'units', type:'string']
    ]

    def riskMapping = [
            RISK_DESC:[name:'description', type:'string'],
            RISK_IMPACT:[name:'consequence', type:'lookup', values:['1':'Insignificant', '2':'Minor', '3':'Moderate', '4':'Major', '5':'Extreme']],
            RISK_LIKELIHOOD:[name:'likelihood', type:'lookup', values:['5':'Almost Certain', '4':'Likely', '3':'Possible', '2':'Unlikely', '1':'Remote']],
            RISK_MITIGATION:[name:'currentControl', type:'string']
    ]

    private boolean includeProgress

    public GmsMapper() {
        this.activitiesModel = []
        this.programModel = []
        this.organisations = []
        includeProgress = false
    }

    public GmsMapper(activitiesModel, programModel, organisations, includeProgress = false) {
        this.activitiesModel = activitiesModel
        this.programModel = programModel
        this.includeProgress = includeProgress
        this.organisations = organisations
    }

    def validateHeaders(projectRows) {
        def errors = []
        def mappings = projectMapping + siteMapping + activityMapping + outputTargetColumnMapping + riskMapping
        def mappingKeys = new HashSet(mappings.keySet())
        mappingKeys.add(GRANT_ID_COLUMN)
        mappingKeys.add(DATA_TYPE_COLUMN)
        mappingKeys.add(DATA_SUB_TYPE_COLUMN)
        mappingKeys.add(REPORTING_THEME_COLUMN)

        projectRows[0].keySet().each { key ->
            if (key == 'index') {
                return
            }
            if (!(key in mappingKeys)) {
                errors << "Unused column header ${key}, please check it is not named incorrectly"
            }
        }
        mappingKeys.each { key ->

            if (!(key in projectRows[0].keySet())) {
                errors << "Missing column in spreadsheet ${key} - load may be incomplete without this"
            }
        }
        return errors
    }

    def mapProject(projectRows) {

        def errors = []
        def result = gmsToMerit(projectRows[0], projectMapping) // All project rows have the project details.

        def project = result.mappedData

        def program = programModel.programs.find {it.name == project.associatedProgram}
        if (!program) {
            errors << "Programme ${project.associatedProgram} doesn't match an existing MERIT programme"
        }
        else {
            if (project.associatedSubProgram) {
                if (!program.subprograms.find{it.name == project.associatedSubProgram}) {
                    errors << "Sub-programme ${project.associatedSubProgram} doesn't match any MERIT programme"
                }
            }
        }
        def organisation = organisations.find{it.name == project.organisationName}
        if (organisation) {
            project.organisationId = organisation.organisationId
        }
        else {
            errors << "No organisation exists with name ${project.organisationName}"
        }
        errors.addAll(result.errors)
        project.planStatus = 'not approved'

        mapRisks(projectRows, project, errors)

        def sites = mapSites(projectRows, project, errors)

        def activities = mapActivities(projectRows, project, errors)


        [project:project, sites:sites, activities:activities, errors:errors]

    }

    private def mapSites(projectRows, project, errors) {
        // TODO more than one location row?
        def siteRows = projectRows.findAll{it[DATA_TYPE_COLUMN] == LOCATION_DATA_TYPE}
        def sites = []
        def count = siteRows.size()
        siteRows.eachWithIndex {siteRow, i ->

            def siteResult = gmsToMerit(siteRow, siteMapping)
            def site = siteResult.mappedData
            errors.addAll(siteResult.errors)

            if (site.kmlUrl) {
                site.kmlUrl = site.kmlUrl.replace('edit', 'kml')
            }
            def siteIndex = count > 1 ? "${i+1} " : ''
            site.name = "Project area ${siteIndex}for ${project.grantId}"

            sites << site
        }
        sites
    }

    private def mapActivities(projectRows, project, errors) {

        // Build a lookup from GMS code to activity type.
        def gmsCodeToActivityType = [:]
        activitiesModel.activities.each {
            if (it.gmsId) {
                for (id in it.gmsId.split('\\s')) {
                    gmsCodeToActivityType << [(id):it.name]
                }
            }
        }
        def mainThemes = projectRows.findAll{it[DATA_TYPE_COLUMN] == REPORTING_THEME_DATA_TYPE && it[DATA_SUB_TYPE_COLUMN] == REPORTING_THEME_DATA_SUB_TYPE}.collect{it[REPORTING_THEME_COLUMN]}

        def mainTheme = null
        // If the project only addresses a single theme, that theme will be pre-populated for all activities.
        if (mainThemes && mainThemes.size() == 1) {
            mainTheme = mainThemes[0]
        }

        def activityRows = projectRows.findAll{it[DATA_TYPE_COLUMN] == ACTIVITY_DATA_TYPE && it[DATA_SUB_TYPE_COLUMN] == ACTIVITY_DATA_SUB_TYPE}
        def activities = []
        activityRows.eachWithIndex { activityRow, i ->
            def activityResult = gmsToMerit(activityRow, activityMapping)
            def mappedActivity = activityResult.mappedData
            errors.addAll(activityResult.errors)

            def activity = [:]
            if (mappedActivity.code == 'OTH') {
                return
            }

            if (mappedActivity.code) {
                def activityType = gmsCodeToActivityType[mappedActivity.code]
                if (activityType) {
                    if (!activities.find{it.type == activityType}) {
                        activity.type = activityType
                        activity.plannedStartDate = mappedActivity.plannedStartDate
                        activity.plannedEndDate = mappedActivity.plannedEndDate

                        activity.description = 'Activity ' + (activities.size() + 1)
                        if (mainTheme) {
                            activity.mainTheme = mainTheme
                        }

                        activities << activity
                    }

                    def targetResult = mapTarget(activityRow)
                    def target = targetResult.mappedData
                    errors.addAll(targetResult.errors)
                    if (!project.outputTargets) {
                        project.outputTargets = []
                    }
                    if (target) {
                        project.outputTargets << target
                    }
                }
                else {
                    errors << [error:"Unmappable code for activity : ${mappedActivity.code} - ${activityRow.PGAT_ACTIVITY_DELIVERABLE} row: {$activityRow.index}"]
                }
            }
            else {
                errors << [error:"Missing code for activity: ${activityRow.PGAT_ACTIVITY_DELIVERABLE} row: {$activityRow.index}"]
            }

        }
        activities

    }

    static def riskMatrix = [
            "Almost Certain":["Insignificant":"Medium","Minor":"Significant","Moderate":"High","Major":"High","Extreme":"High"],
            "Likely":        ["Insignificant":"Low","Minor":"Medium","Moderate":"Significant","Major":"High","Extreme":"High"],
            "Possible":      ["Insignificant":"Low","Minor":"Medium","Moderate":"Medium","Major":"High","Significant":"High"],
            "Unlikely":      ["Insignificant":"Low","Minor":"Low","Moderate":"Medium","Major":"Medium","Significant":"Significant"],
            "Remote":        ["Insignificant":"Low","Minor":"Low","Moderate":"Low","Major":"Medium","Significant":"Medium"]
    ]

    private def mapRisks(projectRows, project, errors) {
        def riskRows = projectRows.findAll {it[DATA_TYPE_COLUMN] == RISK_DATA_TYPE}
        def risks = []
        riskRows.eachWithIndex { riskRow, i ->

            def result = gmsToMerit(riskRow, riskMapping)
            errors.addAll(result.errors)
            def risk = [
                    "threat"  : "",
                    "description" : "",
                    "likelihood" : "",
                    "consequence" : "",
                    "riskRating" : "",
                    "currentControl" : "",
                    "residualRisk" : ""]
            risk.putAll(result.mappedData)

            risk.riskRating = riskMatrix[risk.likelihood]?riskMatrix[risk.likelihood][risk.consequence]:''
            risks << risk
        }
        if (risks) {
            project.risks = [rows:risks]
        }
    }

    private def mapTarget(rowMap) {

        def errors = []
        def map = gmsToMerit(rowMap, outputTargetColumnMapping)
        def target = map.mappedData
        errors.addAll(map.errors)

        def code = target.remove('code')

        if (!target) {
            errors << "No target defined for ${code}, row: ${rowMap.index}"
        }
        def result = [:]

        def outputName, score
        activitiesModel.outputs.find { output ->
            score = output.scores?.find{
                it.gmsId?.split('\\s')?.contains(code)
            }
            outputName = output.name
            return score
        }

        if (!score) {
            errors << "No mapping for score ${code}, row: ${rowMap.index}"
        }
        else {
            if (includeProgress) {
                result << [target: target.target, outputLabel:outputName, scoreLabel:score.label, scoreName:score.name, units:score.units, progressToDate:target.progressToDate]
            }
            else {
                if (score.isOutputTarget) {
                    result << [target: target.target, outputLabel:outputName, scoreLabel:score.label, scoreName:score.name, units:score.units]
                }
                else {
                    errors << "Warning: score ${code} is not an output target"
                }
            }

        }
        [mappedData:result, errors: errors]
    }

    private def gmsToMerit(rowMap, mapping) {
        def result = [:]
        def errors = []
        mapping.each { entry ->

            try {
                def value = convertByType(rowMap[entry.key], entry.value)
                result[entry.value.name] = value
            }
            catch (Exception e) {
                errors << "Error converting value: ${rowMap[entry.key]} from row ${rowMap.index} column: ${entry.key}, ${e.getMessage()}"
            }
        }

        [mappedData:result, errors:errors]
    }

    private def convertByType(String value, mapping) {
        def type = mapping.type
        value = value?value.trim():''
        switch (type) {
            case 'date':
                return convertDate(value, mapping.mandatory)
            case 'decimal':
                return convertDecimal(value)
            case 'string':
                return value
            case 'url':
                URI.create(value) // validation purposes only
                return value
            case 'email':
                if (value && !EmailValidator.instance.isValid(value)) {
                    throw new IllegalArgumentException("Invalid email: ${value}")
                }
                return value
            case 'lookup':
                def lookupValue = mapping.values[value]
                if (!(lookupValue)) {
                    throw new IllegalArgumentException("${value} is not in ${mapping.values}")
                }
                return lookupValue

        }
        throw new IllegalArgumentException("Unsupported type: ${type}")
    }

    private def convertDate(date, mandatory) {

        if (!mandatory && !date) {
            return ''
        }

        if (date && date.isInteger()) {
            final long DAYS_FROM_1900_TO_1970 = 25567
            // Date is number of days since 1900
            long days = date as Long
            long millisSince1970 = (days - DAYS_FROM_1900_TO_1970) * 24l * 60l * 60l * 1000l
            return MERIT_DATE_FORMAT.format(new Date(millisSince1970))
        }
        else {
            def format = date.length() == 10 ? GMS_DATE_FORMAT : SHORT_GMS_DATE_FORMAT
            def parsedDate = format.parse(date)
            MERIT_DATE_FORMAT.format(parsedDate)
        }
    }

    private def convertDecimal(value) {
        if (!value) {
            return 0
        }
        BigDecimal result
        try {
            if (value instanceof String) {
                value = value.replaceAll(",", "")
            }
            result = new BigDecimal(value)
        }
        catch (Exception e) {
            println e
            result = new BigDecimal(0)
        }
        result.doubleValue()
    }

    /**
     * Maps a project into a List of Maps representing rows in the GMS spreadsheet format.
     * @param project the project to export.
     */
    def exportToGMS(project) {

        def resultRows = []

        // These are the scores that have meaning to the GMS
        def scores = project.outputSummary?.grep { score -> (score.results || score.target) && score.score.gmsId }.flatten()

        // These need to be included in every row mapped.
        def projectDetails = meritToGMS(project, projectMapping)

        scores.each { score ->

            def mappedOutputTarget = mapScore(score)

            def row = [:]
            row.putAll(projectDetails)
            row.putAll([(DATA_TYPE_COLUMN): ACTIVITY_DATA_TYPE, (DATA_SUB_TYPE_COLUMN): ACTIVITY_DATA_SUB_TYPE])
            row.putAll(mappedOutputTarget)

            resultRows << row

        }

        resultRows << projectDetails

        return resultRows
    }

    public void toCsv(projects, writer) {

        writer.println(GMS_COLUMNS.join(','))
        projects.each { project ->

            def projectRows = exportToGMS(project)
            projectRows.each { mapRow ->

                StringBuilder row = new StringBuilder()
                GMS_COLUMNS.each {

                    if (row) { row.append(',')}
                    row.append(writeCsvValue(mapRow[it]))
                }
                writer.println(row)
            }

        }
        writer.flush()
    }

    private def writeCsvValue(val) {
        if (!val) return ''

        return "\"${val.replaceAll("\"", "\"\"")}\""
    }


    private def meritToGMS(project, mapping) {

        def results = [:]

        mapping.each { gmsKey, fieldMapping ->

            def meritKey = fieldMapping.name
            def meritValue = formatByType(project[meritKey], fieldMapping.type)


            results << [(gmsKey) : meritValue]

        }
        results
    }


    private def mapScore(score) {

        def target = ''
        if (score.score.isOutputTarget) {
            target = score.target ? formatDecimal(score.target) : '0'
        }

        // Two codes can be mapped to a single score, in this case we return the first one.
        def code = score.score.gmsId.split('\\s')[0]
        def value = score.results? score.results[0].result : 0
        def result = [PGAT_ACTIVITY_DELIVERABLE_GMS_CODE: code, PGAT_ACTIVITY_UNIT:target, UNITS_COMPLETED: formatDecimal(value, '0')]

        result

    }


    private def formatByType(value, type) {


        switch (type) {
            case 'date':
                return formatDate(value)
            case 'decimal':
                return formatDecimal(value)
            case 'string':
                return value
            case 'email':
                return value
        }
        throw new IllegalArgumentException("Unsupported type: ${type}")
    }

    private def formatDate(value) {

        if (!value) {
            return ''
        }
        // No support for 'Z' as the timezone designator.
        if (value.endsWith('Z')) {
            value = value.replace('Z', '+0000')
        }

        def date = MERIT_DATE_FORMAT.parse(value)
        return GMS_DATE_FORMAT.format(date)
    }

    private def formatDecimal(value, defaultValue = '') {
        if (!value) {
            return defaultValue
        }
        def numericValue
        if (value instanceof String) {
            numericValue = GMS_DECIMAL_FORMAT.parse(value)
        }
        else {
            numericValue = value
        }
        return GMS_DECIMAL_FORMAT.format(numericValue)
    }

}
