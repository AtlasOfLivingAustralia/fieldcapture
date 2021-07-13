<%@ page import="au.org.ala.merit.ProjectController" contentType="text/html;charset=UTF-8" expressionCodec="none"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${project?.name.encodeAsHTML()} | Project | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
        var fcConfig = {
                serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
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
                siteUploadUrl: "${createLink(controller: 'site', action: 'siteUpload', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId)])}",
                starProjectUrl: "${createLink(controller: 'project', action: 'starProject')}",
                addUserRoleUrl: "${createLink(controller: 'user', action: 'addUserAsRoleToProject')}",
                removeUserWithRoleUrl: "${createLink(controller: 'user', action: 'removeUserWithRole')}",
                projectMembersUrl: "${createLink(controller: 'project', action: 'getMembersForProjectId')}",
                spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
                spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
                spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
                geoserverUrl: "${grailsApplication.config.getProperty('spatial.geoserverUrl')}",
                sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
                sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
                featureServiceUrl: "${createLink(controller: 'proxy', action:'feature')}",
                organisationLinkBaseUrl: "${createLink(controller:'organisation', action:'index')}",
                imageLocation: "${assetPath(src:'/')}",
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
                projectReportUrl: "${createLink(controller:'project', action:'projectReport', id:project.projectId)}",
                projectReportPDFUrl: "${createLink(controller:'project', action:'projectReportPDF', id:project.projectId)}",
                meriPlanPDFUrl: "${createLink(controller:'project', action:'meriPlanPDF', id:project.projectId)}",
                sitesPhotoPointsUrl: "${createLink(controller:'project', action:'projectSitePhotos', id:project.projectId)}",
                organisationSearchUrl: "${createLink(controller: 'organisation', action: 'search')}",
                submitReportUrl: "${createLink(controller: 'project', action: 'ajaxSubmitReport', id:project.projectId)}/",
                approveReportUrl: "${createLink(controller: 'project', action: 'ajaxApproveReport', id:project.projectId)}/",
                rejectReportUrl: "${createLink(controller: 'project', action: 'ajaxRejectReport', id:project.projectId)}/",
                resetReportUrl: "${createLink(controller:'project', action:'resetReport', id:project.projectId)}",
                adjustReportUrl: "${createLink(controller:'project', action:'adjustReport', id:project.projectId)}",
                reportOwner: {projectId: '${project.projectId}', endDate: '${project.plannedEndDate}'},
                reportCreateUrl: '${g.createLink( action:'createReport', id:project.projectId)}',
                viewReportUrl: '${createLink(action:"viewReport", id:project.projectId)}',
                editReportUrl: "${createLink(action:"editReport", id:project.projectId)}",
                reportPDFUrl: "${createLink(action:"reportPDF", id:project.projectId)}",
                deleteActivitiesUrl: "${createLink(controller: 'project', action: 'ajaxDeleteReportActivities', id:project.projectId)}/",
                submitPlanUrl: "${createLink(controller:'project', action:'ajaxSubmitPlan', id:project.projectId)}",
                modifyPlanUrl: "${createLink(controller:'project', action:'ajaxRejectPlan', id:project.projectId)}",
                approvalPlanUrl: "${createLink(controller:'project', action:'ajaxApprovePlan', id:project.projectId)}",
                rejectPlanUrl: "${createLink(controller:'project', action:'ajaxRejectPlan', id:project.projectId)}",
                unlockPlanForCorrectionUrl: "${createLink(controller:'project', action:'ajaxUnlockPlanForCorrection', id:project.projectId)}",
                finishedCorrectingPlanUrl: "${createLink(controller:'project', action:'ajaxFinishedCorrectingPlan', id:project.projectId)}",
                projectScoresUrl: "${createLink(action:'serviceScores', id:project.projectId)}",
                healthCheckUrl: "${createLink(controller:'ajax', action:'keepSessionAlive')}",
                projectDatesValidationUrl: "${createLink(controller:'project', action:'ajaxValidateProjectDates', id:project.projectId)}",
                spinnerUrl: "${asset.assetPath(src:'loading.gif')}",
                projectSitesUrl: "${createLink(action:'ajaxProjectSites', id:project.projectId)}",
                useGoogleBaseMap: ${grails.util.Environment.current == grails.util.Environment.PRODUCTION},
                meriPlanUploadUrl: "${createLink(controller:'project', action:'uploadMeriPlan', id:project.projectId)}",
                leafletIconPath: "${assetPath(src:'leaflet-0.7.7/images')}",
                approvedMeriPlanHistoryUrl: "${createLink(action:"approvedMeriPlanHistory", id:project.projectId)}",
                viewHistoricalMeriPlanUrl: "${createLink(action:"viewMeriPlan", id:project.projectId)}",
                riskChangesReportHtmlUrl: "${createLink(controller:'project', action:'projectReport', id:project.projectId)}",
                riskChangesReportPdfUrl: "${createLink(controller:'project', action:'projectReportPDF', id:project.projectId)}",
                newDataSetUrl: "${createLink(controller:'dataSet', action:'create', id:project.projectId)}",
                editDataSetUrl: "${createLink(controller:'dataSet', action:'edit', id:project.projectId)}",
                deleteDataSetUrl: "${createLink(controller:'dataSet', action:'delete', id:project.projectId)}",
                unlockActivityUrl:"${createLink(controller:'activity', action:'ajaxUnlock')}",

                returnTo: "${createLink(controller: 'project', action: 'index', id: project.projectId)}"

            },
            here = window.location.href;

        fcConfig.project = <fc:renderProject project="${project}"/>;
    </script>

    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="project.css"/>
    <asset:stylesheet src="leaflet-manifest.css"/>
    <asset:stylesheet src="feature.css"/>
    <asset:stylesheet src="select2-bootstrap4/select2-bootstrap4.css"/>

