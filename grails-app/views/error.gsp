<!DOCTYPE html>
<html>
	<head>
		<title>Grails Runtime Exception</title>
		<meta name="layout" content="nrm">
		<link rel="stylesheet" href="${resource(dir: 'css', file: 'errors.css')}" type="text/css">
	</head>
	<body>
    <div id="wrapper" class="container-fluid">
        <h1 style="margin:20px 0;">An error occurred</h1>
        <g:if test="${exception}">
            <g:renderException exception="${exception}" />
        </g:if>
        <g:elseif test="${response.status == 404}">
            <p>404 - The requested page was not found</p>
        </g:elseif>
        <div class="space-before space-after">&nbsp</div>
	</body>
</html>
