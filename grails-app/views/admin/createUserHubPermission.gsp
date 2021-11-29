<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>User Permissions for MERIT</title>
    <script>
        var fcConfig = {
            loadPermissionsUrl: "${createLink(controller:'user', action:'getMembersOfHub')}",
            getMembersForHubPaginatedUrl: "${createLink(controller: 'user', action: 'getMembersForHubPaginated')}",
            removeHubUserUrl: "${createLink(controller: 'user', action: 'removeUserWithHubRole')}",
            updateHubUser: "${createLink(controller: 'user', action: 'addUserToHub')}"
        };
    </script>
<asset:stylesheet src="common-bs4.css"/>
</head>
<body>
<content tag="pageTitle">User Permissions for MERIT</content>
<div class="merit-header">
    <h2>User Permissions for MERIT</h2>
</div>
<div><span id="alert" class="alert alert-success"></span></div>
<div id="permissions">
    <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserToHub'), entityId:hubId]"/>
    <g:render template="/admin/permissionTablePaginated"/>
</div>


<asset:script>
%{--    populatePermissionsTable();--}%
</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:deferredScripts/>

</body>
</html>
