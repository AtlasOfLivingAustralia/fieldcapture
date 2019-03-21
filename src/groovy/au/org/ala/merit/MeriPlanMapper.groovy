package au.org.ala.merit

import org.apache.commons.lang.StringUtils
import org.apache.poi.hssf.usermodel.HSSFCell
import org.apache.poi.ss.usermodel.*
import org.apache.poi.ss.util.CellReference
import org.apache.poi.xssf.usermodel.XSSFCell

import java.util.regex.Matcher
import java.util.regex.Pattern

/**
 * The MeriPlanMapper is responsible for taking a spreadsheet in the custom format used for RLP MERI plans
 * and convert it to a format compatible with the MERIT representation of a MERI plan.
 *
 */
class MeriPlanMapper {

    private static final String MERI_PLAN_SHEET_NAME = 'MERI plan template'

    private List sections = [
            [sectionStart:'Program outcome', sectionEnd:'Secondary Regional Land Partnerships outcome(s)', loader:this.&loadPrimaryOutcome],
            [sectionStart:'Secondary Regional Land Partnerships outcome(s)', sectionEnd:'Short-term outcome statement/s *', loader:this.&loadSecondaryOutcomes],
            [sectionStart:'Short-term outcome statement/s *', sectionEnd:'Medium-term outcome statement/s *', loader:this.&loadShortTermOutcomes],
            [sectionStart:'Medium-term outcome statement/s *', sectionEnd:'Project details', loader:this.&loadMediumTermOutcomes],
            [sectionStart:'Project details', sectionEnd:'Environment projects only (Primary outcomes 1-4)', loader:this.&loadProjectDescription],
            [sectionStart:'Environment projects only (Primary outcomes 1-4)', sectionEnd:'Agriculture projects only (Primary outcomes 5 or 6)', loader:this.&loadThreatsAndInterventions],
            [sectionStart:'Agriculture projects only (Primary outcomes 5 or 6)', sectionEnd:'Project methodology (4000 character limit [approx. 650 words]) *', loader:this.&loadRationale],
            [sectionStart:'Project methodology (4000 character limit [approx. 650 words]) *', sectionEnd:'Monitoring methodology', loader:this.&loadProjectMethodology],
            [sectionStart:'Monitoring methodology', sectionEnd:'Add row', loader:this.&loadMonitoringBaseline],
            [sectionStart:'Add row', sectionEnd:'Project review, evaluation and improvement methodology and approach * (3000 character limit [approximately 500 words])', loader:this.&loadMonitoringIndicators],
            [sectionStart:'Project review, evaluation and improvement methodology and approach * (3000 character limit [approximately 500 words])', sectionEnd:'Relevant national and regional plans', loader:this.&loadProjectEvaluationApproach],
            [sectionStart:'Relevant national and regional plans', sectionEnd:'Project services and minimum targets  *', loader:this.&loadPlans],
            [sectionStart:'Project services and minimum targets  *', sectionEnd:'Project risks', loader:this.&loadServices],
            [sectionStart:'Project risks', sectionEnd:'END OF DOCUMENT', loader:this.&loadRisks]]

    private static final List COMMENTS_TO_IGNORE = [
            "[multiple primary investment priorities only applicable where Outcome 5 or 6 is selected as Primary Outcome]",
            "select from drop down list",
            "Please select Project Service from drop down list"]


    // Targets are the most problematic item in the sheet.
    // They are supposed to be entered as <target quantity> (target measure label), ...
    // e.g. 20 (Number of days maintaining monitoring regimes), 2 (Number of monitoring regimes established)
    // However as it is free text field, the values entered are much less structure.
    private Pattern TARGET_MATCHING_PATTERN = Pattern.compile(/(\d+\.?\d*)(?:[^\(\)\d])?(?:\((.*)\))?/)

    /** Required to map service and output target names into scores and service ids */
    private List serviceConfiguration

    private Map investmentPriorities

    MeriPlanMapper(List serviceConfiguration, Map investmentPriorities) {
        this.serviceConfiguration = serviceConfiguration
        this.investmentPriorities = investmentPriorities
    }


    /**
     * Takes an InputStream containing a Microsoft Excel spreadsheet in the MERI plan format
     * and produces a Map that can be used to populate the MERI plan in MERIT.
     */
    Map importMeriPlan(InputStream meriPlanXlsx) {

        List processingMessages = []
        Map meriPlanResult = [:]
        meriPlanXlsx.withCloseable {

            Workbook workbook = WorkbookFactory.create(meriPlanXlsx)
            Sheet meriPlan = workbook.getSheet(MERI_PLAN_SHEET_NAME)

            Iterator<Row> allRows = meriPlan.rowIterator()
            Row row = allRows.next()
            sections.each { Map section ->
                String firstCell = null
                while (allRows.hasNext() && firstCell != section.sectionStart) {
                    firstCell = getCellValue(row, "A")
                    row = allRows.next()
                }
                List rows = []
                while (allRows.hasNext() && firstCell != section.sectionEnd) {
                    rows << row

                    row = allRows.next()
                    firstCell = getCellValue(row, "A")
                }
                Map result = loadSection(rows, section.loader)
                meriPlanResult = merge(meriPlanResult, result.data)
                processingMessages << result.messages

            }
        }
        return meriPlanResult
    }

