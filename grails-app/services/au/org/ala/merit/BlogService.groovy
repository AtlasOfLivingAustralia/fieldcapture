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
    ProgramService programService
    ManagementUnitService managementUnitService
    DocumentService documentService
    SettingService settingService
    GrailsCacheManager grailsCacheManager

    /**
     *
     *
     * @param programOrProjectId
     * @param from
     * @return
     */
    @Deprecated
    private BlogType checkBlogType(String programOrProjectId, BlogType from){
        if (!programOrProjectId)
            return BlogType.SITE
        else if(!from)
            return BlogType.PROJECT
        else
            return from
    }
    @Deprecated
    private BlogType checkBlogType(String projectId, String programId, String managmentUnitId=null){
        if (!programId && !projectId &&!managmentUnitId)
            return BlogType.SITE
        else if (managmentUnitId)
            return BlogType.MANAGEMENTUNIT
        else if( projectId)
            return BlogType.PROJECT
        else
            return BlogType.PROGRAM
    }


    /**
     *
     * @param id  program Id or project Id
     * @param blogEntryId
     * @param from Program/Project/Site
     * @return
     */
    Map get(String id, String blogEntryId, BlogType from=null) {
        List<Map> blog

        BlogType blogType = checkBlogType(id,from)

        switch (blogType) {
            case BlogType.SITE:
                blog = getSiteBlog()
                break
            case BlogType.PROGRAM:
                Map program = programService.get(id)
                blog = getBlog(program)
                break
            case BlogType.PROJECT:
                Map project = projectService.get(id)
                blog = getProjectBlog(project)
                break
            case BlogType.MANAGEMENTUNIT:
                Map mu = managementUnitService.get(id)
                blog = getBlog(mu)
                break
        }

        int index = blog.findIndexOf{it.blogEntryId == blogEntryId}
        if (index > -1){
            Map blogEntry = blog[index]
            attachImages([blogEntry])
            return blogEntry
        }else
            return [];
    }


    @Cacheable(BlogService.HOMEPAGE_BLOG_CACHE_REGION)
    List<Map> getSiteBlog() {
        Map blogSetting = settingService.getJson(SITE_BLOG_KEY)

        List<Map> blog = blogSetting?.blog?:[]
        process(blog)
        blog
    }

    /**
     * Support existing method
     * Get blog from program/project/management unit
     * @param programOrproject
     * @return
     */
    List<Map> getBlog(Map programOrProject){
        return getProjectBlog(programOrProject)
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
        String programId = blogEntry.programId
        String managementUnitId = blogEntry.managementUnitId

        Enum blogType = BlogType.SITE
        if(blogEntry.blogOf) {
            blogType = BlogType.lookup(blogEntry.blogOf)
            blogEntry.remove('blogOf')
        }

        def result
        switch(blogType){
            case BlogType.MANAGEMENTUNIT:
                result = updateManagementUnitBlog(managementUnitId, id, blogEntry)
                break
            case BlogType.PROGRAM:
                result = updateProgramBlog(programId, id, blogEntry)
                break
            case BlogType.PROJECT:
                result = updateProjectBlog(projectId, id, blogEntry)
                break
            case BlogType.SITE:
                result = updateSiteBlog(id, blogEntry)
                break
        }
        result
    }
    /**
     *
     * @param projectOrProgramId  ID of project,program or management unit
     * @param id
     * @param from
     * @return
     */
    def delete(String projectOrProgramId, String id, BlogType from = null) {
        def result
        BlogType blogType = checkBlogType(projectOrProgramId, from)
        switch(blogType){
            case BlogType.MANAGEMENTUNIT:
                result = deleteManagementUnitBlogEntry(projectOrProgramId, id)
                break
            case BlogType.PROGRAM:
                result = deleteProgramBlogEntry(projectOrProgramId, id)
                break
            case BlogType.PROJECT:
                result = deleteProjectBlogEntry(projectOrProgramId, id)
                break
            case BlogType.SITE:
                result = deleteSiteBlogEntry(id)
                break
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

    private def deleteProgramBlogEntry(String programId, String id) {
        Map program = programService.get(programId)

        if (program.blog) {
            deleteBlogEntry(program.blog, id)
        }

        programService.update(programId, [blog:program.blog])
    }

    private def deleteManagementUnitBlogEntry(String muId, String id) {
        Map mu = managementUnitService.get(muId)

        if (mu.blog) {
            deleteBlogEntry(mu.blog, id)
        }

        managementUnitService.update(muId, [blog:mu.blog])
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

    def updateProgramBlog(String programId, String id, Map blogEntry) {
        Map program = programService.get(programId)

        if (!program.blog) {
            program.blog = []
        }

        if (id) {
            int index = program.blog.findIndexOf{it.blogEntryId == id}
            program.blog[index] = blogEntry
        } else {
            blogEntry.blogEntryId = nextId(program.blog)
            program.blog << blogEntry
        }

        Map result = programService.update(program.programId, [blog:program.blog])
        /**
         * Todo Handle error message
         */
        if (result.statusCode == 200){
            return ["status": "Updated"]
        }else{
            return result
        }
    }

    def updateManagementUnitBlog(String managementUnitId, String id, Map blogEntry) {
        Map managementUnit= managementUnitService.get(managementUnitId)

        if (!managementUnit.blog) {
            managementUnit.blog = []
        }

        if (id) {
            int index = managementUnit.blog.findIndexOf{it.blogEntryId == id}
            managementUnit.blog[index] = blogEntry
        } else {
            blogEntry.blogEntryId = nextId(managementUnit.blog)
            managementUnit.blog << blogEntry
        }

        Map result = managementUnitService.update(managementUnit.managementUnitId, [blog:managementUnit.blog])
        /**
         * Todo Handle error message
         */
        if (result.statusCode == 200){
            return ["status": "Updated"]
        }else{
            return result
        }
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
