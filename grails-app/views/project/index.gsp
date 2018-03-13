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
        siteUploadUrl: "${createLink(controller: 'site', action: 'siteUpload', params:[projectId:project.projectId, returnTo:createLink(controller: 'project', action: 'index', id: project.projectId)])}",
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
        <fc:tabContent tabs="${projectContent}"/>
    </div>

    <g:render template="/shared/timeoutMessage" model="${[url:grailsApplication.config.security.cas.loginUrl+'?service='+createLink(action:'index', id:project.projectId, absolute: true)]}"/>
    <g:render template="/shared/unsavedChanges" model="${[id:'meriPlanUnsavedChanges', unsavedData:'MERI Plan']}"/>
    <g:render template="/shared/unsavedChanges" model="${[id:'risksUnsavedChanges', unsavedData:'Risks & Threats']}"/>

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

            var userRoles = {
                editor:${user?.isEditor?:false},
                admin:${user?.isAdmin?:false},
                grantManager:${user?.isCaseManager?:false}
            };

            var config = {
                meriPlanPDFUrl: fcConfig.meriPlanPDFUrl,
                documentUpdateUrl: fcConfig.documentUpdateUrl,
                projectUpdateUrl: fcConfig.projectUpdateUrl,
                PROJECT_DETAILS_KEY:PROJECT_DETAILS_KEY,
                PROJECT_RISKS_KEY:PROJECT_RISKS_KEY

            };

            var programs = <fc:modelAsJavascript model="${programs}"/>;
            var project = fcConfig.project;

            var viewModel = new ProjectPageViewModel(
                project,
                project.sites,
                project.activities || [],
                userRoles,
                ${themes},
                config);

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
                fcConfig.projectUpdateUrl,
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
                            "orderData":[4],
                            "width":"8em",
                            "orderable":true
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
                var $toInit = $(storedTab + '-tab');
                if ($toInit.is(':enabled')) {
                    $toInit.tab('show');
                }

            }

        });// end window.load


</asset:script>
<asset:javascript src="common.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>
</body>
</html>