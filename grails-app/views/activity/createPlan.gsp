<%@ page import="au.org.ala.merit.DateUtils; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Create | Activity | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>

    <script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/"
        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common.css"/>

</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <ul class="breadcrumb">
            <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
            <g:if test="${project}">
                <li><a data-bind="click:goToProject" class="clickable">Project</a> <span class="divider">/</span></li>
            </g:if>
            <g:if test="${site}">
                <li><a data-bind="click:goToSite" class="clickable">Site</a> <span class="divider">/</span></li>
            </g:if>
            <li class="active">Create new activity</li>
        </ul>
        <g:render template="createOrEditActivity"/>
    </div>
</div>
<asset:javascript src="common.js"/>
<asset:javascript src="forms-manifest.js"/>
<asset:deferredScripts/>
</body>
</html>