</head>

<body>
<div id="spinner" class="spinner"
     style="position: fixed;top: 50%;left: 50%;margin-left: -50px;margin-top: -50px;text-align:center;z-index:1234;overflow: auto;width: 100px;height: 102px;">
    <asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>
</div>

<div class="${containerType}">

    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <g:if test="${config?.program || project.managementUnitId}">
                <g:if test="${project.managementUnitId}">
                    <li class="breadcrumb-item">
                        <g:link controller="managementUnit" action="index"
                                id="${project.managementUnitId}">${project.managementUnitName?.encodeAsHTML()}</g:link>
                    </li>
                </g:if>
                <g:if test="${config?.program?.name.equals('Regional Land Partnerships') || config?.program?.name.equals('Environmental Restoration Fund')}">
                    <li class="breadcrumb-item">${config.program.name?.encodeAsHTML()}</li>
                </g:if>
            </g:if>
            <g:else>
               <li class="breadcrumb-item">Projects</li>
            </g:else>

            <li class="breadcrumb-item active" data-bind="text:name"></li>
        </ol>
    </section> <!-- end of breadcrumb -->

    <section class="row">
        <div class="col-sm-10">
            <h1 class="pull-left" data-bind="text:name"></h1>
            <g:if test="${flash.errorMessage || flash.message}">
                <div class="col-sm-5">
                    <div class="alert alert-danger">
                        <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                        ${flash.errorMessage ?: flash.message}
                    </div>
                </div>
            </g:if>
        </div>

    <div class="col-sm-2">
        <div class="float-right pull-right">
            <g:if test="${showAlternateTemplate}">
                <a href="${createLink(action: 'index', id: project.projectId)}"><button class="btn btn-sm " type="button">User View</button></a>
            </g:if>
            <g:set var="disabled">${(!user) ? "disabled='disabled' title='login required'" : ''}</g:set>
            <g:if test="${isProjectStarredByUser}">
                <button class="btn btn-sm" id="starBtn"><i
                        class="fa fa-star"></i> <span>Remove from favourites</span></button>
            </g:if>
            <g:else>
                <button class="btn btn-sm" id="starBtn" ${disabled}><i
                        class="fa fa-star-o"></i> <span>Add to favourites</span></button>
            </g:else>
        </div>

    </div>
    </section> <!-- end of project title section -->

