package au.org.ala.merit

import au.com.bytecode.opencsv.CSVWriter
import org.apache.commons.validator.EmailValidator

import java.text.DecimalFormat
import java.text.SimpleDateFormat
/**
 * Knows how to map from the format supplied by the GMS into projects, sites and activities.
 */
class GmsMapper {

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

    static final FINANCIAL_YEAR_FUNDING_PREFIX = 'FUNDING_'

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
    private AbnLookupService abnLookupService

    private List<Map> scores

    /** Map of program name to program id */
    private Map programs

    /** Map of management unit name to management unit id */
    private Map managementUnits

    def projectMapping = [
            (GRANT_ID_COLUMN):[name:'grantId', type:'string', mandatory:true,description:'The grant id of the project.  The combination of grantId and externalId must be unique.'],
            EXTERNAL_ID:[name:'externalId', type:'string',description:'The id of this project in an external system (e.g. grants hub)'],
            APP_NM:[name:'name', type:'string', mandatory:true, description:'The project name as it will appear in MERIT'],
            APP_DESC:[name:'description', type:'string', description:'The project description as it will appear in MERIT'],
            PROGRAM_NM:[name:'associatedProgram', type:'string',mandatory:true,description:'Must match the name of an existing MERIT program or sub-program'],
            ROUND_NM:[name:'associatedSubProgram', type:'string'],
            MANAGEMENT_UNIT:[name:'managementUnitName', type:'string', mandatory: false, description: 'The management unit the project is being conducted in'],
            ABN:[name: 'abn', type: 'string', description:'The ABN of the organisation receiving the funding'],
            ORG_ID:[name:'organisationId', type:'string',description:'The organisationId of the organisation in MERIT (only used if the ABN is not supplied)'],
            ORG_CONTRACT_NAME:[name:'organisationContractName', type: 'string', description: 'The name used in the project contract.  Appears as the organisation name on the project page.'],
            START_DT:[name:'plannedStartDate', type:'date', mandatory:true, description:'The planned start date of the project'],
            FINISH_DT:[name:'plannedEndDate', type:'date', mandatory:true, description:'The planned end date of the project'],
            CONTRACT_START_DT:[name:'contractStartDate', type:'date'],
            CONTRACT_END_DT:[name:'contractEndDate', type:'date'],
            ORDER_NO: [name: 'externalIds', type:'externalId',description:'The SAP Internal Order Number for this project', multipleColumnsSupported: true, idType:'INTERNAL_ORDER_NUMBER'],
            TECH_ONE_ID: [name: 'externalIds', type:'externalId', 'description':'The Tech One system ID for this project', multipleColumnsSupported: true, idType:'TECH_ONE_CODE'],
            TECH_ONE_CONTRACT_NUMBER: [name: 'externalIds', type:'externalId', 'description':'The Tech One contract number for this project', multipleColumnsSupported: true, idType:'TECH_ONE_CONTRACT_NUMBER'],
            WORK_ORDER_ID:[name:'externalIds', type:'externalId', multipleColumnsSupported: true, idType:'WORK_ORDER'],
            FUNDING:[name:'funding', type:'decimal',description:'Total funding for this project (displayed on project overview)'],
            AUTHORISEDP_EMAIL:[name:'adminEmail', type:'email', description:'This user will be added as an admin to the project'],
            GRANT_MGR_EMAIL:[name:'grantManagerEmail', type:'email', description:'This user will be added as a project grant manager to the project'],
            GRANT_MGR_EMAIL_2:[name:'grantManagerEmail2', type:'email', description:'This user will be added as a project grant manager to the project'],
            APPLICANT_EMAIL:[name:'applicantEmail', type:'email',description:'This user will be added as a project admin'],
            ADMIN_EMAIL:[name:'adminEmail2', type:'email', description:'This user will be added as a project admin'],
            EDITOR_EMAIL:[name:'editorEmail', type:'email', description:'This user will be added as a project editor'],
            EDITOR_EMAIL_2:[name:'editorEmail2', type:'email', description:'This user will be added as a project editor'],
            TAGS:[name:'tags', type:'list',description:'Can be used to facet projects on the project explorer.  Currently used to tag projects as being a part of the bushfire response'],
            PROJECT_STATUS:[name:'status', type:'lookup', values:['Active':'active', 'Terminated':'terminated', 'Completed':'completed'], default:'application', description:'The project status - Application (default), Active, Completed, Terminated'],
            MERI_PLAN_STATUS:['name':'planStatus', type:'lookup', values:['Approved':'approved'], default:'not approved', description:'The MERI plan status - not approved (default), Approved'],
            FUNDING_TYPE:[name:'fundingType', type:'string', description:'The funding model used for this project (Grant, Procurement, Special Purpose Payment)'],
            ORIGIN_SYSTEM:[name:'origin', type:'string', description:'The owning system for this project (e.g. Business Grants Hub)', default:'merit'],
            ELECTION_COMMITMENT_YEAR:[name:'electionCommitmentYear', type:'string', description: 'If an election commitment, the year of the commitment'],
            PORTFOLIO:[name:'portfolio', type:'string', description: 'Agriculture / Environment / Both'],
            GRANT_AWARD_ID:[name:'externalIds', type:'externalId', multipleColumnsSupported: true, idType:'GRANT_AWARD', description:'If different to the grant opportunity id specified in the program'],
            MANAGING_AGENCY:[name:'manager', type:'string', description:'The agency managing the delivery of this project']
    ]

