<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Create | Blog Entry | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            blogUpdateUrl: "${createLink(action:'update')}",
            blogViewUrl: "${createLink(action:'index')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            returnTo: "${params.returnTo?:g.createLink(controller:'project', id:params.projectId)}"
            };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="blog.css"/>


</head>
<body>
<div class="${containerType}">
    <div aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <g:if test="${params.projectId}">
                <li class="breadcrumb-item"><g:link controller="project" id="${params.projectId}">Project </g:link></li>
            </g:if>
            <g:if test="${params.programId}">
                <li class="breadcrumb-item"><g:link controller="program" id="${params.programId}">Program </g:link></li>
            </g:if>
            <g:if test="${params.managementUnitId}">
                <li class="breadcrumb-item"><g:link controller="managementUnit" id="${params.managementUnitId}">Management Unit </g:link></li>
            </g:if>

            <li class=" breadcrumb-item active">
                New blog entry
            </li>

        </ol>
    </div>

    <g:render template="editBlogEntry"/>

    <div class="form-actions">
        <button type="button" id="save" data-bind="click:save" class="btn btn-sm btn-primary">Create</button>
        <button type="button" id="cancel" data-bind="click:cancel" class="btn btn-sm btn-danger">Cancel</button>
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
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="blog.js"/>
<asset:javascript src="attach-document-no-ui.js"/>

<asset:deferredScripts/>

</body>


</html>
