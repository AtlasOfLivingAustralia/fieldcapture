<%@ page import="au.org.ala.merit.DateUtils" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>${project?.name} | Audit Project | Admin | MERIT</title>
		<asset:stylesheet src="audit.css"/>
        <script disposition="head">
        var fcConfig = {
                auditSearchUrl: "${createLink(action:'searchProjectAuditMessages',id:project?.projectId)}",
                auditMessageUrl: "${createLink(action:'auditMessageDetails')}"
        };
        </script>
	</head>
	<body>
    <content tag="pageTitle">Audit</content>

        <g:set var="searchTerm" value="${params.searchTerm}"/>

        <div class="row">
        <div class="col-sm-12"><h3>Project Audit - ${project.name}</h3></div>

        <div class="col-sm-12"><h4>Grant Id : ${project.grantId}</h4></div>

        <div class="col-sm-12"><h4>External Id : ${project.externalId}</h4></div>



        </div>

        <div class="row">
            <div class="col-sm-12 text-right">
                <a href="${createLink(action:'auditProjectSearch',params:[searchTerm: searchTerm])}" class="btn btn-default btn-sm float-right"><i class="fa fa-backward"></i> Back</a>
            </div>
        </div>

    <g:set var="returnTo" value="${createLink(action:'auditProject', id:project.projectId, params:[searchTerm:params.searchTerm])}"/>

    <g:render template="auditMessageListWithServerSidePagination"></g:render>

    <asset:javascript src="base-bs4.js"/>
    <asset:javascript src="audit.js"/>

    <asset:script>
        var config = {
            auditSearchUrl: fcConfig.auditSearchUrl,
            auditMessageUrl: fcConfig.auditMessageUrl
        };
        $(document).ready(function() {
            initialiseAuditTableServerSide(config);
        });
    </asset:script>
    <asset:deferredScripts/>
    </body>
</html>

