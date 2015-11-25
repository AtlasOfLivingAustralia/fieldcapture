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

        metadataService.getProgramConfiguration(_,_) >> [weekDaysToCompleteReport:43]
    }

    def project(plannedStartDate = '2015-01-01T00:00:00Z', plannedEndDate = '2016-12-31T23:59:59Z') {
        [plannedStartDate:plannedStartDate, plannedEndDate:plannedEndDate, name:'project', projectId:'p1']
    }

    def reports() {
        [[reportId:'1', fromDate: '2015-01-01T00:00:00Z', toDate: '2015-07-01T00:00:00Z', dueDate: '2015-08-13T00:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'],
         [reportId:'2', fromDate: '2015-07-01T00:00:00Z', toDate: '2016-01-01T00:00:00Z', dueDate: '2016-02-13T00:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'],
         [reportId:'3', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', dueDate: '2016-08-13T00:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'],
         [reportId:'4', fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', dueDate: '2017-02-13T00:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1']]

    }

    def cleanup() {
    }

    void "reports can be generated correctly for a new project"() {

        setup:
        def project = project()
        projectService.get(_, _) >> project
        webService.getJson(_) >> []

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [fromDate: '2015-01-01T00:00:00Z', toDate: '2015-07-01T00:00:00Z', dueDate: '2015-08-13T00:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2015-07-01T00:00:00Z', toDate: '2016-01-01T00:00:00Z', dueDate: '2016-02-13T00:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', dueDate: '2016-08-13T00:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', dueDate: '2017-02-13T00:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1'])
    }

    void "reports can be regenerated correctly when a project start date is moved back"() {
        setup:
        def project = project('2014-07-01T00:00:00Z')
        projectService.get(_, _) >> project
        webService.getJson(_) >> reports()

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [reportId:'1', fromDate: '2014-07-01T00:00:00Z', toDate: '2015-01-01T00:00:00Z', dueDate: '2015-02-13T00:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2015-01-01T00:00:00Z', toDate: '2015-07-01T00:00:00Z', dueDate: '2015-08-13T00:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2015-07-01T00:00:00Z', toDate: '2016-01-01T00:00:00Z', dueDate: '2016-02-13T00:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'4', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', dueDate: '2016-08-13T00:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', dueDate: '2017-02-13T00:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1'])


    }

    void "reports can be regenerated correctly when a project start date is moved forward"() {
        setup:
        def project = project('2015-08-01T00:00:00Z')
        projectService.get(_, _) >> project
        webService.getJson(_) >> reports()

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true)

        then:
        1 * webService.doPost(_, [reportId:'1', fromDate: '2015-07-01T00:00:00Z', toDate: '2016-01-01T00:00:00Z', dueDate: '2016-02-13T00:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', dueDate: '2016-08-13T00:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', dueDate: '2017-02-13T00:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doDelete({ it.endsWith('/report/4')})

    }

    void "reports can be added correctly when a project end date is moved forward"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2017-07-01T00:00:00Z')
        projectService.get(_, _) >> project
        webService.getJson(_) >> reports()

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true)

        then:
        0 * webService.doDelete(*_)
        1 * webService.doPost(_, [reportId:'1', fromDate: '2015-01-01T00:00:00Z', toDate: '2015-07-01T00:00:00Z', dueDate: '2015-08-13T00:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2015-07-01T00:00:00Z', toDate: '2016-01-01T00:00:00Z', dueDate: '2016-02-13T00:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', dueDate: '2016-08-13T00:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'4', fromDate: '2016-07-01T00:00:00Z', toDate: '2017-01-01T00:00:00Z', dueDate: '2017-02-13T00:00:00Z', type: 'Activity', name: 'Stage 4', description: "Stage 4 for project", projectId: 'p1'])
        1 * webService.doPost(_, [fromDate: '2017-01-01T00:00:00Z', toDate: '2017-07-01T00:00:00Z', dueDate: '2017-08-13T00:00:00Z', type: 'Activity', name: 'Stage 5', description: "Stage 5 for project", projectId: 'p1'])


    }

    void "reports can be removed correctly when a project end date is moved backwards"() {
        setup:
        def project = project('2015-01-01T00:00:00Z', '2016-07-01T00:00:00Z')
        projectService.get(_, _) >> project
        webService.getJson(_) >> reports()

        when:
        service.regenerateAllStageReportsForProject('p1', 6, true)

        then:
        1 * webService.doPost(_, [reportId:'1', fromDate: '2015-01-01T00:00:00Z', toDate: '2015-07-01T00:00:00Z', dueDate: '2015-08-13T00:00:00Z', type: 'Activity', name: 'Stage 1', description: "Stage 1 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'2', fromDate: '2015-07-01T00:00:00Z', toDate: '2016-01-01T00:00:00Z', dueDate: '2016-02-13T00:00:00Z', type: 'Activity', name: 'Stage 2', description: "Stage 2 for project", projectId: 'p1'])
        1 * webService.doPost(_, [reportId:'3', fromDate: '2016-01-01T00:00:00Z', toDate: '2016-07-01T00:00:00Z', dueDate: '2016-08-13T00:00:00Z', type: 'Activity', name: 'Stage 3', description: "Stage 3 for project", projectId: 'p1'])
        1 * webService.doDelete({ it.endsWith('/report/4')})
    }

    void "reports can be changed correctly if there are approved reports"() {

    }
}
