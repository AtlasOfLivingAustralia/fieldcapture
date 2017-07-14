<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit | Site Blog| Admin | Data capture | Atlas of Living Australia</title>

    <script>
        fcConfig = {
            documentBulkUpdateUrl: "${g.createLink(controller:"document", action:"bulkUpdate")}",
            documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
            createBlogEntryUrl: "${createLink(controller: 'blog', action:'create', params:[returnTo:createLink(controller: 'admin', action: 'editSiteBlog')])}",
            editBlogEntryUrl: "${createLink(controller: 'blog', action:'edit', params:[returnTo:createLink(controller: 'admin', action: 'editSiteBlog')])}",
            deleteBlogEntryUrl: "${createLink(controller: 'blog', action:'delete', params:[returnTo:createLink(controller: 'admin', action: 'editSiteBlog')])}",
            imageLocation:"${assetPath(src:'/')}"
        }
    </script>
    <asset:stylesheet src="common.css"/>
    <g:set var="here" value="${g.createLink(action:'editSiteBlog')}"/>
</head>

<body>
<h3>Edit Site Blog</h3>

<g:render template="/blog/blogSummary"/>

<asset:javascript src="common.js"/>
<asset:deferredScripts/>
</body>
</html>