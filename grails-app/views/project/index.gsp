<%@ page import="au.org.ala.merit.ProjectController" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>${project?.name.encodeAsHTML()} | Project | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectUpdateUrl: "${createLink(action: 'ajaxUpdate', id: project.projectId)}",
        updateProjectDatesUrl: "${createLink(controller: 'project', action: 'updateProjectDates')}/",
        sitesDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDeleteSitesFromProject', id:project.projectId)}",
        siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDeleteSiteFromProject', id:project.projectId)}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
        siteEditUrl: "${createLink(controller: 'site', action: 'edit')}",
        removeSiteUrl: "${createLink(controller: 'site', action: '')}",
        activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
        activityEnterDataUrl: "${createLink(controller: 'activity', action: 'enterData')}",
        activityPrintUrl: "${createLink(controller: 'activity', action: 'print')}",
        activityCreateUrl: "${createLink(controller: 'activity', action: 'createPlan')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
        siteCreateUrl: "${createLink(controller: 'site', action: 'createForProject', params: [projectId:project.projectId])}",
        siteSelectUrl: "${createLink(controller: 'site', action: 'select', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId)])}",
        siteUploadUrl: "${createLink(controller: 'site', action: 'uploadShapeFile', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId)])}",
        starProjectUrl: "${createLink(controller: 'project', action: 'starProject')}",
        addUserRoleUrl: "${createLink(controller: 'user', action: 'addUserAsRoleToProject')}",
        removeUserWithRoleUrl: "${createLink(controller: 'user', action: 'removeUserWithRole')}",
        projectMembersUrl: "${createLink(controller: 'project', action: 'getMembersForProjectId')}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
        organisationLinkBaseUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${assetPath(src:'/')}",
        documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
        documentDeleteUrl: "${createLink(controller:"document", action:"deleteDocument")}",
        pdfgenUrl: "${createLink(controller: 'resource', action: 'pdfUrl')}",
        pdfViewer: "${createLink(controller: 'resource', action: 'viewer')}",
        imgViewer: "${createLink(controller: 'resource', action: 'imageviewer')}",
        audioViewer: "${createLink(controller: 'resource', action: 'audioviewer')}",
        videoViewer: "${createLink(controller: 'resource', action: 'videoviewer')}",
        errorViewer: "${createLink(controller: 'resource', action: 'error')}",
        createBlogEntryUrl: "${createLink(controller: 'blog', action:'create', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId, fragment: 'overview')])}",
        editBlogEntryUrl: "${createLink(controller: 'blog', action:'edit', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId, fragment: 'overview')])}",
        deleteBlogEntryUrl: "${createLink(controller: 'blog', action:'delete', params:[projectId:project.projectId])}",
        shapefileDownloadUrl: "${createLink(controller:'project', action:'downloadShapefile', id:project.projectId)}",
        regenerateStageReportsUrl: "${createLink(controller:'project', action:'regenerateStageReports', id:project.projectId)}",
        previewStageReportUrl: "${createLink(controller:'project', action:'previewStageReport')}",
        projectReportUrl:"${createLink(controller:'project', action:'projectReport', id:project.projectId)}",
        projectReportPDFUrl:"${createLink(controller:'project', action:'projectReportPDF', id:project.projectId)}",
        meriPlanPDFUrl:"${createLink(controller:'project', action:'meriPlanPDF', id:project.projectId)}",
        sitesPhotoPointsUrl:"${createLink(controller:'project', action:'projectSitePhotos', id:project.projectId)}",
        organisationSearchUrl: "${createLink(controller: 'organisation', action: 'search')}",
        submitReportUrl: "${createLink(controller: 'project', action: 'ajaxSubmitReport')}/",
        approveReportUrl: "${createLink(controller: 'project', action: 'ajaxApproveReport')}/",
        rejectReportUrl: "${createLink(controller: 'project', action: 'ajaxRejectReport')}/",
        deleteActivitiesUrl: "${createLink(controller: 'project', action: 'ajaxDeleteReportActivities')}/",
        submitPlanUrl : "${createLink(controller:'project', action:'ajaxSubmitPlan', id:project.projectId)}",
        modifyPlanUrl : "${createLink(controller:'project', action:'ajaxRejectPlan', id:project.projectId)}",
        approvalPlanUrl : "${createLink(controller:'project', action:'ajaxApprovePlan', id:project.projectId)}",
        rejectPlanUrl : "${createLink(controller:'project', action:'ajaxRejectPlan', id:project.projectId)}",
        unlockPlanForCorrectionUrl : "${createLink(controller:'project', action:'ajaxUnlockPlanForCorrection', id:project.projectId)}",
        finishedCorrectingPlanUrl : "${createLink(controller:'project', action:'ajaxFinishedCorrectingPlan', id:project.projectId)}",

        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"

    },
        here = window.location.href;

        fcConfig.project = <fc:renderProject project="${project}"/>;
    </script>

    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="project.css"/>
