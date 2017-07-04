<%@ page import="au.org.ala.merit.DateUtils" %>
<div class="row well well-small">
    <g:if test="${messages}">
        <table style="width: 95%;" class="table table-striped table-bordered table-hover" id="audit-message-list">
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
                    <td><a class="btn btn-small" href="${createLink(action:'auditMessageDetails', params:[id:message.id, compareId: message.entity.compareId, searchTerm: searchTerm, returnTo:returnTo])}">
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

<r:script type="text/javascript">
    $(document).ready(function() {
        $('#audit-message-list').DataTable({
            "order": [[ 0, "desc" ]],
            "aoColumnDefs": [{ "sType": "date-uk", "aTargets": [0] }],
            "oLanguage": {
                "sSearch": "Search: "
            }
        });
        $('.dataTables_filter input').attr("placeholder", "Date, Action, Type, Name, User");
    });
</r:script>