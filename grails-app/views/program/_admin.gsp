<div class="row">
    <div class="nav flex-column nav-pills col-3">
        <a class="nav-link active" data-toggle="pill" href="#edit-program-details" role="tab">Edit</a>
        <a class="nav-link" data-toggle="pill" href="#program-permissions" role="tab">Permissions</a>
        <g:if test="${fc.userIsSiteAdmin()}">
                <a class="nav-link" data-toggle="pill" href="#reporting" role="tab">Reporting</a>
        </g:if>
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

        </div>


        <div class="tab-pane" id="program-permissions">
            <h4>Add Permissions</h4>

            <div class="row-fluid">
                <div class="span6 alert alert-info">
                    Any user access assigned to this programme will automatically be applied to all projects run under this programme.
                </div>
            </div>
            <g:render template="/admin/addPermissions"
                      model="[addUserUrl: g.createLink(controller: 'program', action: 'addUserAsRoleToProgram'), entityType: 'au.org.ala.ecodata.Program', entityId: program.programId]"/>

            <h4>Current Programme Permissions</h4>
            <g:render template="/admin/permissionTable" model="[
                    loadPermissionsUrl: g.createLink(controller: 'user', action: 'getMembersOfProgram', id: program.programId),
                    removeUserUrl     : g.createLink(controller: 'program', action: 'removeUserWithRoleFromProgram', id:program.programId),
                    entityId          : program.programId, user: user]"/>

        </div>

        <g:if test="${fc.userIsSiteAdmin()}">
        <div class="tab-pane" id="reporting">
            <form>
                <h3>Core services and output reporting frequency</h3>
                <div class="form-group">
                    <label for="start-date">Start date</label>
                    <div>
                    <fc:datePicker class="form-control" id="start-date" name="start-date" targetField="startDate.date" data-validation-engine="validate[required,future[30-06-2018]]"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="end-date">End date</label>
                    <div>
                    <fc:datePicker class="form-control" id="end-date" name="end-date" targetField="endDate.date" data-validation-engine="validate[required,future[start-date]]"/>
                    </div>
                </div>

                <div class="form-group">
                    <label for="core-services-group">Core services reporting group</label>
                    <select class="form-control" id="core-services-group" data-bind="value:coreServicesPeriod, options:coreServicesOptions, optionsText:'label', optionsValue:'label', optionsCaption:'Please select'" data-validation-engine="validate[required]"></select>

                </div>

                <div class="form-group">
                    <label for="progress-reporting-group">Project Output reporting group</label>
                    <select class="form-control" id="progress-reporting-group" data-bind="value:activityReportingPeriod, options:activityReportingOptions, optionsText:'label', optionsValue:'label', optionsCaption:'Please select'" data-validation-engine="validate[required]"></select>

                </div>


                <button class="btn btn-primary" data-bind="click:saveReportingConfiguration">Save</button>
            </form>

            <hr/>
            <g:if test="${fc.userIsAlaOrFcAdmin()}">
            <form class="utilities">
                <h3>Regenerate reports</h3>
                <p>This may need to be done if the report configuration is edited.</p>
                <h4>Program report categories</h4>
                <ul class="list-unstyled" data-bind="foreach:programReportCategories">
                    <li><label class="checkbox"><input type="checkbox" data-bind="value:$data, checked:$parent.selectedProgramReportCategories"> <span data-bind="text:$data"></span></label></li>
                </ul>

                <h4>Project report categories</h4>
                <ul class="list-unstyled" data-bind="foreach:projectReportCategories">
                    <li><label class="checkbox"><input type="checkbox" data-bind="value:$data, checked:$parent.selectedProjectReportCategories"> <span data-bind="text:$data"></span></label></li>
                </ul>

                <button class="btn btn-success" data-bind="click:regenerateReportsByCategory">Regenerate reports</button>
            </form>
            </g:if>
        </div>
        </g:if>
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <div class="tab-pane" id="config">
            <h4 style="display:inline-block">Program configuration</h4> <button class="btn btn-success float-right" data-bind="click:saveProgramConfiguration">Save Configuration</button>

            <textarea rows="80" style="width:100%" data-bind="value:config">

            </textarea>
        </div>
        </g:if>
    </div>
</div>
