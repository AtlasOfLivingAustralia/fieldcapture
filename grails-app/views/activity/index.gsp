<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>${activity?.activityId}| ${site.name} | ${site.projectName} | Field Capture</title>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" id="${site.projectId}">${site.projectName}</g:link> <span class="divider">/</span></li>
    <li><g:link controller="site" id="${site.siteId}">${site.name}</g:link> <span class="divider">/</span></li>
    <li class="active">${activity.activityId}</li>
</ul>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="page-header span9">
            <h1>${site.projectName}: ${site.name}</h1>
            <h2>Activity: ${activity.activityId}</h2>
            <p class="well well-small">${activity.description}</p>
        </div>
        <div class="span2 clearfix">
            <g:link action="edit" id="${activity.activityId}" class="btn">Edit activity</g:link>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <span class="span3">Start date: ${activity.startDate}</span>
            <span class="span3">End date: ${activity.endDate}</span>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <span class="span3">Census method: ${activity.censusMethod}</span>
            <span class="span3">Method accuracy: ${activity.methodAccuracy}</span>
            <span class="span3">Collector: ${activity.collector}</span>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <span class="span6">Notes: ${activity.notes}</span>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">
            <h3 style="border-bottom: #eeeeee solid 1px;">Activity types</h3>
            <ul>
                <g:each in="${activity.types}" var="a">
                    <li>${a}</li>
                </g:each>
            </ul>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12 metadata">
            <span class="span6">Created: ${activity.dateCreated}</span>
            <span class="span6">Last updated: ${activity.lastUpdated}</span>
        </div>
    </div>

</div>
</body>
</html>