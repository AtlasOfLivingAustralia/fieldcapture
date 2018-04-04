<h4>Administrator actions</h4>
<div class="row-fluid">
    <p><a class="btn btn-info btn-small admin-action" href="${g.createLink(action:'edit')}"><i class="icon-edit icon-white"></i> Edit</a> Edit the programme details and content</p>
    <g:if test="${fc.userIsAlaOrFcAdmin()}"><p><button class="admin-action btn btn-small btn-danger" data-bind="click:deleteProgram"><i class="icon-remove icon-white"></i> Delete</button> Delete this program from the system. <strong>This cannot be undone</strong></p></g:if>
</div>
<h4>Add Permissions</h4>
<div class="row-fluid">
    <div class="span6 alert alert-info">
        Any user access assigned to this programme will automatically be applied to all projects run under this programme.
    </div>
</div>
<g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserAsRoleToProgram'), entityType:'au.org.ala.ecodata.Program', entityId:program.programId]"/>
<g:render template="/admin/permissionTable" model="[
        loadPermissionsUrl:g.createLink(controller:'program', action:'getMembersOfProgram'),
        removeUserUrl:g.createLink(controller:'user', action:'removeUserWithRoleFromProgram'),
        entityId:program.programId, user:user]"/>
