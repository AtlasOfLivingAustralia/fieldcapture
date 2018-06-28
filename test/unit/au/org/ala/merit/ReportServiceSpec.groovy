package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(ReportService)
class ReportServiceSpec extends Specification {

    def webService = Mock(WebService)
    def projectService = Stub(ProjectService)
    def metadataService = Stub(MetadataService)

    def setup() {

        service.webService = webService
        service.projectService = projectService
        service.metadataService = metadataService
    }

    def project(plannedStartDate = '2014-12-31T13:00:00Z', plannedEndDate = '2016-12-31T23:59:59Z') {
        [plannedStartDate:plannedStartDate, plannedEndDate:plannedEndDate, name:'project', projectId:'p1']
    }

    def reports() {
        [[reportId:'1', fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', submissionDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'],
         [reportId:'2', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'],
         [reportId:'3', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'],
         [reportId:'4', fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T13:00:00Z', submissionDate: '2016-12-31T13:00:00Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1', category:'Stage reports']]

    }

    def cleanup() {
    }

    void "reports can be generated correctly for a new project"() {

        setup:
        def project = project()
        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', submissionDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T23:59:59Z', submissionDate: '2016-12-31T23:59:59Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1', category:'Stage reports'])
        0 * webService._
    }

    void "reports can be regenerated correctly when a project start date is moved back"() {
        setup:
        def project = project('2014-06-30T14:00:00Z')
        project.reports = reports()
        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [reportId:'1', fromDate: '2014-06-30T14:00:00Z', toDate: '2014-12-31T13:00:00Z', submissionDate: '2014-12-31T13:00:00Z', dueDate: '2015-02-12T13:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', submissionDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'4', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T23:59:59Z', submissionDate: '2016-12-31T23:59:59Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', category:'Stage reports'])
        0 * webService._
    }

    void "reports can be regenerated correctly when a project start date is moved forward"() {
        setup:
        def project = project('2015-08-01T00:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        1 * webService.doPost(_, [reportId:'1', fromDate: '2015-08-01T00:00:00Z', toDate: '2015-12-31T13:00:00Z', submissionDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', submissionDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T23:59:59Z', submissionDate: '2016-12-31T23:59:59Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._

    }

    void "reports can be added correctly when a project end date is moved forward"() {
        setup:
        def project = project('2014-12-31T13:00:00Z', '2017-07-01T00:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report should be added at the end of the project"

        1 * webService.doPost(_, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-07-01T00:00:00Z', submissionDate: '2017-07-01T00:00:00Z', dueDate: '2017-08-12T14:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', category:'Stage reports'])
        0 * webService._

    }

    void "reports can be removed correctly when a project end date is moved backwards"() {
        setup:
        def project = project('2014-12-31T13:00:00Z', '2016-06-30T14:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "the last report should be deleted"
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._
    }

    void "reports can be changed correctly if there is one approved report"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-07-01T00:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report should be added to the end"
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-07-01T00:00:00Z', submissionDate:'2017-07-01T00:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', dueDate: '2017-08-12T14:00:00Z', category:'Stage reports'])

        0 * webService._
    }

    void "no reports should be changed if all reports are approved"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-01-01T00:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[1].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[2].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[3].publicationStatus = ReportService.REPORT_APPROVED

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "no reports should not be changed"
        0 * webService._

    }

    void "Can add a report to the end of a project with all approved reports when an extension to the end date is granted"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-01-07T00:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[1].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[2].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[3].publicationStatus = ReportService.REPORT_APPROVED

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report is added to the end of the schedule"
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-01-07T00:00:00Z', submissionDate: '2017-01-07T00:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", dueDate:'2017-08-12T14:00:00Z', projectId: 'p1', category:'Stage reports'])

        and: "no other reports should not be changed"
        0 * webService._

    }

    void "no approved or submitted reports can be deleted regardless of the new end date"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2015-12-31T13:00:00Z')
        project.reports = reports()
        project.reports[0].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[1].publicationStatus = ReportService.REPORT_APPROVED
        project.reports[2].publicationStatus = ReportService.REPORT_SUBMITTED

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "only the non-approved or submitted report should be removed."
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._
    }


    void "no stage overlap should occur when an existing approved report exists with misaligned times"() {

        // Reproducing a bug where existing reports (one approved) aligned to 00:00 UTC were regenerated due to a project
        // extension resulted in a slight overlap due to the new report times being aligned to midnight Australian east coast time
        // (i.e. stage 1 remained ending at 2016-07-01T00:00:00Z and stage 2 was regenerated to start at 2016-06-30T14:00:00Z)
        setup:
        def project = project('2016-04-15T00:00:00Z', '2017-06-29T14:00:00Z') // End date extended by 6 months
        project.reports = [
                [reportId:'1', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', submissionDate: '2016-07-01T00:00:00Z', dueDate: '', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1', category:'Stage reports', publicationStatus:ReportService.REPORT_APPROVED],
                [reportId:'2', fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', submissionDate: '2017-01-01T00:00:00Z', dueDate: '', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1', category:'Stage reports']]
        projectService.get(_, _) >> project

        when: "reports are regenerated"
        service.regenerateAllStageReportsForProject('p1', 6, true)

        then: "report 2 is realigned with a from date matching report 1 end date and an end date aligned to australian time"
        1 * webService.doPost({it.endsWith('/report/2')}, [fromDate: '2016-07-01T00:00:00Z', toDate: '2016-12-31T13:00:00Z', submissionDate: '2016-12-31T13:00:00Z', type: 'Activity', name: 'Stage 2', description: 'Stage 2 for project', projectId: 'p1', reportId:'2', category:'Stage reports'])

        and: "a new report is added to cover the project end date extension"
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-06-29T14:00:00Z', submissionDate: '2017-06-29T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1', category:'Stage reports'])

        and: "the first report is not modified because it is approved"
        0 * webService._

    }
}
