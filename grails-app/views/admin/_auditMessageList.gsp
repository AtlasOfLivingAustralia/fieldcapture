<%@ page import="au.org.ala.merit.DateUtils" %>
<div class="row well well-small">
    <g:if test="${messages}">
        <table class="table table-striped table-bordered table-hover w-100" id="audit-message-list">
            <thead>
            <th>Date</th>
            <th>Action</th>
            <th>Type</th>
            <th>Name</th>
            <th>User</th>
            <th></th>
            </thead>
            <tbody>

            <g:each in="${messages}" var="message">
                <tr>
                    <td><!-- ${DateUtils.displayFormatWithTimeNoSpace(message?.date)} --> ${DateUtils.displayFormatWithTime(message?.date)}</td>
                    <td>${message.eventType}</td>
                    <td>${message.entityType?.substring(message.entityType?.lastIndexOf('.')+1)}</td>
                    <td>${message.entity?message.entity[nameKey?:'name']:''} ${message.entity?.type} <small>(${message.entityId})</small></td>
                    <g:set var="displayName" value="${userMap[message.userId] ?: message.userId }" />
                    <td><g:encodeAs codec="HTML">${displayName}</g:encodeAs></td>
                    <td><a class="btn btn-sm" href="${createLink(action:'auditMessageDetails', params:[id:message.id, compareId: message.entity.compareId, searchTerm: searchTerm, returnTo:returnTo])}">
                        <i class="fa fa-search"></i>
                    </a>
                    </td>
                </tr>
            </g:each>
            </tbody>
        </table>

    </g:if>
    <g:else>
            <div class="col-sm-11">
                <div class="p-3 alert-danger text-dark">No messages found!</div>
            </div>

    </g:else>
</div>
