
        <h4>Administrator actions</h4>
    <div class="row">
        <p class="ml-3"><button class="btn btn-info btn-sm admin-action" style="width:200px;" data-bind="click:editOrganisation"><i class="fa fa-edit"></i> Edit</button> Edit the organisation details and content</p>
    </div>
        <g:if test="${showEditAnnoucements}">
            <div class="row">
                <p class="ml-3"><a href="${g.createLink(action:'editAnnouncements',id:organisation.organisationId)}"><button class="btn btn-sm btn-info admin-action" style="width:200px;"><i class="fa fa-edit"></i> Edit Announcements</button></a> Bulk edit the announcements for all projects managed by this organisation</p>
            </div>
        </g:if>
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
            <div class="row">
                <p class="ml-3"><button class="admin-action btn btn-sm btn-danger" style="width:200px;" data-bind="click:deleteOrganisation"><i class="fa fa-remove"></i> Delete</button> Delete this organisation from the system. <strong>This cannot be undone</strong></p></g:if>

        </div>
    <h4>Add Permissions</h4>

    <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'organisation', action:'addUserAsRoleToOrganisation'), entityType:'au.org.ala.ecodata.Organisation', entityId:organisation.organisationId]"/>
    <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:loadPermissionsUrl, removeUserUrl:g.createLink(controller:'organisation', action:'removeUserWithRoleFromOrganisation'), entityId:organisation.organisationId, user:user]"/>
