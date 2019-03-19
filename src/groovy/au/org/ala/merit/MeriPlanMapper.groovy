package au.org.ala.merit

import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellReference

/**
 * The MeriPlanMapper is responsible for taking a spreadsheet in the custom format used for RLP MERI plans
 * and convert it to a format compatible with the MERIT representation of a MERI plan.
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
            [sectionStart:'', sectionEnd:'END OF DOCUMENT', loader:null]]

    private static final String COMMENT_START = "["


    Map importMeriPlan(InputStream meriPlanXlsx) {

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
                meriPlanResult = merge(meriPlanResult, loadSection(rows, section.loader))
            }
        }
        return meriPlanResult
    }

    private String getCellString(Cell cell, String defaultValue = null) {
        cell && cell.cellType == Cell.CELL_TYPE_STRING ? cell.getStringCellValue() : defaultValue
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

    Map loadPrimaryOutcome(List<Row> rows) {
        String primaryOutcomeAssetColumn = "L"
        String primaryOutcome = ''
        List assets = []

        if (rows.size() > 1) {
            primaryOutcome = rows[1].getCell(0).getStringCellValue()
            for (Row row : rows) {
                String asset = getCellValue(row, primaryOutcomeAssetColumn)
                if (asset && !asset.startsWith(COMMENT_START)) {
                    assets << asset
                }
            }
        }
        Map result = [outcomes: [primaryOutcome: [description: primaryOutcome, assets: assets]]]
        result
    }

    Map loadSecondaryOutcomes(List<Row> rows) {
        Map config = [startRow:1, cellMapping:[B:"description", H:"assets"]]
        loadOutcomes(rows, config, "secondaryOutcomes")
    }

    Map loadShortTermOutcomes(List<Row> rows) {
        Map config = [startRow: 0, cellMapping:[B:"description"]]
        loadOutcomes(rows, config, "shortTermOutcomes")
    }

    Map loadMediumTermOutcomes(List<Row> rows) {
        Map config = [startRow: 0, cellMapping:[B:"description"]]
        loadOutcomes(rows, config, "midTermOutcomes")
    }

    Map loadProjectDescription(List<Row> rows) {
        [description:loadSingleValue(rows, 1, "A")]
    }

    Map loadThreatsAndInterventions(List<Row> rows) {

        Map config = [startRow: 1, cellMapping:[B:'threat', H:'intervention']]
        List threatsAndInterventions = mapSection(config, rows)
        [threats:[description:'', rows:threatsAndInterventions]]
    }

    Map loadRationale(List<Row> rows) {
        [rationale:loadSingleValue(rows, 1, "A")]
    }


    Map loadProjectMethodology(List<Row> rows) {
        [projectMethodology:loadSingleValue(rows, 0, "A")]
    }

    Map loadMonitoringBaseline(List<Row> rows) {
        Map config = [startRow: 1, cellMapping: [B:"baseline", H:"method"]]
        List baseline = mapSection(config, rows)
        [baseline:[rows:baseline]]
    }

    Map loadMonitoringIndicators(List<Row> rows) {
        Map config = [startRow: 1, cellMapping: [B:"data1", H:"data2"]]
        List indicators = mapSection(config, rows)
        [keq:[rows:indicators]]
    }

    Map loadProjectEvaluationApproach(List<Row> rows) {
        [projectEvaluationApproach:loadSingleValue(rows, 0, "A")]
    }

    String loadSingleValue(List<Row> rows, int startRow, String column) {
        String value = null
        if (rows.size() > startRow) {
            value = getCellValue(rows[startRow], column)
        }
        value
    }


    Map loadOutcomes(List<Row> rows, Map config, String outputKey) {
        List outcomes = mapSection(config, rows)
        outcomes.each {Map outcome ->
            outcome.assets = outcome.assets ? [outcome.assets] : []
        }
        Map result = [outcomes: [(outputKey): outcomes]]
        result
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

    private Map mapRow(Map config, Row row) {
        Map result = [:]
        config.each {k, v ->
            String value = getCellValue(row, k)
            if (value) {
                result[v] = value
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
        if (row && row.lastCellNum > columnIdx) {
            Cell cell = row.getCell(columnIdx)
            value = getCellString(cell, defaultValue)
        }

        value?.trim()
    }

    /**
     * Merges two maps, replacing keys in map1 with map2 unless they are both Maps in which
     * case the values are merged recursively.
     */
    Map merge(Map map1, Map map2) {
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
