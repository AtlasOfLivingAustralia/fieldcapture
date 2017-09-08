package au.org.ala.merit

import grails.converters.JSON
import grails.plugin.cache.GrailsCacheManager
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject
import org.springframework.cache.annotation.Cacheable

class BlogService {

    public static final String HOMEPAGE_BLOG_CACHE_REGION = 'homePageBlog'
    private static final String SITE_BLOG_KEY = 'merit.site.blog'
    ProjectService projectService
    DocumentService documentService
    SettingService settingService
    GrailsCacheManager grailsCacheManager

    Map get(String projectId, String blogEntryId) {
        List<Map> blog
        if (!projectId) {
            blog = getSiteBlog()
        }
        else {
            Map project = projectService.get(projectId)
            blog = getProjectBlog(project)
        }

        int index = blog.findIndexOf{it.blogEntryId == blogEntryId}
        Map blogEntry = blog[index]
        attachImages([blogEntry])
        return blogEntry
    }

    @Cacheable(BlogService.HOMEPAGE_BLOG_CACHE_REGION)
    List<Map> getSiteBlog() {
        Map blogSetting = settingService.getJson(SITE_BLOG_KEY)

        List<Map> blog = blogSetting?.blog?:[]
        process(blog)
        blog
    }

    List<Map> getProjectBlog(Map project) {
        List<Map> blog = project?.blog?:[]
        process(blog)

        blog
    }

    private void process(List<Map> blog) {

        blog.sort{a, b -> b.keepOnTop <=> a.keepOnTop ?: b.date <=> a.date}
        attachImages(blog)
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
            deleteBlogEntry(project.blog, id)
        }

        projectService.update(projectId, [blog:project.blog])
    }

    private def deleteSiteBlogEntry(String id) {
        grailsCacheManager.destroyCache(HOMEPAGE_BLOG_CACHE_REGION)

        List blog = getSiteBlog()

        deleteBlogEntry(blog, id)

        settingService.set(SITE_BLOG_KEY, ([blog:blog] as JSON).toString())
    }

    private void deleteBlogEntry(List blog, String blogEntryId) {
        int index = blog.findIndexOf{it.blogEntryId == blogEntryId}
        Map blogEntry = blog.remove(index)
        if (blogEntry.imageId) {
            documentService.delete(blogEntry.imageId)
        }
    }

    def updateSiteBlog(String id, Map blogEntry) {

        grailsCacheManager.destroyCache(HOMEPAGE_BLOG_CACHE_REGION)

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

    private void attachImages(List<Map> blog) {
        blog.each { entry ->
            if (entry.imageId) {
                def doc = documentService.get(entry.imageId)
                if (doc) {
                    // entry is a JSONObject so if we add a List to to it won't serialize properly.
                    entry.documents = new JSONArray()
                    entry.documents.add(doc)
                }
            }
        }
    }
}
