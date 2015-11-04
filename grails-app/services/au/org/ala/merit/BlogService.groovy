package au.org.ala.merit

import au.org.ala.fieldcapture.SettingService
import grails.converters.JSON

class BlogService {

    private static final String SITE_BLOG_KEY = 'merit.site.blog'
    ProjectService projectService
    SettingService settingService

    Map get(String projectId, String blogEntryId) {
        Map project = projectService.get(projectId)

        int index = Integer.parseInt(blogEntryId)
        return project.blog[index]
    }

    List<Map> getSiteBlog() {
        Map blog = settingService.getJson(SITE_BLOG_KEY)

        return blog?.blog?:[]
    }

    def update(String id, Map blogEntry) {
        String projectId = blogEntry.projectId

        def result
        if (!projectId) {
            result = updateSiteBlog(id, blogEntry)
        }
        else {
            result = updateProjectBlog(projectId, id, blogEntry)
        }
        result
    }

    def updateSiteBlog(String id, Map blogEntry) {

        List blog = getSiteBlog()

        if (id) {
            int index = Integer.parseInt(blogEntry.blogEntryId)
            blog[index] = blogEntry
        }
        else {
            blogEntry.blogEntryId = "0"
            blog << blogEntry
        }

        settingService.set(SITE_BLOG_KEY, ([blog:blog] as JSON).toString())

    }

    def updateProjectBlog(String projectId, String id, Map blogEntry) {
        Map project = projectService.get(projectId)

        if (!project.blog) {
            project.blog = []
        }

        if (id) {
            int index = Integer.parseInt(blogEntry.blogEntryId)
            project.blog[index] = blogEntry
        } else {
            blogEntry.blogEntryId = "0"
            project.blog << blogEntry
        }

        projectService.update(project.projectId, project)
    }

}
