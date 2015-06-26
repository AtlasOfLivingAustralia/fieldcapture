package au.org.ala.merit

import au.org.ala.fieldcapture.ActivityService
import au.org.ala.fieldcapture.SearchService
import grails.test.mixin.TestFor
import org.joda.time.DateTime
import org.joda.time.DateTimeUtils
import spock.lang.Specification

/**
 * Specification for the ReportController.
 */
@TestFor(ReportController)
class ReportControllerSpec extends Specification {

    def activityServiceStub = Stub(ActivityService)
    def projectServiceStub = Stub(ProjectService)
    def searchServiceStub = Stub(SearchService)

    def setup() {
        controller.activityService = activityServiceStub
        controller.projectService = projectServiceStub
        controller.searchService = searchServiceStub
    }

    def cleanup() {
        DateTimeUtils.setCurrentMillisSystem()
    }
    def "the list of available financial years to report on should start with 2014/2015 and end with the current financial year"() {

        setup:
        searchServiceStub.report(_) >> [:]
        searchServiceStub.allProjects(_, _) >> [:]
        activityServiceStub.search(_) >> [:]

        when:
        def now = new DateTime(2014, 06, 30, 23, 59)
        DateTimeUtils.setCurrentMillisFixed(now.millis)
        controller.greenArmyReport()

        then: "There is no Green Army data before the 2014/2015 financial year"
        controller.modelAndView.model.availableYears == []

        when:
        now = new DateTime(2014, 07, 01, 23, 59)
        DateTimeUtils.setCurrentMillisFixed(now.millis)
        controller.greenArmyReport()

        then: "There is a single years data available"
        controller.modelAndView.model.availableYears == [[label:'2014/2015', value:2014]]


        when:
        now = new DateTime(2016, 07, 01, 0, 0)
        DateTimeUtils.setCurrentMillisFixed(now.millis)
        controller.greenArmyReport()

        then: "There are 3 years data available"
        controller.modelAndView.model.availableYears == [[label:'2014/2015', value:2014], [label:'2015/2016',value:2015],  [label:'2016/2017', value:2016]]
    }

    def "the financial year for the report should have a sensible default"() {

        setup:
        searchServiceStub.report(_) >> [:]
        searchServiceStub.allProjects(_, _) >> [:]
        activityServiceStub.search(_) >> [:]

        when:
        def now = new DateTime(2015, 6, 30, 23, 59)
        DateTimeUtils.setCurrentMillisFixed(now.millis)
        controller.greenArmyReport()

        then:
        controller.modelAndView.model.financialYear == 2014

        when: "it is less than a month into the new financial year"
        now = new DateTime(2015, 7, 31, 23, 59)
        DateTimeUtils.setCurrentMillisFixed(now.millis)
        controller.greenArmyReport()

        then: "the previous financial year should be used.  (There is no data for the new financial year at that point)"
        controller.modelAndView.model.financialYear == 2014

        when: "it is more than a month into the new financial year"
        now = new DateTime(2015, 8, 1, 0, 1)
        DateTimeUtils.setCurrentMillisFixed(now.millis)
        controller.greenArmyReport()

        then: "the new financial year should be used."
        controller.modelAndView.model.financialYear == 2015
    }

    def "the financial year for the report can be supplied via a parameter"() {

        setup:
        searchServiceStub.report(_) >> [:]
        searchServiceStub.allProjects(_, _) >> [:]
        activityServiceStub.search(_) >> [:]

        when:
        params.financialYear = '2015'
        controller.greenArmyReport()

        then:
        controller.modelAndView.model.financialYear == 2015

    }
}