    def geographicInfoMapping = [
            NATIONWIDE:[name:'nationwide', type:'boolean', description:'If true, this project does not have a primary state'],
            PRIMARY_STATE:[name:'primaryState', type:'string', description:''],
            PRIMARY_ELECTORATE:[name:'primaryElectorate', type:'string', description:''],
            OTHER_ELECTORATES:[name:'otherElectorates', type:'list', description:''],
            OTHER_STATES:[name:'otherStates', type:'list', description:'']
    ]


    def siteMapping = [
            LOC_DESC:[name:'description', type:'string'],
            LOC_URL:[name:'kmlUrl',type:'url'],
            LOC_LATITUDE:[name:'lat',type:'decimal'],
            LOC_LONGITUDE:[name:'lon',type:'decimal'],
            ELECTORATE:[name:'electorate', type:'string']
    ]

    def activityMapping = [
            PGAT_ACTIVITY_DELIVERABLE:[name:'type', type:'string'],
            PGAT_ACTIVITY_DESCRIPTION:[name:'description', type:'string'],
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
        this.scores = []
        this.programs = [:]
        this.managementUnits = [:]
        includeProgress = false
    }

    GmsMapper(activitiesModel, programModel, organisations, abnLookup, List<Map> scores, Map programs = [:], Map managementUnits = [:], includeProgress = false) {
        this.activitiesModel = activitiesModel
        this.programModel = programModel
        this.includeProgress = includeProgress
        this.organisations = organisations
        this.scores = scores
        this.programs = programs
        this.managementUnits = managementUnits
        this.abnLookupService = abnLookup
    }

    /** Creates a CSV file in the format required to import projects into MERIT with additional instructions */
    void buildMeritImportCSVTemplate(Writer writer) {
        CSVWriter csvWriter = new CSVWriter(writer)
        csvWriter.writeNext("Delete the top three lines before importing this file into MERIT")
        List descriptions = []
        List mandatoryFlags = []
        List headers = []
        projectMapping.each { String key, Map value ->
           // Deliberately omit fields without a description as they are largely deprecated.
            String description = value.description
            if (description) {
                headers << key
                mandatoryFlags << (value.mandatory ? 'Mandatory' : 'Optional')
                if (value.multipleColumnsSupported) {
                    description += ". Additional values can be supplied by adding columns named ${key}_2, ${key}_3 etc"
                }
                descriptions << description
           }
        }
        csvWriter.writeNext(descriptions as String[])
        csvWriter.writeNext(mandatoryFlags as String[])
        csvWriter.writeNext(headers as String[])
    }

