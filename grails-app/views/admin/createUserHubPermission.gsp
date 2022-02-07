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
    <div class="merit-subheader">
        <h4>Add permissions for a user</h4>
    </div>
    <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserToHub'), entityId:hubId, containerId:'member-list']"/>
    <div class="merit-subheader">
        <h4>Edit and remove permissions for a user</h4>
    </div>

    <g:render template="/admin/permissionTablePaginated" model="[containerId:'member-list']"/>
</div>

<asset:javascript src="common-bs4.js"/>
<asset:deferredScripts/>
</body>
</html>
