<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="http://merit.giraffedesign.com.au/css/project.css">
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>${project?.name.encodeAsHTML()} | Project | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectUpdateUrl: "${createLink(action: 'ajaxUpdate', id: project.projectId)}",
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
        siteSelectUrl: "${createLink(controller: 'site', action: 'select', params:[projectId:project.projectId])}&returnTo=${createLink(controller: 'project', action: 'index', id: project.projectId)}",
        siteUploadUrl: "${createLink(controller: 'site', action: 'uploadShapeFile', params:[projectId:project.projectId])}&returnTo=${createLink(controller: 'project', action: 'index', id: project.projectId)}",
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
        imageLocation:"${resource(dir:'/images')}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}",
        documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
        documentDeleteUrl: "${createLink(controller:"document", action:"deleteDocument")}",
        pdfgenUrl: "${createLink(controller: 'resource', action: 'pdfUrl')}",
        pdfViewer: "${createLink(controller: 'resource', action: 'viewer')}",
        imgViewer: "${createLink(controller: 'resource', action: 'imageviewer')}",
        audioViewer: "${createLink(controller: 'resource', action: 'audioviewer')}",
        videoViewer: "${createLink(controller: 'resource', action: 'videoviewer')}",
        errorViewer: "${createLink(controller: 'resource', action: 'error')}",
        },
        here = window.location.href;

    </r:script>

    <!--[if gte IE 8]>
        <style>
           .thumbnail > img {
                max-width: 400px;
            }
            .thumbnail {
                max-width: 410px;
            }
        </style>
    <![endif]-->
    <r:require modules="gmap3,mapWithFeatures,knockout,datepicker,amplify,jqueryValidationEngine, merit_projects, attachDocuments, wmd"/>
</head>
<body>
<div id="spinner" class="spinner" style="position: fixed;top: 50%;left: 50%;margin-left: -50px;margin-top: -50px;text-align:center;z-index:1234;overflow: auto;width: 100px;height: 102px;">
    <r:img id="img-spinner" width="50" height="50" dir="images" file="loading.gif" alt="Loading"/>
