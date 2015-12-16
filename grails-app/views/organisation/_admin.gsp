
        <h4>Administrator actions</h4>
    <div class="row-fluid">
        <p><button class="btn btn-info btn-small admin-action" style="width:200px;" data-bind="click:editOrganisation"><i class="icon-edit icon-white"></i> Edit</button> Edit the organisation details and content</p>
        <g:if test="${showEditAnnoucements}">
        <p><a href="${g.createLink(action:'editAnnouncements',id:organisation.organisationId)}"><button class="btn btn-small btn-info admin-action" style="width:200px;"><i class="icon-edit icon-white"></i> Edit Announcements</button></a> Bulk edit the announcements for all projects managed by this organisation</p>
        </g:if>
        <g:if test="${fc.userIsAlaOrFcAdmin()}"><p><button class="admin-action btn btn-small btn-danger" style="width:200px;" data-bind="click:deleteOrganisation"><i class="icon-remove icon-white"></i> Delete</button> Delete this organisation from the system. <strong>This cannot be undone</strong></p></g:if>
    </div>
    <h4>Add Permissions</h4>
    <div class="row-fluid">
        <div class="span6 alert alert-info">
            Any user access assigned to this organisation will automatically be applied to all projects managed by this organisation.
        </div>
    </div>
    <g:render template="/admin/addPermissions" plugin="fieldcapture-plugin" model="[addUserUrl:g.createLink(controller:'organisation', action:'addUserAsRoleToOrganisation'), entityType:'au.org.ala.ecodata.Organisation', entityId:organisation.organisationId]"/>
    <g:render template="/admin/permissionTable" plugin="fieldcapture-plugin" model="[loadPermissionsUrl:loadPermissionsUrl, removeUserUrl:g.createLink(controller:'organisation', action:'removeUserWithRoleFromOrganisation'), entityId:organisation.organisationId, user:user]"/>
