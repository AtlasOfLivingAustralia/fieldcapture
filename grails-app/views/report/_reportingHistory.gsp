<%@ page import="au.org.ala.fieldcapture.DateUtils" %>
<html>

<head>

</head>

<g:if test="${reportingHistory}">
<table id="reportHistory" class="table table-striped">
    <thead>
        <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Date</th>
            <th>User</th>
        </tr>
    </thead>
    <tbody>
        <g:each in="${reportingHistory}" var="change">
            <tr>
                <td>${change.name}</td>
                <td>${change.status}</td>
                <td>${au.org.ala.fieldcapture.DateUtils.isoToDisplayFormat(change.date)}</td>
                <td>${change.who}</td>
            </tr>
        </g:each>
    </tbody>
</table>
</g:if>
<g:else>
    <em>There is no reporting history for this project</em>
</g:else>

</html>