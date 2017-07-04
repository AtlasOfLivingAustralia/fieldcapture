<%@ page import="au.org.ala.merit.DateUtils" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Audit Project | Data capture | Atlas of Living Australia</title>
		<style type="text/css" media="screen">
		</style>
	</head>
	<body>
        <r:require modules="jquery_bootstrap_datatable"/>
        <g:set var="searchTerm" value="${params.searchTerm}"/>

        <div class="row">
             <h3>Project Audit - ${project.name}</h3>
             <h4>Grant Id : ${project.grantId}</h4>
             <h4>External Id : ${project.externalId}</h4>
        </div>

        <div class="row">
            <div class="span12 text-right">
                <a href="${createLink(action:'auditProjectSearch',params:[searchTerm: searchTerm])}" class="btn btn-default btn-small"><i class="icon-backward"></i> Back</a>
            </div>
        </div>

    <g:set var="returnTo" value="${createLink(action:'auditProject', id:project.projectId, params:[searchTerm:params.searchTerm])}"/>

    <g:render template="auditMessageList"></g:render>

    </body>
</html>

