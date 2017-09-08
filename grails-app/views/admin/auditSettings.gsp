<%@ page import="au.org.ala.merit.DateUtils" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Audit Settings | MERIT | Atlas of Living Australia</title>
        <asset:stylesheet src="audit.css"/>
	</head>
	<body>

        <h3>Settings and Site Blog Audit</h3>


        <div class="row">
            <div class="span12 text-right">
                <a href="${createLink(action:'audit')}" class="btn btn-default btn-small"><i class="icon-backward"></i> Back</a>
            </div>
        </div>

        <g:set var="returnTo" value="${createLink(action:'auditSettings')}"/>

        <g:render template="auditMessageList"></g:render>

        <asset:javascript src="audit.js"/>

    </body>
</html>