</head>
<body>
<div id="spinner" class="spinner" style="position: fixed;top: 50%;left: 50%;margin-left: -50px;margin-top: -50px;text-align:center;z-index:1234;overflow: auto;width: 100px;height: 102px;">
    <asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>
</div>
<div class="${containerType}">

    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <li class="active">Projects <span class="divider">/</span></li>
        <li class="active" data-bind="text:name"></li>
    </ul>

    <div class="row-fluid">
        <div class="row-fluid">
            <div class="clearfix">
                <h1 class="pull-left" data-bind="text:name"></h1>
                <g:if test="${flash.errorMessage || flash.message}">
                    <div class="span5">
                        <div class="alert alert-error">
                            <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                            ${flash.errorMessage?:flash.message}
                        </div>
                    </div>
                </g:if>
                <div class="pull-right">
                    <g:if test="${user?.isCaseManager && hasCustomTemplate}">
                        <a class="btn"  href="${createLink(action:'index', id:project.projectId)}">User View</a>
                    </g:if>
                    <g:set var="disabled">${(!user) ? "disabled='disabled' title='login required'" : ''}</g:set>
                    <g:if test="${isProjectStarredByUser}">
                        <button class="btn" id="starBtn"><i class="icon-star"></i> <span>Remove from favourites</span></button>
                    </g:if>
                    <g:else>
                        <button class="btn" id="starBtn" ${disabled}><i class="icon-star-empty"></i> <span>Add to favourites</span></button>
                    </g:else>
                </div>
            </div>
        </div>
    </div>

    <!-- content tabs -->
    <ul id="projectTabs" class="nav nav-tabs big-tabs">
        <fc:tabList tabs="${projectContent}"/>
    </ul>


    <div class="tab-content" style="overflow:visible;display:none">
        <div class="tab-pane ${projectContent.overview.default?'active':''}" id="overview">
            <g:render template="overview" model="${projectContent.overview}"/>
        </div>

        <div class="tab-pane" id="documents">
            <!-- Project Documents -->
            <g:render template="docs"/>
        </div>

        <g:if test="${projectContent.details.visible && !projectContent.details.disabled}">
        <div class="tab-pane ${projectContent.details.default?'active':''}" id="details">
            <g:if test="${projectContent.details.meriPlanVisibleToUser}">
                <!-- Project Details -->
                <g:render template="projectDetails" model="[project: project, risksAndThreatsVisible:projectContent.details.risksAndThreatsVisible]"/>

                <div class="row-fluid space-after">
                    <div class="span12">
                        <div class="well well-small">
                            <label><b>MERI attachments:</b></label>
                            <g:render template="/shared/listDocuments"
                                  model="[useExistingModel: true,editable:false, filterBy: 'programmeLogic', ignore: '', imageUrl:assetPath(src:'/'),containerId:'meriPlanDocumentList']"/>
                        </div>
                    </div>
                </div>
            </g:if>
            <g:else>
                <h3>MERI plan in development</h3>
            </g:else>
        </div>
        </g:if>


        <g:if test="${user?.hasViewAccess}">
            <div class="tab-pane" id="plan">
            <!-- PLANS -->
                <g:render template="/shared/activitiesPlan"
                    model="[activities:activities ?: [], sites:project.sites ?: [], showSites:true, reports:projectContent.plan?.reports, scores:projectContent.plan.scores]"/>
                <g:if test="${user?.isCaseManager}">
                    <div class="validationEngineContainer" id="grantmanager-validation">
                        <g:render template="grantManagerSettings" model="[project:project]"/>
                    </div>
                </g:if>
                <g:if test="${projectContent.risksAndThreats.visible}">
                <div class="validationEngineContainer" id="risk-validation">
                    <g:render template="riskTable" model="[project:project]"/>
                </div>
                </g:if>
            </div>

            <div class="tab-pane" id="site">
                <!-- SITES -->
                <!-- ko stopBinding:true -->
                <g:render template="/site/sitesList" model="${[editable:user?.isEditor]}"/>
                <!-- /ko -->
                <div id="site-photo-points">
                    <a href="#"><i>Click to view photo points and photos</i></a>
                </div>


            </div>

            <div class="tab-pane" id="dashboard">
                <!-- DASHBOARD -->
                <g:render template="dashboard"/>
            </div>


        </g:if>

        <g:if test="${projectContent.admin.visible}">
            <g:set var="activeClass" value="class='active'"/>
            <div class="tab-pane" id="admin">
                <!-- ADMIN -->
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
                            <g:if test="${projectContent.admin.showAnnouncementsTab}">
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
                                <li><a href="#species" id="species-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Species of interest</a></li>
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

                            <!-- PROJECT DETAILS -->
                            <g:if test="${user.isAdmin || user.isCaseManager}">
                                <div id="projectDetails" class="pill-pane">
                                    <!-- Edit project details -->
                                    <h3>MERI Plan</h3>
                                    <g:render template="/shared/restoredData" model="[id:'restoredData', saveButton:'Save', cancelButton:'Cancel']"/>
                                    <div class="row-fluid">
                                        <div class="validationEngineContainer" id="project-details-validation">
                                            <g:render template="editProjectDetails" model="[project: project]"/>
                                        </div>
                                    </div>
                                </div>
                            </g:if>
                            <g:if test="${projectContent.admin.showAnnouncementsTab}">
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
                                %{--<div class="border-divider large-space-before">&nbsp;</div>--}%
                                <div id="species" class="pill-pane">
                                    %{--<a name="species"></a>--}%
                                    <g:render template="/species/species" model="[project:project, activityTypes:activityTypes]"/>
                                </div>
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
            </div>
        </g:if>
    </div>

    <g:render template="/shared/timeoutMessage" model="${[url:grailsApplication.config.security.cas.loginUrl+'?service='+createLink(action:'index', id:project.projectId, absolute: true)]}"/>
    <g:render template="/shared/unsavedChanges" model="${[id:'meriPlanUnsavedChanges', unsavedData:'MERI Plan']}"/>
    <g:render template="/shared/unsavedChanges" model="${[id:'risksUnsavedChanges', unsavedData:'Risks & Threats']}"/>

