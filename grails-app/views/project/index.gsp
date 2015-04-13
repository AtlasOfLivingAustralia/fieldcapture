<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
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
        organisationLinkBaseUrl: "${grailsApplication.config.collectory.baseURL + 'public/show/'}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"
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
    <r:require modules="gmap3,mapWithFeatures,knockout,datepicker,amplify,jqueryValidationEngine, projects, attachDocuments, wmd"/>
</head>
<body>
<div id="spinner" class="spinner" style="position: fixed;top: 50%;left: 50%;margin-left: -50px;margin-top: -50px;text-align:center;z-index:1234;overflow: auto;width: 100px;height: 102px;">
    <img id="img-spinner" width="50" height="50" src="${request.contextPath}/images/loading.gif" alt="Loading"/>
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
    <g:set var="tabIsActive"><g:if test="${user?.hasViewAccess}">tab</g:if></g:set>
    <ul id="projectTabs" class="nav nav-tabs big-tabs">
        <li class="active"><a href="#overview" id="overview-tab" data-toggle="tab">Overview</a></li>
        <li><a href="#details" id="details-tab" data-toggle="${tabIsActive}">MERI Plan</a></li>
        <li><a href="#plan" id="plan-tab" data-toggle="${tabIsActive}">Activities</a></li>
        <li><a href="#site" id="site-tab" data-toggle="${tabIsActive}">Sites</a></li>
        <li><a href="#dashboard" id="dashboard-tab" data-toggle="${tabIsActive}">Dashboard</a></li>
        <g:if test="${user?.isAdmin || user?.isCaseManager}"><li><a href="#admin" id="admin-tab" data-toggle="tab">Admin</a></li></g:if>
    </ul>


    <div class="tab-content" style="overflow:visible;display:none">
        <div class="tab-pane active" id="overview">
            <!-- OVERVIEW -->
            <div class="row-fluid">
                <div class="clearfix" data-bind="visible:organisation()||organisationName()">
                    <h4>
                        Recipient:
                        <a data-bind="visible:organisation(),text:transients.collectoryOrgName,attr:{href:fcConfig.organisationLinkBaseUrl + organisation()}"></a>
                        <span data-bind="visible:organisationName(),text:organisationName"></span>
                    </h4>
                </div>
                <div class="clearfix" data-bind="visible:serviceProviderName()">
                    <h4>
                        Service provider:
                        <span data-bind="text:serviceProviderName"></span>
                    </h4>
                </div>
                <div class="clearfix" data-bind="visible:associatedProgram()">
                    <h4>
                        Programme:
                        <span data-bind="text:associatedProgram"></span>
                        <span data-bind="text:associatedSubProgram"></span>
                    </h4>
                </div>
                <div class="clearfix" data-bind="visible:funding()">
                    <h4>
                        Approved funding (GST inclusive): <span data-bind="text:funding.formattedCurrency"></span>
                    </h4>

                </div>

                <div data-bind="visible:plannedStartDate()">
                    <h4>
                        Project start: <span data-bind="text:plannedStartDate.formattedDate"></span>
                        <span data-bind="visible:plannedEndDate()">Project finish: <span data-bind="text:plannedEndDate.formattedDate"></span></span>
                    </h4>
                </div>

                <div class="clearfix" style="font-size:14px;">
                    <div class="span3" data-bind="visible:status" style="margin-bottom: 0">
                        <span data-bind="if: status().toLowerCase() == 'active'">
                            Project Status:
                            <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-success" style="font-size: 13px;"></span>
                        </span>
                        <span data-bind="if: status().toLowerCase() == 'completed'">
                            Project Status:
                            <span style="text-transform:uppercase;" data-bind="text:status" class="badge badge-info" style="font-size: 13px;"></span>
                        </span>

                    </div>
                    <div class="span3" data-bind="visible:grantId" style="margin-bottom: 0">
                        Grant Id:
                        <span data-bind="text:grantId"></span>
                    </div>
                    <div class="span3" data-bind="visible:externalId" style="margin-bottom: 0">
                        External Id:
                        <span data-bind="text:externalId"></span>
                    </div>
                    <div class="span3" data-bind="visible:manager" style="margin-bottom: 0">
                        Manager:
                        <span data-bind="text:manager"></span>
                    </div>

                </div>
                <div data-bind="visible:description()">
                    <p class="well well-small more" data-bind="text:description"></p>
                </div>
            </div>
            <div class="row-fluid">
                <!-- show any primary images -->
                <div data-bind="visible:primaryImages() !== null,foreach:primaryImages,css:{span5:primaryImages()!=null}">
                    <div class="thumbnail with-caption space-after">
                        <img class="img-rounded" data-bind="attr:{src:url, alt:name}" alt="primary image"/>
                        <p class="caption" data-bind="text:name"></p>
                        <p class="attribution" data-bind="visible:attribution"><small><span data-bind="text:attribution"></span></small></p>
                    </div>
                </div>

                <!-- show other documents -->
                <div id="documents" data-bind="css: { span3: primaryImages() != null, span7: primaryImages() == null }">
                    <h4>Project documents</h4>
                    <div data-bind="visible:documents().length == 0">
                        No documents are currently attached to this project.
                        <g:if test="${user?.isAdmin}">To add a document use the Documents section of the Admin tab.</g:if>
                    </div>
                    <g:render plugin="fieldcapture-plugin" template="/shared/listDocuments"
                              model="[useExistingModel: true,editable:false, filterBy: 'all', ignore: 'programmeLogic', imageUrl:resource(dir:'/images/filetypes'),containerId:'overviewDocumentList']"/>
                </div>

                <div class="span4">
                    <div data-bind="visible:newsAndEvents()">
                        <h4>News and events</h4>
                        <div id="newsAndEventsDiv" data-bind="html:newsAndEvents" class="well"></div>
                    </div>
                    <div data-bind="visible:projectStories()">
                        <h4>Project stories</h4>
                        <div id="projectStoriesDiv" data-bind="html:projectStories" class="well"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-pane" id="details">
            <!-- Project Details -->
            <g:render template="projectDetails" model="[project: project]"/>

            <div class="row-fluid space-after">
                <div class="span6">
                    <div class="well well-small">
                        <label><b>MERI attachments:</b></label>
							<g:render plugin="fieldcapture-plugin" template="/shared/listDocuments"
                                  model="[useExistingModel: true,editable:false, filterBy: 'programmeLogic', ignore: '', imageUrl:resource(dir:'/images/filetypes'),containerId:'overviewDocumentList']"/>
                    </div>
                </div>
            </div>
        </div>

        <g:if test="${user?.hasViewAccess}">
            <div class="tab-pane" id="plan">
            <!-- PLANS -->
                <g:if test="${useAltPlan}">
                    <g:render  plugin="fieldcapture-plugin" template="/shared/plan"
                              model="[activities:activities ?: [], sites:project.sites ?: [], showSites:true]"/>
                </g:if>
                <g:else>
                    <g:render template="/shared/activitiesPlan"
                              model="[activities:activities ?: [], sites:project.sites ?: [], showSites:true]"/>
                </g:else>
                <g:if test="${user?.isCaseManager}">
                    <div class="validationEngineContainer" id="grantmanager-validation">
                        <g:render template="grantManagerSettings" model="[project:project]"/>
                    </div>
                </g:if>
                <div class="validationEngineContainer" id="risk-validation">
                    <g:render template="riskTable" model="[project:project]"/>
                </div>
            </div>

            <div class="tab-pane" id="site">
                <!-- SITES -->
                <!-- ko stopBinding:true -->
                <g:render plugin="fieldcapture-plugin" template="/site/sitesList"/>
                <!-- /ko -->

            </div>

            <div class="tab-pane" id="dashboard">
                <!-- DASHBOARD -->
                <g:render plugin="fieldcapture-plugin" template="dashboard"/>
            </div>
        </g:if>
        <g:if test="${user?.isAdmin || user?.isCaseManager}">
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
                                        <g:render plugin="fieldcapture-plugin" template="/shared/listDocuments"
                                                  model="[useExistingModel: true,editable:true, filterBy: 'all', ignore: '', imageUrl:resource(dir:'/images/filetypes'),containerId:'adminDocumentList']"/>
                                    </div>
                                </div>
                                %{--The modal view containing the contents for a modal dialog used to attach a document--}%
                                <g:render plugin="fieldcapture-plugin" template="/shared/attachDocument"/>
                                <div class="row-fluid attachDocumentModal">
                                    <button class="btn" id="doAttach" data-bind="click:attachDocument">Attach Document</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </g:if>
    </div>

    <g:render template="/shared/timeoutMessage" plugin="fieldcapture-plugin" model="${[url:createLink(action:'index', id:project.projectId)]}"/>
    <g:render template="/shared/unsavedChanges" plugin="fieldcapture-plugin" model="${[id:'meriPlanUnsavedChanges', unsavedData:'MERI Plan']}"/>
    <g:render template="/shared/unsavedChanges" plugin="fieldcapture-plugin" model="${[id:'risksUnsavedChanges', unsavedData:'Risks & Threats']}"/>

    <g:if env="development">
        <hr />
        <div class="expandable-debug">
            <h3>Debug</h3>
            <div>
                <h4>KO model</h4>
                <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                <h4>Activities</h4>
                <pre>${activities?.encodeAsHTML()}</pre>
                <h4>Sites</h4>
                <pre>${project.sites?.encodeAsHTML()}</pre>
                <h4>Project</h4>
                <pre>${project?.encodeAsHTML()}</pre>
                <h4>Features</h4>
                <pre>${mapFeatures}</pre>
                <h4>activityTypes</h4>
                <pre>${activityTypes}</pre>
            </div>
        </div>
    </g:if>
