<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${project?.project_name} | Field Capture</title>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" action="index" id="${project.project_id}">${project.project_name}</g:link> <span class="divider">/</span></li>
    <li class="active">Edit</li>
    </ul>
    <div class="row-fluid">
        <div class="page-header">
            <h1>${project?.project_name}</h1>
        </div>
        <g:form action="update" class="form-horizontal"><fieldset>
                <div class="control-group">
                    <label class="control-label">Project description</label>
                    <div class="controls">
                        <g:textArea class="input-xxlarge" name="description" rows="3" cols="50">${project.project_description}</g:textArea>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">External id</label>
                    <div class="controls">
                        <g:textField class="" name="project_external_id" value="${project.project_external_id}"/>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">project manager</label>
                    <div class="controls">
                        <g:textField class="" name="project_manager" value="${project.project_manager}"/>
                    </div>
                </div>
        </fieldset></g:form>
    </div>
</body>
</html>