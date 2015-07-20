package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import org.apache.poi.hssf.util.HSSFColor
import org.apache.poi.ss.usermodel.*
import org.apache.poi.ss.util.CellReference
import org.apache.poi.xssf.usermodel.XSSFDataFormat
import org.grails.plugins.excelimport.ExcelImportService
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.joda.time.LocalDate
import pl.touk.excel.export.WebXlsxExporter
import pl.touk.excel.export.XlsxExporter
import pl.touk.excel.export.getters.PropertyGetter

import javax.servlet.http.HttpServletResponse

/**
 * Responsible for mapping project announcements to Excel format and back.
 */
class AnnouncementsMapper {


    static def DEFAULT_SHEET = "Announcements"

    /**
     * A formatter for use with the Grails Excel Export Plugin to convert ISO formatted dates
     * to Java Dates so the cell style can be set correctly
     */
    static class DisplayDateFormatter extends PropertyGetter<String, String> {
        DisplayDateFormatter(String propertyName) {
            super(propertyName)
        }
        @Override
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

    def excelImportService

    public AnnouncementsMapper(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService
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

        def fileName = 'announcements_'+DateUtils.displayFormat(new DateTime())+XlsxExporter.filenameSuffix


        def exporter = new WebXlsxExporter()

        exporter.with {
            CellStyle headerStyle = headerStyle(workbook)
            CellStyle dateStyle = dateStyle(workbook)

            setDateCellFormat('dd-mm-yyyy')
            setWorksheetName(DEFAULT_SHEET)
            setResponseHeaders(response, fileName)
            fillHeader(headers)
            styleRow(sheet, 0, headerStyle)
            sheet.setDefaultColumnStyle(3, dateStyle)
            sheet.setDefaultColumnStyle(6, dateStyle)
            add(announcements, properties)
            styleColumn(sheet, 3, dateStyle)
            styleColumn(sheet, 6, dateStyle)

            sizeColumns(workbook)
            workbook.write(response.outputStream)
        }

        response.outputStream.flush()
    }

    def styleRow(Sheet sheet, int row, CellStyle style) {
        sheet.getRow(row).cellIterator().toList().each {
            it.setCellStyle(style)
        }
    }

    def styleColumn(Sheet sheet, int column, CellStyle style) {
        for (int i=1; i<sheet.lastRowNum; i++) {
            sheet.getRow(i).getCell(column).setCellStyle(style)
        }
    }

    private CellStyle headerStyle(Workbook workbook) {
        CellStyle headerStyle = workbook.createCellStyle()
        headerStyle.setFillBackgroundColor(IndexedColors.BLACK.getIndex())
        headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND)
        Font font = workbook.createFont()
        font.setBoldweight(Font.BOLDWEIGHT_BOLD)
        font.setColor(HSSFColor.WHITE.index)
        headerStyle.setFont(font)
        return headerStyle
    }
    private CellStyle dateStyle(Workbook workbook) {
        CellStyle dateCellStyle = workbook.createCellStyle()
        XSSFDataFormat dateFormat = workbook.createDataFormat()
        dateCellStyle.dataFormat = dateFormat.getFormat('dd-mm-yyyy')

        return dateCellStyle
    }

    def sizeColumns(workbook) {
        for (Sheet sheet:workbook) {
            // For table upload templates, the validation sheet may have no rows if nothing needs validation.
            def row = sheet.getRow(0)
            if (row) {
                int columns = row.getLastCellNum()
                for (int col = 0; col < columns; col++) {
                    sheet.autoSizeColumn(col);
                }
            }
        }
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
        def announcements = excelImportService.columns(workbook, config)
        announcements.each { announcement ->
            announcement.eventDate = parseDisplayDate(announcement.eventDate)
            announcement.grantAnnouncementDate = parseDisplayDate(announcement.grantAnnouncementDate)
        }
    }


}
