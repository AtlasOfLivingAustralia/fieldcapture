<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${project?.name} | Projects | Field Capture</title>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" action="index" id="${project.projectId}">${project.name}</g:link> <span class="divider">/</span></li>
    <li class="active">Edit</li>
    </ul>
    <div class="row-fluid">
        <div class="page-header">
            <h1>${project?.name}</h1>
        </div>
        <g:form action="update" class="form-horizontal"><fieldset>
            <g:hiddenField name="id" value="${project.projectId}"/>
            <div class="control-group">
                <label class="control-label">Project description</label>
                <div class="controls">
                    <g:textArea class="input-xxlarge" name="description" rows="3" cols="50">${project.description ?: ''}</g:textArea>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">External id</label>
                <div class="controls">
                    <g:textField class="" name="externalId" value="${project.externalId}"/>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">project manager</label>
                <div class="controls">
                    <g:textField class="" name="manager" value="${project.manager}"/>
                </div>
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </fieldset></g:form>
    </div>
</body>
</html>