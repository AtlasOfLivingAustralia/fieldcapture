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
            removeHubUserUrl: "${createLink(controller: 'user', action: 'removeUserWithHubRole')}",
            userExpiryUrl: "${createLink(controller: 'user', action: 'addUserToHub')}"

        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<content tag="pageTitle">User Permission for MERIT</content>
<div class="com-sm-5">
    <div id="formStatus" class="hide d-none alert alert-success">
        <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
        <span></span>
    </div>
</div>
<div id="permissions" class="pill-pane tab-pane">
    <h4>Add Permissions</h4>
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
