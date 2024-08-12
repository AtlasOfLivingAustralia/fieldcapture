<div class="row">
    <div class="nav flex-column nav-pills col-3">
        <g:if test="${!fc.userHasReadOnlyAccess()}">
        <a class="nav-link active" data-toggle="pill" href="#edit-program-details" id="edit-program-details-tab" role="tab">Edit</a>
        </g:if>
        <a class="nav-link" data-toggle="pill" href="#organisation-permissions" id="organisation-permissions-tab" role="tab">Permissions</a>
        <a id="edit-documents-tab" class="nav-link" data-toggle="pill" href="#edit-documents" role="tab">Documents</a>
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
            <a class="nav-link" data-toggle="pill" href="#reporting-config" id="reporting-config-tab" role="tab">Reporting</a>
            <a class="nav-link" data-toggle="pill" href="#config" id="config-tab" role="tab">Configuration</a>
        </g:if>


    </div>

    <div class="tab-content col-9">
<g:if test="${!fc.userHasReadOnlyAccess()}">
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
</g:if>

        <div class="tab-pane" id="organisation-permissions">
            <h4>Add Permissions</h4>

            <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'organisation', action:'addUserAsRoleToOrganisation'), entityType:'au.org.ala.ecodata.Organisation', entityId:organisation.organisationId]"/>
            <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:loadPermissionsUrl, removeUserUrl:g.createLink(controller:'organisation', action:'removeUserWithRoleFromOrganisation'), entityId:organisation.organisationId, user:user]"/>

        </div>

        <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <div class="tab-pane" id="reporting-config">
            <form>
                <h3>Reporting configuration</h3>
                <div class="form-group">
                    <div class="input-group">
                        <button id="enable-reporting" class="btn btn-success" data-bind="enable:!isReportingEnabled() && availableReportCategories.length > 0, click:enableReporting">Enable Reporting</button>
                    </div>
                </div>


                <div class="form-group">
                    <label for="start-date">Start date</label>
                    <div class="input-group">
                        <fc:datePicker class="form-control dateControl" id="start-date" name="start-date" bs4="bs4" targetField="startDate.date" data-validation-engine="validate[required,future[30-06-2018]]" autocomplete="off"/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="end-date">End date</label>
                    <div class="input-group">
                        <fc:datePicker class="form-control dateControl" id="end-date" name="end-date" bs4="bs4" targetField="endDate.date" data-validation-engine="validate[required,future[start-date]]" autocomplete="off"/>
                    </div>
                </div>

                <button class="btn btn-primary" data-bind="enable:isReportingEnabled(), click:saveReportingConfiguration">Save</button>

            </form>
            <hr/>
            <form class="utilities">
                <h3>Regenerate reports</h3>
                <p>This will need to be done after report configuration is edited.</p>
                <h4>Organisation report categories</h4>
                <ul class="categories-to-regenerate list-unstyled" data-bind="foreach:organisationReportCategories">
                    <li><label class="checkbox"><input type="checkbox" data-bind="enable:!$data.adhoc, value:$data.category, checked:$parent.selectedOrganisationReportCategories"> <span data-bind="text:$data.category"></span></label></li>
                </ul>

                <button id="generate-reports" class="btn btn-success" data-bind="enable:selectedOrganisationReportCategories().length, click:regenerateReportsByCategory">Regenerate reports</button>
            </form>

        </div>

            <div class="tab-pane" id="config">
                <h4 style="display:inline-block">Organisation configuration</h4> <button class="btn btn-success float-right" data-bind="click:saveOrganisationConfiguration">Save Configuration</button>

                <textarea id="textConfig" rows="80" style="width:100%" data-bind="value:config">

                </textarea>
            </div>
        </g:if>


        <g:if test="${fc.userHasReadOnlyAccess() && !fc.userIsAlaAdmin()}">
        <!-- ko stopBinding:true -->
        <div id="edit-documents" class="tab-pane">
            <div class="attachDocumentModal">
                <div class="row">
                    <h3 class="col-3 d-inline-block">Documents</h3>
                    <form class="col-9 form-inline justify-content-end">

                        <label class="col-auto col-form-label">Filter documents:
                            <select class="form-control form-control-sm" data-bind="optionsCaption:'No filter', options:documentRoles, optionsText:'name', optionsValue:'id', value:documentFilter"></select>
                        </label>
                    </form>
                </div>
            </div>
            <div class="clearfix"></div>
            <hr/>
            <div class="row-fluid">
                <div class="span10">

                    <g:render template="/shared/editDocuments"
                              model="[useExistingModel: true, documents: organisation.documents, editable:false, filterBy: 'all', ignore: '', imageUrl:assetPath(src:'filetypes'),containerId:'adminDocumentList']"/>
                    %{--The modal view containing the contents for a modal dialog used to attach a document--}%
                    <g:render template="/shared/attachDocument"/>

                </div>
            </div>
        </div>
        <!-- /ko -->
        </g:if>
        <g:else>
            <!-- ko stopBinding:true -->
            <div id="edit-documents" class="tab-pane">
                <div class="attachDocumentModal">
                    <div class="row">
                        <h3 class="col-3 d-inline-block">Documents</h3>
                        <form class="col-9 form-inline justify-content-end">

                            <label class="col-auto col-form-label">Filter documents:
                                <select class="form-control form-control-sm" data-bind="optionsCaption:'No filter', options:documentRoles, optionsText:'name', optionsValue:'id', value:documentFilter"></select>
                            </label>
                            <button class="btn btn-info btn-sm form-control" id="doAttach" data-bind="click:attachDocument">Attach Document</button>

                        </form>
                    </div>
                </div>
                <div class="clearfix"></div>
                <hr/>
                <div class="row-fluid">
                    <div class="span10">

                        <g:render template="/shared/editDocuments"
                                  model="[useExistingModel: true, documents: organisation.documents, editable:true, filterBy: 'all', ignore: '', imageUrl:assetPath(src:'filetypes'),containerId:'adminDocumentList']"/>

                    </div>
                </div>
                %{--The modal view containing the contents for a modal dialog used to attach a document--}%
                <g:render template="/shared/attachDocument"/>

            </div>
            <!-- /ko -->
        </g:else>
    </div>
</div>
