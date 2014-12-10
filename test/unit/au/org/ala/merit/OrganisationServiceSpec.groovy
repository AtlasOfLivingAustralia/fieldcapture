package au.org.ala.merit

import au.org.ala.fieldcapture.ActivityService
import au.org.ala.fieldcapture.DateUtils
import au.org.ala.fieldcapture.WebService
import grails.test.mixin.TestFor
import groovy.time.TimeCategory
import org.joda.time.Period
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(OrganisationService)
class OrganisationServiceSpec extends Specification {

	def activityService = Mock(ActivityService)
	def webService = Stub(WebService)

	def setup() {
		service.activityService = activityService
		service.webService = webService
	}

	def cleanup() {
	}

	void "find the activities for an organisations projects"() {

		when:
		service.findActivitiesForOrganisation(organisationWithProjects(), ['t1', 't2'])

		then:
		1 * activityService.search([type:['t1', 't2'], projectId:['1', '2', '3'], plannedStartDate:"2014-01-01T00:00:00+0000", plannedEndDate:'2016-02-28T00:00:00+0000'])
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
		then: "2 years, 3 months of monthly reports"
		reportsByType['t1'].size() == 27

		and: "9 quarterly reports"
		reportsByType['t2'].size() == 9

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
					[type: 't1', period: 1.months],
					[type: 't2', period: 3.months]]

			def projectEndDate = DateUtils.parse(project.plannedEndDate).toDate()

			reportConf.each { conf ->
				def date = DateUtils.parse(project.plannedStartDate).toDate()

				while (date.before(projectEndDate)) {

					def endDate = date + conf.period
					def periodDescription = endDate.format('MMM yyyy')
					// brings the end date into the previous month
					if (conf.period > 1.months) {
						periodDescription = date.format('MMM') + '-' + periodDescription
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
