<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${project?.project_name} | Field Capture</title>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li class="active">${project.project_name}</li>
</ul>
    <div class="row-fluid">
        <div class="page-header span9">
            <h1>${project?.project_name}</h1>
            <p class="well well-small">${project.project_description}</p>
        </div>
        <div class="span2 clearfix">
            <g:link action="edit" id="${project.project_id}" class="btn">Edit project</g:link>
        </div>
        <div class="span4">
            <h2>Activities</h2>
            <ul class="unstyled">
                <li>activity 1</li>
                <li>activity 2</li>
                <li>activity 3</li>
            </ul>
        </div>
        <div class="span4">
            <h2>Sites</h2>
            <ul class="unstyled">
                <li>${project.project_sites}</li>
                <li>another site</li>
            </ul>
        </div>
    </div>
</body>
</html>