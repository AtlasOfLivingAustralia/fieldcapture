package au.org.ala.merit

import au.org.ala.fieldcapture.ActivityService
import au.org.ala.fieldcapture.DateUtils
import au.org.ala.fieldcapture.WebService
import grails.converters.JSON
import grails.test.mixin.TestFor
import groovy.time.TimeCategory
import org.joda.time.Months
import org.joda.time.Period
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(OrganisationService)
class OrganisationServiceSpec extends Specification {

	def activityService = Mock(ActivityService)
    def projectService = Mock(ProjectService)
	def webService = Stub(WebService)

	def setup() {
        service.projectService = projectService
		service.activityService = activityService
		service.webService = webService
	}


	def cleanup() {
	}

	void "find the activities for an organisations projects"() {

		when:
		service.findActivitiesForOrganisation(organisationWithProjects(), ['t1', 't2'])

		then:
		1 * activityService.search([type:['t1', 't2'], projectId:['1', '2', '3'], dateProperty:'plannedEndDate', startDate:"2014-01-01T00:00:00+0000", endDate:'2016-02-28T00:00:00+0000'])
	}

	void "organisational level reports should be grouped based on report type and reporting period"() {

		given:
		def organisation = organisationWithProjects()
		def reportConf
		use (TimeCategory) {
			 reportConf = [
				[type: 't1', period: Period.months(1)],
				[type: 't2', period: Period.months(3)]]
		}
		activityService.search(_) >> [resp:[activities:organisationActivities(organisation)]]

		when:
		def reports = service.getReportsForOrganisation(organisation, reportConf)
		def reportsByType = reports.groupBy{it.type}

        then: "2 years, 3 months of monthly reports, the first activity finishes on the 1st of Feb so isn't reportable until Feb"
		reportsByType['t1'].size() == 26

		and: "9 quarterly reports"
		reportsByType['t2'].size() == 9
	}

	void "the projects for an organisation should include projects for which the organisation is the service provider"() {
        given:
        def orgId = '1234'
        def organisation = [organisationId:orgId, name:'name', description:'description']
        def serviceProviderProjects = ['1', '2', '3', '4'].collect{[projectId:it, name:'p'+it]}
        def organisationProjects = ['5', '6', '7', '8', '9'].collect{[projectId:it, name:'p'+it]}
        def organisationProjectsWithDuplicates = ['3', '4', '5', '6', '7', '8', '9'].collect{[projectId:it, name:'p'+it]}

        webService.getJson(_) >> organisation

        when: "the organisation is not a service provider for any projects"
        organisation = service.get(orgId)
        def projects = organisation.projects

        then:
        1 * projectService.search([organisationId:orgId, view:'enhanced']) >> [resp:[projects:organisationProjects]]
        1 * projectService.search([orgIdSvcProvider:orgId, view:'enhanced']) >> [resp:[projects:[]]]

        projects.size() == organisationProjects.size()
        projects == organisationProjects

        when: "the organisation is exclusively a service provider"
        organisation = service.get(orgId)
        projects = organisation.projects


        then:
        1 * projectService.search([organisationId:orgId, view:'enhanced']) >> [resp:[projects:[]]]
        1 * projectService.search([orgIdSvcProvider:orgId, view:'enhanced']) >> [resp:[projects:serviceProviderProjects]]

        projects.size() == serviceProviderProjects.size()
        projects == serviceProviderProjects

        when:"the organisation is a service provider and runs it's own projects as well"
        organisation = service.get(orgId)
        projects = organisation.projects

        then: "both sets of projects should be returned"
        1 * projectService.search([organisationId:orgId, view:'enhanced']) >> [resp:[projects:organisationProjects]]
        1 * projectService.search([orgIdSvcProvider:orgId, view:'enhanced']) >> [resp:[projects:serviceProviderProjects]]

        projects.size() == serviceProviderProjects.size() + organisationProjects.size()
        projects ==  organisationProjects + serviceProviderProjects

        when: "there is overlap between the organisation and service provider projects"
        organisation = service.get(orgId)
        projects = organisation.projects

        then: "there should be no duplicate projects returned"
        1 * projectService.search([organisationId:orgId, view:'enhanced']) >> [resp:[projects:organisationProjectsWithDuplicates]]
        1 * projectService.search([orgIdSvcProvider:orgId, view:'enhanced']) >> [resp:[projects:serviceProviderProjects]]

        projects.size() == serviceProviderProjects.size() + organisationProjects.size()
        projects.sort{it.projectId} == (organisationProjects + serviceProviderProjects).sort{it.projectId}

    }

	def organisationActivities(organisation) {

		def activities = []

		organisation.projects.each {
			def prjActivities = generateActivities(it)
			activities += prjActivities
		}

		activities
	}
	static int activityId = 0
	def generateActivities(project) {
		def reports = []
		use(TimeCategory) {
			def reportConf = [
					[type: 't1', period: Months.months(1)],
					[type: 't2', period: Months.months(3)]]

			def projectEndDate = DateUtils.parse(project.plannedEndDate)

			reportConf.each { conf ->
				def date = DateUtils.parse(project.plannedStartDate)

				while (date.isBefore(projectEndDate)) {

					def endDate = date.plus(conf.period)
					def periodDescription = endDate.toDate().format('MMM yyyy')

					// brings the end date into the previous month
					if (conf.period.isGreaterThan(Months.months(1))) {
						periodDescription = date.toDate().format('MMM') + '-' + periodDescription
					}

					def description = conf.type + ' - ' + periodDescription
					reports << [activityId:++activityId, projectId:project.projectId, type: conf.type, description: description, plannedStartDate: DateUtils.format(date), plannedEndDate: DateUtils.format(endDate)]

					date = endDate
				}
			}
		}

		reports
	}

	private Map activity(id, prjId, type, startDate, endDate) {
		return [activityId:id, projectId: prjId, type:type, plannedStartDate: startDate, plannedEndDate: endDate]
	}

	private Map organisationWithProjects() {
		def org = [organisationId:'id', name:'name', description:'description']
		org.projects = [project('1', '2014-01-01T00:00:00+0000', '2014-12-31T00:00:00+0000'), project('2', '2014-06-01T00:00:00+0000', '2015-12-31T00:00:00+0000'), project('3', '2015-01-02T00:00:00+0000', '2016-02-28T00:00:00+0000')]
		return org
	}

	private Map project(id, startDate, endDate) {
		return [projectId:id, plannedStartDate:startDate, plannedEndDate:endDate]
	}

}
