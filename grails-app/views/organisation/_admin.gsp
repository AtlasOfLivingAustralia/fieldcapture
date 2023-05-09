<div class="row">
    <div class="nav flex-column nav-pills col-3">
        <a class="nav-link active" data-toggle="pill" href="#edit-program-details" id="edit-program-details-tab" role="tab">Edit</a>
        <a class="nav-link" data-toggle="pill" href="#program-permissions" id="permissions-tab" role="tab">Permissions</a>
        <a class="nav-link" data-toggle="pill" href="#config" id="configuration-tab" role="tab">Configuration</a>
    </div>

    <div class="tab-content col-9">
        <div class="tab-pane active" id="edit-program-details">
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
                    <p class="ml-3"><button class="admin-action btn btn-sm btn-danger" style="width:200px;" data-bind="click:deleteOrganisation"><i class="fa fa-remove"></i> Delete</button> Delete this organisation from the system. <strong>This cannot be undone</strong></p>
                </div>
            </g:if>
        </div>

        <div class="tab-pane" id="program-permissions">
            <h4>Add Permissions</h4>

            <div class="row">
                <div class="ml-3 col-sm-6 alert alert-primary">
                    Any user access assigned to this organisation will automatically be applied to all projects managed by this organisation.
                </div>
            </div>
            <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'organisation', action:'addUserAsRoleToOrganisation'), entityType:'au.org.ala.ecodata.Organisation', entityId:organisation.organisationId]"/>
            <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:loadPermissionsUrl, removeUserUrl:g.createLink(controller:'organisation', action:'removeUserWithRoleFromOrganisation'), entityId:organisation.organisationId, user:user]"/>

        </div>

        <div class="tab-pane" id="config">
            <h4 style="display:inline-block">Program configuration</h4> <button class="btn btn-success float-right" data-bind="click:saveOrganisationConfiguration">Save Configuration</button>

            <textarea id="textConfig" rows="80" style="width:100%" data-bind="value:config">

            </textarea>
        </div>

    </div>
</div>
