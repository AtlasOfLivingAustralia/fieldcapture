<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit | Site Blog| Admin | Data capture | Atlas of Living Australia</title>
    <r:require modules="knockout,jqueryValidationEngine"/>
    <r:script disposition="head">
        fcConfig = {
           documentBulkUpdateUrl: "${g.createLink(controller:"document", action:"bulkUpdate")}",
           documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
           imageLocation:"${resource(dir:'/images')}"
        }
    </r:script>
</head>

<body>
<h3>Edit Site Blog</h3>

<div id="site-blog">
    <g:if test="${blog.size() > 0}">
    <ul>
        <g:each in="${blog}" var="blogEntry">
        <li>${blogEntry.title} | Edit | Delete</li>
        </g:each>

    </ul>
    </g:if>
    <g:else>
        No blog entries.
    </g:else>
</div>

<div class="form-actions">
    <a href="${g.createLink(controller: 'blog', action:'create')}"><button type="button" id="new" class="btn btn-primary">New Entry</button></a>
</div>


</body>
</html>