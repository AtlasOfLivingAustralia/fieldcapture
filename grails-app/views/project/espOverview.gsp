<%@ page import="grails.converters.JSON" contentType="text/html;charset=UTF-8" %>
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
        featuresService: "${createLink(controller: 'proxy', action: 'features')}",
            featureService: "${createLink(controller: 'proxy', action: 'feature')}",
            spatialWms: "${grailsApplication.config.spatial.geoserverUrl}",
            spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        tabbedActivityUrl: "${createLink(controller: 'activity', action:'ajaxLoadActivityForm')}",
        returnTo: "${createLink(controller: 'project', action: 'espOverview', id: project.projectId)}"

    },
        here = window.location.href;


    </script>

    <asset:stylesheet src="common.css"/>
</head>
<body>
<div class="${containerType}">
    <div>
        <ul class="breadcrumb pull-left">
            <li>
                <g:link controller="home">Home</g:link> <span class="divider">/</span>
            </li>
            <li class="active">Projects <span class="divider">/</span></li>
            <li class="active">Project</li>
        </ul>
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

    <h2>${project.name}</h2>
    <g:if test="${flash.errorMessage || flash.message}">
        <div class="span5">
            <div class="alert alert-error">
                <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                ${flash.errorMessage?:flash.message}
            </div>
        </div>
    </g:if>
    <p>${project.description}</p>

    <ul class="nav nav-tabs">
        <li class="active"><a href="#mysites" data-toggle="tab">My Sites</a></li>
        %{--<g:each in="${project.sites}" var="site" status="i">--}%
            %{--<li><a href="#site${i}">${site.name}</a></li>--}%
        %{--</g:each>--}%
        <li><a href="#species-records-tab" data-toggle="tab">Species Records</a></li>
        <li><a href="#dashboard-tab" data-toggle="tab">Dashboard</a></li>
        <li><a href="#photographs-tab" data-toggle="tab">Photographs</a></li>
        <li><a href="#reporting-tab" data-toggle="tab">Submission</a></li>
    </ul>


    <div class="tab-content">
        <div class="tab-pane active" id="mysites">

            <div class="row-fluid">
                <div id="map" class="span12" style="height:500px; width:100%"></div>
            </div>
            <p>Click on a site to fill out the report for that site.</p>
            <p>Green sites have finished reports.  Red sites have unfinished reports.</p>
        </div>
        %{--<g:each in="${project.sites}" var="site" status="i">--}%
            %{--<div class="tab-pane" id="site${i}">--}%

            %{--</div>--}%
        %{--</g:each>--}%
        <div class="tab-pane" id="species-records-tab">

        </div>
        <div class="tab-pane" id="dashboard-tab">
            <h3>Dashboard</h3>
            <div class="row-fluid">
                <div class="span12 form-actions">
                    <g:render template="dashboard"/>
                </div>
            </div>
        </div>
        <div class="tab-pane" id="photographs-tab">
            <div id="site-photo-points"></div>

        </div>
        <div class="tab-pane" id="reporting-tab">
            <div id="reporting">
                <g:if test="${reportingVisible}">


                <h3>Reporting</h3>
                <div class="row-fluid">
                    <div class="form-actions span12">
                        <strong>Current reporting period: <span data-bind="text:currentStage.datesLabel"></span></strong>
                        <p>
                            <strong>Status:</strong> <span data-bind="text:currentReport.status()"></span>
                        </p>
                        <strong>Checklist: </strong>
                        <ul class="unstyled">
                            <li data-bind="visible:hasAdministrativeReports"><i data-bind="css:{'fa-check-square-o':finishedAdminReporting, 'fa-square-o':!finishedAdminReporting}" class="fa fa-square-o"></i> Administrative reporting complete <i class="fa fa-question-circle" data-bind="popover:{content:adminReportingHelp}"></i></li>
                            <li><i data-bind="css:{'fa-check-square-o':finishedActivityReporting, 'fa-square-o':!finishedActivityReporting}" class="fa fa-square-o"></i> Progress reporting complete for all sites <i class="fa fa-question-circle" data-bind="popover:{content:activityReportingHelp}"></i></li>
                            <li><i data-bind="css:{'fa-check-square-o':currentStage.isSubmitted(), 'fa-square-o':!currentStage.isSubmitted()}" class="fa fa-square-o"></i> Report submitted <i class="fa fa-question-circle" data-bind="popover:{content:submitReportHelp}"></i></li>
                            %{--<li><i data-bind="css:{'fa-check-square-o':currentStage.isApproved(), 'fa-square-o':!currentStage.isApproved()}" class="fa fa-square-o"></i> Report approved <i class="fa fa-question-circle" data-bind="popover:{content:approveReportHelp}"></i></li>--}%
                        </ul>
                        <strong>Actions: </strong>
                        <div>
                            <button class="btn btn-success" data-bind="visible:hasAdministrativeReports, enable:!currentStage.isReadOnly(), click:administrativeReporting, attr:{title:administrativeReportButtonHelp}">Administrative reporting</button>
                            <button class="btn btn-success" data-bind="enable:canSubmitReport(), click:currentStage.submitReport, attr:{title:submitReportHelp}">Submit for grant manager approval</button>
                        </div>
                    </div>
                </div>

                </g:if>

            </div>
        </div>
    </div>



