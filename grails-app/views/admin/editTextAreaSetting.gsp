<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Edit ${settingTitle} | Data capture | Atlas of Living Australia</title>
		<style type="text/css" media="screen">
		</style>
        <r:require module="bootstrap" />
	</head>
	<body>
        <h3>Edit ${settingTitle}</h3>
        <g:form controller="admin" action="saveTextAreaSetting">
            <g:hiddenField name="settingKey" value="${settingKey}" />
            <div class="row-fluid">
            <g:textArea name="textValue" value="${textValue}" rows="20" cols="120" class="span10">
            </g:textArea>
            </div>
            <div class="row-fluid">
                <a class="btn" href="${createLink(controller:'admin', action:'settings')}">Cancel</a>
                <button class="btn btn-primary">Save</button>
            </div>
        </g:form>
    </body>
</html>
