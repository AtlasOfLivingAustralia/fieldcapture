<%@ page import="au.org.ala.fieldcapture.DateUtils; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>Create | Activity | Field Capture</title>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>

    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker,jQueryFileUploadUI,mapWithFeatures"/>

</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <ul class="breadcrumb">
            <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
            <g:if test="${project}">
                <li><a data-bind="click:goToProject" class="clickable">Project</a> <span class="divider">/</span></li>
            </g:if>
            <g:elseif test="${site}">
                <li><a data-bind="click:goToSite" class="clickable">Site</a> <span class="divider">/</span></li>
            </g:elseif>
            <li class="active">Create new activity</li>
        </ul>
        <g:render template="createOrEditActivity"/>
    </div>
</div>
</body>
</html>