    def validateHeaders(projectRows) {
        def errors = []
        def mappings = projectMapping + siteMapping + activityMapping + outputTargetColumnMapping + riskMapping + geographicInfoMapping
        def mappingKeys = new HashSet(mappings.keySet())
        mappingKeys.add(GRANT_ID_COLUMN)
        mappingKeys.add(DATA_TYPE_COLUMN)
        mappingKeys.add(DATA_SUB_TYPE_COLUMN)
        mappingKeys.add(REPORTING_THEME_COLUMN)
        mappingKeys.add(FINANCIAL_YEAR_FUNDING_PREFIX)
        mappingKeys.add("FINANCIAL_YEAR_FUNDING_DESCRIPTION")

        projectRows[0].keySet().each { key ->
            if (!key?.trim() || key == 'index') {
                return
            }
            if (!(key in mappingKeys) && !(mappingKeys.find{key.startsWith(it)})) {
                errors << "Unused column header ${key}, please check it is not named incorrectly"
            }
        }
        mappingKeys.each { key ->
            Map mapping = mappings[key]
            if (mapping && !(key in projectRows[0].keySet())) {
                if (key && mapping.mandatory) {
                    errors << "Missing column in spreadsheet ${key} - load may be incomplete without this"
                }
            }
        }
        return errors
    }

    def mapProject(projectRows) {

        List errors = []
        List messages = []
        Map result = gmsToMerit(projectRows[0], projectMapping) // All project rows have the project details.
        def project = result.mappedData
        project.projectType = 'works'
        project.isMERIT = true

        mapGeographicInfo(projectRows[0], project, errors)


        String programName = project.associatedSubProgram ?: project.associatedProgram
        Map program = programs[programName]
        String programId = program?.programId
        if (programId) {
            project.remove('associatedProgram')
            project.remove('associatedSubProgram')
            project.programId = programId
        }
        else {
            errors << "Program ${programName} doesn't match an existing MERIT programme"
        }

        if (project.managementUnitName) {
            String managementUnitName = project.remove('managementUnitName')
            project.managementUnitId = managementUnits[managementUnitName]
            if (!project.managementUnitId) {
                errors << "No management unit exists with name ${managementUnitName}"
            }
        }

        Map organisation = mapOrganisation(project, program, errors, messages)

        errors.addAll(result.errors)
        project.planStatus = project.planStatus ?: 'not approved'

        mapRisks(projectRows, project, errors)

        def sites = mapSites(projectRows, project, errors)

        def activities = mapActivities(projectRows, project, errors)

        Map meriPlan = mapMeriPlan(projectRows, errors)
        if (meriPlan) {
            project.custom = [details:meriPlan]
        }

        [project:project, sites:sites, activities:activities, errors:errors, messages:messages, organisation:organisation]

    }

    private Map findExistingOrganisation(String organisationId, String abn) {
        organisations.find{
            (abn && (it.abn == abn)) ||
                    (organisationId && (it.organisationId == organisationId)) }

    }