    private String getCellString(Cell cell, String defaultValue = null) {
        if (!cell) {
            return defaultValue
        }
        String value = defaultValue
        switch (cell.cellType) {
            case Cell.CELL_TYPE_STRING:
                value = cell.getStringCellValue()
                break
            case Cell.CELL_TYPE_NUMERIC:
                value = ((XSSFCell)cell).getRawValue()
                break
        }
        value
    }


    /**
     * The sheet is broken up into sections separated by headers.
     * @param sectionHeading the section to be parsed
     * @param rows the rows contained in the section.
     */
    private Map loadSection(List<Row> rows, Closure loader) {
        Map data = [:]

        if (loader) {
            data = loader(rows)
        }
        data
    }

    private Map loadPrimaryOutcome(List<Row> rows) {
        String primaryOutcome = loadSingleValue(rows, 1, "A")
        Map config = [startRow: 1, cellMapping: [L:[name:"asset"]]]
        List assets = mapSection(config, rows).collect{it.asset}

        Map data = [outcomes: [primaryOutcome: [description: primaryOutcome, assets: assets]]]
        [data:data]
    }

    private Map loadSecondaryOutcomes(List<Row> rows) {
        Map config = [startRow:1, cellMapping:[B:[name:"description"], H:[name:"assets"]]]
        loadOutcomes(rows, config, "secondaryOutcomes")
    }

    private Map loadShortTermOutcomes(List<Row> rows) {
        Map config = [startRow: 0, cellMapping:[B:[name:"description"]]]
        loadOutcomes(rows, config, "shortTermOutcomes")
    }

    private Map loadMediumTermOutcomes(List<Row> rows) {
        Map config = [startRow: 0, cellMapping:[B:[name:"description"]]]
        loadOutcomes(rows, config, "midTermOutcomes")
    }

    private Map loadProjectDescription(List<Row> rows) {
        [data:[description:loadSingleValue(rows, 1, "A")]]
    }

    private Map loadThreatsAndInterventions(List<Row> rows) {

        Map config = [startRow: 1, cellMapping:[B:[name:'threat'], H:[name:'intervention']]]
        List threatsAndInterventions = mapSection(config, rows)
        [data:[threats:[description:'', rows:threatsAndInterventions]]]
    }

    private Map loadRationale(List<Row> rows) {
        [data:[rationale:loadSingleValue(rows, 1, "A")]]
    }


    private Map loadProjectMethodology(List<Row> rows) {
        [data:[projectMethodology:loadSingleValue(rows, 0, "A")]]
    }

    private Map loadMonitoringBaseline(List<Row> rows) {
        Map config = [startRow: 1, cellMapping: [B:[name:"baseline"], H:[name:"method"]]]
        List baseline = mapSection(config, rows)
        [data:[baseline:[rows:baseline]]]
    }

    private Map loadMonitoringIndicators(List<Row> rows) {
        Map config = [startRow: 1, cellMapping: [B:[name:"data1"], H:[name:"data2"]]]
        List indicators = mapSection(config, rows)
        [data:[keq:[rows:indicators]]]
    }

    private Map loadProjectEvaluationApproach(List<Row> rows) {
        [data:[projectEvaluationApproach:loadSingleValue(rows, 0, "A")]]
    }

    private Map loadPlans(List<Row> rows) {
        Map config = [startRow: 1, cellMapping: [B:[name:"data1"], D:[name:"data2"], K:[name:"data3"]]]
        List plans = mapSection(config, rows)
        [data:[priorities:[rows:plans]]]
    }

    private Map loadServices(List<Row> rows) {
        Map config = [startRow:3, cellMapping: [B:[name:'serviceName'], F:[name:"target"], H:[name:"2018/2019"], J:[name:"2019/2020"], L:[name:"2020/2021"], N:[name:"2021/2022"], P:[name:"2022/2023"]]]
        List services = mapSection(config, rows)
        List messages = []
        List serviceIds = []
        List outputTargets = []

        // Services need a fair bit of post-processing to be mapped correctly.
        services.each { Map unprocessedService ->
            Map service = serviceConfiguration.find{it.name == unprocessedService.serviceName}
            if (!service) {
                println "No match for service: "+unprocessedService.serviceName
            }
            else {
                if (!serviceIds.contains(service.id)) {
                    serviceIds << service.id
                }

                Map result = mapTargets(service, unprocessedService.target)
                messages = messages + result.messages

                result.data.each { Map target ->
                    outputTargets << [scoreId:target.scoreId, target:target.target, periodTargets:[]]
                }

                ["2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"].each { String period ->
                    result = mapTargets(service, unprocessedService[period])
                    messages = messages + result.messages

                    result.data.each { Map target ->
                        Map outputTarget = outputTargets.find{it.scoreId == target.scoreId}
                        if (!outputTarget) {
                            outputTarget = [scoreId: target.scoreId, periodTargets:[]]
                            outputTargets << outputTarget
                        }
                        outputTarget.periodTargets << [period:period, target:target.target]
                    }

                }
            }
        }
        [data:[serviceIds:serviceIds, outputTargets:outputTargets], messages:messages]
    }

