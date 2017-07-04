package au.org.ala.merit

import au.org.ala.merit.UserService
import grails.test.mixin.TestFor
import org.apache.commons.httpclient.HttpStatus
import spock.lang.Specification

/**
 * Specification / tests for the BlogController
 */
@TestFor(BlogController)
class BlogControllerSpec extends Specification {

    def projectService = Mock(ProjectService)
    def blogService = Mock(BlogService)
    def userService = Mock(UserService)

    public setup() {
        controller.projectService = projectService
        controller.blogService = blogService
        controller.userService = userService
    }

    void "Non project members cannot edit project blogs"() {
        setup:
        projectService.canUserEditProject(_, _) >> false

        when:
        params.projectId = '1234'
        controller.edit('1')

        then:
        response.status == HttpStatus.SC_MOVED_TEMPORARILY
    }

    void "Project members can edit the project blog"() {
        setup:
        projectService.canUserEditProject(_, _) >> true
        userService.getUser() >> [userId:"1"]

        when:
        params.projectId = '1234'
        controller.edit('1')

        then:
        1 * blogService.get('1234', '1') >> [:]
        response.status == HttpStatus.SC_OK
    }

    void "Non project members cannot update project blogs"() {
        setup:
        projectService.canUserEditProject(_, _) >> false

        when:
        request.method = "POST"
        params.projectId = '1234'
        controller.update('1')

        then:
        response.status == HttpStatus.SC_UNAUTHORIZED
    }

    void "Project members can update the project blog"() {
        setup:
        request.method = "POST"
        request.JSON = [projectId:'1234']
        projectService.canUserEditProject(_, _) >> true
        userService.getUser() >> [userId:"1"]

        when:
        params.projectId = '1234'
        controller.update('1')

        then:
        1 * blogService.update('1', _) >> [status:200]
        response.status == HttpStatus.SC_OK
    }

    void "Non project members cannot delete project blogs"() {
        setup:
        projectService.canUserEditProject(_, _) >> false

        when:
        request.method = "POST"
        params.projectId = '1234'
        controller.delete('1')

        then:
        response.status == HttpStatus.SC_UNAUTHORIZED
    }

    void "Project members can delete the project blog"() {
        setup:
        request.method = "POST"
        request.JSON = [projectId:'1234']
        projectService.canUserEditProject(_, _) >> true
        userService.getUser() >> [userId:"1"]

        when:
        params.projectId = '1234'
        controller.delete('1')

        then:
        1 * blogService.delete('1234', '1') >> [status:200]
        response.status == HttpStatus.SC_OK
    }
}