</div>
<g:if test="${user?.isEditor && projectContent.admin.visible}">
    <asset:script>
        // Admin JS code only exposed to admin users
        $(function () {
            // remember state of admin nav (vertical tabs)
            $('#adminNav a[data-toggle="tab"]').on('shown', function (e) {
                var tab = e.currentTarget.hash;
                amplify.store('project-admin-tab-state', tab);
            });
            $('#admin-tab').on('shown', function() {
                var storedAdminTab = amplify.store('project-admin-tab-state');
                // restore state if saved
                if (storedAdminTab === '') {
                    $('#permissions-tab').tab('show');
                } else {
                    $(storedAdminTab + "-tab").tab('show');
                }
            });

            <g:if test="${user.isAdmin || user.isCaseManager}">
        populatePermissionsTable();
    </g:if>
        });

    </asset:script>
</g:if>
<asset:script>
        var organisations = <fc:modelAsJavascript model="${organisations}"/>;

       // custom validator to ensure that only one of two fields is populated
        function exclusive (field, rules, i, options) {
            var otherFieldId = rules[i+2], // get the id of the other field
                otherValue = $('#'+otherFieldId).val(),
                thisValue = field.val(),
                message = rules[i+3];
            // checking thisValue is technically redundant as this validator is only called
            // if there is a value in the field
            if (otherValue !== '' && thisValue !== '') {
                return message;
            } else {
                return true;
            }
        }

        $(function () {
            var PROJECT_DETAILS_KEY = 'project.custom.details.${project.projectId}';
            var PROJECT_RISKS_KEY = 'project.risks.${project.projectId}';

            var map;
            // setup 'read more' for long text
            $('.more').shorten({
                moreText: 'read more',
                showChars: '1000'
            });
            // setup confirm modals for deletions
            $(document).on("click", "a[data-bb]", function(e) {
                e.preventDefault();
                var type = $(this).data("bb"),
                    href = $(this).attr('href');
                if (type === 'confirm') {
                    bootbox.confirm("Delete this entire project? Are you sure?", function(result) {
                        if (result) {
                            document.location.href = href;
                        }
                    });
                }
            });

            $('#settings-validation').validationEngine();
            $('#project-details-validation').validationEngine();
            $('#risk-validation').validationEngine();
            $('#grantmanager-validation').validationEngine();
            $('#risks-announcements').validationEngine();
            $('.helphover').popover({animation: true, trigger:'hover'});

            $('#cancel').click(function () {
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });

            $('#risks-cancel').click(function () {
                amplify.store(PROJECT_RISKS_KEY, null);
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });
            $('#summary-cancel').click(function () {
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });

            function ViewModel(project, sites, activities, isUserEditor, themes, newsAndEvents, projectStories) {
                var self = this;
                _.extend(this, new ProjectViewModel(project, isUserEditor, organisations));
                _.extend(this, new MERIPlan(project, themes, PROJECT_DETAILS_KEY));
                _.extend(this, new Risks(project.risks, PROJECT_RISKS_KEY));
                _.extend(this, new MERIPlanActions(project, _.extend({}, fcConfig, {declarationModalSelector:'#unlockPlan'})));

                self.workOrderId = ko.observable(project.workOrderId);
                self.userIsCaseManager = ko.observable(${user?.isCaseManager});
				self.userIsAdmin = ko.observable(${user?.isAdmin});
                self.promote = [{id: 'yes', name:'Yes'},{id:'no',name:'No'}];
				self.promoteOnHomepage = ko.observable(project.promoteOnHomepage);
				self.planStatus = ko.observable(project.planStatus);
                self.mapLoaded = ko.observable(false);
				self.transients.variation = ko.observable();
				self.changeActivityDates = ko.observable(false);
				self.contractDatesFixed.subscribe(function() {
				    self.changeActivityDates(!self.contractDatesFixed());
				});
				self.transients.selectOrganisation = function(data){
				    self.transients.organisation({organisationId:data.source.organisationId, name:data.label});
				};

                self.transients.selectServiceProviderOrganisation = function(data){
				    self.transients.serviceProviderOrganisation({organisationId:data.source.organisationId, name:data.label});
				};
                self.allYears = function(startYear) {
		            var currentYear = new Date().getFullYear(), years = [];
		            startYear = startYear || 2010;
		            while ( startYear <= currentYear+10 ) {
		                    years.push(startYear++);
		            }
		            return years;
			    };
			    self.years = [];
			    self.years = self.allYears();


                self.validateProjectEndDate = function() {

                    var endDate = self.plannedEndDate();
                    if (endDate <= self.plannedStartDate()) {
                        return "The project end date must be after the start date";
                    }
                    if (project.activities && !self.changeActivityDates()) {
                        var lastActivityDate = _.reduce(project.activities, function(max, activity) { return activity.plannedEndDate > max ? activity.plannedEndDate : max; }, project.plannedStartDate);
                        if (endDate < lastActivityDate) {
                            return "The project end date must be after the last activity in the project ( "+convertToSimpleDate(lastActivityDate)+ " )";
                        }
                    }

                };

                self.validateProjectStartDate = function() {

                    var startDate = self.plannedStartDate();
                    if (startDate >= self.plannedEndDate()) {
                        return "The project start date must be before the end date";
                    }
                    if (project.activities && !self.changeActivityDates()) {
                        var firstActivityDate = _.reduce(project.activities, function(min, activity) { return activity.plannedEndDate < min ? activity.plannedEndDate : min; }, project.plannedEndDate);
                        if (startDate > firstActivityDate) {
                            return "The project start date must be before the first activity in the project ( "+convertToSimpleDate(firstActivityDate)+ " )";
                        }
                    }

                };

				self.saveProjectDetails = function(){
					self.saveProject(false);
				};

				self.cancelProjectDetailsEdits = function() {
				    self.details.cancelAutosave();

				    document.location.reload(true);
				};

				self.meriPlanPDF = function() {
                    var url = fcConfig.meriPlanPDFUrl;
                    window.open(url,'meri-plan-report');
				};

				self.saveAnnouncements = function(){

				    if (!$('#risks-announcements').validationEngine('validate')) {
				        return;
				    }
                    self.details.saveWithErrorDetection(function() {
                        $(document).scrollTop(400);
                        showAlert("Announcements saved", "alert-success", 'announcement-result-placeholder');
                    });
				};

				// Save project details
				self.saveProject = function(enableSubmit){
				    if ($('#project-details-validation').validationEngine('validate')) {
                        self.details.status('active');
                        self.details.saveWithErrorDetection(function() {
                            if(enableSubmit) {
                                self.submitChanges();
                            }
                        });
					}
				};

            	self.saveAndSubmitChanges = function(){
            		self.saveProject(true);
            	};

                self.uploadVariationDoc = function(doc){
	               	 var json = JSON.stringify(doc, function (key, value) {
	                            return value === undefined ? "" : value;
	                     });
					 $.post(
			            fcConfig.documentUpdateUrl,
			            {document:json},
			            function(result) {
	                        showAlert("Project end date saved","alert-success","save-settings-result-placeholder");
							location.reload();
			            })
			            .fail(function() {
			                alert('Error saving document record');
            			});
                };
                self.saveGrantManagerSettings = function () {

                    if ($('#grantmanager-validation').validationEngine('validate')) {
                    	var doc = {oldDate:project.plannedEndDate, newDate:self.plannedEndDate(),reason:self.transients.variation(),role:"variation",projectId:project.projectId};
	                    var jsData = {
	                     	plannedEndDate: self.plannedEndDate()
	                     };
	                     var json = JSON.stringify(jsData, function (key, value) {
	                            return value === undefined ? "" : value;
	                     });

	                     var id = "${project?.projectId}";
	                        $.ajax({
	                            url: "${createLink(action: 'ajaxUpdate', id: project.projectId)}",
	                            type: 'POST',
	                            data: json,
	                            contentType: 'application/json',
	                            success: function (data) {
	                                if (data.error) {
	                                    showAlert("Failed to save settings: " + data.detail + ' \n' + data.error,
	                                    "alert-error","save-settings-result-placeholder");
	                                } else {
	                                    self.uploadVariationDoc(doc);
	                                }
	                            },
	                            error: function (data) {
	                                var status = data.status;
	                                alert('An unhandled error occurred: ' + data.status);
	                            }
	                        });
                	}
                };

                self.saveSettings = function () {
                    if ($('#settings-validation').validationEngine('validate')) {

                        // only collect those fields that can be edited in the settings pane
                        var jsData = {
                            name: self.name(),
                            description: self.description(),
                            externalId: self.externalId(),
                            grantId: self.grantId(),
                            workOrderId: self.workOrderId(),
                            manager: self.manager(),
                            plannedStartDate: self.plannedStartDate(),
                            plannedEndDate: self.plannedEndDate(),
                            contractStartDate: self.contractStartDate(),
                            contractEndDate: self.contractEndDate(),
                            organisationId: self.organisationId(),
                            organisationName: self.organisationName(),
                            orgIdSvcProvider: self.orgIdSvcProvider(),
                            serviceProviderName: self.serviceProviderName(),
                            associatedProgram: self.associatedProgram(),
                            associatedSubProgram: self.associatedSubProgram(),
                            funding: new Number(self.funding()),
                            status:self.status(),
                            promoteOnHomepage:self.promoteOnHomepage(),
                            changeActivityDates:self.changeActivityDates()
                        };

                        // this call to stringify will make sure that undefined values are propagated to
                        // the update call - otherwise it is impossible to erase fields
                        var json = JSON.stringify(jsData, function (key, value) {
                            return value === undefined ? "" : value;
                        });
                        var id = "${project?.projectId}";
                        $.ajax({
                            url: "${createLink(action: 'ajaxUpdate', id: project.projectId)}",
                            type: 'POST',
                            data: json,
                            contentType: 'application/json',
                            success: function (data) {
                                if (data.error) {
                                    showAlert("Failed to save settings: " + data.detail + ' \n' + data.error,
                                        "alert-error","save-result-placeholder");
                                } else {
                                    showAlert("Project settings saved","alert-success","save-result-placeholder");
                                }
                            },
                            error: function (data) {
                                var status = data.status;
                                alert('An unhandled error occurred: ' + data.status);
                            }
                        });
                    }
                };
                self.regenerateStageReports = function() {
                    $.ajax(fcConfig.regenerateStageReportsUrl).done(function(data) {
                        document.location.reload();
                    }).fail(function(data) {
                        bootbox.alert('<span class="label label-warning">Error</span> <p>There was an error regenerating the stage reports: '+data+'</p>');
                    });
                };

            } // end of view model

            var programs = <fc:modelAsJavascript model="${programs}"/>;
            var project = fcConfig.project;

            var viewModel = new ViewModel(
                project,
                project.sites,
                project.activities || [],
                ${user?.isEditor?:false},
                ${themes});

            viewModel.loadPrograms(programs);
            ko.applyBindings(viewModel);

            window.validateProjectEndDate = viewModel.validateProjectEndDate;
            window.validateProjectStartDate = viewModel.validateProjectStartDate;

            autoSaveModel(
                viewModel.details,
                '${createLink(action: 'ajaxUpdate', id: project.projectId)}',
                {
                    storageKey:PROJECT_DETAILS_KEY,
                    autoSaveIntervalInSeconds:${grailsApplication.config.fieldcapture.autoSaveIntervalInSeconds?:60},
                    restoredDataWarningSelector:'#restoredData',
                    resultsMessageSelector:'.save-details-result-placeholder',
                    timeoutMessageSelector:'#timeoutMessage',
                    errorMessage:"Failed to save MERI Plan: ",
                    successMessage: 'MERI Plan saved',
                    preventNavigationIfDirty:true,
                    defaultDirtyFlag:ko.dirtyFlag
                });


            $('#project-details-save').appear().on('appear', function() {
                $('#floating-save').slideUp(400);
            }).on('disappear', function() {
                if (viewModel.details.dirtyFlag.isDirty()) {
                    $('#floating-save').slideDown(400);
                }
                else {
                    $('#floating-save').slideUp(400);
                }
            });
            viewModel.details.dirtyFlag.isDirty.subscribe(function(dirty) {
                if (dirty && !$('#floating-save').is(':appeared')) {
                   $('#floating-save').slideDown(400);
                }
                else {
                    $('#floating-save').slideUp(400);
                }
            });
            autoSaveModel(
                viewModel.risks,
                '${createLink(action: 'ajaxUpdate', id: project.projectId)}',
                {
                    storageKey:PROJECT_RISKS_KEY,
                    autoSaveIntervalInSeconds:${grailsApplication.config.fieldcapture.autoSaveIntervalInSeconds?:60},
                    restoredDataWarningSelector:'#restoredRisksData',
                    resultsMessageSelector:'#summary-result-placeholder',
                    timeoutMessageSelector:'#timeoutMessage',
                    errorMessage:"Failed to save risks details: ",
                    successMessage: 'Successfully saved',
                    defaultDirtyFlag:ko.dirtyFlag
                });

            var meriPlanVisible = false;
            var risksVisible = false;
            $('a[data-toggle="tab"]').on('show', function(e) {

                if (meriPlanVisible && viewModel.details.dirtyFlag.isDirty()) {
                    e.preventDefault();
                    bootbox.alert($('#meriPlanUnsavedChanges').html());
                }
                else {
                    meriPlanVisible = (e.target.hash  == '#projectDetails');
                }
                if (risksVisible && viewModel.risks.dirtyFlag.isDirty()) {
                    e.preventDefault();
                    bootbox.alert($('#risksUnsavedChanges').html());
                }
                else {
                    risksVisible = (e.target.hash  == '#plan');
                }
            });

         // retain tab state for future re-visits
            // and handle tab-specific initialisations
            var planTabInitialised = false;
            var dashboardInitialised = false;
            var documentsInitialised = false;
            var meriPlanInitialised = false;

            $('#projectTabs a[data-toggle="tab"]').on('shown', function (e) {
                var tab = e.currentTarget.hash;
                amplify.store('project-tab-state', tab);
                // only init map when the tab is first shown
                if (tab === '#site' && map === undefined) {
                    var mapOptions = {
                        zoomToBounds:true,
                        zoomLimit:16,
                        highlightOnHover:true,
                        features:[],
                        featureService: "${createLink(controller: 'proxy', action:'feature')}",
                        wmsServer: "${grailsApplication.config.spatial.geoserverUrl}"
                    };

                    map = init_map_with_features({
                            mapContainer: "map",
                            scrollwheel: false,
                            featureService: "${createLink(controller: 'proxy', action:'feature')}",
                            wmsServer: "${grailsApplication.config.spatial.geoserverUrl}"
                        },
                        mapOptions
                    );
                    var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
                    var sitesViewModel = new SitesViewModel(project.sites, map, mapFeatures, ${user?.isEditor?:false}, project.projectId);
                    ko.applyBindings(sitesViewModel, document.getElementById('sitesList'));
                    var tableApi = $('#sites-table').DataTable( {
                        "columnDefs": [
                        {
                            "targets": 0,
                            "orderable": false,
                            "searchable": false,
                            "width":"2em"
                        },
                        {
                            "targets": 1,
                            "orderable": false,
                            "searchable": false,
                            "width":"4em"
                        },
                        {
                            "targets":3,
                            "sort":4,
                            "width":"8em"
                        },
                        {
                            "targets":4,
                            "visible":false

                        }
                        ],
                        "order":[3, "desc"],
                        "language": {
                            "search":'<div class="input-prepend"><span class="add-on"><i class="fa fa-search"></i></span>_INPUT_</div>',
                            "searchPlaceholder":"Search sites..."

                        },
                        "searchDelay":350
                        }
                    );

                    var visibleIndicies = function() {
                        var settings = tableApi.settings()[0];
                        var start = settings._iDisplayStart;
                        var count = settings._iDisplayLength;

                        var visibleIndicies = [];
                        for (var i=start; i<Math.min(start+count, settings.aiDisplay.length); i++) {
                            visibleIndicies.push(settings.aiDisplay[i]);
                        }
                        return visibleIndicies;
                    };
                    $('#sites-table').dataTable().on('draw.dt', function(e) {
                        sitesViewModel.sitesFiltered(visibleIndicies());
                    });
                    $('#sites-table tbody').on( 'mouseenter', 'td', function () {
                            var table = $('#sites-table').DataTable();
                            var rowIdx = table.cell(this).index().row;
                            sitesViewModel.highlightSite(rowIdx);

                        } ).on('mouseleave', 'td', function() {
                            var table = $('#sites-table').DataTable();
                            var rowIdx = table.cell(this).index().row;
                            sitesViewModel.unHighlightSite(rowIdx);
                        });
                    $('#select-all-sites').change(function() {
                        var checkbox = this;
                        // This lets knockout update the bindings correctly.
                        $('#sites-table tbody tr :checkbox').trigger('click');
                    });
                    sitesViewModel.sitesFiltered(visibleIndicies());

                    $('#site-photo-points a').click(function(e) {
                        e.preventDefault();
                        $('#site-photo-points').html('<asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>');
                        $.get(fcConfig.sitesPhotoPointsUrl).done(function(data) {

                            $('#site-photo-points').html($(data));
                            $('#site-photo-points img').on('load', function() {

                                var parent = $(this).parents('.thumb');
                                var $caption = $(parent).find('.caption');
                                $caption.outerWidth($(this).width());

                            });
                            $( '.photo-slider' ).mThumbnailScroller({theme:'hover-classic'});
                            $('.photo-slider .fancybox').fancybox({
                                helpers : {
                                    title: {
                                        type: 'inside'
                                    }
                                },
                                beforeLoad: function() {
                                    var el, id = $(this.element).data('caption');

                                    if (id) {
                                        el = $('#' + id);

                                        if (el.length) {
                                            this.title = el.html();
                                        }
                                    }
                                },
                                nextEffect:'fade',
                                previousEffect:'fade'
                            });
                            $(window).load(function() {

                            });
                        });
                    });
                }
                if (tab === '#plan' && !planTabInitialised) {
                    $.event.trigger({type:'planTabShown'});
                    planTabInitialised = true;
                }
                if (tab == '#dashboard' && !dashboardInitialised) {
                    $.event.trigger({type:'dashboardShown'});
                    dashboardInitialised;
                }

                if(tab == "#documents" && !documentsInitialised){
                    documentsInitialised = true;
                    initialiseDocumentTable('#overviewDocumentList');
                }

                if (tab == '#details' && !meriPlanInitialised) {
                    meriPlanInitialised = true;
                    initialiseDocumentTable('#meriPlanDocumentList');
                };
            });

            var newsAndEventsInitialised = false;
            $('#editNewsAndEvents-tab').on('shown', function() {
                if (!newsAndEventsInitialised) {
                    var newsAndEventsViewModel = new window.newsAndEventsViewModel(viewModel, project.newsAndEvents);
                    ko.applyBindings(newsAndEventsViewModel, $('#editnewsAndEventsContent')[0]);
                    newsAndEventsInitialised = true;
                }

            });
            var projectStoriesInitialised = false;
            $('#editProjectStories-tab').on('shown', function() {
                if (!projectStoriesInitialised) {
                    var projectStoriesViewModel = new window.projectStoriesViewModel(viewModel, project.projectStories);
                    ko.applyBindings(projectStoriesViewModel, $('#editprojectStoriesContent')[0]);
                    projectStoriesInitialised = true;
                }
            });

            var overviewInitialised = false;
            $('#overview-tab').on('shown', function() {
                if (!overviewInitialised) {
                    initialiseOverview();

                    overviewInitialised = true;
                }
            });
            function initialiseOverview() {
                $( '#public-images-slider' ).mThumbnailScroller({});
                $('#public-images-slider .fancybox').fancybox();
            }

            $('#gotoEditBlog').click(function () {
                amplify.store('project-admin-tab-state', '#editProjectBlog');
                $('#admin-tab').tab('show');
            });


            // Non-editors should get tooltip and popup when trying to click other tabs
            $('#projectTabs li a').not('[data-toggle="tab"]').css('cursor', 'not-allowed') //.data('placement',"right")
            .attr('title','Only available to project members').addClass('tooltips');

            // Star button click event
            $("#starBtn").click(function(e) {
                var isStarred = ($("#starBtn i").attr("class") == "icon-star");
                toggleStarred(isStarred, '${user?.userId?:''}', '${project.projectId}');
            });

            // BS tooltip
            $('.tooltips').tooltip();

            //Page loading indicator.
			$('.spinner').hide();
        	$('.tab-content').fadeIn();

        	// re-establish the previous tab state
            var storedTab = window.location.hash;
            if (!storedTab) {
                storedTab = ${user?"amplify.store('project-tab-state')":"'overview'"};
            }
            var isEditor = ${user?.isEditor?:false};

            initialiseOverview();
            if (storedTab !== '') {
                $(storedTab + '-tab').tab('show');
            }

        });// end window.load


</asset:script>
<asset:javascript src="common.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>
</body>
</html>