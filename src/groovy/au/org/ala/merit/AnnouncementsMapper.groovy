package au.org.ala.merit

import au.org.ala.fieldcapture.DateUtils
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.apache.poi.ss.util.CellReference
import org.grails.plugins.excelimport.ExcelImportService
import org.joda.time.DateTime
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
     * to our display format.
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
            return DateUtils.isoToDisplayFormat(isoDate)
        }
    }

    static def ANNOUNCEMENT_HEADER_MAPPING = [
            'Grant ID':'grantId',
            'Project Name':'name',
            'Proposed event/announcement':'eventName',
            'Proposed Date of event / announcement (if known)':'eventDate',
            'Type of event / announcement (if known)':'eventType',
            'Description of the event':'eventDescription',
            'Value of the funding round':'funding']

    def excelImportService

    public AnnouncementsMapper(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService
    }

    public void announcementsToExcel(HttpServletResponse response, announcements) {

        def properties = [], headers = []
        ANNOUNCEMENT_HEADER_MAPPING.each { header, property ->
            headers << header
            if (property == 'scheduledDate') {
                properties << new DisplayDateFormatter(property)
            }
            else {
                properties << property
            }
        }

        def fileName = 'announcements_'+DateUtils.displayFormat(new DateTime())+XlsxExporter.filenameSuffix

        new WebXlsxExporter().with {
            setWorksheetName(DEFAULT_SHEET)
            setResponseHeaders(response, fileName)
            fillHeader(headers)
            add(announcements, properties)
            save(response.outputStream)
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
        excelImportService.columns(workbook, config)
    }


}
