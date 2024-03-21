package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.testing.services.ServiceUnitTest
import groovy.time.TimeCategory
import org.joda.time.Months
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
class OrganisationServiceSpec extends Specification implements ServiceUnitTest<OrganisationService> {

	def activityService = Mock(ActivityService)
    def projectService = Mock(ProjectService)
	def webService = Mock(WebService)
	def reportService = Mock(ReportService)
	def userService = Mock(UserService)
	def metadataService = Mock(MetadataService)
	AbnLookupService abnLookupService = Mock(AbnLookupService)

	def setup() {
        service.projectService = projectService
		service.activityService = activityService
		service.webService = webService
		service.reportService = reportService
		service.userService = userService
		service.metadataService = metadataService
		service.abnLookupService = abnLookupService
		service.grailsApplication = grailsApplication
	}


	def cleanup() {
	}

	void "find the activities for an organisations projects"() {

		when:
		service.findActivitiesForOrganisation(organisationWithProjects(), ['t1', 't2'])

		then:
		1 * activityService.search([type:['t1', 't2'], projectId:['1', '2', '3'], dateProperty:'plannedEndDate', startDate:"2014-01-01T00:00:00+0000", endDate:'2016-02-28T00:00:00+0000'])
	}

	def "Checking if abn already exist in db"(){
		setup:
		String ordId = "123"
		String abn = "12345678901"
		Map list1 = [organisationId: "123", abn:"12345678901"]
		def reducedList = []
		reducedList.add(list1)
		def list = [list:reducedList?:[]]


		when:
		def message = service.checkExistingAbnNumber(ordId, abn)

		then:
		1 * metadataService.organisationList() >> list

		and:
		message == null
	}

	// user tends to update abn number for the existing organisation. saving details without any errors message
	def "processing without any error with new abn number if organisation id matches"(){
		setup:
		String ordId = "123"
		String abn = "12345678911"
		Map list1 = [organisationId: "1234", abn:"12345678911"]
		def reducedList = []
		reducedList.add(list1)
		def list = [list:reducedList?:[]]


		when:
		def message = service.checkExistingAbnNumber(ordId, abn)

		then:
		1 * metadataService.organisationList() >> list

		and:
		message == "Abn Number is not unique"
	}

	def "creating new organisation with existing abn number that saved in db"(){
		setup:
		String abn = "12345678911"
		Map list1 = [organisationId: "1234", abn:"12345678911"]
		def reducedList = []
		reducedList.add(list1)
		def list = [list:reducedList?:[]]


		when:
		def message = service.checkExistingAbnNumber('', abn)

		then:
		1 * metadataService.organisationList() >> list

		and:
		message == "Abn Number is not unique"
	}

	def "create new organisation and empty org list"(){
		setup:
		String abn = "12345678911"
		Map list1 = [:]
		def reducedList = []
		reducedList.add(list1)
		def list = [list:reducedList?:[]]


		when:
		def message = service.checkExistingAbnNumber('', abn)

		then:
		1 * metadataService.organisationList() >> list

		and:
		message == null
	}

	def "when user enter a valid abn number return a abn details"(){
		setup:
		String abn = "11111111111"
		Map expected = [ abn: "11111111111", entityName: "Test abn"]

		when:
		Map abnDetails = service.getAbnDetails(abn)

		then:
		1 * abnLookupService.lookupOrganisationNameByABN(abn) >> expected

		and:
		abnDetails.abn == "11111111111"
		abnDetails.name == "Test abn"
	}

	def "When user provide an invalid abn number return an error message"(){
		setup:
		String abn = "11111111111"
		Map expected = [ abn: "", entityName: ""]

		when:
		Map abnDetails = service.getAbnDetails(abn)

		then:
		1 * abnLookupService.lookupOrganisationNameByABN(abn) >> expected

		and:
		abnDetails.error == "invalid"
	}

	def "A hubId is added to the organisation when creating a new organisation"() {
		setup:
		SettingService.setHubConfig(new HubSettings(hubId:"merit"))

		when:
		service.update("", [name:"Organisation 1"])

		then:
		1 * webService.doPost({it.endsWith('organisation/')}, [name:"Organisation 1", hubId:"merit"])
		1 * metadataService.clearOrganisationList()
	}

	def "An organisation can be saved with a null / blank ABN"() {
		setup:
		SettingService.setHubConfig(new HubSettings(hubId:"merit"))

		when:
		service.update("", [name:"Organisation 1"])

		then:
		1 * webService.doPost({it.endsWith('organisation/')}, [name:"Organisation 1", hubId:"merit"])
	}

	def "An ABN will be validated for uniqueness, if supplied"() {
		setup:
		SettingService.setHubConfig(new HubSettings(hubId:"merit"))

		when: "The ABN exists on another organisation"
		Map result = service.update("o2", [name:"Organisation 1", abn:"134566778"])

		then: "A validation error will be returned and no update will occur"
		1 * metadataService.organisationList() >> [list:[[organisationId:"1", abn:"134566778"]]]
		result.error != null
		0 * webService.doPost({it.endsWith('organisation/o2')}, [abn:"134566778", name:"Organisation 1", hubId:"merit"])

		when: "The ABN exists on the current organisation"
		result = service.update("o2", [name:"Organisation 1", abn:"134566778"])

		then: "The update will succeed"
		1 * metadataService.organisationList() >> [list:[[organisationId:"o2", abn:"134566778"]]]
		1 * webService.doPost({it.endsWith('organisation/o2')}, [abn:"134566778", name:"Organisation 1"])

	}

	def "If an organisationId is included in update props, if it's different to the id an error will be returned"() {
		setup:
		SettingService.setHubConfig(new HubSettings(hubId:"merit"))

		when: "The ABN exists on another organisation"
		Map result = service.update("o2", [name:"Organisation 1", abn:"134566778", organisationId:"o1"])

		then:
		result.error != null
	}

	def "The service can cancel a report (mark it as Not Required)"() {
		when:
		service.cancelReport("o1", "r1", "Testing")

		then:
		1 * webService.getJson({it.endsWith('organisation/o1?view=')}) >> [organisationId:"o1"]
		1 * reportService.get("r1") >> [reportId:"r1", organisationId:"o1", activityId:'a1']
		1 * reportService.cancelReport("r1", ['a1'], "Testing", [organisationId:"o1", reports:null], [])
		1 * webService.getJson({it.endsWith('permissions/getMembersForOrganisation/o1')}) >> []
	}

	static int activityId = 0
	private def generateActivities(project) {
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