    private Map mapOrganisation(Map project, Map program, List errors, List messages) {
        Map organisation
        Map abnLookup
        String error = null

        boolean createOrganisation = false
        String organisationId = project.remove('organisationId')
        String abn = project.remove('abn')?.replaceAll(' ', '')
        String contractName = project.remove('organisationContractName')
        if (organisationId || abn) {
            organisation = findExistingOrganisation(organisationId, abn)
            if (!organisation) {
                if (abn) {
                    abnLookup = abnLookupService.lookupOrganisationDetailsByABN(abn)
                    if (abnLookup && !abnLookup.error) {
                        List names = [abnLookup.entityName] + abnLookup.businessNames
                        organisation = organisations.find { it.name in names }
                        if (organisation) {
                            error = "An existing organisation name was matched via the entity/business name ${organisation.name} but the ABN doesn't match the abn of the MERIT organisation (${organisation.abn})"
                        } else {
                            createOrganisation = true
                            String name
                            if (contractName) {
                                name = contractName
                                organisation = abnLookup + [name:contractName, contractNames: [contractName]]
                            }
                            else {
                                name = abnLookup.businessNames ? abnLookup.businessNames[0] : abnLookup.entityName
                                organisation = abnLookup + [name: name]
                            }
                            messages << "An organisation will be created with ABN: ${abn} and name: ${name}"
                        }
                    } else {
                        error = "An error was encountered looking up the ABN ${abn}${abnLookup?.error ? ': '+abnLookup.error : ''}"
                    }
                }
                else {
                    error = "No organisation exists with abn: '${abn}' and/or organisationId: '${organisationId}'"
                }
            }

            // Validate we can use the contract name
            if (organisation && contractName) {
                List names = [organisation.name] + organisation.contractNames
                if (contractName && !contractName in names) {
                    error = "The organisation name in the contract ${contractName} doesn't match a known organisation name"
                }
            }
            if (!error) {
                // We are standardising on "Recipient" as the default organisation relationship
                String description = 'Recipient'
                project.associatedOrgs = [
                        [organisationId:organisation.organisationId, name: contractName ?: organisation.name, organisationName:organisation.name, description:description]]
            }
        } else {
            error = "Please supply an organisationId (ORG_ID) or ABN (ABN) for the project"
        }
        if (error) {
            errors << error
        }
        createOrganisation ? organisation : null

    }


