<%@ page import="au.org.ala.merit.DateUtils" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>${organisation?.name} | Admin | MERIT</title>
        <asset:stylesheet src="audit.css"/>
	</head>
	<body>
    <content tag="pageTitle">Audit</content>
        <g:set var="searchTerm" value="${params.searchTerm}"/>


        <h3>Organisation Audit - ${organisation.name}</h3>


        <div class="row">
            <div class="col-sm-12 text-right">
                <a href="${createLink(action:'auditOrganisationSearch',params:[searchTerm: searchTerm])}" class="btn btn-default btn-sm"><i class="fa fa-backward"></i> Back</a>
            </div>
        </div>

        <g:set var="returnTo" value="${createLink(action:'auditOrganisation', id:organisation.organisationId, params:[searchTerm:params.searchTerm])}"/>
        <g:render template="auditMessageList"></g:render>

        <asset:javascript src="audit.js"/>
    </body>
</html>

