<div class="row">
    <div id="adminNav" class="nav flex-column nav-pills col-sm-2 pl-2 pr-0">
        <g:if test="${fc.userIsAlaOrFcAdmin()}">
            <a class="nav-link active" data-toggle="pill" href="#settings" id="settings-tab" role="tab">Project Settings</a>
        </g:if>
        <g:if test="${user.isAdmin || user.isCaseManager}">
            <a class="nav-link" data-toggle="pill" href="#projectDetails" id="projectDetails-tab" role="tab" >MERI Plan</a>
            <g:if test="${risksAndThreatsVisible}">
                <a class="nav-link" href="#risks" id="risks-tab" data-toggle="pill" role="tab" >Risks and threats</a>
            </g:if>
        </g:if>
        <g:if test="${risksAndThreatsVisible}">
            <a class="nav-link" href="#risks-reporting-section" id="risks-reporting-tab" data-toggle="pill" role="tab" > Risks and threats changes</a>
        </g:if>
        <g:if test="${showAnnouncementsTab}">
            <a class="nav-link" href="#alternateAnnouncements" id="alternateAnnouncements-tab" data-toggle="pill" role="tab" >Project Announcements</a>
        </g:if>
        <g:if test="${user.isAdmin || user.isCaseManager}">
            <a class="nav-link" href="#editProjectBlog" id="editProjectBlog-tab" data-toggle="pill" role="tab" >Edit Project Blog</a>
        </g:if>
        <g:if test="${project.newsAndEvents}">
            <a class="nav-link" href="#editNewsAndEvents" id="editNewsAndEvents-tab" data-toggle="pill" role="tab" > News and events</a>
        </g:if>
        <g:if test="${project.projectStories}">
            <a class="nav-link" href="#editProjectStories" id="editProjectStories-tab" data-toggle="pill" role="tab" >Project stories</a>
        </g:if>
        <g:if test="${user.isAdmin || user.isCaseManager}">
            <a class="nav-link" href="#permissions" id="permissions-tab" data-toggle="pill" role="tab" >Project access</a>
            <g:if test="${showSpecies}">
                <a class="nav-link" href="#species" id="species-tab" data-toggle="pill" role="tab" >Species of interest</a>
            </g:if>
            <a class="nav-link" href="#edit-documents" id="edit-documents-tab" data-toggle="pill" role="tab" >Documents</a>
        </g:if>
        <g:elseif test="${fc.userHasReadOnlyAccess()}">
            <a class="nav-link" href="#permissions" id="permissions-tab" data-toggle="pill" role="tab" >Project access</a>
            <a class="nav-link" href="#edit-documents" id="edit-documents-tab" data-toggle="pill" role="tab" >Documents</a>
        </g:elseif>
        <g:if test="${fc.userIsSiteAdmin() || fc.userHasReadOnlyAccess()}">
            <a class="nav-link" href="#project-audit" id="project-audit-tab" data-toggle="pill" role="tab" >Audit</a>
        </g:if>
    </div> <!-- end of side nav -->
    <div class="col-10">
        <div class="pill-content tab-content">
            <g:set var="activeClass" value="active"/>
            <g:if test="${fc.userIsAlaOrFcAdmin()}">
                <!-- PROJECT SETTINGS -->
                <div id="settings" class="pill-pane tab-pane fade show active">
                    <h3>Project Settings</h3>
                    <div class="row">
                        <div id="save-result-placeholder"></div>
                        <div class="col-sm-12 validationEngineContainer" id="settings-validation">
                            <g:render template="editProject"
                                      model="[project: project, canChangeProjectDates:projectContent.admin.canChangeProjectDates]"/>
                        </div>
                    </div>
                </div>
            </g:if>

        <!-- MERI PLAN -->
            <g:if test="${user.isAdmin || user.isCaseManager}">
                <div id="projectDetails" class="pill-pane tab-pane">
                    <!-- Edit project details -->
                    <g:render template="/shared/restoredData" model="[id:'restoredData', saveButton:'Save', cancelButton:'Cancel']"/>
                    <div class="row">
                        <div class="validationEngineContainer col-sm-12" id="project-details-validation">
                            <g:render template="editMeriPlan" model="[project: project]"/>
                        </div>
                    </div>
                </div>
                <g:if test="${risksAndThreatsVisible}">
                  <div id="risks" class="pill-pane tab-pane">
                      <div class="validationEngineContainer meri-plan" id="risk-validation" data-bind="with:meriPlan">
                          <g:render template="riskTable" model="[project:project]"/>
                      </div>
                  </div>
                </g:if>

            </g:if>
                <g:if test="${risksAndThreatsVisible}">
                    <div id="risks-reporting-section" class="pill-pane tab-pane">
                        <g:render template="riskReporting" model="[project:project]"/>
                    </div>
                </g:if>
            <g:if test="${showAnnouncementsTab}">
                <div id="alternateAnnouncements" class="pill-pane tab-pane">
                    <div id="announcement-result-placeholder"></div>
                    <g:render template="announcements" model="[project: project]"/>
                </div>
            </g:if>
            <div id="editProjectBlog" class="pill-pane tab-pane">
                <h3>Edit Project Blog</h3>
                <g:render template="/blog/blogSummary" model="${[blog:project.blog?:[]]}"/>
            </div>
            <g:if test="${project.newsAndEvents}">
                <div id="editNewsAndEvents" class="pill-pane tab-pane">
                    <g:render template="editProjectContent" model="${[attributeName:'newsAndEvents', header:'News and events']}"/>
                </div>
            </g:if>
            <g:if test="${project.projectStories}">
                <div id="editProjectStories" class="pill-pane tab-pane">
                    <g:render template="editProjectContent" model="${[attributeName:'projectStories', header:'Project stories']}"/>
                </div>
            </g:if>
            <g:if test="${user.isAdmin || user.isCaseManager}">
                <div id="permissions" class="pill-pane tab-pane">
                    <h3>Project Access</h3>
                        <h4>Add Permissions</h4>
                        <g:render template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserAsRoleToProject'), entityId:project.projectId]"/>
                    <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:g.createLink(controller:'project', action:'getMembersForProjectId', id:project.projectId), removeUserUrl:g.createLink(controller:'user', action:'removeUserWithRoleFromProject'), entityId:project.projectId, user:user]"/>
                </div>
                <!-- SPECIES -->
                <g:if test="${showSpecies}">
            %{--<div class="border-divider large-space-before">&nbsp;</div>--}%
                <div id="species" class="pill-pane tab-pane">
                    %{--<a name="species"></a>--}%
                    <g:render template="/species/species" model="[project:project]"/>
                </div>
                </g:if>
                <!-- DOCUMENTS -->
                <g:render template="/admin/editDocuments"/>
            </g:if>
            <g:elseif test="${fc.userHasReadOnlyAccess()}">
                <div id="permissions" class="pill-pane tab-pane">
                    <h3>Project Access</h3>
                    <g:render template="/admin/permissionTable" model="[loadPermissionsUrl:g.createLink(controller:'project', action:'getMembersForProjectId', id:project.projectId), removeUserUrl:g.createLink(controller:'user', action:'removeUserWithRoleFromProject'), entityId:project.projectId, user:user]"/>
                </div>
                <g:render template="/admin/editDocuments"/>
            </g:elseif>
            <g:if test="${fc.userIsSiteAdmin() || fc.userHasReadOnlyAccess()}">
                <!-- Audit -->
                <div id="project-audit" class="pill-pane tab-pane">
                    <g:render template="/project/audit"/>
                </div>
            </g:if>
        </div>
    </div>
</div>
