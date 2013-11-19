<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Audit Message Detail | Data capture | Atlas of Living Australia</title>
		<style type="text/css" media="screen">
		</style>
	</head>
	<body>
        <h3>Audit Message - ${message?.id}</h3>
        <div class="row-fluid">
            <div class="span4">
                <strong>Date:</strong>
                ${message.date}
            </div>
            <div class="span4">
                <Strong>User:</Strong>
                ${userDetails.displayName}
                (<g:encodeAs codec="HTML">${message.userId ?: '<anon>'}</g:encodeAs>)
            </div>
            <div class="span4">
                <Strong>Project:</Strong>
                <g:encodeAs codec="HTML">${message.projectId}</g:encodeAs>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span4">
                <strong>Event Type:</strong>
                ${message.eventType}
            </div>
            <div class="span4">
                <strong>Object Type:</strong>
                ${message.entityType}
            </div>
            <div class="span4">
                <Strong>Object Id:</Strong>
                <g:encodeAs codec="HTML">${message.entityId}</g:encodeAs>
            </div>
            <div class="span4">
            </div>
        </div>

        <div class="well well-small">
            <fc:renderJsonObject object="${message.entity}" />
        </div>

    </body>
</html>
