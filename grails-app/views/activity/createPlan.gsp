<%@ page import="au.org.ala.merit.DateUtils; grails.converters.JSON; org.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>Create | Activity | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>

    <script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/"
        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <section aria-labelledby="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
                <g:if test="${project}">
                    <li class="breadcrumb-item"><g:link controller="project" action="index" id="${project.projectId}">Project</g:link> </li>
                </g:if>
                <g:if test="${site}">
                    <li class="breadcrumb-item"><a data-bind="click:goToSite" class="clickable">Site</a></li>
                </g:if>
                <li class="breadcrumb-item active">Create New Activity</li>
            </ol>
        </section>
        <div class="createOrEditActivity">
            <g:render template="createOrEditActivity"/>
        </div>

    </div>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="forms-manifest.js"/>
<asset:deferredScripts/>
</body>
</html>
