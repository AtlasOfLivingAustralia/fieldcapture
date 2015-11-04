package au.org.ala.merit

class BlogService {

    ProjectService projectService

    Map get(String projectId, String blogEntryId) {
        Map project = projectService.get(projectId)

        int index = Integer.parseInt(blogEntryId)
        return project.blog[index]
    }

    def update(String id, Map blogEntry) {
        String projectId = blogEntry.projectId
        Map project = projectService.get(projectId)

        if (!project.blog) {
            project.blog = []
        }

        if (id) {
            int index = Integer.parseInt(blogEntry.blogEntryId)
            project.blog[index] = blogEntry
        }
        else {
            blogEntry.blogEntryId = "0"
            project.blog << blogEntry
        }

        projectService.update(project.projectId, project)

    }
}
