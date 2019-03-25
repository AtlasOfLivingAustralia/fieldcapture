package au.org.ala.merit.reports


import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import spock.lang.Specification

@TestMixin(GrailsUnitTestMixin)
class Reef2050PlanActionReportConfigSpec extends Specification{

    def "The config needs a periodEnd and type to be valid"() {
        when:
        Reef2050PlanActionReportConfig config = new Reef2050PlanActionReportConfig()

        then:
        config.validate() == false

        when:
        config = new Reef2050PlanActionReportConfig(periodEnd: "2018-01-01T00:00:00Z")

        then:
        config.validate() == false

        when:
        config = new Reef2050PlanActionReportConfig(type:Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE)

        then:
        config.validate() == false


        when:
        config = new Reef2050PlanActionReportConfig(periodEnd: "2018-01-01T00:00:00Z", type:Reef2050PlanActionReportConfig.REEF_2050_PLAN_ACTION_REPORTING_ACTIVITY_TYPE)

        then:
        config.validate() == true

    }

    def "The config formats labels based on the period selected"() {
        when:
        Reef2050PlanActionReportConfig config = new Reef2050PlanActionReportConfig(periodEnd: "2017-12-31T13:00:00Z")

        then:
        config.label == '01 July 2017 - 31 December 2017'

        when:
        config.periodEnd = "2017-06-30T14:00:00Z"

        then:
        config.label == '01 January 2017 - 30 June 2017'

    }

    def "The period start date is calculated from the period end date and the reporting period"() {
        when:
        Reef2050PlanActionReportConfig config = new Reef2050PlanActionReportConfig(periodEnd: "2017-12-31T13:00:00Z")

        then:
        config.periodStart() == "2017-06-30T14:00:00Z"

        when:
        config.periodEnd = "2017-06-30T14:00:00Z"

        then:
        config.periodStart() == "2016-12-31T13:00:00Z"

    }

}
