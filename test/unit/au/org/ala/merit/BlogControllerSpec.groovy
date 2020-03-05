package au.org.ala.merit

import grails.test.mixin.TestFor
import org.apache.http.HttpStatus
import spock.lang.Specification

/**
 * Specification / tests for the BlogController
 */
@TestFor(BlogController)
class BlogControllerSpec extends Specification {

    def projectService = Mock(ProjectService)
    def blogService = Mock(BlogService)
    def userService = Mock(UserService)
    def programService = Mock(ProgramService)
    def documentService = Mock(DocumentService)


    public setup() {
        controller.projectService = projectService
        controller.blogService = blogService
        controller.userService = userService
        controller.programService = programService
        controller.documentService = documentService
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
        1 * blogService.get('1234', '1', BlogType.PROJECT) >> [:]
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
        1 * blogService.delete('1234', '1', BlogType.PROJECT) >> [status:200]
        response.status == HttpStatus.SC_OK
    }


    void "Program admin can edit project blogs"() {
        setup:
        controller.params.programId = '1234'
        userService.isUserAdminForProgram(_,_) >> true

        when:
        controller.edit('1')

        then:
        view == '/blog/edit'
    }

    void "Program editor can update the blog"() {
        setup:
        request.method = "POST"
        request.JSON = [programId:'1234',
                blog:[
                        [
                                 "date" : "2019-08-07T14:00:00Z",
                                 "keepOnTop" : false,
                                 "blogEntryId" : "0",
                                 "title" : "This is a test",
                                 "type" : "Program Stories",
                                 "programId" : "test_program",
                                 "content" : "This is a blog test",
                                 "stockIcon" : "fa-newspaper-o"
                        ]
                ]
        ]
        userService.isUserEditorForProgram(_,_) >> true
        userService.getUser() >> [userId:"1"]

        when:
        params.programId = '1234'
        controller.update('0')

        then:
        1 * blogService.update('0', _) >> [status:200]
        response.status == HttpStatus.SC_OK
    }

    void "Program grant manager can delete program blogs"() {
        setup:
        request.method = "POST"
        userService.isUserGrantManagerForProgram(_,_) >> true

        when:
        params.programId = '1234'
        controller.delete('1')

        then:
        1 * blogService.delete("1234", "1", BlogType.PROGRAM) >> [status:200]

        response.status == HttpStatus.SC_OK
    }

    void "Project admins can update the blog with images"() {
        setup:
        String userId = "u1"
        String projectId = "p1"
        String documentId = 'd1'

        Map blog = [
            "date" : "2019-08-07T14:00:00Z",
            "keepOnTop" : false,
            "blogEntryId" : "0",
            "title" : "This is a test",
            "type" : "Program Stories",
            "projectId" : projectId,
            "content" : "This is a blog test",
            "blogOf": "PROJECT",
            "image": [
                    "contentType":"image/png",
                    "filename":"test image",
                    "type":"image"
            ]
        ]
        Map expectedBlog = blog + [imageId:documentId] - [image:blog.image]

        when:
        request.method = "POST"
        request.JSON = blog
        controller.update('0')

        then:
        userService.getUser() >> [userId:userId]
        1 * projectService.canUserEditProject(userId, projectId) >> true
        1 * documentService.saveStagedImageDocument(blog.image + [projectId:projectId, public:true, name:blog.title]) >> [statusCode:HttpStatus.SC_OK, resp:[documentId:documentId]]
        1 * blogService.update('0', expectedBlog) >> [status:200]
        response.status == HttpStatus.SC_OK
    }



}
