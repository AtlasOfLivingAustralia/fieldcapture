<div class="row">
    <div class="nav flex-column nav-pills col-3">
        <a class="nav-link active" data-toggle="pill" href="#edit-program-details" role="tab">Edit</a>
        <a class="nav-link" data-toggle="pill" href="#program-permissions" role="tab">Permissions</a>
        <a class="nav-link" data-toggle="pill" href="#reporting" role="tab">Reporting</a>
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
            <a class="nav-link" data-toggle="pill" href="#config" role="tab">Configuration</a>
        </g:if>
    </div>

    <div class="tab-content col-9">
        <div class="tab-pane active" id="edit-program-details">
            <h4>Administrator actions</h4>

            <div class="row">
                <div class="col-sm-2">
                    <a class="btn btn-info btn-small admin-action" href="${g.createLink(action: 'edit', id:program.programId)}"><i
                            class="fa fa-edit"></i> Edit</a>
                </div>

                <div class="col-sm-10">Edit the programme details and content</div>
            </div>

            <g:if test="${fc.userIsAlaOrFcAdmin()}">
                <div class="row">
                    <div class="col-sm-2">
                        <button class="admin-action btn btn-small btn-danger" data-bind="click:deleteProgram"><i class="fa fa-remove"></i> Delete</button>
                    </div>
                    <div class="col-sm-10">
                        Delete this program from the system. <strong>This cannot be undone</strong>
                    </div>
                </div>
            </g:if>
        </div>


        <div class="tab-pane" id="program-permissions">
            <h4>Add Permissions</h4>

            <div class="row-fluid">
                <div class="span6 alert alert-info">
                    Any user access assigned to this programme will automatically be applied to all projects run under this programme.
                </div>
            </div>
            <g:render template="/admin/addPermissions"
                      model="[addUserUrl: g.createLink(controller: 'user', action: 'addUserAsRoleToProgram'), entityType: 'au.org.ala.ecodata.Program', entityId: program.programId]"/>

            <h4>Current Programme Permissions</h4>
            <g:render template="/admin/permissionTable" model="[
                    loadPermissionsUrl: g.createLink(controller: 'user', action: 'getMembersOfProgram', id: program.programId),
                    removeUserUrl     : g.createLink(controller: 'user', action: 'removeUserWithRoleFromProgram'),
                    entityId          : program.programId, user: user]"/>

        </div>

        <div class="tab-pane" id="reporting">
            <form>
                <div class="form-group">
                    <label for="first-reporting-date">Date first milestone report is due</label>
                    <fc:datePicker class="form-control" targetField="firstMilestoneDate.date" id="first-reporting-date" data-validation-engine="validate[required]"/>

                </div>
                <div class="form-group">
                    <label for="milestone-reporting-period">Reporting period (months)</label>
                    <input type="number" class="form-control" data-bind="value:milestonePeriod" id="milestone-reporting-period" data-validation-engine="validate[required,custom[integer]]">

                </div>
                <div class="form-group">
                    <label for="core-services-reporting-period">Core services reporting period (months)</label>
                    <input type="number" class="form-control"  id="core-services-reporting-period">
                </div>
                <button class="btn btn-primary" data-bind="click:saveReportingConfiguration">Save</button>
            </form>
        </div>
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <div class="tab-pane" id="config">
            <h4 style="display:inline-block">Program configuration</h4> <button class="btn btn-success float-right" data-bind="click:saveProgramConfiguration">Save Configuration</button>

            <textarea rows="80" style="width:100%" data-bind="value:config">

            </textarea>
        </div>
        </g:if>
    </div>
</div>
