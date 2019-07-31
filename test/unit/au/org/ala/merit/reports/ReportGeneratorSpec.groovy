package au.org.ala.merit.reports

import au.org.ala.merit.DateUtils
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
        name == '6M'
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



}