</div>
<div class="container-fluid">

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
        <div class="tab-pane active" id="overview">
            <g:render template="overview" model="[project:project]"/>
        </div>

        <div class="tab-pane" id="documents">
            <!-- Project Documents -->
            <g:render plugin="fieldcapture-plugin" template="docs"/>
        </div>

        <g:if test="${projectContent.details.visible}">
        <div class="tab-pane" id="details">
            <!-- Project Details -->
            <g:render template="projectDetails" model="[project: project]"/>

            <div class="row-fluid space-after">
                <div class="span6">
                    <div class="well well-small">
                        <label><b>MERI attachments:</b></label>
                        <g:render plugin="fieldcapture-plugin" template="/shared/listDocuments"
                                  model="[useExistingModel: true,editable:false, filterBy: 'programmeLogic', ignore: '', imageUrl:resource(dir:'/images'),containerId:'overviewDocumentList']"/>
                    </div>
                </div>
            </div>
        </div>
        </g:if>


        <g:if test="${user?.hasViewAccess}">
            <div class="tab-pane" id="plan">
            <!-- PLANS -->
                <g:render template="/shared/activitiesPlan"
                    model="[activities:activities ?: [], sites:project.sites ?: [], showSites:true, reports:projectContent.plan?.reports]"/>
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
                <g:render plugin="fieldcapture-plugin" template="/site/sitesList" model="${[editable:user?.isEditor]}"/>
                <!-- /ko -->

            </div>

            <div class="tab-pane" id="dashboard">
                <!-- DASHBOARD -->
                <g:render plugin="fieldcapture-plugin" template="dashboard"/>
            </div>


        </g:if>

        <g:if test="${projectContent.admin.visible}">
            <g:set var="activeClass" value="class='active'"/>
            <div class="tab-pane" id="admin">
                <!-- ADMIN -->
                <div class="row-fluid">
                    <div class="span2 large-space-before">
                        <ul id="adminNav" class="nav nav-tabs nav-stacked ">
                            <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole) || fc.userInRole(role: grailsApplication.config.security.cas.adminRole)}">
                                <li ${activeClass}><a href="#settings" id="settings-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project settings</a></li>
                                <g:set var="activeClass" value=""/>
                            </g:if>

                            <li><a href="#projectDetails" id="projectDetails-tab" data-toggle="tab"><i class="icon-chevron-right"></i> MERI Plan</a></li>
                            <li><a href="#editNewsAndEvents" id="editNewsAndEvents-tab" data-toggle="tab"><i class="icon-chevron-right"></i> News and events</a></li>
                            <li><a href="#editProjectStories" id="editProjectStories-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project stories</a></li>

                            <li ${activeClass}><a href="#permissions" id="permissions-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Project access</a></li>
                            <li><a href="#species" id="species-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Species of interest</a></li>
                            <li><a href="#edit-documents" id="edit-documents-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Documents</a></li>
                            <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole) || fc.userInRole(role: grailsApplication.config.security.cas.adminRole)}">
                                <li><a href="#project-audit" id="project-audit-tab" data-toggle="tab"><i class="icon-chevron-right"></i> Audit</a></li>
                            </g:if>
                        </ul>
                    </div>
                    <div class="span10">
                        <div class="pill-content">
                            <g:set var="activeClass" value="active"/>
                            <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole) || fc.userInRole(role: grailsApplication.config.security.cas.adminRole)}">
                                <!-- PROJECT SETTINGS -->
                                <div id="settings" class="pill-pane ${activeClass}">
                                    <h3>Project Settings</h3>
                                    <div class="row-fluid">
                                        <div id="save-result-placeholder"></div>
                                        <div class="span10 validationEngineContainer" id="settings-validation">
                                            <g:render plugin="fieldcapture-plugin" template="editProject"
                                                      model="[project: project]"/>
                                        </div>
                                    </div>
                                </div>
                                <g:set var="activeClass" value=""/>
                            </g:if>

                            <!-- PROJECT DETAILS -->
                            <div id="projectDetails" class="pill-pane">
                                <!-- Edit project details -->
                                <h3>MERI Plan</h3>
                                <g:render template="/shared/restoredData" plugin="fieldcapture-plugin" model="[id:'restoredData', saveButton:'Save', cancelButton:'Cancel']"/>
                                <div class="row-fluid">
                                    <div class="validationEngineContainer" id="project-details-validation">
                                        <g:render template="editProjectDetails" model="[project: project]"/>
                                    </div>
                                </div>
                            </div>
                            <div id="editNewsAndEvents" class="pill-pane">
                                <g:render plugin="fieldcapture-plugin"  template="editProjectContent" model="${[attributeName:'newsAndEvents', header:'News and events']}"/>
                                <hr/>
                                <div id="announcement-result-placeholder"></div>
                                <g:render template="announcements" model="[project: project]"/>
                            </div>

                            <div id="editProjectStories" class="pill-pane">
                                <g:render plugin="fieldcapture-plugin" template="editProjectContent" model="${[attributeName:'projectStories', header:'Project stories']}"/>
                            </div>

                            <div id="permissions" class="pill-pane ${activeClass}">
                                <h3>Project Access</h3>
                                <h4>Add Permissions</h4>
                                <g:render plugin="fieldcapture-plugin" template="/admin/addPermissions" model="[addUserUrl:g.createLink(controller:'user', action:'addUserAsRoleToProject'), entityId:project.projectId]"/>
                                <g:render plugin="fieldcapture-plugin" template="/admin/permissionTable" model="[loadPermissionsUrl:g.createLink(controller:'project', action:'getMembersForProjectId', id:project.projectId), removeUserUrl:g.createLink(controller:'user', action:'removeUserWithRoleFromProject'), entityId:project.projectId, user:user]"/>
                            </div>
                            <!-- SPECIES -->
                            %{--<div class="border-divider large-space-before">&nbsp;</div>--}%
                            <div id="species" class="pill-pane">
                                %{--<a name="species"></a>--}%
                                <g:render plugin="fieldcapture-plugin"  template="/species/species" model="[project:project, activityTypes:activityTypes]"/>
                            </div>
                            <!-- DOCUMENTS -->
                            <div id="edit-documents" class="pill-pane">
                                <h3>Project Documents</h3>
                                <div class="row-fluid">
                                    <div class="span10">
                                        <g:render plugin="fieldcapture-plugin" template="/shared/editDocuments"
                                                  model="[useExistingModel: true,editable:true, filterBy: 'all', ignore: '', imageUrl:resource(dir:'/images/filetypes'),containerId:'adminDocumentList']"/>
                                    </div>
                                </div>
                                %{--The modal view containing the contents for a modal dialog used to attach a document--}%
                                <g:render plugin="fieldcapture-plugin" template="/shared/attachDocument"/>
                                <div class="row-fluid attachDocumentModal">
                                    <button class="btn" id="doAttach" data-bind="click:attachDocument">Attach Document</button>
                                </div>
                            </div>
                            <g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole) || fc.userInRole(role: grailsApplication.config.security.cas.adminRole)}">
                                <!-- Audit -->
                                <div id="project-audit" class="pill-pane">
                                    <g:render template="/project/audit" plugin="fieldcapture-plugin"/>
                                </div>
                            </g:if>
                        </div>
                    </div>
                </div>
            </div>
        </g:if>
    </div>

    <g:render template="/shared/timeoutMessage" plugin="fieldcapture-plugin" model="${[url:createLink(action:'index', id:project.projectId)]}"/>
    <g:render template="/shared/unsavedChanges" plugin="fieldcapture-plugin" model="${[id:'meriPlanUnsavedChanges', unsavedData:'MERI Plan']}"/>
    <g:render template="/shared/unsavedChanges" plugin="fieldcapture-plugin" model="${[id:'risksUnsavedChanges', unsavedData:'Risks & Threats']}"/>

