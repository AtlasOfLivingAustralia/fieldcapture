package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
import au.org.ala.merit.config.ReportConfig
import org.joda.time.DateTime
import spock.lang.Specification

class ReportGeneratorSpec extends Specification {

    ReportOwner projectOwner
    def setup() {
        projectOwner = new ReportOwner(id:[projectId:'p1'], name:'Project 1', periodStart: '2018-06-30T14:00:00Z', periodEnd: '2023-06-30T14:00:00Z')
    }


    def "Report names and descriptions can include the financial year the report falls into"() {
        setup:
        ReportConfig config = new ReportConfig(reportingPeriodInMonths: 6)
        ReportOwner owner = new ReportOwner(name:"Project 1")
        DateTime start = DateUtils.parse('2018-06-30T14:00:00Z')
        DateTime end = DateUtils.parse('2018-12-31T13:00:00Z')

        when:
        String name = new ReportGenerator().format("%5\$s", config, owner, 0, start, end)

        then:
        name == '2018/2019'

        when:
        config.reportingPeriodInMonths = 3
        start = DateUtils.parse('2018-06-30T14:00:00Z')
        end = DateUtils.parse('2018-09-30T11:00:00Z')
        name = new ReportGenerator().format("%5\$s", config, owner, 0, start, end)

        then:
        name == '2018/2019'

        when:
        start = DateUtils.parse('2018-12-31T13:00:00Z')
        end = DateUtils.parse('2019-03-31T13:00:00Z')
        name = new ReportGenerator().format("%5\$s", config, owner, 0, start, end)

        then:
        name == '2018/2019'

        when:
        start = DateUtils.parse('2019-03-31T13:00:00Z')
        end = DateUtils.parse('2019-06-30T14:00:00Z')

        name = new ReportGenerator().format("%5\$s", config, owner, 0, start, end)

        then:
        name == '2018/2019'
    }

    def "Report names and descriptions can include reporting period information"() {
        setup:
        ReportConfig config = new ReportConfig(reportingPeriodInMonths: 6)
        ReportOwner owner = new ReportOwner(name:"Project 1")
        DateTime start = DateUtils.parse('2018-06-30T14:00:00Z')
        DateTime end = DateUtils.parse('2018-12-31T13:00:00Z')

        when:
        String name = new ReportGenerator().format("%6\$s", config, owner, 0, start, end)

        then:
        name == 'Semester'

        when:
        config.reportingPeriodInMonths = 3
        name = new ReportGenerator().format("%6\$s", config, owner, 0, start, end)

        then:
        name == 'Quarter'

        when:
        config.reportingPeriodInMonths = 0
        name = new ReportGenerator().format("%6\$s", config, owner, 0, start, end)

        then:
        name == ''

    }

    def "Report names and descriptions can include a report sequence number relative to the financial year"() {
        setup:
        ReportConfig config = new ReportConfig(reportingPeriodInMonths: 3)
        ReportOwner owner = new ReportOwner(name:"Project 1")
        DateTime start = DateUtils.parse('2018-06-30T14:00:00Z')
        DateTime end = DateUtils.parse('2018-09-30T14:00:00Z')

        when:
        String name = new ReportGenerator().format("%5\$s %7\$02d", config, owner, 0, start, end)

        then:
        name == '2018/2019 01'

        when:
        start = DateUtils.parse('2018-09-30T14:00:00Z')
        end = DateUtils.parse('2018-12-31T14:00:00Z')
        name = new ReportGenerator().format("%5\$s %7\$02d", config, owner, 0, start, end)

        then:
        name == '2018/2019 02'

        when:
        start = DateUtils.parse('2018-12-31T13:00:00Z')
        end = DateUtils.parse('2019-03-31T13:00:00Z')
        name = new ReportGenerator().format("%5\$s %7\$02d", config, owner, 0, start, end)

        then:
        name == '2018/2019 03'

        when:
        start = DateUtils.parse('2019-03-31T13:00:00Z')
        end = DateUtils.parse('2019-06-30T14:00:00Z')

        name = new ReportGenerator().format("%5\$s %7\$02d", config, owner, 0, start, end)

        then:
        name == '2018/2019 04'

        when:
        config.reportingPeriodInMonths = 6
        start = DateUtils.parse('2018-06-30T14:00:00Z')
        end = DateUtils.parse('2018-12-31T13:00:00Z')
        name = new ReportGenerator().format("%5\$s %7\$02d", config, owner, 0, start, end)

        then:
        name == '2018/2019 01'

        when:
        start = DateUtils.parse('2018-12-31T13:00:00Z')
        end = DateUtils.parse('2019-06-30T14:00:00Z')
        name = new ReportGenerator().format("%5\$s %7\$02d", config, owner, 0, start, end)

        then:
        name == '2018/2019 02'

    }

