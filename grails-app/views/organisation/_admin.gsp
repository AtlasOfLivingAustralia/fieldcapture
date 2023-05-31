<div class="row">
    <div class="nav flex-column nav-pills col-3">
        <a class="nav-link active" data-toggle="pill" href="#edit-program-details" id="edit-program-details-tab" role="tab">Edit</a>
        <a class="nav-link" data-toggle="pill" href="#organisation-permissions" id="permissions-tab" role="tab">Permissions</a>
        <a class="nav-link" data-toggle="pill" href="#reporting-config" id="reporting-tab" role="tab">Reporting</a>
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

        <div class="tab-pane" id="organisation-permissions">
            <h4>Add Permissions</h4>

            <div class="row">
                <div class="ml-3 col-sm-6 alert alert-primary">
                    Any user access assigned to this organisation will automatically be applied to all projects managed by this organisation.
                </div>
            </div>
            <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'organisation', action:'addUserAsRoleToOrganisation'), entityType:'au.org.ala.ecodata.Organisation', entityId:organisation.organisationId]"/>
            <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:loadPermissionsUrl, removeUserUrl:g.createLink(controller:'organisation', action:'removeUserWithRoleFromOrganisation'), entityId:organisation.organisationId, user:user]"/>

        </div>
        <div class="tab-pane" id="reporting-config">
            <form>
                <h3>Core services and output reporting frequency</h3>
                <div class="form-group">
                    <label for="start-date">Start date</label>
                    <div class="input-group">
                        <fc:datePicker class="form-control dateControl" id="start-date" name="start-date" bs4="bs4" targetField="startDate.date" data-validation-engine="validate[required,future[30-06-2018]]"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="end-date">End date</label>
                    <div class="input-group">
                        <fc:datePicker class="form-control dateControl" id="end-date" name="end-date" bs4="bs4" targetField="endDate.date" data-validation-engine="validate[required,future[start-date]]"/>
                    </div>
                </div>

                <div class="form-group">
                    <label for="core-services-group">Core services reporting group</label>
                    <select class="form-control" id="core-services-group" data-bind="value:coreServicesPeriod, options:coreServicesOptions, optionsText:'label', optionsValue:'label', optionsCaption:'Please select'" data-validation-engine="validate[required]"></select>
                </div>

                <button class="btn btn-primary" data-bind="click:saveReportingConfiguration">Save</button>

            </form>
            <hr/>
            <form class="utilities">
                <h3>Regenerate reports</h3>
                <p>This may need to be done if the report configuration is edited.</p>
                <h4>Organisation report categories</h4>
                <ul class="list-unstyled" data-bind="foreach:organisationReportCategories">
                    <li><label class="checkbox"><input type="checkbox" data-bind="value:$data, checked:$parent.selectedOrganisationReportCategories"> <span data-bind="text:$data"></span></label></li>
                </ul>

                <button class="btn btn-success" data-bind="click:regenerateReportsByCategory">Regenerate reports</button>
            </form>

        </div>
        <div class="tab-pane" id="config">
            <h4 style="display:inline-block">Program configuration</h4> <button class="btn btn-success float-right" data-bind="click:saveOrganisationConfiguration">Save Configuration</button>

            <textarea id="textConfig" rows="80" style="width:100%" data-bind="value:config">

            </textarea>
        </div>

    </div>
</div>