    private Map mapTargets(Map matchedService, String value) {


        List targets = []
        if (!value) {
            return [data:targets]
        }
        List scoreLabels = matchedService.scores.collect{it.label}

        Matcher matcher = TARGET_MATCHING_PATTERN.matcher(value)
        while (matcher.find()) {

            String target = matcher.group(1)
            String scoreLabel = matcher.group(2)

            if (!scoreLabel && matchedService.scores?.size() == 1) {
                targets << [target:target, scoreId: matchedService.scores[0].scoreId]
            }
            else {
                Map result = postProcess(scoreLabel, [pickList:scoreLabels])

                if (result.processedValue) {
                    Map score = matchedService.scores.find{it.label == result.processedValue}
                    if (score) {
                        targets << [target:target, scoreId: score.scoreId]
                    }
                }
            }
        }

        [data:targets, messages:[]]
    }

    private Map loadRisks(List<Row> rows) {
        Map config = [startRow:1, cellMapping: [B:[name:'threat'], C:[name:"description"], H:[name:"likelihood"], I:[name:"consequence", capitalise:true], J:[name:"riskRating", capitalise:true], K:[name:"currentControl"], Q:[name:"residualRisk", capitalise:true]]]
        List risks = mapSection(config, rows)
        [data:[risks:[rows:risks]]]
    }


    private String loadSingleValue(List<Row> rows, int startRow, String column) {
        String value = null
        if (rows.size() > startRow) {
            value = getCellValue(rows[startRow], column)
        }
        value
    }


    private Map loadOutcomes(List<Row> rows, Map config, String outputKey) {
        List outcomes = mapSection(config, rows)
        outcomes.each {Map outcome ->
            List availableAssets = investmentPriorities[outcome.description]
            outcome.assets = outcome.assets ? [outcome.assets] : []

            outcome.assets.collect { String asset ->
                postProcess(asset, [pickList:availableAssets]).processedValue
            }
        }
        Map data = [outcomes: [(outputKey): outcomes]]
        [data:data]
    }

    private List mapSection(Map config, List<Row> rows) {

        List results = []
        if (rows && rows.size() > config.startRow) {
            for (int i=config.startRow ?: 0; i<rows.size(); i++) {
                Map result = mapRow(config.cellMapping, rows[i])
                if (result) { // Don't add rows with all empty values
                    results << result
                }
            }
        }

        results
    }

    private Map mapRow(Map rowConfig, Row row) {
        Map result = [:]
        rowConfig.each {k, cellConfig ->
            String value = getCellValue(row, k)
            Map processResult = postProcess(value, cellConfig)
            if (processResult.processedValue) {
                result[cellConfig.name] = processResult.processedValue
            }
        }
        result
    }


    /**
     * Gets the value of the cell identified by the supplied column.  If the cell is not
     * string typed or doesn't exist, the defaultValue is returned.
     */
    private String getCellValue(Row row, String column, String defaultValue = null) {
        String value = defaultValue
        int columnIdx = CellReference.convertColStringToIndex(column)
        if (row && columnIdx >= 0 && row.lastCellNum > columnIdx) {
            Cell cell = row.getCell(columnIdx)
            value = getCellString(cell, defaultValue)
        }

        value?.trim()
    }

    private Map postProcess(String value, Map config) {

        Map results = [value:value, processedValue:value]
        // Ignore values that match comments / help text in the sheet
        if (value && (value in COMMENTS_TO_IGNORE)) {
            results.processedValue = null
        }

        if (config.capitalise) {
            results.processedValue = value?.capitalize()
        }
        if (config.pickList) {
            Map pickResults = matchFromList(value, config.pickList)
            results.processedValue = pickResults.matchedValue
        }

        results
    }

    private Map matchFromList(String value, List values) {

        Map result = [value:value, matchedValue: value, exact:true]
        if (value) {
            int minimumDistance = Integer.MAX_VALUE
            String match = null
            values.each { String item ->
                int distance = StringUtils.getLevenshteinDistance(value, item)
                if (distance < minimumDistance) {
                    minimumDistance = distance
                    match = item
                }
            }
            result = [value:value, matchedValue:match, exact:minimumDistance == 0]

        }
        result


    }

    /**
     * Merges two maps, replacing keys in map1 with map2 unless they are both Maps in which
     * case the values are merged recursively.
     */
    private Map merge(Map map1, Map map2) {
        Map result = [:] + map1
        map2.each { k, v ->
            if (result[k] instanceof Map && v instanceof Map) {
                result[k] = merge(result[k], v)
            } else {
                result[k] = v
            }
        }

        result
    }
}
