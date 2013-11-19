<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Audit Project | Data capture | Atlas of Living Australia</title>
		<style type="text/css" media="screen">
		</style>
	</head>
	<body>
        <h3>Project Audit - ${project.name}</h3>
        <div class="well well-small">
            <g:if test="${messages}">
                <table>
                    <thead>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Object type</th>
                        <th>Object ID</th>
                        <th>User</th>
                        <th/>
                    </thead>
                    <tbody>
                        <g:each in="${messages}" var="message">
                            <tr>
                                <td>${message.date}</td>
                                <td>${message.eventType}</td>
                                <td>${message.entityType?.substring(message.entityType?.lastIndexOf('.')+1)}</td>
                                <td>${message.entityId}</td>
                                <g:set var="displayName" value="${userMap[message.userId] ?: message.userId }" />
                                <td><g:encodeAs codec="HTML">${displayName}</g:encodeAs></td>
                                <td>
                                    <a class="btn btn-small" href="${createLink(action:'auditMessageDetails', params:[id:message.id])}">
                                        <i class="icon-search"></i>
                                    </a>
                                </td>
                            </tr>
                        </g:each>
                    </tbody>
                </table>

            </g:if>
            <g:else>
                <div>No messages found!</div>
            </g:else>
        </div>

        <div class="row-fluid">
            <div class="span12">
                <a href="${createLink(action:'audit')}" class="btn">Back</a>
            </div>
        </div>
    </body>
</html>
