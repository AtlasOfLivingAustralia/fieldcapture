package au.org.ala.merit

import au.org.ala.fieldcapture.MetadataService
import au.org.ala.fieldcapture.WebService
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

    def project(plannedStartDate = '2015-01-01T00:00:00Z', plannedEndDate = '2016-12-31T23:59:59Z') {
        [plannedStartDate:plannedStartDate, plannedEndDate:plannedEndDate, name:'project', projectId:'p1']
    }

    def reports() {
        [[reportId:'1', fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'],
         [reportId:'2', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'],
         [reportId:'3', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'],
         [reportId:'4', fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T13:00:00Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1']]

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
        1 * webService.doPost(_, [fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T13:00:00Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1'])
        0 * webService._
    }

    void "reports can be regenerated correctly when a project start date is moved back"() {
        setup:
        def project = project('2014-07-01T00:00:00Z')
        project.reports = reports()
        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [reportId:'1', fromDate: '2014-06-30T14:00:00Z', toDate: '2014-12-31T13:00:00Z', dueDate: '2015-02-12T13:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2014-12-31T13:00:00Z', toDate: '2015-06-30T14:00:00Z', dueDate: '2015-08-12T14:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'4', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T13:00:00Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1'])
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
        1 * webService.doPost(_, [reportId:'1', fromDate: '2015-06-30T14:00:00Z', toDate: '2015-12-31T13:00:00Z', dueDate: '2016-02-12T13:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2015-12-31T13:00:00Z', toDate: '2016-06-30T14:00:00Z', dueDate: '2016-08-12T14:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2016-06-30T14:00:00Z', toDate: '2016-12-31T13:00:00Z', dueDate: '2017-02-12T13:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doDelete({ it.endsWith('/report/4')})
        0 * webService._

    }

    void "reports can be added correctly when a project end date is moved forward"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-07-01T00:00:00Z')
        project.reports = reports()

        projectService.get(_, _) >> project

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true, 43)

        then: "a new report should be added at the end of the project"

        1 * webService.doPost(_, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-06-30T14:00:00Z', dueDate: '2017-08-12T14:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1'])
        0 * webService._

    }

    void "reports can be removed correctly when a project end date is moved backwards"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2016-06-30T14:00:00Z')
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
        1 * webService.doPost({it.endsWith('/report/')}, [fromDate: '2016-12-31T13:00:00Z', toDate: '2017-06-30T14:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1', dueDate: '2017-08-12T14:00:00Z'])

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
}