</div>
<r:script>


        var organisations = ${institutions};

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
            $('.helphover').popover({animation: true, trigger:'hover'});

            $('#cancel').click(function () {
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });
            $('#details-cancel').click(function () {
                amplify.store(PROJECT_DETAILS_KEY, null);
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });
            $('#risks-cancel').click(function () {
                amplify.store(PROJECT_RISKS_KEY, null);
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });
            $('#summary-cancel').click(function () {
                document.location.href = "${createLink(action: 'index', id: project.projectId)}";
            });

            var DetailsViewModel = function(o, period) {
            	var self = this;
				this.status = ko.observable(o.status);
				this.obligations = ko.observable(o.obligations);
				this.policies = ko.observable(o.policies);
				this.caseStudy = ko.observable(o.caseStudy ? o.caseStudy : false);
            	this.keq = new GenericViewModel(o.keq);
            	this.objectives = new ObjectiveViewModel(o.objectives);
            	this.priorities = new GenericViewModel(o.priorities);
				this.implementation = new ImplementationViewModel(o.implementation);
				this.partnership = new GenericViewModel(o.partnership);
				this.lastUpdated = o.lastUpdated ? o.lastUpdated : moment().format();
				this.budget = new BudgetViewModel(o.budget, period);

            	var row = [];
            	o.events ? row = o.events : row.push(ko.mapping.toJS(new EventsRowViewModel()));
				this.events = ko.observableArray($.map(row, function (obj, i) {
					return new EventsRowViewModel(obj);
			    }));

			    this.modelAsJSON = function() {
			        var tmp = {};
					tmp['details'] =  ko.mapping.toJS(self);
					var jsData = {"custom": tmp};
                    var json = JSON.stringify(jsData, function (key, value) {
                           return value === undefined ? "" : value;
                       });
                    return json;
			    };
            };

            var ObjectiveViewModel = function(o) {
            	var self = this;
            	if(!o) o = {};

            	var row = [];
            	o.rows ? row = o.rows : row.push(ko.mapping.toJS(new GenericRowViewModel()));
            	this.rows = ko.observableArray($.map(row, function (obj, i) {
					return new GenericRowViewModel(obj);
			    }));

            	var row1 = [];
            	o.rows1 ? row1 = o.rows1 : row1.push(ko.mapping.toJS(new OutcomeRowViewModel()));
            	this.rows1 = ko.observableArray($.map(row1, function (obj, i) {
					return new OutcomeRowViewModel(obj);
			    }));
            };
            var ImplementationViewModel = function(o) {
            	var self = this;
            	if(!o) o = {};
            	this.description = ko.observable(o.description);
            };

            //National, Partnership and KEQ
            var GenericViewModel = function(o) {
            	var self = this;
            	if(!o) o = {};
            	this.description = ko.observable(o.description);
            	var row = [];
            	o.rows ? row = o.rows : row.push(ko.mapping.toJS(new GenericRowViewModel()));
            	this.rows = ko.observableArray($.map(row, function (obj,i) {
			         return new GenericRowViewModel(obj);
			    }));
            };

            var GenericRowViewModel = function(o) {
            	var self = this;
            	if(!o) o = {};
            	this.data1 = ko.observable(o.data1);
            	this.data2 = ko.observable(o.data2);
            	this.data3 = ko.observable(o.data3);
            };

            var EventsRowViewModel = function(o) {
            	var self = this;
            	if(!o) o = {};
            	this.name = ko.observable(o.name);
            	this.description = ko.observable(o.description);
            	this.media = ko.observable(o.media);
            	this.scheduledDate = ko.observable(o.scheduledDate).extend({simpleDate: false});
            };

            var OutcomeRowViewModel = function(o) {
            	var self = this;
            	if(!o) o = {};
            	this.description = ko.observable(o.description);
            	if(!o.assets) o.assets = [];
            	this.assets = ko.observableArray(o.assets);

            };

            var BudgetViewModel = function(o, period){
            	var self = this;
            	if(!o) o = {};

            	this.overallTotal = ko.observable(0.0);

				var headerArr = [];
				for(i = 0; i < period.length; i++){
					headerArr.push({"data":period[i]});
				}
				this.headers = ko.observableArray(headerArr);

				var row = [];
				o.rows ? row = o.rows : row.push(ko.mapping.toJS(new BudgetRowViewModel({},period)));
            	this.rows = ko.observableArray($.map(row, function (obj, i) {
                    // Headers don't match with previously stored headers, adjust rows accordingly.
					if(o.headers && period && o.headers.length != period.length) {
						var updatedRow = [];
						for(i = 0; i < period.length; i++) {
							var index = -1;

							for(j = 0; j < o.headers.length; j++) {
								if(period[i] == o.headers[j].data) {
									index = j;
									break;
								}
							}
							updatedRow.push(index != -1 ? obj.costs[index] : 0.0)
							index = -1;
						}
						obj.costs = updatedRow;
					}

					return new BudgetRowViewModel(obj,period);
			    }));

			    this.overallTotal = ko.computed(function (){
			    	var total = 0.0;
            		ko.utils.arrayForEach(this.rows(), function(row) {
           				if(row.rowTotal()){
           					total += parseFloat(row.rowTotal());
           				}
    				});
			    	return total;
			    },this).extend({currency:{}});

			    var allBudgetTotal = [];
			    for(i = 0; i < period.length; i++){
					allBudgetTotal.push(new BudgetTotalViewModel(this.rows, i));
				}
			    this.columnTotal = ko.observableArray(allBudgetTotal);
            };

			//col total
            var BudgetTotalViewModel = function (rows, index){
            	var self = this;
            	this.data =  ko.computed(function (){
            		var total = 0.0;
            		ko.utils.arrayForEach(rows(), function(row) {
           				if(row.costs()[index]){
           					total += parseFloat(row.costs()[index].dollar());
           				}
    				});
    				return total;
            	},this).extend({currency:{}});
            };

            var BudgetRowViewModel = function(o,period) {
            	var self = this;
            	if(!o) o = {};
            	this.shortLabel = ko.observable(o.shortLabel);
            	this.description = ko.observable(o.description);

            	var arr = [];
            	for(i = 0 ; i < period.length; i++)
            		arr.push(ko.mapping.toJS(new FloatViewModel()));

				//Incase if timeline is generated.
				if(o.costs && o.costs.length != arr.length) {
					o.costs = arr;
				}
				o.costs ? arr = o.costs : arr;
            	this.costs = ko.observableArray($.map(arr, function (obj, i) {
					return new FloatViewModel(obj);
			    }));

            	this.rowTotal = ko.computed(function (){
            		var total = 0.0;
            		ko.utils.arrayForEach(this.costs(), function(cost) {
            			if(cost.dollar())
            				total += parseFloat(cost.dollar());
    				});
					return total;
            	},this).extend({currency:{}});

            };

            var FloatViewModel = function(o){
            	var self = this;
            	if(!o) o = {};
            	self.dollar = ko.observable(o.dollar ? o.dollar : 0.0).extend({numericString:0}).extend({currency:{}});
            };

			var RisksViewModel = function(risks) {

				 var self = this;
				 this.overallRisk = ko.observable();
				 this.status = ko.observable();
				 this.rows = ko.observableArray();
			     this.load = function(risks) {
			         if (!risks) {
			             risks = {};
			         }
			         self.overallRisk(orBlank(risks.overallRisk));
                     self.status(orBlank(risks.status));
			         if (risks.rows) {
                         self.rows($.map(risks.rows, function (obj) {
                            return new RisksRowViewModel(obj);
                         }));
			         }
			         else {
			            self.rows.push(new RisksRowViewModel());
			         }
			     };
			     this.modelAsJSON = function() {
			         var tmp = {};
					 tmp = ko.mapping.toJS(self);
					 tmp['status'] = 'active';
					 var jsData = {"risks": tmp};
					 var json = JSON.stringify(jsData, function (key, value) {
                        return value === undefined ? "" : value;
                     });
                     return json;
			     };
			     this.load(risks);
			};

			var RisksRowViewModel = function(risksRow) {
				 var self = this;
				 if(!risksRow) risksRow = {};
				 this.threat = ko.observable(risksRow.threat);
				 this.description = ko.observable(risksRow.description);
				 this.likelihood = ko.observable(risksRow.likelihood);
				 this.consequence = ko.observable(risksRow.consequence);
				 this.currentControl = ko.observable(risksRow.currentControl);
				 this.residualRisk = ko.observable(risksRow.residualRisk);
				 this.riskRating = ko.computed(function (){
				 		if (this.likelihood() == '' && this.consequence() == '')
				 			return;

			 			var riskCol = ["Insignificant","Minor","Moderate","Major","Extreme"];
			            var riskTable = [
			              		["Almost Certain","Medium","Significant","High","High","High"],
			              		["Likely","Low","Medium","Significant","High","High"],
			              		["Possible","Low","Medium","Medium","Significant","High"],
			              		["Unlikely","Low","Low","Medium","Medium","Significant"],
			              		["Remote","Low","Low","Low","Medium","Medium"]
			              	];
			 			var riskRating = "";
						var riskRowIndex = -1;

						for(var i = 0; i < riskTable.length; i++) {
							if(riskTable[i][0] == this.likelihood()){
								riskRowIndex = i;
								break;
							}
						}

						if(riskRowIndex >= 0){
							for(var i = 0; i < riskCol.length; i++) {
								if(riskCol[i] == this.consequence()){
									riskRating = riskTable[riskRowIndex][i+1];
									break;
								}
							}
						}
            			return riskRating;
                 }, this);
			};

			function limitText(field, maxChar){
				$(field).attr('maxlength',maxChar);
			}

            function ViewModel(project, newsAndEvents, projectStories, sites, activities, isUserEditor,today,themes) {
                var self = this;
                self.name = ko.observable(project.name);
                self.description = ko.observable(project.description);
                self.externalId = ko.observable(project.externalId);
                self.grantId = ko.observable(project.grantId);
                self.workOrderId = ko.observable(project.workOrderId);
                self.manager = ko.observable(project.manager);
                self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
                self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});
                self.contractStartDate = ko.observable(project.contractStartDate).extend({simpleDate: false});
                self.contractEndDate = ko.observable(project.contractEndDate).extend({simpleDate: false});

                self.funding = ko.observable(project.funding).extend({currency:{}});
                self.regenerateProjectTimeline = ko.observable(false);
				self.userIsCaseManager = ko.observable(${user?.isCaseManager});
				self.userIsAdmin = ko.observable(${user?.isAdmin});
				
				var projectDefault = "active";
				if(project.status){
					projectDefault = project.status; 
				}
				self.status = ko.observable(projectDefault.toLowerCase());
				self.projectStatus = [{id: 'active', name:'Active'},{id:'completed',name:'Completed'}];
				self.promote = [{id: 'yes', name:'Yes'},{id:'no',name:'No'}];
				self.promoteOnHomepage = ko.observable(project.promoteOnHomepage);

                // todo: move this to mongodb lookup.
 	            self.threatOptions = [
	                'Blow-out in cost of project materials',
	                'Changes to regional boundaries affecting the project area',
					'Co-investor withdrawal / investment reduction',
					'Lack of delivery partner capacity',
					'Lack of delivery partner / landholder interest in project activities',
					'Organisational restructure / loss of corporate knowledge',
					'Organisational risk (strategic, operational, resourcing and project levels)',
					'Seasonal conditions (eg. drought, flood, etc.)',
					'Timeliness of project approvals processes',
					'Workplace health & safety (eg. Project staff and / or delivery partner injury or death)'
	        	];
	        	self.likelihoodOptions = [
	                'Almost Certain',
	                'Likely',
	                'Possible',
	                'Unlikely',
					'Remote'
	        	];

	        	self.consequenceOptions = [
	        		'Insignificant',
	        		'Minor',
	        		'Moderate',
	        		'Major',
	        		'Extreme'
	        	];

	        	self.ratingOptions =[
	        		'High',
	        		'Significant',
	        		'Medium',
	        		'Low'
	        	];

				self.obligationOptions =[
	        		'Yes',
	        		'No'
	        	];

	        	self.organisations =[
					'Academic/research institution',
					'Australian Government Department',
					'Commercial entity',
					'Community group',
					'Farm/Fishing Business',
					'If other, enter type',
					'Indigenous Organisation',
					'Individual',
					'Local Government',
					'Other',
					'Primary Industry group',
					'School',
					'State Government Organisation',
					'Trust',
	        	];

	        	self.protectedNaturalAssests =[
					'Natural/Cultural assets managed',
					'Threatened Species',
					'Threatened Ecological Communities',
					'Migratory Species',
					'Ramsar Wetland',
					'World Heritage area',
					'Community awareness/participation in NRM',
					'Indigenous Cultural Values',
					'Indigenous Ecological Knowledge',
					'Remnant Vegetation',
					'Aquatic and Coastal systems including wetlands',
					'Not Applicable'
	        	];
	        	self.projectThemes =  $.map(themes, function(theme, i) {
	                	return theme.name;
	                });
	            self.projectThemes.push("MERI & Admin");
	            self.projectThemes.push("Others");    

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

				if(!project.custom){
					project.custom = {};
				}
				if(!project.custom.details){
					project.custom.details = {};
				}

                var projectDetails = project.custom.details;
                var savedProjectCustomDetails = amplify.store(PROJECT_DETAILS_KEY);
                if (savedProjectCustomDetails) {
                    var restored = JSON.parse(savedProjectCustomDetails);

                    if (restored.custom) {
                        $('#restoredData').show();
                        projectDetails = restored.custom.details;
                    }
                }
                self.details = new DetailsViewModel(projectDetails, getBugetHeaders(project.timeline));

                var projectRisks = project.risks;
                var savedRisks = amplify.store(PROJECT_RISKS_KEY);
                if (savedRisks) {
                    var restored = JSON.parse(savedRisks);
                    if (restored.risks) {
                        $('#restoredRiskData').show();
                        projectRisks = restored.risks;
                    }
                }
                self.risks = new RisksViewModel(projectRisks);

                self.isProjectDetailsSaved = ko.computed (function (){
                	return (project['custom']['details'].status == 'active');
                });
                self.isProjectDetailsLocked = ko.computed (function (){
                	return (project.planStatus == 'approved' || project.planStatus =='submitted');
                });

                self.detailsLastUpdated = ko.observable(project.custom.details.lastUpdated).extend({simpleDate: true});
				self.planStatus = ko.observable(project.planStatus);

                self.addObjectives = function(){
					self.details.objectives.rows.push(new GenericRowViewModel());
    			};
    			 self.addOutcome = function(){
					self.details.objectives.rows1.push(new OutcomeRowViewModel());
    			};
				self.removeObjectives = function(row){
                	self.details.objectives.rows.remove(row);
                };
                self.removeObjectivesOutcome = function(row){
                	self.details.objectives.rows1.remove(row);
                };
                self.addNationalAndRegionalPriorities = function(){
					self.details.priorities.rows.push(new GenericRowViewModel());
    			};
                self.removeNationalAndRegionalPriorities = function(row){
                	self.details.priorities.rows.remove(row);
                };

                self.addKEQ = function(){
					self.details.keq.rows.push(new GenericRowViewModel());
    			};
                self.removeKEQ = function(keq){
                	self.details.keq.rows.remove(keq);
                };

                self.mediaOptions = [{id:"yes",name:"Yes"},{id:"no",name:"No"}];

                self.addEvents = function(){
					self.details.events.push(new EventsRowViewModel());
    			};
                self.removeEvents = function(event){
                	self.details.events.remove(event);
                };

                self.addPartnership = function(){
					self.details.partnership.rows.push (new GenericRowViewModel());
    			};
                self.removePartnership = function(partnership){
                	self.details.partnership.rows.remove(partnership);
                };

                //Risks details
				self.addRisks = function(){
               		self.risks.rows.push(new RisksRowViewModel());
                };
                self.removeRisk = function(risk) {
					self.risks.rows.remove(risk);
                };

                self.projectDatesChanged = ko.computed(function() {
                    return project.plannedStartDate != self.plannedStartDate() ||
                           project.plannedEndDate != self.plannedEndDate();
                });

				self.overAllRiskHighlight = ko.computed(function () {
					return getClassName(self.risks.overallRisk());
    			});

				function getClassName(val){
					var className = '';
					if(val == 'High')
			     		className = 'badge badge-important';
			     	else if (val == 'Significant')
			     		className = 'badge badge-warning';
					else if (val == 'Medium')
			     		className = 'badge badge-info';
					else if (val == 'Low')
			     		className = 'badge badge-success';
					return className;
				}

				self.addBudget = function(){
					self.details.budget.rows.push (new BudgetRowViewModel({},getBugetHeaders(project.timeline)));
    			};
                self.removeBudget = function(budget){
                	self.details.budget.rows.remove(budget);
                };
                self.organisation = ko.observable(project.organisation);
                self.organisationName = ko.observable(project.organisationName);
                self.serviceProviderName = ko.observable(project.serviceProviderName);
                self.associatedProgram = ko.observable(); // don't initialise yet - we want the change to trigger dependents
                self.associatedSubProgram = ko.observable(project.associatedSubProgram);
                self.newsAndEvents = ko.observable(newsAndEvents);
                self.projectStories = ko.observable(projectStories);
                self.mapLoaded = ko.observable(false);

                self.transients = {};
				self.transients.variation = ko.observable();
                self.transients.organisations = organisations;
                self.transients.collectoryOrgName = ko.computed(function () {
                    if (self.organisation() === undefined || self.organisation() === '') {
                        return "";
                    } else {
                        return $.grep(self.transients.organisations, function (obj) {
                            return obj.uid === self.organisation();
                        })[0].name;
                    }
                });
                self.transients.programsModel = [];
                self.transients.programs = [];
                self.transients.subprograms = {};
                self.transients.subprogramsToDisplay = ko.computed(function () {
                    return self.transients.subprograms[self.associatedProgram()];
                });

                var calculateDuration = function(startDate, endDate) {
                    if (!startDate || !endDate) {
                        return '';
                    }
                    var start = moment(startDate);
                    var end = moment(endDate);
                    var durationInDays = end.diff(start, 'days');

                    return Math.ceil(durationInDays/7);
                };
                var calculateEndDate = function(startDate, duration) {
                    var start =  moment(startDate);
                    var end = start.add(duration*7, 'days');
                    return end.toDate().toISOStringNoMillis();
                };

                var contractDatesFixed = function() {
                    var programs = self.transients.programsModel.programs;
                    for (var i=0; i<programs.length; i++) {
                        console.log(programs[i]);

                        if (programs[i].name === self.associatedProgram()) {
                        console.log(programs[i].name);
                            return programs[i].projectDatesContracted;
                        }
                    }
                    return true;
                }

                var updatingDurations = false; // Flag to prevent endless loops during change of end date / duration.

                self.transients.plannedDuration = ko.observable(calculateDuration(self.plannedStartDate(), self.plannedEndDate()));
                self.transients.plannedDuration.subscribe(function(newDuration) {
                    if (updatingDurations) {
                        return;
                    }
                    try {
                        updatingDurations = true;
                        self.plannedEndDate(calculateEndDate(self.plannedStartDate(), newDuration));
                    }
                    finally {
                        updatingDurations = false;
                    }
                });

                self.plannedEndDate.subscribe(function(newEndDate) {
                    if (updatingDurations) {
                        return;
                    }
                    try {
                        updatingDurations = true;
                        self.transients.plannedDuration(calculateDuration(self.plannedStartDate(), newEndDate));
                    }
                    finally {
                        updatingDurations = false;
                    }
                });

                self.plannedStartDate.subscribe(function(newStartDate) {
                    if (updatingDurations) {
                        return;
                    }
                    if (contractDatesFixed()) {
                        if (!self.plannedEndDate()) {
                            return;
                        }
                        try {
                            updatingDurations = true;
                            self.transients.plannedDuration(calculateDuration(newStartDate, self.plannedEndDate()));
                        }
                        finally {
                            updatingDurations = false;
                        }
                    }
                    else {
                        if (!self.transients.plannedDuration()) {
                            return;
                        }
                        try {
                            updatingDurations = true;
                            self.plannedEndDate(calculateEndDate(newStartDate, self.transients.plannedDuration()));
                        }
                        finally {
                            updatingDurations = false;
                        }
                    }
                });

                self.transients.contractDuration = ko.observable(calculateDuration(self.contractStartDate(), self.contractEndDate()));
                self.transients.contractDuration.subscribe(function(newDuration) {
                    if (updatingDurations) {
                        return;
                    }
                    if (!self.contractStartDate()) {
                        return;
                    }
                    try {
                        updatingDurations = true;
                        self.contractEndDate(calculateEndDate(self.contractStartDate(), newDuration));
                    }
                    finally {
                        updatingDurations = false;
                    }
                });


                self.contractEndDate.subscribe(function(newEndDate) {
                    if (updatingDurations) {
                        return;
                    }
                    if (!self.contractStartDate()) {
                        return;
                    }
                    try {
                        updatingDurations = true;
                        self.transients.contractDuration(calculateDuration(self.contractStartDate(), newEndDate));
                    }
                    finally {
                        updatingDurations = false;
                    }
                });

                self.contractStartDate.subscribe(function(newStartDate) {
                    if (updatingDurations) {
                        return;
                    }
                    if (contractDatesFixed()) {
                        if (!self.contractEndDate()) {
                            return;
                        }
                        try {
                            updatingDurations = true;
                            self.transients.contractDuration(calculateDuration(newStartDate, self.contractEndDate()));
                        }
                        finally {
                            updatingDurations = false;
                        }
                    }
                    else {
                        if (!self.transients.contractDuration()) {
                            return;
                        }
                        try {
                            updatingDurations = true;
                            self.contractEndDate(calculateEndDate(newStartDate, self.transients.contractDuration()));
                        }
                        finally {
                            updatingDurations = false;
                        }
                    }
                });

                self.loadPrograms = function (programsModel) {
                    self.transients.programsModel = programsModel;
                    $.each(programsModel.programs, function (i, program) {
                        if (program.readOnly) {
                            return;
                        }
                        self.transients.programs.push(program.name);
                        self.transients.subprograms[program.name] = $.map(program.subprograms,function (obj, i){return obj.name});

                    });
                    self.associatedProgram(project.associatedProgram); // to trigger the computation of sub-programs
                };

                self.removeTransients = function (jsData) {
                    delete jsData.transients;
                    return jsData;
                };

				self.saveProjectDetails = function(){
					self.saveProject(false);
				};

				self.saveAnnouncements= function(){
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

				// Save risks details.
				self.saveRisks = function(){

					if (!$('#risk-validation').validationEngine('validate'))
						return;
                    self.risks.saveWithErrorDetection(function() {location.reload();});

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
	                     	plannedEndDate: self.plannedEndDate(),
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
                            organisation: self.organisation(),
                            organisationName: self.organisationName(),
                            serviceProviderName: self.serviceProviderName(),
                            associatedProgram: self.associatedProgram(),
                            associatedSubProgram: self.associatedSubProgram(),
                            funding: new Number(self.funding()),
                            status:self.status(),
                            promoteOnHomepage:self.promoteOnHomepage()
                        };

                        if (self.regenerateProjectTimeline()) {
                            var dates = {
                                plannedStartDate: self.plannedStartDate(),
                                plannedEndDate: self.plannedEndDate()
                            };
                            var program = $.grep(self.transients.programsModel.programs, function(program, index) {
                                return program.name == self.associatedProgram();
                            });

                            if (program[0]) {
                                addTimelineBasedOnStartDate(dates, program[0].reportingPeriod, program[0].reportingPeriodAlignedToCalendar);
                            }
                            else {
                                addTimelineBasedOnStartDate(dates);
                            }
                            jsData.timeline = dates.timeline;
                        }
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

                // documents
                self.documents = ko.observableArray();
                self.addDocument = function(doc) {
                    // check permissions
                    if ((isUserEditor && doc.role !== 'approval') ||  doc.public) {
                    	doc.maxStages = '${project.timeline?.size()}';
                        self.documents.push(new DocumentViewModel(doc));
                    }
                };

                self.attachDocument = function() {
                    var url = '${g.createLink(controller:"proxy", action:"documentUpdate")}';
                    showDocumentAttachInModal( url,
                    		new DocumentViewModel({role:'information', maxStages:'${project.timeline?.size()}'},{key:'projectId', value:'${project.projectId}'}), 
                    		'#attachDocument')
                        	.done(function(result){self.documents.push(new DocumentViewModel(result))});
                };
                self.editDocumentMetadata = function(document) {
                    var url = '${g.createLink(controller:"proxy", action:"documentUpdate")}' + "/" + document.documentId;
                    showDocumentAttachInModal( url, document, '#attachDocument')
                        .done(function(result){
                            window.location.href = here; // The display doesn't update properly otherwise.
                        });
                };
                self.deleteDocument = function(document) {
                    var url = '${g.createLink(controller:"proxy", action:"deleteDocument")}/'+document.documentId;
                    $.post(url, {}, function() {self.documents.remove(document);});

                };
                // this supports display of the project's primary images
                this.primaryImages = ko.computed(function () {
                    var pi = $.grep(self.documents(), function (doc) {
                        return ko.utils.unwrapObservable(doc.isPrimaryProjectImage);
                    });
                    return pi.length > 0 ? pi : null;
                });

                $.each(project.documents, function(i, doc) {
                    self.addDocument(doc);
                });

            } // end of view model

            var newsAndEventsMarkdown = '${(project.newsAndEvents?:"").markdownToHtml().encodeAsJavaScript()}';
            var projectStoriesMarkdown = '${(project.projectStories?:"").markdownToHtml().encodeAsJavaScript()}';
            var today = '${today}';
            var programs = <fc:modelAsJavascript model="${programs}"/>;

            var project = <fc:modelAsJavascript model="${project}"/>;
            var viewModel = new ViewModel(
                checkAndUpdateProject(project),
                newsAndEventsMarkdown,
                projectStoriesMarkdown,
                ${project.sites},
                ${activities ?: []},
                ${user?.isEditor?:false},
                today,
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
                    successMessage: 'MERI Plan saved'
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
                    successMessage: 'Successfully saved'
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

                    // set trigger for site reverse geocoding
                    sitesViewModel.triggerGeocoding();
                    sitesViewModel.displaySites();
                }
                if (tab === '#plan' && !planTabInitialised) {
                    $.event.trigger({type:'planTabShown'});
                    planTabInitialised = true;
                }
                if (tab == '#dashboard' && !dashboardInitialised) {
                    $.event.trigger({type:'dashboardShown'});
                    dashboardInitialised;
                }
            });

            var newsAndEventsInitialised = false;
            $('#editNewsAndEvents-tab').on('shown', function() {
                if (!newsAndEventsInitialised) {
                    var newsAndEventsViewModel = new window.newsAndEventsViewModel(viewModel, newsAndEventsMarkdown);
                    ko.applyBindings(newsAndEventsViewModel, $('#editnewsAndEventsContent')[0]);
                    newsAndEventsInitialised = true;
                }

            });
            var projectStoriesInitialised = false;
            $('#editProjectStories-tab').on('shown', function() {
                if (!projectStoriesInitialised) {
                    var projectStoriesViewModel = new window.projectStoriesViewModel(viewModel, projectStoriesMarkdown);
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