    def "RLP output reports can be generated using names specified relative to the financial year in which they fall"() {
        setup:
        ReportGenerator generator = new ReportGenerator()
        ReportConfig config = new ReportConfig(
                reportingPeriodInMonths: 3,
                reportsAlignedToCalendar: true,
                activityType: 'RLP Outputs Report',
                category: 'Outputs Reporting',
                canSubmitDuringReportingPeriod: true,
                reportNameFormat: "%5\$s - Outputs Report %7\$02d",
                reportDescriptionFormat: "%5\$s - Outputs Report %7\$02d")

        when:
        List reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        reports.size() == 5 * 4 // A five year project with 4 reports per year

        and:
        reports[0].name == '2018/2019 - Outputs Report 01'
        reports[1].name == '2018/2019 - Outputs Report 02'
        reports[2].name == '2018/2019 - Outputs Report 03'
        reports[3].name == '2018/2019 - Outputs Report 04'

        reports[4].name == '2019/2020 - Outputs Report 01'
        reports[5].name == '2019/2020 - Outputs Report 02'
        reports[6].name == '2019/2020 - Outputs Report 03'
        reports[7].name == '2019/2020 - Outputs Report 04'

        reports[8].name == '2020/2021 - Outputs Report 01'
        reports[9].name == '2020/2021 - Outputs Report 02'
        reports[10].name == '2020/2021 - Outputs Report 03'
        reports[11].name == '2020/2021 - Outputs Report 04'

        reports[12].name == '2021/2022 - Outputs Report 01'
        reports[13].name == '2021/2022 - Outputs Report 02'
        reports[14].name == '2021/2022 - Outputs Report 03'
        reports[15].name == '2021/2022 - Outputs Report 04'

        reports[16].name == '2022/2023 - Outputs Report 01'
        reports[17].name == '2022/2023 - Outputs Report 02'
        reports[18].name == '2022/2023 - Outputs Report 03'
        reports[19].name == '2022/2023 - Outputs Report 04'

        when:
        config.reportingPeriodInMonths = 6
        reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        reports.size() == 5 * 2 // A five year project with 2 reports per year

        and:
        reports[0].name == '2018/2019 - Outputs Report 01'
        reports[1].name == '2018/2019 - Outputs Report 02'

        reports[2].name == '2019/2020 - Outputs Report 01'
        reports[3].name == '2019/2020 - Outputs Report 02'

        reports[4].name == '2020/2021 - Outputs Report 01'
        reports[5].name == '2020/2021 - Outputs Report 02'

        reports[6].name == '2021/2022 - Outputs Report 01'
        reports[7].name == '2021/2022 - Outputs Report 02'

        reports[8].name == '2022/2023 - Outputs Report 01'
        reports[9].name == '2022/2023 - Outputs Report 02'

    }

    def "The RLP Output Report naming convention can be produced"() {
        setup:
        ReportConfig config = new ReportConfig(reportingPeriodInMonths: 6)
        ReportOwner owner = new ReportOwner(name:"Project 1")
        DateTime start = DateUtils.parse('2018-06-30T14:00:00Z')
        DateTime end = DateUtils.parse('2018-12-31T13:00:00Z')
        config.reportNameFormat = "Year %5\$s - %6\$s %7\$d Outputs Report"

        when:
        String name = new ReportGenerator().format(config.reportNameFormat, config, owner, 0, start, end)

        then:
        name == 'Year 2018/2019 - Semester 1 Outputs Report'

        when:
        config.reportingPeriodInMonths = 3
        end = DateUtils.parse('2018-09-30T13:00:00Z')
        name = new ReportGenerator().format(config.reportNameFormat, config, owner, 0, start, end)

        then:
        name == 'Year 2018/2019 - Quarter 1 Outputs Report'

    }

