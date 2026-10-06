package au.org.ala.merit

import au.org.ala.ecodata.utils.ExcelUtils
import jakarta.servlet.http.HttpServletResponse
import org.apache.poi.hssf.util.HSSFColor
import org.apache.poi.ss.usermodel.*
import org.apache.poi.ss.util.CellReference
import org.apache.poi.xssf.streaming.SXSSFWorkbook
import org.apache.poi.xssf.usermodel.XSSFDataFormat
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.LocalDate

/**
 * Responsible for mapping project announcements to Excel format and back.
 */
class AnnouncementsMapper {


    static def DEFAULT_SHEET = "Announcements"

    /**
     * A formatter for use with the Grails Excel Export Plugin to convert ISO formatted dates
     * to Java Dates so the cell style can be set correctly
     */
    static class DisplayDateFormatter {
        private String propertyName
        DisplayDateFormatter(String propertyName) {
            this.propertyName = propertyName
        }
        protected String format(String isoDate) {
            if (!isoDate) {
                return ''
            }
            try {
                return DateUtils.displayFormat(DateUtils.parse(isoDate))
            }
            catch (Exception e) {
                return ''
            }
        }
    }

    /** Handles empty strings, nulls, strings and LocalDates */
    public String parseDisplayDate(displayDate) {
        try {
            if (!displayDate) {
                return ''
            }
            def date
            if (displayDate instanceof Date) {
                // POI returns dates at midnight in the default timezone
                displayDate = LocalDate.fromDateFields(displayDate)
            }
            if (displayDate instanceof LocalDate) {
                date = displayDate.toDateTimeAtStartOfDay(DateTimeZone.UTC)
            }
            else {
                date = DateUtils.parseDisplayDate(displayDate)
            }
            return DateUtils.format(date)
        }
        catch (Exception e) {
            println "Parsing ${displayDate} failed. Type: ${displayDate.class}"
            return ''
        }
    }


    static def ANNOUNCEMENT_HEADER_MAPPING = [
            'Grant ID':'grantId',
            'Project Name':'name',
            'Type':'eventType',
            'Name of funding announcement or non-funding opportunity':'eventName',
            'Scheduled date for: 1 - Announcing the opening of the grant round; 2 - Non-funding opportunities':'eventDate',
            'When will successful applicants be announced':'grantAnnouncementDate',
            'Total value of funding announcement':'funding',
            'Information about this funding announcement or non-funding opportunity':'eventDescription',

        ]


    public AnnouncementsMapper() {
    }

    public void announcementsToExcel(HttpServletResponse response, announcements) {

        def properties = [], headers = []
        ANNOUNCEMENT_HEADER_MAPPING.each { header, property ->
            headers << header
            if (property == 'eventDate' || property == 'grantAnnouncementDate') {
                properties << new DisplayDateFormatter(property)
            }
            else {
                properties << property
            }
        }

        def fileName = 'announcements_'+DateUtils.displayFormat(new DateTime())+".xlsx"

        // Inlined Apache POI replacement for the discontinued excel-export plugin's WebXlsxExporter.
        response.setHeader('Content-Disposition', 'attachment; filename="'+fileName+'"')
        response.contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        SXSSFWorkbook workbook = new SXSSFWorkbook()
        try {
            Sheet sheet = workbook.createSheet(DEFAULT_SHEET)

            // Write the header row
            Row headerRow = sheet.createRow(0)
            CellStyle headerStyle = headerStyle(workbook)
            headers.eachWithIndex{ header, index ->
                Cell cell = headerRow.createCell(index)
                cell.setCellValue(header)
            }
            styleRow(sheet, 0, headerStyle)

            CellStyle dateStyle = dateStyle(workbook)
            sheet.setDefaultColumnStyle(3, dateStyle)
            sheet.setDefaultColumnStyle(6, dateStyle)
            announcements.eachWithIndex { announcement, rowIndex ->
                Row row = sheet.createRow(rowIndex + 1)
                properties.eachWithIndex { property, colIndex ->
                    Cell cell = row.createCell(colIndex)
                    def value
                    if (property instanceof DisplayDateFormatter) {
                        value = property.format(announcement[property.propertyName])
                    }
                    else {
                        value = announcement[property]
                    }
                    if (value instanceof Number) {
                        cell.setCellValue(value.doubleValue())
                    }
                    else {
                        cell.setCellValue(value?.toString() ?: '')
                    }
                }
            }

            styleColumn(sheet, 3, dateStyle)
            styleColumn(sheet, 6, dateStyle)

            workbook.write(response.outputStream)
        }
        finally {
            workbook.close()
        }

        response.outputStream.flush()
    }

    def static styleRow(Sheet sheet, int row, CellStyle style) {
        sheet.getRow(row).cellIterator().toList().each {
            it.setCellStyle(style)
        }
    }

    def static styleColumn(Sheet sheet, int column, CellStyle style) {
        for (int i=1; i<sheet.lastRowNum; i++) {
            sheet.getRow(i).getCell(column).setCellStyle(style)
        }
    }

    private static CellStyle headerStyle(Workbook workbook) {
        CellStyle headerStyle = workbook.createCellStyle()
        headerStyle.setFillBackgroundColor(IndexedColors.BLACK.getIndex())
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND)
        Font font = workbook.createFont()
        //font.setBoldweight(Font.BOLDWEIGHT_BOLD)
        font.setBold(true)
        font.setColor(HSSFColor.HSSFColorPredefined.WHITE.index)
        headerStyle.setFont(font)
        return headerStyle
    }
    private static CellStyle dateStyle(Workbook workbook) {
        CellStyle dateCellStyle = workbook.createCellStyle()
        XSSFDataFormat dateFormat = workbook.createDataFormat()
        dateCellStyle.dataFormat = dateFormat.getFormat('dd-mm-yyyy')

        return dateCellStyle
    }


    public List excelToAnnouncements(InputStream excelIn) {

        def columnMap = [:]
        ANNOUNCEMENT_HEADER_MAPPING.eachWithIndex { headerMap, i ->
            columnMap << [(CellReference.convertNumToColString(i)):headerMap.value]
        }
        def config = [
            sheet:DEFAULT_SHEET,
            startRow:1, // Skip the header row
            columnMap: columnMap
        ]

        Workbook workbook = WorkbookFactory.create(excelIn)
        def announcements = ExcelUtils.convertColumnMapManyRows(workbook, config)
        announcements.each { announcement ->
            announcement.eventDate = parseDisplayDate(announcement.eventDate)
            announcement.grantAnnouncementDate = parseDisplayDate(announcement.grantAnnouncementDate)
        }
    }


}
