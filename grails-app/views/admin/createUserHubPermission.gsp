<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>User Permission for MERIT</title>
    <script>
        var fcConfig = {
            loadPermissionsUrl: "${createLink(controller:'user', action:'getMembersOfHub')}",
            getMembersForHubPaginatedUrl: "${createLink(controller: 'user', action: 'getMembersForHubPaginated')}",
            removeUserUrl: "${createLink(controller: 'user', action: 'removeUserWithHubRole')}"

        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<content tag="pageTitle">User Permission for MERIT</content>
<div id="permissions" class="pill-pane tab-pane">
    <h4>Add Permissions</h4>
    <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserToHub'), entityId:hubId]"/>
%{--    <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:g.createLink(controller:'user', action:'getMembersOfHub', id:hubId), removeUserUrl:g.createLink(controller:'user', action:'removeUserWithHubRole'), entityId:hubId, user:user]"/>--}%
    <g:render template="/admin/permissionTablePaginated"/>

</div>



<asset:script>
%{--    populatePermissionsTable();--}%
</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:deferredScripts/>

</body>
</html>