<!-- content tabs -->
    <ul id="projectTabs" class="nav nav-tabs" data-tab="tab" role="tablist">
        <fc:tabList tabs="${projectContent}"/>
    </ul>


    <div class="tab-content" style="overflow:visible;display:none">
        <fc:tabContent tabs="${projectContent}"/>
    </div>
    <g:render template="/shared/timeoutMessage"
              model="${[url: grailsApplication.config.getProperty('security.cas.loginUrl') + '?service=' + createLink(action: 'index', id: project.projectId, absolute: true)]}"/>
    <g:render template="/shared/unsavedChanges" model="${[id: 'meriPlanUnsavedChanges', unsavedData: 'MERI Plan']}"/>
    <g:render template="/shared/unsavedChanges" model="${[id: 'risksUnsavedChanges', unsavedData: 'Risks & Threats']}"/>

</div>
<g:if test="${user?.isEditor && projectContent.admin?.visible}">
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
    $(function () {
        var PROJECT_DETAILS_KEY = 'project.custom.details.${project.projectId}';
        var PROJECT_RISKS_KEY = 'project.risks.${project.projectId}';

        var map;
        // setup 'read more' for long text
        $('.more').shorten({
            moreText: 'read more',
            showChars: '1000'
        });


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

        var userRoles = {
            editor:${user?.isEditor ?: false},
            admin:${user?.isAdmin ?: false},
            grantManager:${user?.isCaseManager ?: false}
    };

var config = {
    meriPlanPDFUrl: fcConfig.meriPlanPDFUrl,
    saveTargetsUrl: fcConfig.projectUpdateUrl,
    documentUpdateUrl: fcConfig.documentUpdateUrl,
    projectUpdateUrl: fcConfig.projectUpdateUrl,
    projectSitesUrl: fcConfig.projectSitesUrl,
    projectScoresUrl: fcConfig.projectScoresUrl,
    meriPlanUploadUrl: fcConfig.meriPlanUploadUrl,
    projectDatesValidationUrl: fcConfig.projectDatesValidationUrl,
    approvedMeriPlanHistoryUrl: fcConfig.approvedMeriPlanHistoryUrl,
    viewHistoricalMeriPlanUrl: fcConfig.viewHistoricalMeriPlanUrl,
    documentDeleteUrl: fcConfig.documentDeleteUrl,
    featureServiceUrl: fcConfig.featureServiceUrl,
    wmsServerUrl: fcConfig.geoserverUrl,
    spinnerUrl: fcConfig.spinnerUrl,
    sitesPhotoPointsUrl:fcConfig.sitesPhotoPointsUrl,
    googleBaseMapUrl: fcConfig.useGoogleBaseMap,
    meriStorageKey:PROJECT_DETAILS_KEY,
    activityBasedReporting: ${Boolean.valueOf(projectContent.admin.config.activityBasedReporting)},
            minimumProjectEndDate: '${projectContent.admin.minimumProjectEndDate?:null}',
            riskChangesReportElementId: 'risk-changes-report',
            riskChangesReportHtmlUrl: fcConfig.riskChangesReportHtmlUrl,
            riskChangesReportPdfUrl: fcConfig.riskChangesReportPdfUrl,
            newDataSetUrl: fcConfig.newDataSetUrl,
            editDataSetUrl: fcConfig.editDataSetUrl,
            deleteDataSetUrl: fcConfig.deleteDataSetUrl,
            returnToUrl: fcConfig.returnTo
        };

    var programs = <fc:modelAsJavascript model="${programs}"/>;
    var project = fcConfig.project;

            var themes = <fc:modelAsJavascript model="${config.themes}" default="[]"/>;
    config.themes = themes;
            var services = <fc:modelAsJavascript model="${config.services}" default="[]"/>;

    config.useAlaMap = ${Boolean.valueOf(projectContent.site.useAlaMap)};
    config.showSiteType = ${Boolean.valueOf(projectContent.site.showSiteType)};
    config.services = services;
    config.useRlpTemplate = services.length > 0;
    config.useRlpRisksModel = config.useRlpTemplate;
    config.risksStorageKey = PROJECT_RISKS_KEY;

    config.requireMeriApprovalReason = ${projectContent.admin.requireMeriPlanApprovalReason};

    config.autoSaveIntervalInSeconds = ${grailsApplication.config.getProperty('fieldcapture.autoSaveIntervalInSeconds', Integer, 60)};
            config.riskAndThreatTypes = <fc:modelAsJavascript model="${config.riskAndThreatTypes}" default="null"/>;
    var programName = <fc:modelAsJavascript model="${(config.program?.acronym ?: project.associatedSubProgram) ?: project.associatedProgram}"/>
    config.programName = programName

    config.programObjectives = <fc:modelAsJavascript model="${config.program?.config?.objectives ?: []}"/>
    config.programActivities = <fc:modelAsJavascript model="${config.program?.config?.activities?.collect { it.name } ?: []}"/>
    config.excludeFinancialYearData = ${config.program?.config?.excludeFinancialYearData ?: false};

    project.mapFeatures =  $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
    var viewModel = new ProjectPageViewModel(project, project.sites, project.activities || [], organisations, userRoles, config);
    viewModel.loadPrograms(programs);
    ko.applyBindings(viewModel);
    window.validateProjectEndDate = viewModel.validateProjectEndDate;
    var options = {
                storageKey:PROJECT_RISKS_KEY,
                autoSaveIntervalInSeconds:${grailsApplication.config.getProperty('fieldcapture.autoSaveIntervalInSeconds', Integer, 60)},
                restoredDataWarningSelector:'#restoredRisksData',
                resultsMessageSelector:'#summary-result-placeholder',
                timeoutMessageSelector:'#timeoutMessage',
                errorMessage:"Failed to save risks details: ",
                successMessage: 'Successfully saved',
                defaultDirtyFlag:ko.dirtyFlag,
                healthCheckUrl:fcConfig.healthCheckUrl,
                preventNavigationIfDirty: true
            }

    autoSaveModel(viewModel.meriPlan.risks, fcConfig.projectUpdateUrl, options);

            var meriPlanVisible = false;
            var risksVisible = false;
            $('a[data-toggle="tab"]').on('show', function(e) {
               if (meriPlanVisible && viewModel.meriPlan.meriPlan().dirtyFlag.isDirty()) {
                    e.preventDefault();
                    bootbox.alert($('#meriPlanUnsavedChanges').html());
                }
                else {
                    meriPlanVisible = (e.target.hash  == '#projectDetails');
                }
                if (risksVisible && viewModel.meriPlan.risks.dirtyFlag.isDirty()) {
                    e.preventDefault();
                    bootbox.alert($('#risksUnsavedChanges').html());
                }
                else {
                    risksVisible = (e.target.hash  == '#plan' || e.target.hash == '#risks');
                }
            });
    function initialiseOverview() {
        $( '#public-images-slider' ).mThumbnailScroller({});
        $('#public-images-slider .fancybox').fancybox();
    }

    var tabs = {
        'overview': {
            default:true,
            initialiser: function () {
                initialiseOverview();
            }
        },
        'plan': {
            initialiser: function() {
                $.event.trigger({type:'planTabShown'});
            }
        },
        'dashboard': {
            initialiser: function() {
                $.event.trigger({type:'dashboardShown'});
            }
        },
        'documents': {
            initialiser: function() {
                initialiseDocumentTable('#overviewDocumentList');
            }
        },
        'site': {
            initialiser: function () {
                L.Browser.touch = false;
                var mapFeatures = project.mapFeatures;
                var sitesTabOptions = {
                    featureServiceUrl: config.featureServiceUrl,
                    wmsServerUrl: config.wmsServerUrl,     // geoServerUrl
                    spinnerUrl: config.spinnerUrl,
                    mapFeatures: mapFeatures,
                    sitesPhotoPointsUrl:config.sitesPhotoPointsUrl,
                    userIdEditor: userRoles.editor,
                    bindingElementId:'sitesList',
                    sitesTableSelector:'#sites-table',
                    selectAllSelector:'#select-all-sites',
                    photoPointSelector:'#site-photo-points',
                    loadingSpinnerSelector:'#img-spinner',
                    photoScrollerSelector:'.photo-slider',
                    useAlaMap:config.useAlaMap,
                    showSiteType:config.showSiteType
                };
                if (config.useAlaMap) {
                    sitesTabOptions.mapFeatures = {};
                    sitesTabOptions.useGoogleBaseMap = config.googleBaseMapUrl;
                    var sitesList = $('#'+sitesTabOptions.bindingElementId);
                    sitesList.children().hide();
                    sitesList.append('<image class="sites-spinner" width="50" height="50" src="'+sitesTabOptions.spinnerUrl+'" alt="Loading"/>');
                    $.get(config.projectSitesUrl).done(function(data) {
                        sitesList.children().show();
                        var sitesViewModel = viewModel.initialiseSitesTab(sitesTabOptions);

                        if (data && data.features) {
                            sitesViewModel.setFeatures(data.features);
                        }
                        sitesList.find('.sites-spinner').remove();

                    });
                }
                else {
                    viewModel.initialiseSitesTab(sitesTabOptions);
                }
            }
        },
        'details': {
            initialiser: function () {
                viewModel.initialiseMeriPlan();
            }
        },
        'reporting': {
            initialiser: function () {
                viewModel.initialiseReports();
            }
        },
        'datasets': {
            initialiser: function() {
                viewModel.initialiseDataSets();
            }
        },
        'admin': {
            initialiser: function () {
                viewModel.initialiseAdminTab();
            }
        }
    };

    initialiseTabs(tabs, {tabSelector:'#projectTabs.nav a', tabStorageKey:'project-tab-state', initialisingHtmlSelector:'#spinner'});

            var newsAndEventsInitialised = false;
            $('#editNewsAndEvents-tab').on('shown.bs.tab', function() {
                if (!newsAndEventsInitialised) {
                    var newsAndEventsViewModel = new window.newsAndEventsViewModel(viewModel, project.newsAndEvents);
                    ko.applyBindings(newsAndEventsViewModel, $('#editnewsAndEventsContent')[0]);
                    newsAndEventsInitialised = true;
                }

            });
            var projectStoriesInitialised = false;
            $('#editProjectStories-tab').on('shown.bs.tab', function() {
                if (!projectStoriesInitialised) {
                    var projectStoriesViewModel = new window.projectStoriesViewModel(viewModel, project.projectStories);
                    ko.applyBindings(projectStoriesViewModel, $('#editprojectStoriesContent')[0]);
                    projectStoriesInitialised = true;
                }
            });

            // Non-editors should get tooltip and popup when trying to click other tabs
            $('#projectTabs li a').not('[data-toggle="tab"]').css('cursor', 'not-allowed') //.data('placement',"right")
            .attr('title','Only available to project members').addClass('tooltips nav-link');

            // Star button click event
            $("#starBtn").on("click", function(e) {
                var isStarred = ($("#starBtn i").attr("class") === "fa fa-star");
                toggleStarred(isStarred, '${user?.userId ?: ''}', '${project.projectId}');
            });

            $('#gotoEditBlog').on("click", function () {
                amplify.store('project-admin-tab-state', '#editProjectBlog-tab');
                $('#admin-tab').tab('show');
                $('#editProjectBlog-tab').tab('show');
            });

            // BS tooltip
            $('.tooltips').tooltip();

            //Page loading indicator.
			$('.spinner').hide();
        	$('.tab-content').fadeIn();
        	$('.programId').select2({theme: "bootstrap4"});

        	new LockService({unlockUrl:fcConfig.unlockActivityUrl}).unlockAll();

        });// end document.ready

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="tab-init.js"/>
<asset:javascript src="projects.js"/>
<asset:javascript src="document.js"/>
<asset:javascript src="reporting.js"/>
<asset:javascript src="select2/4.0.3/js/select2.full"/>
<asset:javascript src="knockout-custom-bindings.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
<asset:javascript src="leaflet-manifest.js"/>
<asset:javascript src="feature.js"/>
<asset:deferredScripts/>
</body>
</html>
