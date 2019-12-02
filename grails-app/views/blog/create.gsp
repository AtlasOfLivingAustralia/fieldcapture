<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Create | Blog Entry | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            blogUpdateUrl: "${createLink(action:'update')}",
            blogViewUrl: "${createLink(action:'index')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            returnTo: "${params.returnTo?:g.createLink(controller:'project', id:params.projectId)}"
            };
    </script>
    <asset:stylesheet src="common.css"/>

</head>
<body>
<div class="${containerType}">
    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <g:if test="${params.projectId}">
            <li><g:link controller="project" id="${params.projectId}">Project </g:link>  <span class="divider"> / </span></li>
        </g:if>
        <g:if test="${params.programId}">
            <li><g:link controller="program" id="${params.programId}">Program </g:link>  <span class="divider"> / </span></li>
        </g:if>
        <g:if test="${params.managementUnitId}">
            <li><g:link controller="managementUnit" id="${params.managementUnitId}">Management Unit </g:link>  <span class="divider"> / </span></li>
        </g:if>

        <li class="active">
            New blog entry
        </li>
    </ul>

    <g:render template="editBlogEntry"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-primary">Create</button>
        <button type="button" id="cancel" data-bind="click:cancel" class="btn">Cancel</button>
    </div>
</div>

<asset:script>

    $(function () {
        var blogEntry = <fc:modelAsJavascript model="${blogEntry}" default="{}"/>;
        var blogEntryViewModel = new EditableBlogEntryViewModel(blogEntry, '.validationEngineContainer');

        ko.applyBindings(blogEntryViewModel);
        $('.helphover').popover({animation: true, trigger:'hover'});
    });



</asset:script>
<asset:javascript src="common.js"/>
<asset:javascript src="blog.js"/>
<asset:javascript src="attach-document-no-ui.js"/>

<asset:deferredScripts/>

</body>


</html>