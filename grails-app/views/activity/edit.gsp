<%@ page import="grails.converters.JSON; org.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>Print | ${activity.type} | MERIT</title>
    </g:if>
    <g:else>
        <meta name="layout" content="nrm_bs4"/>
        <title>Edit | ${activity.type} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/",
        saveOuputTargetsUrl: "${createLink(controller:'project', action:'ajaxUpdate', id:activity.projectId)}"
        },
        here = document.location.href;
    </script>
    <asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <ul class="breadcrumb">
                <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
                <li><a data-bind="click:goToProject" class="clickable">Project</a> <span class="divider">/</span></li>
                <li class="active">
                    <span data-bind="text:type"></span>
                    <span data-bind="text:startDate.formattedDate"></span><span data-bind="visible:endDate">/</span><span data-bind="text:endDate.formattedDate"></span>
                </li>
            </ul>
        </g:if>

        <g:render template="createOrEditActivity"/>
    </div>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projects.js"/>
<asset:javascript src="forms-manifest.js"/>
<asset:deferredScripts/>
</body>
</html>
