<div class="row-fluid">
    <div class="span2 large-space-before">
        <ul id="adminNav" class="nav nav-tabs nav-stacked ">
            <g:if test="${fc.userIsAlaOrFcAdmin()}">
                <li ${activeClass}><a href="#settings" id="settings-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project settings</a></li>
                <g:set var="activeClass" value=""/>
            </g:if>
            <g:if test="${user.isAdmin || user.isCaseManager}">
                <li><a href="#projectDetails" id="projectDetails-tab" data-toggle="tab"><i class="icon-chevron-right"></i> MERI Plan</a></li>
            </g:if>
            <g:if test="${showAnnouncementsTab}">
                <li><a href="#alternateAnnouncements" id="alternateAnnouncements-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project Announcements</a></li>
            </g:if>
            <li><a href="#editProjectBlog" id="editProjectBlog-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Edit Project Blog</a></li>
            <g:if test="${project.newsAndEvents}">
                <li><a href="#editNewsAndEvents" id="editNewsAndEvents-tab" data-toggle="tab"><i class="icon-chevron-right"></i> News and events</a></li>
            </g:if>
            <g:if test="${project.projectStories}">
                <li><a href="#editProjectStories" id="editProjectStories-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project stories</a></li>
            </g:if>
            <g:if test="${user.isAdmin || user.isCaseManager}">
                <li ${activeClass}><a href="#permissions" id="permissions-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project access</a></li>
                <g:if test="${showSpecies}">
                <li><a href="#species" id="species-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Species of interest</a></li>
                </g:if>
                <li><a href="#edit-documents" id="edit-documents-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Documents</a></li>
            </g:if>
            <g:if test="${fc.userIsSiteAdmin()}">
                <li><a href="#project-audit" id="project-audit-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Audit</a></li>
            </g:if>
        </ul>
    </div>
    <div class="span10">
        <div class="pill-content">
            <g:set var="activeClass" value="active"/>
            <g:if test="${fc.userIsAlaOrFcAdmin()}">
                <!-- PROJECT SETTINGS -->
                <div id="settings" class="pill-pane ${activeClass}">
                    <h3>Project Settings</h3>
                    <div class="row-fluid">
                        <div id="save-result-placeholder"></div>
                        <div class="span10 validationEngineContainer" id="settings-validation">
                            <g:render template="editProject"
                                      model="[project: project, canChangeProjectDates:projectContent.admin.canChangeProjectDates]"/>
                        </div>
                    </div>
                </div>
                <g:set var="activeClass" value=""/>
            </g:if>

        <!-- MERI PLAN -->
            <g:if test="${user.isAdmin || user.isCaseManager}">
                <div id="projectDetails" class="pill-pane">
                    <!-- Edit project details -->
                    <h3>MERI Plan</h3>
                    <g:render template="/shared/restoredData" model="[id:'restoredData', saveButton:'Save', cancelButton:'Cancel']"/>
                    <div class="row-fluid">
                        <div class="validationEngineContainer" id="project-details-validation">
                            <g:render template="editMeriPlan" model="[project: project]"/>
                        </div>
                    </div>
                </div>
            </g:if>
            <g:if test="${showAnnouncementsTab}">
                <div id="alternateAnnouncements" class="pill-pane">
                    <div id="announcement-result-placeholder"></div>
                    <g:render template="announcements" model="[project: project]"/>
                </div>
            </g:if>
            <div id="editProjectBlog" class="pill-pane">
                <h3>Edit Project Blog</h3>
                <g:render template="/blog/blogSummary" model="${[blog:project.blog?:[]]}"/>
            </div>
            <g:if test="${project.newsAndEvents}">
                <div id="editNewsAndEvents" class="pill-pane">
                    <g:render template="editProjectContent" model="${[attributeName:'newsAndEvents', header:'News and events']}"/>
                </div>
            </g:if>
            <g:if test="${project.projectStories}">
                <div id="editProjectStories" class="pill-pane">
                    <g:render template="editProjectContent" model="${[attributeName:'projectStories', header:'Project stories']}"/>
                </div>
            </g:if>
            <g:if test="${user.isAdmin || user.isCaseManager}">
                <div id="permissions" class="pill-pane ${activeClass}">
                    <h3>Project Access</h3>
                    <h4>Add Permissions</h4>
                    <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserAsRoleToProject'), entityId:project.projectId]"/>
                    <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:g.createLink(controller:'project', action:'getMembersForProjectId', id:project.projectId), removeUserUrl:g.createLink(controller:'user', action:'removeUserWithRoleFromProject'), entityId:project.projectId, user:user]"/>
                </div>
                <!-- SPECIES -->
                <g:if test="${showSpecies}">
            %{--<div class="border-divider large-space-before">&nbsp;</div>--}%
                <div id="species" class="pill-pane">
                    %{--<a name="species"></a>--}%
                    <g:render template="/species/species" model="[project:project]"/>
                </div>
                </g:if>
                <!-- DOCUMENTS -->
                <div id="edit-documents" class="pill-pane">
                    <div class="span10 attachDocumentModal">
                        <h3 style="display:inline-block">Project Documents</h3>
                        <button class="btn btn-info pull-right" style="margin-top:20px;" id="doAttach" data-bind="click:attachDocument">Attach Document</button>
                    </div>
                    <div class="clearfix"></div>
                    <hr/>
                    <div class="row-fluid">
                        <div class="span10">
                            <g:render template="/shared/editDocuments"
                                      model="[useExistingModel: true,editable:true, filterBy: 'all', ignore: '', imageUrl:assetPath(src:'filetypes'),containerId:'adminDocumentList']"/>
                        </div>
                    </div>
                    %{--The modal view containing the contents for a modal dialog used to attach a document--}%
                    <g:render template="/shared/attachDocument"/>

                </div>
            </g:if>
            <g:if test="${fc.userIsSiteAdmin()}">
                <!-- Audit -->
                <div id="project-audit" class="pill-pane">
                    <g:render template="/project/audit"/>
                </div>
            </g:if>
        </div>
    </div>
</div>