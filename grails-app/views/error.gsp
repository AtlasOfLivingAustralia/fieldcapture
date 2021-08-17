<!DOCTYPE html>
<html>
<head>
    <title>Grails Runtime Exception</title>
    <meta name="layout" content="nrm_bs4">
    <asset:stylesheet src="errors.css"/>
    <asset:stylesheet src="common-bs4.css"/>
</head>

<body>
<div id="wrapper" class="${containerType}">
    <h1 style="margin:20px 0;">An error occurred</h1>
    <g:if test="${exception}">
        <g:if test="${grails.util.Environment.isDevelopmentRun()}">
            <g:renderException exception="${exception}"/>
        </g:if>
        <g:else>
            ${exception.getMessage()}
        </g:else>
    </g:if>
    <g:elseif test="${response.status == 404}">
        <p>404 - The requested page was not found</p>
    </g:elseif>
    <g:elseif test="${error}">
        <p>${error}</p>
    </g:elseif>
    <div class="space-before space-after">&nbsp</div>
</body>
<asset:javascript src="common-bs4.js"/>
</html>