</div>

<!-- ko stopBinding:true -->
%{--Template for the site info window popup--}%
<div id="info-window-template" data-bind="template:'popup'" style="display:none"></div>
<script type="text/html" id="popup">

<div>
    <strong data-bind="text:name"></strong>
    <div data-bind="visible:reportingComplete">
        <p>You have finished reporting for this site.</p>
    </div>
    <div data-bind="visible:!reportingComplete">
        <p>Click the site to update your management progress for this site.  If you have finished reporting for the year, make sure you tick the finished reporting checkbox at the bottom of the form.</p>
    </div>

</div>

</script>

<g:render template="/shared/declaration"/>
<!-- /ko -->

<asset:javascript src="common.js"/>
<asset:javascript src="projects.js"/>
<asset:javascript src="esp-overview.js"/>
<asset:deferredScripts/>

<script type="text/javascript">
    var organisations = <fc:modelAsJavascript model="${organisations}"/>;
    var sites = JSON.parse('${(sites as grails.converters.JSON).toString()}');

    var features = <fc:modelAsJavascript model="${mapFeatures}"/>;

    $(function() {
        var project = <fc:renderProject project="${project}"/>;
        var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        var userIsEditor = ${user?.isEditor?:false};

        var mapOptions = {
            zoomToBounds:true,
            zoomLimit:16,
            highlightOnHover:true,
            features:[],
            featureService: fcConfig.featureService,
            wmsServer:fcConfig.spatialWms,
            mapContainer: "map"
        };

        var map = init_map_with_features(mapOptions, {});

        var sitesViewModel = new SitesViewModel(project.sites, map, mapFeatures, userIsEditor, project.projectId);
        var reportsViewModel = new ProjectReportsViewModel(project);
        var planViewModel = new PlanViewModel(project.activities, project.reports, [], {}, project, null, fcConfig, true, false);

        var currentReport = reportsViewModel.currentReport;

        var currentStage = _.find(planViewModel.stages, function(stage) {
            return stage.toDate == currentReport.toDate;
        });

        ko.applyBindings(sitesViewModel, document.getElementById('map'));
        sitesViewModel.displayAllSites();

        _.each(sitesViewModel.sites, function(site) {
            new SiteStatusModel(site, currentStage, map, sitesViewModel);
        });

        ko.applyBindings(new SimplifiedReportingViewModel(currentStage, currentReport), document.getElementById('reporting'));
        $('.nav a').click(function() {
            $(this).tab('show');
            var tabContentTarget = $(this).attr('href');
            if (tabContentTarget.indexOf('#site') === 0) {
                $.get(fcConfig.tabbedActivityUrl+'/bbe23720-20db-4b8b-9c2e-7f81f63cf70a', function(data) {
                    $(tabContentTarget).html(data);
                });
            }
            if (tabContentTarget == '#photographs-tab') {
                $('#site-photo-points').html('<asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>');
                $.get(fcConfig.sitesPhotoPointsUrl).done(function (data) {

                    $('#site-photo-points').html($(data));
                    $('#site-photo-points img').on('load', function () {

                        var parent = $(this).parents('.thumb');
                        var $caption = $(parent).find('.caption');
                        $caption.outerWidth($(this).width());

                    });
                    $('.photo-slider').mThumbnailScroller({theme: 'hover-classic'});
                    $('.photo-slider .fancybox').fancybox({
                        helpers: {
                            title: {
                                type: 'inside'
                            }
                        },
                        beforeLoad: function () {
                            var el, id = $(this.element).data('caption');

                            if (id) {
                                el = $('#' + id);

                                if (el.length) {
                                    this.title = el.html();
                                }
                            }
                        },
                        nextEffect: 'fade',
                        previousEffect: 'fade'
                    });

                });
            }

        });
    });

</script>

</body>
</html>