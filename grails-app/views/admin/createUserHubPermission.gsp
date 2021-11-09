<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>User Permission for MERIT</title>
    <asset:stylesheet src="common-bs4.css"/>

</head>
<body>
<content tag="pageTitle">User Permission for MERIT</content>

    <div id="permissions" class="pill-pane tab-pane">
        <h4>Add Permissions</h4>
        <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserToHub', id:hubId), entityId:hubId, hubFlg:hubFlg]"/>
        <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:g.createLink(controller:'user', action:'getMembersOfHub', id:hubId), removeUserUrl:g.createLink(controller:'user', action:'removeUserWithHubRole', id:hubId), user:user]"/>

    </div>

<asset:script>
    populatePermissionsTable();
</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="admin.js"/>
<asset:javascript src="tab-init.js"/>
<asset:javascript src="projects.js"/>
<asset:javascript src="document.js"/>
<asset:javascript src="reporting.js"/>
<asset:javascript src="select2/js/select2.full.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
<asset:javascript src="leaflet-manifest.js"/>
<asset:javascript src="feature.js"/>
<asset:deferredScripts/>

</body>
</html>
