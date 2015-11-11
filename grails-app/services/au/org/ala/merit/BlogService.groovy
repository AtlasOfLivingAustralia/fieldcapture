package au.org.ala.merit

import au.org.ala.fieldcapture.SettingService
import grails.converters.JSON

class BlogService {

    private static final String SITE_BLOG_KEY = 'merit.site.blog'
    ProjectService projectService
    SettingService settingService

    Map get(String projectId, String blogEntryId) {
        List<Map> blog
        if (!projectId) {
            blog = getSiteBlog()
        }
        else {
            Map project = projectService.get(projectId)
            blog = project.blog
        }

        int index = blog.findIndexOf{it.blogEntryId == blogEntryId}
        return blog[index]
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

    def delete(String projectId, String id) {
        def result
        if (projectId) {
            result = deleteProjectBlogEntry(projectId, id)
        }
        else {
            result = deleteSiteBlogEntry(id)
        }
        result
    }

    private def deleteProjectBlogEntry(String projectId, String id) {
        Map project = projectService.get(projectId)

        if (project.blog) {

            int index = project.blog.findIndexOf{it.blogEntryId == id}
            project.blog.remove(index)
        }

        projectService.update(projectId, [blog:project.blog])
    }

    private def deleteSiteBlogEntry(String id) {
        List blog = getSiteBlog()


        int index = blog.findIndexOf{it.blogEntryId == id}
        blog.remove(index)

        settingService.set(SITE_BLOG_KEY, ([blog:blog] as JSON).toString())
    }


    def updateSiteBlog(String id, Map blogEntry) {

        List blog = getSiteBlog()

        if (id) {
            int index = blog.findIndexOf{it.blogEntryId == id}
            blog[index] = blogEntry
        }
        else {
            blogEntry.blogEntryId = nextId(blog)
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
            int index = project.blog.findIndexOf{it.blogEntryId == id}
            project.blog[index] = blogEntry
        } else {
            blogEntry.blogEntryId = nextId(project.blog)
            project.blog << blogEntry
        }

        projectService.update(project.projectId, [blog:project.blog])
    }

    String nextId(List<Map> blog) {
        def entry = blog.max{Integer.parseInt(it.blogEntryId)}

        return entry?Integer.parseInt(entry.blogEntryId)+1:0
    }
}