</div>

<r:script>
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

        $(window).load(function () {
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
                $.extend(this, new ProjectViewModel(project, ${user?.isEditor?:false}, organisations));
                $.extend(this, new MERIPlan(project, themes, PROJECT_DETAILS_KEY));
                $.extend(this, new Risks(project.risks, PROJECT_RISKS_KEY));

                self.workOrderId = ko.observable(project.workOrderId);
                self.userIsCaseManager = ko.observable(${user?.isCaseManager});
				self.userIsAdmin = ko.observable(${user?.isAdmin});
                self.promote = [{id: 'yes', name:'Yes'},{id:'no',name:'No'}];
				self.promoteOnHomepage = ko.observable(project.promoteOnHomepage);
				self.planStatus = ko.observable(project.planStatus);
                self.serviceProviderName = ko.observable(project.serviceProviderName);
                self.mapLoaded = ko.observable(false);
				self.transients.variation = ko.observable();

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


				self.saveProjectDetails = function(){
					self.saveProject(false);
				};

				self.cancelProjectDetailsEdits = function() {
				    self.details.cancelAutosave();

				    document.location.reload(true);
				};

				self.saveAnnouncements= function(){

				    if (!$('#risks-announcements').validationEngine('validate')) {
				        return;
				    }
				    var tmp = {};
					self.details.status('active');
					tmp['details'] =  ko.mapping.toJS(self.details);
					var jsData = {"custom": tmp};
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
                                 showAlert("Failed to save project announcement: " + data.detail + ' \n' + data.error,
                                     "alert-error","announcement-result-placeholder");
                             } else {
                                 showAlert("Projects announcements saved","alert-success","announcement-result-placeholder");
                             }
                         },
                         error: function (data) {
                             var status = data.status;
                             alert('An unhandled error occurred: ' + data.status);
                         }
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

				// Modify plan
				self.saveStatus = function (url) {
	                var payload = {projectId: project.projectId};
	                return $.ajax({
	                    url: url,
	                    type: 'POST',
	                    data: JSON.stringify(payload),
	                    contentType: 'application/json'
	                });
            	};

            	self.saveAndSubmitChanges = function(){
            		self.saveProject(true);
            	};

            	self.submitChanges = function (newValue) {
	                self.saveStatus('${g.createLink(action:'ajaxSubmitPlan', id:project.projectId)}')
	                .done(function (data) {
	                    if (data.error) {
	                        showAlert("Unable to modify plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
	                            "alert-error","status-update-error-placeholder");
	                    } else {
	                        location.reload();
	                    }
	                })
	                .fail(function (data) {
	                    if (data.status === 401) {
	                        showAlert("Unable to modify plan. You do not have case manager rights for this project.",
	                            "alert-error","status-update-error-placeholder");
	                    } else {
	                        showAlert("Unable to modify plan. An unhandled error occurred: " + data.status,
	                            "alert-error","status-update-error-placeholder");
	                    }
	                });
            	};

            	self.modifyPlan = function () {
                // should we check that status is 'approved'?
                self.saveStatus('${g.createLink(action:'ajaxRejectPlan', id:project.projectId)}')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to modify plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to modify plan. You do not have case manager rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to modify plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
          	  };
			// approve plan and handle errors
            self.approvePlan = function () {
                // should we check that status is 'submitted'?
                self.saveStatus('${g.createLink(action:'ajaxApprovePlan', id:project.projectId)}')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to approve plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to approve plan. You do not have case manager rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to approve plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
            };
            // reject plan and handle errors
            self.rejectPlan = function () {
                // should we check that status is 'submitted'?
                self.saveStatus('${g.createLink(action:'ajaxRejectPlan', id:project.projectId)}')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to reject plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to reject plan. You do not have case manager rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to reject plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
          	  };

               self.uploadVariationDoc = function(doc){
	               	 var json = JSON.stringify(doc, function (key, value) {
	                            return value === undefined ? "" : value;
	                     });
					 $.post(
			            "${createLink(controller:"proxy", action:"documentUpdate")}",
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
                            serviceProviderName: self.serviceProviderName(),
                            associatedProgram: self.associatedProgram(),
                            associatedSubProgram: self.associatedSubProgram(),
                            funding: new Number(self.funding()),
                            status:self.status(),
                            promoteOnHomepage:self.promoteOnHomepage()
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

            } // end of view model

            var programs = <fc:modelAsJavascript model="${programs}"/>;
            var project = <fc:modelAsJavascript model="${project}"/>;

            var viewModel = new ViewModel(
                checkAndUpdateProject(project, undefined, programs),
                ${project.sites},
                ${activities ?: []},
                ${user?.isEditor?:false},
                ${themes});

            viewModel.loadPrograms(programs);
            ko.applyBindings(viewModel);

            autoSaveModel(
                viewModel.details,
                '${createLink(action: 'ajaxUpdate', id: project.projectId)}',
                {
                    storageKey:PROJECT_DETAILS_KEY,
                    autoSaveIntervalInSeconds:${grailsApplication.config.fieldcapture.autoSaveIntervalInSeconds?:60},
                    restoredDataWarningSelector:'#restoredData',
                    resultsMessageId:'save-details-result-placeholder',
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
                    resultsMessageId:'summary-result-placeholder',
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
                    var sitesViewModel = new SitesViewModel(project.sites, map, mapFeatures, ${user?.isEditor?:false});
                    ko.applyBindings(sitesViewModel, document.getElementById('sitesList'));

                }
                if (tab === '#plan' && !planTabInitialised) {
                    $.event.trigger({type:'planTabShown'});
                    planTabInitialised = true;
                }
                if (tab == '#dashboard' && !dashboardInitialised) {
                    $.event.trigger({type:'dashboardShown'});
                    dashboardInitialised;
                }

                var documentsInitialised = false;
                if(tab == "#documents" && !documentsInitialised){
                    documentsInitialised = true;
                }
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

            // re-establish the previous tab state
            var storedTab = amplify.store('project-tab-state');
            var isEditor = ${user?.isEditor?:false};
            if (storedTab === '') {
                $('#overview-tab').tab('show');
            } else if (isEditor) {
                $(storedTab + '-tab').tab('show');
            }

            // Non-editors should get tooltip and popup when trying to click other tabs
            $('#projectTabs li a').not('[data-toggle="tab"]').css('cursor', 'not-allowed') //.data('placement',"right")
            .attr('title','Only available to project members').addClass('tooltips');

            // Star button click event
            $("#starBtn").click(function(e) {
                var isStarred = ($("#starBtn i").attr("class") == "icon-star");
                toggleStarred(isStarred);
            });

            // BS tooltip
            $('.tooltips').tooltip();

            //Page loading indicator.
			$('.spinner').hide();
        	$('.tab-content').fadeIn();
        });// end window.load

       /**
        * Star/Unstar project for user - send AJAX and update UI
        *
        * @param boolean isProjectStarredByUser
        */
        function toggleStarred(isProjectStarredByUser) {
            var basUrl = fcConfig.starProjectUrl;
            var query = "?userId=${user?.userId}&projectId=${project?.projectId}";
            if (isProjectStarredByUser) {
                // remove star
                $.getJSON(basUrl + "/remove" + query, function(data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $("#starBtn i").removeClass("icon-star").addClass("icon-star-empty");
                        $("#starBtn span").text("Add to favourites");
                    }
                }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
            } else {
                // add star
                $.getJSON(basUrl + "/add" + query, function(data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $("#starBtn i").removeClass("icon-star-empty").addClass("icon-star");
                        $("#starBtn span").text("Remove from favourites");
                    }
                }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
            }
        }
</r:script>

<g:if test="${user?.isAdmin || user?.isCaseManager}">
    <r:script>
        // Admin JS code only exposed to admin users
        $(window).load(function () {

            // remember state of admin nav (vertical tabs)
            $('#adminNav a[data-toggle="tab"]').on('shown', function (e) {
                var tab = e.currentTarget.hash;
                amplify.store('project-admin-tab-state', tab);
            });
            var storedAdminTab = amplify.store('project-admin-tab-state');
            // restore state if saved
            if (storedAdminTab === '') {
                $('#permissions-tab').tab('show');
            } else {
                $(storedAdminTab + "-tab").tab('show');
            }
            populatePermissionsTable();
        });

    </r:script>
</g:if>
</body>
</html>