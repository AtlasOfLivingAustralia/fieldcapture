package au.org.ala.merit.command

import au.org.ala.merit.ActivityService
import au.org.ala.merit.ReportService
import au.org.ala.merit.SiteService
import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin
import org.apache.http.HttpStatus
import org.grails.databinding.DataBinder
import org.grails.databinding.SimpleDataBinder
import org.grails.databinding.SimpleMapDataBindingSource
import spock.lang.Specification

@TestMixin(GrailsUnitTestMixin)
class SaveReportDataCommandSpec extends Specification {


    SaveReportDataCommand command
    ReportService reportService = Mock(ReportService)
    SiteService siteService = Mock(SiteService)
    ActivityService activityService = Mock(ActivityService)
    DataBinder dataBinder = new SimpleDataBinder()

    def setup() {
        command = new SaveReportDataCommand(reportService:reportService, siteService: siteService, activityService: activityService)
    }

    def "the reportId and activityId fields are mandatory"() {

        setup:
        Map jsonData = [
                activity:[]
        ]

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()

        then:
        command.hasErrors() == true
        command.errors.getFieldError("reportId") != null
        command.errors.getFieldError("activityId") != null


    }


    def "the savedData and report fields should not be bound from the request data"() {

        setup:
        Map jsonData = [
                activityId:'a1',
                reportId:'r1',
                savedData:[activityId:'a2'],
                report:[reportId:'r2']
        ]
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED]
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()

        then: "the savedActivity field has been supplied by the activityService, not the request data"
        command.savedActivity == savedActivity

        and: "the report field has been supplied by the reportService, not the request data"
        command.report == r1Report
    }

    def "a supplied siteId must match the siteId in the saved activity"() {
        setup:
        Map jsonData = [
                activityId:'a1',
                reportId:'r1',
                site:[siteId:'s2']
        ]
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED, siteId:'s1']
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()

        then:
        command.hasErrors() == true
        command.errors.getFieldError("site") != null
    }

    def "the supplied activityId must be the activity used by the report"() {
        setup:
        Map jsonData = [
                activityId:'a2',
                reportId:'r1'
        ]
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:'a1']
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED, siteId:'s1']
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()

        then:
        command.hasErrors() == true
        command.errors.getFieldError("activity") != null
    }

    def "the command should delegate to the activity service to save the activity data"() {
        setup:
        Map jsonData = [
                activityId:'a1',
                activity:[
                        outputs:[[name:'output1', data:[:]]]
                ],
                reportId:'r1'
        ]
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED]
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()
        command.save()

        then:
        command.hasErrors() == false
        1 * activityService.update(jsonData.activityId, jsonData.activity)
    }

    def "the command should save site data when it is supplied"() {
        setup:
        Map jsonData = [
                activityId:'a1',
                activity:[
                        outputs:[[name:'output1', data:[:]]]
                ],
                reportId:'r1',
                site:[
                        siteId:'s1',
                        features:[
                                [
                                        type:'feature',
                                        geometry:[
                                                type:'point',
                                                coordinates:[1, 2]
                                        ]
                                ]
                        ]
                ]
        ]
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED, siteId:jsonData.site.siteId]
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()
        command.save()

        then:
        command.hasErrors() == false
        1 * siteService.update(jsonData.site.siteId, jsonData.site)
        1 * activityService.update(jsonData.activityId, jsonData.activity)
    }

    def "the command should assign a siteId when it exists but is not supplied"() {
        setup:
        Map jsonData = [
                activityId:'a1',
                activity:[
                        outputs:[[name:'output1', data:[:]]]
                ],
                reportId:'r1',
                site:[
                        features:[
                                [
                                        type:'feature',
                                        geometry:[
                                                type:'point',
                                                coordinates: [1,2]
                                        ]
                                ]
                        ]
                ]
        ]
        String siteId = 's1'
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED, siteId:siteId]
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()
        command.save()

        then:
        command.hasErrors() == false
        1 * siteService.update(siteId, jsonData.site)
        1 * activityService.update(jsonData.activityId, jsonData.activity)
    }

    def "the command should assign the siteId to the activity when creating a new site"() {
        setup:
        Map jsonData = [
                activityId:'a1',
                activity:[
                        outputs:[[name:'output1', data:[:]]]
                ],
                reportId:'r1',
                site:[
                        features:[
                                [
                                        type:'feature',
                                        geometry:[
                                                type:'point',
                                                coordinates: [1,2]
                                        ]
                                ]
                        ]
                ]
        ]

        String siteId = 's1'
        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED]
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()
        command.save()

        then:
        command.hasErrors() == false
        1 * siteService.update('', jsonData.site) >> [resp:[siteId:siteId]]

        jsonData.activity.siteId == siteId
        jsonData.activity.activityId == jsonData.activityId

        1 * activityService.update(jsonData.activityId, jsonData.activity)
    }

    def "If an existing report site contains no features it should be deleted"() {
        setup:
        String siteId = 's1'
        Map expectedActivityData = [activityId:'a1', siteId:null, outputs:[[name:'output1', data:[:]]]]
        Map jsonData = [
                activityId:'a1',
                activity:[
                        siteId:siteId,
                        outputs:[[name:'output1', data:[:]]]
                ],
                reportId:'r1',
                site:[
                        siteId:siteId,
                        features:[]
                ]
        ]

        Map r1Report = [reportId:jsonData.reportId, publicationStatus:ReportService.REPORT_NOT_APPROVED, activityId:jsonData.activityId]
        Map savedActivity = [activityId:jsonData.activityId, publicationStatus: ReportService.REPORT_NOT_APPROVED, progress:ActivityService.PROGRESS_PLANNED, siteId:siteId]
        reportService.get(jsonData.reportId) >> r1Report
        activityService.get(jsonData.activityId) >> savedActivity

        when:
        dataBinder.bind(command, new SimpleMapDataBindingSource(jsonData))
        command.validate()
        command.save()

        then:
        command.hasErrors() == false
        and: "The activity is updated to remove the site id"
        1 * activityService.update(jsonData.activityId, expectedActivityData)
        and: "The site is deleted"
        1 * siteService.delete(siteId) >> HttpStatus.SC_OK


    }


}