    /**
     * Currently maps a single row of MERI plan budget information into the MERI plan.
     * @param projectRows All of the rows relating to a project.  Only the first row with budget info is used.
     * @param errors Holder for any validation errors raised.
     * @return a Map containing the MERI plan.
     */
    private Map mapMeriPlan(List projectRows, List errors) {
        Map meriPlan = null
        // We only support loading a single budget row, so we exit the loop after the first one we find.
        projectRows.find { Map rowMap ->

            String description = rowMap.FINANCIAL_YEAR_FUNDING_DESCRIPTION
            if (description) {
                meriPlan = [budget:[headers:[], rows:[[rowTotal:0, costs:[]]], overallTotal:0]]
                meriPlan.budget.rows[0].description = description
                for (int i : (10..50)) {
                    String key = FINANCIAL_YEAR_FUNDING_PREFIX+i+"_"+(i+1)
                    String amount = rowMap[key]
                    if (amount) {
                        meriPlan.budget.headers << [data:Integer.toString(i+2000)+'/'+Integer.toString(i+2001)]

                        try {
                            BigDecimal numericAmount = new BigDecimal(amount)
                            meriPlan.budget.rows[0].costs << [dollar:amount]
                            meriPlan.budget.rows[0].rowTotal += numericAmount
                            meriPlan.budget.overallTotal+=numericAmount
                        }
                        catch (Exception e) {
                            errors << "Error converting column: "+key+" value: "+amount+" to a dollar amount"
                        }
                    }
                }
            }
            return description != null
        }
        meriPlan
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

                    activity.type = activityType
                    activity.plannedStartDate = mappedActivity.plannedStartDate
                    activity.plannedEndDate = mappedActivity.plannedEndDate
                    activity.description = mappedActivity.description

                    if (!findActivity(activities, activity)) {
                        if (!activity.description) {
                            activity.description = 'Activity ' + (activities.size() + 1)
                            activity.defaultDescriptionApplied = true // To allow comparsions where description was ommitted.
                        }
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
                    if (target && target.scoreLabel && (target.target || target.progressToDate)) {
                        def existingTarget = project.outputTargets.find({it.scoreLabel == target.scoreLabel})
                        if (existingTarget) {

                            try {
                                double existingTargetValue = convertDecimal(existingTarget.target)
                                double newTargetValue = convertDecimal(target.target)
                                existingTarget.target = existingTargetValue+newTargetValue
                            }
                            catch (NumberFormatException e) {
                                errors << [error:"Error converting target to a number: "+e.message]
                            }
                        }
                        else {
                            project.outputTargets << target
                        }
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
        activities.each {
            it.remove('defaultDescriptionApplied')
        }
        activities

    }

    private Map findActivity(List activities, Map activity) {

        activities.find {
            it.type == activity.type &&
            ((it.description == activity.description) || (it.defaultDescriptionApplied && !activity.description)) &&
            it.plannedStartDate == activity.plannedStartDate &&
            it.plannedEndDate == activity.plannedEndDate
        }
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

    private void mapGeographicInfo(Map rowData, Map project, List errors) {

        Map result = gmsToMerit(rowData, geographicInfoMapping)
        if (result.mappedData) {
            project.geographicInfo = result.mappedData
        }
        errors.addAll(errors)
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

        def outputName
        Map score = scores.find { println it.externalId;  it.externalId ? it.externalId.split('\\s')?.contains(code) : false }

        if (!score) {
            println "No mapping for score ${code}, row: ${rowMap.index}"

            errors << "No mapping for score ${code}, row: ${rowMap.index}"
        }
        else {
            if (includeProgress) {
                result << [target: target.target, scoreId:score.scoreId, outputLabel:score.outputType, scoreLabel:score.label, units:score.units, progressToDate:target.progressToDate]
            }
            else {
                if (score.isOutputTarget) {
                    result << [target: target.target, scoreId:score.scoreId, outputLabel:score.outputType, scoreLabel:score.label, units:score.units]
                }
                else {
                    errors << "Warning: score ${code} is not an output target"
                }
            }

        }
        [mappedData:result, errors: errors]
    }

    private def gmsToMerit(Map rowMap, Map mapping) {
        def result = [:]
        def errors = []
        mapping.each { Map.Entry e ->
            String mappingColumnName = e.key
            Map columnMapping = e.value

            try {
                String propertyName = columnMapping.name
                if (columnMapping.multipleColumnsSupported) {
                    List values = findMultiValue(mappingColumnName, rowMap)
                    if (!result[propertyName]) {
                        result[propertyName] = []
                    }
                    values = values.findAll{it}
                    result[propertyName].addAll(values.collect{convertByType(it, columnMapping)}.findAll{it})
                }
                else {
                    result[propertyName] = convertByType(rowMap[mappingColumnName], columnMapping)
                }

            }
            catch (Exception ex) {
                errors << "Error converting value: ${rowMap[mappingColumnName]} from row ${rowMap.index} column: ${mappingColumnName}, ${ex.getMessage()}"
            }
        }

        [mappedData:result, errors:errors]
    }

    private List findMultiValue(String mappingColumnName, Map rowMap) {
        rowMap.findAll { String key, def value ->
            key.startsWith(mappingColumnName)
        }.collect{it.value}
    }

    private def convertByType(String value, Map mapping) {
        String type = mapping.type
        value = value?value.trim():''
        def result = null
        switch (type) {
            case 'date':
                result = convertDate(value, mapping.mandatory)
                break
            case 'decimal':
                result = convertDecimal(value)
                break
            case 'string':
                result = value ?: (mapping['default']?:value)
                break
            case 'url':
                URI.create(value) // validation purposes only
                result = value
                break
            case 'email':
                if (value && !EmailValidator.instance.isValid(value)) {
                    throw new IllegalArgumentException("Invalid email: ${value}")
                }
                result = value
                break
            case 'lookup':
                def lookupValue = value ? mapping.values[value] : mapping.default
                if (lookupValue == null) {
                    throw new IllegalArgumentException("${value} is not in ${mapping.values}")
                }
                result = lookupValue
                break
            case 'externalId':
                if (value) {
                    result = [idType:mapping.idType, externalId:value]
                }
                break
            case 'list':
                result = value?.split(',').collect{it.trim()}.findAll{it}
                break
            default:
                throw new IllegalArgumentException("Unsupported type: ${type}")
        }
        result
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


}
