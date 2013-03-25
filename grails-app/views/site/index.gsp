<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${site?.name} | Field Capture</title>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><g:link controller="project" action="index" id="${site.projectId}">${site.projectName}</g:link><span class="divider">/</span></li>
        <li class="active">${site.name}</li>
    </ul>
    <div class="container-fluid">
    <div class="row-fluid">
        <div class="page-header span9">
            <h1>${site?.name}</h1>
            <p class="well well-small">${site.description}</p>
        </div>
        <div class="span2 clearfix">
            <g:link action="edit" id="${site.siteId}" class="btn">Edit site</g:link>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <span class="span3">External Id: ${site.externalId}</span>
            <span class="span3">Type: ${site.type}</span>
            <span class="span3">Area: ${site.area}</span>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <span class="span6">Notes: ${site.notes}</span>
            <span class="span3">${site.location?.size()} locations.</span>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">
            <h3 style="border-bottom: #eeeeee solid 1px;">Activities</h3>
        </div>
    </div>
    </div>
</body>
</html>