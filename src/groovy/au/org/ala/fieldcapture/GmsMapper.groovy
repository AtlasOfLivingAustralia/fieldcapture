package au.org.ala.fieldcapture

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

    static final GRANT_ID_COLUMN = 'APP_ID'
    static final DATA_TYPE_COLUMN = 'DATA_TYPE'
    static final DATA_SUB_TYPE_COLUMN = 'ENV_DATA_TYPE'
    static final REPORTING_THEME_COLUMN = 'PGAT_PRIORITY'

    static MERIT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ")

    static final GMS_DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy")
    static final SHORT_GMS_DATE_FORMAT = new SimpleDateFormat("dd/MM/yy")

    static final GMS_DECIMAL_FORMAT = new DecimalFormat()

    static {
        MERIT_DATE_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"))
        GMS_DECIMAL_FORMAT.setMaximumFractionDigits(0)
    }



    def projectMapping = [
            (GRANT_ID_COLUMN):[name:'grantId', type:'string'],
            APP_NM:[name:'name', type:'string'],
            APP_DESC:[name:'description', type:'string'],
            PROGRAM_NM:[name:'associatedProgram', type:'string'],
            ROUND_NM:[name:'associatedSubProgram', type:'string'],
            EXTERNAL_ID:[name:'externalId', type:'string'],
            ORG_TRADING_NAME:[name:'organisationName', type:'string'],
            START_DT:[name:'plannedStartDate', type:'date'],
            FINISH_DT:[name:'plannedEndDate', type:'date'],
            FUNDING:[name:'funding', type:'decimal']
    ]

    def siteMapping = [
            LOC_DESC:[name:'description', type:'string'],
            LOC_URL:[name:'kmlUrl',type:'url'],
            LOC_LATITUDE:[name:'lat',type:'decimal'],
            LOC_LONGITUDE:[name:'lon',type:'decimal']
    ]

    def activityMapping = [
            PGAT_ACTIVITY_DELIVERABLE:[name:'type', type:'string'],
            START_DT:[name:'plannedStartDate',type:'date'],
            FINISH_DT:[name:'plannedEndDate', type:'date']
    ]

    def outputTargetColumnMapping = [
            PGAT_ACTIVITY_DELIVERABLE:[name:'type', type:'string'],
            PGAT_ACTIVITY_TYPE:[name:'gmsScore',type:'string'],
            PGAT_ACTIVITY_UNIT:[name:'target', type:'decimal'],
            PGAT_UOM:[name:'units', type:'string']
    ]

    def activityTypeMapping = [
            'Revegetation':'Revegetation',
            'Weed treatment':'Weed Treatment',
            'Plant propagation':'Plant Propagation',
            'Community participation and engagement':'Community Participation and Engagement',
            'Erosion management':'Erosion Management',
            'Fauna (biological) survey':'Fauna Survey - general',
            'Fencing':'Fencing',
            'Fire management':'Fire Management',
            'Flora (biological) survey':'Flora Survey - general',
            'Public access management':'Public Access and Infrastructure',
            'Seed collection':'Seed Collection',
            'Site preparation':'Site Preparation',
            'Site assessment':'Vegetation Assessment - Commonwealth government methodology',
            'Vegetation monitoring and related activities':'Vegetation Assessment - Commonwealth government methodology',
            'Water quality survey and assessment':'Water Quality Survey'
    ]

    def outputTargetMapping = [
            'Revegetation(no. of plants)no':[outputLabel:'Revegetation Details', scoreLabel:'Number of plants planted', scoreName:'totalNumberPlanted', units:''],
            'Revegetation(area of works)ha':[outputLabel:'Revegetation Details', scoreLabel:'Area of revegetation works (Ha)', scoreName:'areaRevegHa', units:'Ha'],
            'Weed treatment(total area)ha':[outputLabel:'Weed Treatment Details', scoreLabel:'Total area treated (Ha)', scoreName:'areaTreatedHa', units:'Ha'],
            'Plant propagation(no. of plants)no':[outputLabel:'Plant Propagation Details', scoreLabel:'Total No. of plants grown and ready for planting', scoreName:'totalNumberGrown', units:''],
            'Community participation and engagement(events)no':[outputLabel:'Event Details', scoreLabel:'Total No. of Community Participation and Engagement events run', scoreName:'eventTopics', units:''],
            'Erosion management(length)km':[outputLabel:'Erosion Management Details', scoreLabel:'Length of stream/coastline treated (Km)', scoreName:'erosionLength', units:'Km'], // CG - spreadsheet from GMS uses km...
            'Fauna (biological) survey(reports)no':[outputLabel:'Fauna Survey Details',scoreLabel:'No. of surveys undertaken',scoreName:'totalNumberOfOrganisms', units:''], // Not currently output target
            'Fencing(length)km':[outputLabel:'Fence Details', scoreLabel:'Total length of fence (Km)', scoreName:'lengthOfFence', units:'Km'],
            'Fire management(length)km':[outputLabel:'Fire Management Details', scoreLabel:''], // Currently no score for length in fire management
            'Flora (biological) survey(reports)no':[outputLabel:'Flora Survey Details', scoreLabel:'No. of surveys undertaken', scoreName:'totalNumberOfOrganisms', units:''], // Not currently output target
            'Public access management(reports)no':[outputLabel:'Access Control Details', scoreLabel:'No. of activities implementing access control works', scoreName:'structuresInstalled', units:''], // Not currently output target
            'Seed collection(collected)kg':[outputLabel:'Seed Collection Details', scoreLabel:'Total seed collected (Kg)', scoreName:'totalSeedCollectedKg', units:'Kg'],
            'Site preparation(total area treated/prepared)ha':[outputLabel:'Site Preparation Actions', scoreLabel:'Total area prepared (Ha) for follow-up treatment actions', scoreName:'preparationAreaTotal', units:'Ha'],
            'Site assessment(reports)no':[outputLabel:'', scoreLabel: ''], // no scores configured for Vegetation Assessment - Commonwealth government methodology
            'Vegetation monitoring and related activities(sites)no':[outputLabel:'', scoreLabel:''], // no scores configured for Vegetation Assessment - Commonwealth government methodology
            'Water quality survey and assessment(reports)no':[outputLabel:'Water Quality Measurements', scoreLabel:'No. of water quality monitoring events undertaken', scoreName:'instrumentCalibration', units:'' ] // NOt sure if this is exactly what we want.

    ]

    def createProject(projectRows) {

        def errors = []
        def project = gmsToMerit(projectRows[0], projectMapping) // All project rows have the project details.
        project.planStatus = 'not approved'

        // TODO more than one location row?
        def siteRow = projectRows.find{it[DATA_TYPE_COLUMN] == LOCATION_DATA_TYPE}
        def sites = []
        if (siteRow) {
            def site = gmsToMerit(siteRow, siteMapping)

            if (site.kmlUrl) {
                site.kmlUrl = site.kmlUrl.replace('edit', 'kml')
            }
            site.name = "Project area for ${project.grantId}"

            sites << site
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
            def activity = gmsToMerit(activityRow, activityMapping)
            def unmappedType = activity.type
            activity.type = activityTypeMapping[unmappedType]

            // Types for example other cannot be mapped.
            if (activity.type) {

                activity.description = 'Activity ' + (i + 1)
                if (mainTheme) {
                    activity.mainTheme = mainTheme
                }

                activities << activity

                def target = mapTarget(activityRow)
                if (!project.outputTargets) {
                    project.outputTargets = []
                }
                project.outputTargets << target
            }
            else {
                errors << [error:"Unmappable type for activity : ${unmappedType} row: {$activityRow.index}"]
            }

        }

        [project:project, sites:sites, activities:activities, errors:errors]

    }

    private def mapTarget(rowMap) {

        def map = gmsToMerit(rowMap, outputTargetColumnMapping)

        def key = map.type.trim()+map.gmsScore.trim()+map.units.trim()

        def result = [target:map.target]
        result.putAll(outputTargetMapping[key])
        if (map.errors) {
            result.errors = map.errors
        }
        result
    }

    private def gmsToMerit(rowMap, mapping) {
        def result = [:]
        def errors = []
        mapping.each { entry ->

            try {
                def value = convertByType(rowMap[entry.key], entry.value.type)
                result[entry.value.name] = value
            }
            catch (Exception e) {
                errors << "Error converting value: ${rowMap[entry.key]} from row ${rowMap.index} column: ${entry.key}, ${e.getMessage()}"
            }
        }
        if (errors.size() > 0) {
            result.errors = errors
        }
        result
    }

    private def convertByType(String value, String type) {
        value = value?value.trim():''
        switch (type) {
            case 'date':
                return convertDate(value)
            case 'decimal':
                return convertDecimal(value)
            case 'string':
                return value
            case 'url':
                return value
        }
        throw new IllegalArgumentException("Unsupported type: ${type}")
    }

    private def convertDate(date) {


        if (date && date.isInteger()) {
            final long DAYS_FROM_1900_TO_1970 = 25567
            // Date is number of days since 1900
            long days = date as Long
            long millisSince1970 = (days - DAYS_FROM_1900_TO_1970) * 24l * 60l * 60l * 1000l
            return MERIT_DATE_FORMAT.format(new Date(millisSince1970))
        }
        else {
            def format = date.length() == 10 ? GMS_DATE_FORMAT : SHORT_GMS_DATE_FORMAT
            MERIT_DATE_FORMAT.format(format.parse(date))
        }
    }

    private def convertDecimal(value) {
        return new BigDecimal(value).doubleValue()
    }

    /**
     * Maps a project into a List of Maps representing rows in the GMS spreadsheet format.
     * @param project the project to export.
     */
    def exportToGMS(project, metaDataModel) {

        def resultRows = []

        // These need to be included in every row mapped.
        def projectDetails = meritToGMS(project, projectMapping)

        project.outputTargets.each { outputTarget ->

            def mappedOutputTarget = mapOutputTarget(outputTarget)

        }


        return resultRows
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


    private def mapOutputTarget(outputTarget) {

//        "outputLabel": "Weed Treatment Details",
//        "target": "30",
//        "units": "Ha",
//        "scoreLabel": "Total area treated (Ha)",
//        "scoreName": "areaTreatedHa"

        [:]
    }


    private def formatByType(value, type) {


        switch (type) {
            case 'date':
                return formatDate(value)
            case 'decimal':
                return formatDecimal(value)
            case 'string':
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

    private def formatDecimal(value) {
        if (!value) {
            return ''
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
