package au.org.ala.merit

import au.org.ala.fieldcapture.DocumentService
import au.org.ala.merit.MetadataService
import au.org.ala.fieldcapture.UserService
import grails.converters.JSON
import grails.test.mixin.TestFor
import org.apache.commons.httpclient.HttpStatus
import spock.lang.Specification

/**
 * Tests for the ActivityController
 */
@TestFor(ActivityController)
class ActivityControllerSpec extends Specification {

    def activityService = Mock(ActivityService)
    def projectService = Mock(ProjectService)
    def userService = Mock(UserService)
    def documentService = Mock(DocumentService)
    def metadataService = Mock(MetadataService)
    def reportService = Mock(ReportService)

    def setup() {
        controller.activityService = activityService
        controller.projectService = projectService
        controller.userService = userService
        controller.documentService = documentService
        controller.metadataService = metadataService
        controller.reportService = reportService
    }

    def "Non-project members cannot edit activities"() {
        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        projectService.canUserEditProject(_, projectId) >> false
        userService.getCurrentUserId() >> null
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId]

        when:
        request.method = 'POST'
        request.JSON = '{"projectId":"'+projectId+'"}'
        controller.ajaxUpdate(activityId)

        then:
        response.status == HttpStatus.SC_UNAUTHORIZED
        response.json.error =~ /access denied/
    }

    def "A project id must be specified when creating an activity"() {
        setup:
        String activityId = null
        userService.getCurrentUserId() >> "1234"

        when:
        request.method = 'POST'
        request.JSON = '{"type":"Revegetation"}'
        controller.ajaxUpdate(activityId)

        then:
        response.status == HttpStatus.SC_BAD_REQUEST
        response.json.error =~ /No project id/

    }

    def "An activity can be updated"() {
        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        projectService.canUserEditProject(_, projectId) >> true
        userService.getCurrentUserId() >> "1234"
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId]
        def activityData = [projectId:projectId, activityId:activityId, type:"Revegetation"]

        when:
        request.method = 'POST'
        request.JSON = activityData as JSON
        controller.ajaxUpdate(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        1 * activityService.update(activityId, activityData) >> [resp:[message:'updated'], statusCode:HttpStatus.SC_OK]
        response.status == HttpStatus.SC_OK
        response.json.activity.message == 'updated'
    }

    def "An activity can be created"() {
        setup:
        String projectId = 'p1234'
        String activityId = null
        projectService.canUserEditProject(_, projectId) >> true
        userService.getCurrentUserId() >> "1234"
        def activityData = [projectId:projectId, type:"Revegetation"]

        when:
        request.method = 'POST'
        request.JSON = activityData as JSON
        controller.ajaxUpdate(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        1 * activityService.update('', activityData) >> [resp:[message:'created', activityId:'1234'], statusCode:HttpStatus.SC_OK]
        response.status == HttpStatus.SC_OK
        response.json.activity.message == 'created'
        response.json.activity.activityId == '1234'

    }

    def "Photos can be attached to photo points and document ids for those photos are returned correctly"() {
        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId]
        projectService.canUserEditProject(_, projectId) >> true
        userService.getCurrentUserId() >> "1234"
        def activityData = [projectId:projectId, type:"Revegetation"]
        def photoData = [photoPoints:[photos:[[clientId:'1', name:"photo 1", poiId:"poi 1"]]]]
        def requestBody = activityData + photoData

        when:
        request.method = 'POST'
        request.JSON = requestBody as JSON
        controller.ajaxUpdate(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        1 * activityService.update(activityId, activityData) >> [resp:[message:'created', activityId:'1234'], statusCode:HttpStatus.SC_OK]
        1 * documentService.saveStagedImageDocument([name:"photo 1", poiId:'poi 1', activityId:activityId]) >> [resp:[message:'created', documentId:'d1234']]
        response.status == HttpStatus.SC_OK
        response.json.activity.message == 'created'
        response.json.activity.activityId == '1234'
        response.json.photoPoints['1'].documentId == 'd1234'
    }

    def "Activity types for selection are restricted by programme / subprogramme"() {

        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId, type:'activity 1']
        projectService.canUserEditProject(_, projectId) >> true
        projectService.get(projectId) >> [projectId:projectId, associatedProgram:'Programme 1', associatedSubProgram:'Sub-Programme 1']
        def activityTypes = [[name:'category 1', list:[[name:'activity 1', description:'description 1'], [name:'activity 2', description:'description 2']]]]

        userService.getCurrentUserId() >> "1234"

        when:
        def model = controller.edit(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        response.status == HttpStatus.SC_OK
        1 * metadataService.activityTypesList('Programme 1', 'Sub-Programme 1') >> activityTypes
        model.activityTypes == activityTypes
    }

    def "The activity type of the activity being edited will be available for selection, even if it is not normally associated with the project's programme or subprogramme"() {

        setup:
        String projectId = 'p1234'
        String activityId = 'a1234'
        activityService.get(activityId) >> [projectId:projectId, activityId:activityId, type:'activity 3']
        projectService.canUserEditProject(_, projectId) >> true
        projectService.get(projectId) >> [projectId:projectId, associatedProgram:'Programme 1', associatedSubProgram:'Sub-Programme 1']
        def activityTypes = [[name:'category 1', list:[[name:'activity 1', description:'description 1'], [name:'activity 2', description:'description 2']]]]
        def extraActivityType = [name:'Current Activity', list:[[name:"activity 3", description: "The current activity type of the activity being edited"]]]

        userService.getCurrentUserId() >> "1234"

        when:
        def model = controller.edit(activityId)

        then:
        1 * activityService.canEditActivity(_) >> true
        response.status == HttpStatus.SC_OK
        1 * metadataService.activityTypesList('Programme 1', 'Sub-Programme 1') >> activityTypes
        model.activityTypes == activityTypes.plus(0, extraActivityType)
    }

}