    def "Reports should only be generated if the reporting period is calculated to be equal to or greater than the configured minimum period"() {

        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Single",
                firstReportingPeriodEnd: "2023-06-30T14:00:00Z",
                reportNameFormat: "Outcomes Report 2",
                reportDescriptionFormat: "Outcomes report 2 for %4\$s",
                multiple: false,
                minimumPeriodInMonths: 37,
                category: "Outcomes Report 2",
                reportsAlignedToCalendar: false,
                activityType:"RLP Medium term project outcomes")
        String periodStart = '2018-06-30T14:00:00Z'
        String periodEnd = '2019-06-30T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[managementUnitId:'mu1'], name:"MU 1", periodStart:periodStart, periodEnd:periodEnd)
        ReportGenerator reportGenerator = new ReportGenerator()

        when: "The report owner duration is less than the minimum period"
        List reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        !reports

        when:
        periodEnd = '2023-06-30T14:00:00Z'
        owner.periodEnd = periodEnd
        reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == 1
        reports[0].fromDate == periodStart
        reports[0].toDate == periodEnd
    }

    def "A list of non-periodic reports can be generated by specifying the end dates"() {
        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Activity",
                reportNameFormat: "Progress Report %1\$d",
                reportDescriptionFormat: "Progress Report %1\$d",
                multiple: true,
                endDates:['2020-04-14T14:00:00Z', '2020-07-14T14:00:00Z', '2021-01-14T13:00:00Z'],
                category: "Progress reporting",
                reportsAlignedToCalendar: false,
                activityType:"Progress Report")
        String periodStart = '2020-01-30T14:00:00Z'
        String periodEnd = '2021-06-30T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[projectId:'p1'], name:"Project 1", periodStart:periodStart, periodEnd:periodEnd)
        ReportGenerator reportGenerator = new ReportGenerator()

        when: "Reports are generated with a non-periodic configuration"
        List reports = reportGenerator.generateReports(config, owner, 1, null)

        then:
        reports.size() == 3

        reports[0].name == 'Progress Report 1'
        reports[0].fromDate == periodStart
        reports[0].toDate == config.endDates[0]

        reports[1].name == 'Progress Report 2'
        reports[1].fromDate == config.endDates[0]
        reports[1].toDate == config.endDates[1]

        reports[2].name == 'Progress Report 3'
        reports[2].fromDate == config.endDates[1]
        reports[2].toDate == config.endDates[2]

        when: "Reports are re-generated with an approved report"
        reports = reportGenerator.generateReports(config, owner, 2, DateUtils.parse(config.endDates[0]))

        then:
        reports.size() == 2

        reports[0].name == 'Progress Report 2'
        reports[0].fromDate == config.endDates[0]
        reports[0].toDate == config.endDates[1]

        reports[1].name == 'Progress Report 3'
        reports[1].fromDate == config.endDates[1]
        reports[1].toDate == config.endDates[2]

        when: "The project starts after the first report is due"
        owner.periodStart = '2020-04-29T14:00:00Z'
        reports = reportGenerator.generateReports(config, owner, 1, null)

        then: "The first report is not generated"
        reports.size() == 2

        reports[0].name == 'Progress Report 1'
        reports[0].fromDate == '2020-04-29T14:00:00Z'
        reports[0].toDate == config.endDates[1]

        reports[1].name == 'Progress Report 2'
        reports[1].fromDate == config.endDates[1]
        reports[1].toDate == config.endDates[2]

        when: "The project ends before the last report"
        owner.periodStart = '2020-01-30T14:00:00Z'
        owner.periodEnd = '2020-12-31T13:00:00Z'
        reports = reportGenerator.generateReports(config, owner, 1, null)

        then: "The last report is truncated to the project end date"
        reports.size() == 3

        reports[0].name == 'Progress Report 1'
        reports[0].fromDate == '2020-01-30T14:00:00Z'
        reports[0].toDate == config.endDates[0]

        reports[1].name == 'Progress Report 2'
        reports[1].fromDate == config.endDates[0]
        reports[1].toDate == config.endDates[1]

        reports[2].name == 'Progress Report 3'
        reports[2].fromDate == config.endDates[1]
        reports[2].toDate == '2020-12-31T13:00:00Z'

    }

    def "Generated reports include a tag or label to identify the configuration they were generated from"() {
        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Single",
                firstReportingPeriodEnd: "2023-06-30T14:00:00Z",
                reportNameFormat: "Outcomes Report 2",
                reportDescriptionFormat: "Outcomes report 2 for %4\$s",
                multiple: false,
                minimumPeriodInMonths: 37,
                category: "Outcomes Report 2",
                reportsAlignedToCalendar: false,
                activityType:"RLP Medium term project outcomes",
                label:"Test label")
        String periodStart = '2018-06-30T14:00:00Z'
        String periodEnd = '2023-06-30T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[managementUnitId:'mu1'], name:"MU 1", periodStart:periodStart, periodEnd:periodEnd)
        ReportGenerator reportGenerator = new ReportGenerator()

        when:
        List reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == 1
        reports[0].generatedBy == config.label

        when:
        config.label = null
        reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == 1
        reports[0].generatedBy == config.category
    }

    def "When the onlyGenerateReportsForDateBefore configuration is used, reports starting before this date will still have reports generated"() {
        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Single",
                firstReportingPeriodEnd: "2023-06-30T14:00:00Z",
                reportNameFormat: "Outcomes Report 2",
                reportDescriptionFormat: "Outcomes report 2 for %4\$s",
                multiple: false,
                "reportingPeriodInMonths": 60,
                onlyGenerateReportsForDatesBefore: "2019-06-30T14:00:00Z",
                "minimumPeriodInMonths": 36,
                category: "Outcomes Report 2",
                reportsAlignedToCalendar: false,
                activityType:"RLP Medium term project outcomes",
                label:"Test label")
        String periodStart = '2018-06-30T14:00:00Z'
        String periodEnd = '2023-06-30T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[managementUnitId:'mu1'], name:"MU 1", periodStart:periodStart, periodEnd:periodEnd)
        ReportGenerator reportGenerator = new ReportGenerator()

        when:
        List reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == 1
        reports[0].generatedBy == config.label

        when:
        config.label = null
        reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == 1
        reports[0].generatedBy == config.category
    }

    def "Report will not generate if project start date after the onlyGenerateReportsForDatesBefore"() {
        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Single",
                firstReportingPeriodEnd: "2023-06-30T14:00:00Z",
                reportNameFormat: "Outcomes Report 2",
                reportDescriptionFormat: "Outcomes report 2 for %4\$s",
                multiple: false,
                "reportingPeriodInMonths": 60,
                onlyGenerateReportsForDatesBefore: "2019-06-30T14:00:00Z",
                "minimumPeriodInMonths": 36,
                category: "Outcomes Report 2",
                reportsAlignedToCalendar: false,
                activityType:"RLP Medium term project outcomes",
                label:"Test label")
        String periodStart = '2019-07-1T14:00:00Z'
        String periodEnd = '2023-06-30T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[managementUnitId:'mu1'], name:"MU 1", periodStart:periodStart, periodEnd:periodEnd)
        ReportGenerator reportGenerator = new ReportGenerator()

        when:
        List reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports == null

        when:
        reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports == null
    }

    def "We can generate a final report"(String projectEndDate, String expectedFromDate) {
        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Single",
                reportNameFormat: "Final Report",
                reportDescriptionFormat: "Final Report",
                multiple: false,
                alignToOwnerEnd: true,
                alignToOwnerStart: false,
                reportingPeriodInMonths: 3,
                category: "Final Report",
                reportsAlignedToCalendar: true,
                activityType:"Final Report")
        String periodStart = '2020-06-30T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[projectid:'p1'], name:"Project 1", periodStart:periodStart, periodEnd:projectEndDate)
        ReportGenerator reportGenerator = new ReportGenerator()

        when:
        List  reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == 1
        reports[0].toDate == projectEndDate
        reports[0].fromDate == expectedFromDate

        where:
        projectEndDate | expectedFromDate
        '2021-06-30T14:00:00Z' | '2021-03-31T13:00:00Z'
        '2021-08-31T14:00:00Z' | '2021-03-31T13:00:00Z'
        '2021-09-28T14:00:00Z' | '2021-03-31T13:00:00Z'
        '2021-09-30T14:00:00Z' | '2021-06-30T14:00:00Z'
        '2021-06-29T14:00:00Z' | '2021-03-31T13:00:00Z'

    }

    def "We can skip the generation of the final report"(String projectStartDate, String projectEndDate, String lastReportToDate, int expectedReportCount) {
        setup:
        ReportConfig config = new ReportConfig(
                reportType: "Progress",
                reportNameFormat: "Progress Report",
                reportDescriptionFormat: "Progress Report",
                multiple: true,
                skipFinalPeriod: true,
                reportingPeriodInMonths: 3,
                category: "Progress Report",
                reportsAlignedToCalendar: true,
                activityType:"Progress Report")
        ReportOwner owner = new ReportOwner(id:[projectId:'p1'], name:"Project 1", periodStart:projectStartDate, periodEnd:projectEndDate)
        ReportGenerator reportGenerator = new ReportGenerator()

        when:
        List  reports = reportGenerator.generateReports(config, owner, 0, null)

        then:
        reports.size() == expectedReportCount
        reports[reports.size()-1].toDate == lastReportToDate

        where:
        projectStartDate       | projectEndDate         | lastReportToDate       | expectedReportCount
        '2020-06-30T14:00:00Z' | '2021-06-30T14:00:00Z' | '2021-03-31T13:00:00Z' | 3
        '2020-06-30T14:00:00Z' |'2021-08-31T14:00:00Z' | '2021-03-31T13:00:00Z' | 3
        '2020-06-30T14:00:00Z' |'2021-09-28T14:00:00Z' | '2021-03-31T13:00:00Z' | 3
        '2020-06-30T14:00:00Z' |'2021-09-30T14:00:00Z' | '2021-06-30T14:00:00Z' | 4
        '2020-06-30T14:00:00Z' |'2021-06-29T14:00:00Z' | '2021-03-31T13:00:00Z' | 3 // When loading projects the end date gets set to midnight of the last day of the month so we need to handle this correctly.
        '2020-06-30T14:00:00Z' |'2022-02-24T13:00:00Z' | '2021-09-30T14:00:00Z' | 5
        '2020-02-10T13:00:00Z' | '2021-06-30T14:00:00Z' | '2021-03-31T13:00:00Z' | 5
        '2020-02-10T13:00:00Z' |'2021-08-31T14:00:00Z' | '2021-03-31T13:00:00Z' | 5
        '2020-02-10T13:00:00Z' |'2021-09-28T14:00:00Z' | '2021-03-31T13:00:00Z' | 5
        '2020-02-10T13:00:00Z' |'2021-09-30T14:00:00Z' | '2021-06-30T14:00:00Z' | 6
        '2020-02-10T13:00:00Z' |'2021-06-29T14:00:00Z' | '2021-03-31T13:00:00Z' | 5 // When loading projects the end date gets set to midnight of the last day of the month so we need to handle this correctly.
        '2020-02-10T13:00:00Z' |'2022-02-24T13:00:00Z' | '2021-09-30T14:00:00Z' | 7
    }

    def "Will not generate a single report when there's an existing report with status pending approval/submitted"() {
        setup:
        def existingReport = new ArrayList()
        ReportConfig config = new ReportConfig(
                reportType: "Single",
                firstReportingPeriodEnd: "2023-06-30T14:00:00Z",
                reportNameFormat: "Outcomes Report 1",
                reportDescriptionFormat: "Outcomes report 1 for %4\$s",
                multiple: false,
                "description": "Before beginning Outcomes Report 1, please go to the Data set summary tab and complete a form for each data set collected for this project. Help with completing this form can be found in Section 10 of the [RLP MERIT User Guide](http://www.nrm.gov.au/my-project/monitoring-and-reporting-plan/merit)",
                "reportingPeriodInMonths": 36,
                category: "Outcomes Report 1",
                reportsAlignedToCalendar: false,
                activityType:"RLP Short term project outcomes")
        String periodStart = '2020-01-16T13:00:00Z'
        String periodEnd = '2022-06-29T14:00:00Z'
        ReportOwner owner = new ReportOwner(id:[managementUnitId:'mu1'], name:"MU 1", periodStart:periodStart, periodEnd:periodEnd)
        existingReport << [publicationStatus:'pendingApproval']

        ReportGenerator reportGenerator = new ReportGenerator()

        when:
        List reports = reportGenerator.generateReports(config, owner, 0, null, existingReport)

        then:
        reports == []
    }

    def "The minimumReportDurationInDays parameter can be used to merge reports to prevent very short reports"() {
        setup:
        ReportGenerator generator = new ReportGenerator()
        ReportConfig config = new ReportConfig(
                minimumReportDurationInDays: 1,
                reportingPeriodInMonths: 3,
                reportsAlignedToCalendar: true,
                activityType: 'RLP Outputs Report',
                category: 'Outputs Reporting',
                canSubmitDuringReportingPeriod: true,
                reportNameFormat: "%5\$s - Outputs Report %7\$02d",
                reportDescriptionFormat: "%5\$s - Outputs Report %7\$02d")

        projectOwner = new ReportOwner(id:[projectId:'p1'], name:'Project 1', periodStart: '2021-06-30T14:00:00Z', periodEnd: '2023-06-29T14:00:00Z')

        when:
        List reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        reports.size() == 2 * 4

        and:
        reports[0].name == '2021/2022 - Outputs Report 01'
        reports[0].fromDate == '2021-06-30T14:00:00Z'
        reports[0].toDate == '2021-09-30T14:00:00Z'


        reports[1].name == '2021/2022 - Outputs Report 02'
        reports[2].name == '2021/2022 - Outputs Report 03'
        reports[3].name == '2021/2022 - Outputs Report 04'
        reports[4].name == '2022/2023 - Outputs Report 01'

        reports[5].name == '2022/2023 - Outputs Report 02'
        reports[6].name == '2022/2023 - Outputs Report 03'

        reports[7].name == '2022/2023 - Outputs Report 04'
        reports[7].fromDate == '2023-03-31T13:00:00Z'
        reports[7].toDate == '2023-06-29T14:00:00Z'

        when:
        projectOwner.periodStart = '2021-06-29T14:00:00Z'
        projectOwner.periodEnd = '2023-06-30T14:00:00Z'
        reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        reports.size() == 2 * 4 + 2 // A two year project with 4 reports per year + a single day report at the start and end

        and:
        reports[0].name == '2020/2021 - Outputs Report 04'
        reports[0].fromDate == '2021-06-29T14:00:00Z'
        reports[0].toDate == '2021-06-30T14:00:00Z'


        reports[1].name == '2021/2022 - Outputs Report 01'
        reports[2].name == '2021/2022 - Outputs Report 02'
        reports[3].name == '2021/2022 - Outputs Report 03'
        reports[4].name == '2021/2022 - Outputs Report 04'

        reports[5].name == '2022/2023 - Outputs Report 01'
        reports[6].name == '2022/2023 - Outputs Report 02'
        reports[7].name == '2022/2023 - Outputs Report 03'
        reports[8].name == '2022/2023 - Outputs Report 04'
        reports[8].fromDate == '2023-03-31T13:00:00Z'
        reports[8].toDate == '2023-06-30T14:00:00Z'

        reports[9].name == '2023/2024 - Outputs Report 01'
        reports[9].fromDate == '2023-06-30T14:00:00Z'
        reports[9].toDate == '2023-06-30T14:00:00Z'

        when:
        config.minimumReportDurationInDays = 2
        reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        reports.size() == 2 * 4

        //and:
        reports[0].fromDate == '2021-06-29T14:00:00Z'
        reports[0].toDate == '2021-09-30T14:00:00Z'
        reports[0].name == '2021/2022 - Outputs Report 01'
        reports[1].name == '2021/2022 - Outputs Report 02'
        reports[2].name == '2021/2022 - Outputs Report 03'
        reports[3].name == '2021/2022 - Outputs Report 04'

        reports[4].name == '2022/2023 - Outputs Report 01'
        reports[5].name == '2022/2023 - Outputs Report 02'
        reports[6].name == '2022/2023 - Outputs Report 03'
        reports[7].name == '2022/2023 - Outputs Report 04'
        reports[7].fromDate == '2023-03-31T13:00:00Z'
        reports[7].toDate == '2023-06-30T14:00:00Z'
    }

    def "Reports can be selectively generated based on the duration of the project/owner"(Integer maximumOwnerDurationInMonths, Integer minimumOwnerDurationInMonths, String periodStart, String periodEnd, Integer expectedReportCount) {
        setup:
        ReportGenerator generator = new ReportGenerator()
        ReportConfig config = new ReportConfig(
                minimumReportDurationInDays: 1,
                reportingPeriodInMonths: 24,
                reportsAlignedToCalendar: true,
                activityType: 'Outcomes Report 1',
                category: 'Outcomes Reporting',
                canSubmitDuringReportingPeriod: true,
                reportNameFormat: "Outcomes Report 1",
                multiple: false,
                reportDescriptionFormat: "Outcomes Report 1",
                maximumOwnerDurationInMonths: maximumOwnerDurationInMonths,
                minimumOwnerDurationInMonths: minimumOwnerDurationInMonths
        )

        projectOwner = new ReportOwner(id:[projectId:'p1'], name:'Project 1', periodStart: periodStart, periodEnd: periodEnd)

        when:
        List reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        (reports ?: []).size() == expectedReportCount

        where:
        maximumOwnerDurationInMonths | minimumOwnerDurationInMonths | periodStart | periodEnd | expectedReportCount
        24                           | 12                          | '2021-06-30T14:00:00Z' | '2023-06-29T14:00:00Z' | 1
        24                           | 12                          | '2021-06-30T14:00:00Z' | '2023-07-31T14:00:00Z' | 0
        24                           | 12                          | '2021-06-30T14:00:00Z' | '2022-06-30T14:00:00Z' | 1
        24                           | 12                          | '2021-06-30T14:00:00Z' | '2022-06-29T14:00:00Z' | 0
        24                           | null                        | '2021-06-30T14:00:00Z' | '2023-06-29T14:00:00Z' | 1
        24                           | null                        | '2021-06-30T14:00:00Z' | '2023-07-31T14:00:00Z' | 0
        null                         | 12                          | '2021-06-30T14:00:00Z' | '2022-06-30T14:00:00Z' | 1
        null                         | 12                          | '2021-06-30T14:00:00Z' | '2022-06-29T14:00:00Z' | 0

    }

    def "We produce an outcomes 1 report covering between 2-3 years ending on June 30"(String periodStart, String expectedReportEndDate) {
        setup:
        ReportGenerator generator = new ReportGenerator()
        ReportConfig config = new ReportConfig(
                minimumReportDurationInDays: 1,
                reportingPeriodInMonths: 36,
                reportsAlignedToCalendar: true,
                activityType: 'Outcomes Report 1',
                category: 'Outcomes Reporting',
                canSubmitDuringReportingPeriod: true,
                reportNameFormat: "Outcomes Report 1",
                multiple: false,
                reportDescriptionFormat: "Outcomes Report 1",
                maximumOwnerDurationInMonths: null,
                minimumOwnerDurationInMonths: 25,
                calendarAlignmentMonth: 7
        )

        projectOwner = new ReportOwner(id:[projectId:'p1'], name:'Project 1', periodStart: periodStart, periodEnd: '2028-06-29T14:00:00Z')

        when:
        List reports = generator.generateReports(config, projectOwner, 0, null)

        then:
        reports.size() == 1
        reports[0].fromDate == periodStart
        reports[0].toDate == expectedReportEndDate

        where:
        periodStart | expectedReportEndDate
//
        '2024-03-01T14:00:00Z' | '2026-06-30T14:00:00Z'
        '2024-06-29T14:00:00Z' | '2026-06-30T14:00:00Z'

    }
}
