<div class="row">
    <div class="nav flex-column nav-pills col-3">
        <a class="nav-link active" data-toggle="pill" href="#edit-managementUnit-details" role="tab">Edit</a>
        <a class="nav-link" data-toggle="pill" href="#managementUnit-permissions" role="tab">Permissions</a>
        <a id="editManagementUnitBlog-tab" class="nav-link" data-toggle="pill" href="#editManagementUnitBlog" role="tab">Edit Blog</a>
        <a id="edit-documents-tab" class="nav-link" data-toggle="pill" href="#edit-documents" role="tab">Documents</a>
        <g:if test="${fc.userIsSiteAdmin()}">
                <a class="nav-link" data-toggle="pill" href="#reporting" role="tab">Reporting</a>
        </g:if>
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
            <a class="nav-link" data-toggle="pill" href="#config" role="tab">Configuration</a>
        </g:if>
    </div>

    <div class="tab-content col-9">
        <div class="tab-pane active" id="edit-managementUnit-details">
            <h4>Administrator actions</h4>

            <div class="row">
                <div class="col-sm-2">
                    <a class="btn btn-info btn-small admin-action" href="${g.createLink(action: 'edit', id:mu.managementUnitId)}"><i
                            class="fa fa-edit"></i> Edit</a>
                </div>

                <div class="col-sm-10">Edit the management unit details and content</div>
            </div>

        </div>


        <div class="tab-pane" id="managementUnit-permissions">
            <h4>Add Permissions</h4>

            <div class="row-fluid">
                <div class="span6 alert alert-info">
                    Any user access assigned to this management unit will automatically be applied to all projects run under this management unit.
                </div>
            </div>
            <g:render template="/admin/addPermissions"
                      model="[addUserUrl: g.createLink(controller: ' managementUnit', action: 'addUserAsRoleToManagementUnit'), entityType: 'au.org.ala.ecodata.ManagementUnit', entityId: mu.managementUnitId]"/>

            <h4>Current Management Unit Permissions</h4>
            <g:render template="/admin/permissionTable" model="[
                    loadPermissionsUrl: g.createLink(controller: 'user', action: 'getMembersOfManagementUnit', id: mu.managementUnitId),
                    removeUserUrl     : g.createLink(controller: ' managementUnit', action: 'removeUserWithRoleFromManagementUnit', id:mu.managementUnitId),
                    entityId          : mu.managementUnitId, user: user]"/>

        </div>

        <g:if test="${fc.userIsAlaOrFcAdmin() || blog.editable}">
            <div class="tab-pane" id="editManagementUnitBlog">
                <div id="editProjectBlog" class="pill-pane">
                    <h3>Edit Blog</h3>
                    <g:render template="/blog/blogSummary" model="${[blog:mu.blog?:[]]}"/>
                </div>
            </div>
        </g:if>

        <!-- DOCUMENTS -->

    <!-- ko stopBinding:true -->
        <div id="edit-documents" class="tab-pane">
            <div class="attachDocumentModal">
                <div class="row">
                    <h3 class="col-3 d-inline-block">Documents</h3>
                    <form class="col-9 form-inline justify-content-end">

                        <label class="col-auto col-form-label">Filter documents:
                            <select class="form-control" data-bind="optionsCaption:'No filter', options:documentRoles, optionsText:'name', optionsValue:'id', value:documentFilter"></select>
                        </label>
                        <button class="btn btn-info form-control" id="doAttach" data-bind="click:attachDocument">Attach Document</button>

                    </form>
                </div>
            </div>
            <div class="clearfix"></div>
            <hr/>
            <div class="row-fluid">
                <div class="span10">

                    <g:render template="/shared/editDocuments"
                              model="[useExistingModel: true, documents: mu.documents, editable:true, filterBy: 'all', ignore: '', imageUrl:assetPath(src:'filetypes'),containerId:'adminDocumentList']"/>

                </div>
            </div>
            %{--The modal view containing the contents for a modal dialog used to attach a document--}%
            <g:render template="/shared/attachDocument"/>

        </div>
    <!-- /ko -->


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
                <h4>Management Unit report categories</h4>
                <ul class="list-unstyled" data-bind="foreach:managementUnitReportCategories">
                    <li><label class="checkbox"><input type="checkbox" data-bind="value:$data, checked:$parent.selectedManagementUnitReportCategories"> <span data-bind="text:$data"></span></label></li>
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
            <h4 style="display:inline-block">Management Unit configuration</h4> <button class="btn btn-success float-right" data-bind="click:saveManagementUnitConfiguration">Save Configuration</button>

            <textarea rows="80" style="width:100%" data-bind="value:config">

            </textarea>
        </div>
        </g:if>
    </div>
</div>
