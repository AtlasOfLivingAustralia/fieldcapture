<%@ page import="grails.converters.JSON" contentType="text/html;charset=UTF-8" %>
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
        imageLocation:"${resource(dir:'/images')}",
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

        returnTo: "${createLink(controller: 'project', action: 'espOverview', id: project.projectId)}"

    },
        here = window.location.href;


    </r:script>

    <r:require modules="gmap3,mapWithFeatures,knockout,merit_projects,activity"/>
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

    <div class="row-fluid">
        <div id="map" class="span12" style="height:500px; width:100%"></div>
    </div>

    <g:if test="${reportingVisible}">
    <div id="reporting">
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
    </div>
    </g:if>

    <h3>Dashboard</h3>
    <div class="row-fluid">
        <div class="span12 form-actions">
            <g:render template="dashboard"/>
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

<r:script>
        var organisations = <fc:modelAsJavascript model="${organisations}"/>;
var sites = JSON.parse('${(sites as grails.converters.JSON).toString()}');

var features = <fc:modelAsJavascript model="${mapFeatures}"/>;

$(function() {
    var project = <fc:renderProject project="${project}"/>;
    var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');

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

    var sitesViewModel = new SitesViewModel(project.sites, map, mapFeatures, ${user?.isEditor?:false}, project.projectId);
    var reportsViewModel = new ProjectReportsViewModel(project);
    var planViewModel = new PlanViewModel(project.activities, project.reports, [], {}, project, null, fcConfig, true, false);

    var currentReport = reportsViewModel.currentReport;

    var currentStage = _.find(planViewModel.stages, function(stage) {
        return stage.toDate == currentReport.toDate;
    });

    ko.applyBindings(sitesViewModel, document.getElementById('map'));
    sitesViewModel.displayAllSites();


    var SiteStatusModel = function(site, currentStage, map) {
        var self = this;
        self.name = site.name;

        var incompleteActivities = _.filter(currentStage.activities, function(activity) {
            return activity.siteId == site.siteId && !activity.isComplete();
        });
        self.reportingComplete = incompleteActivities.length == 0;

        // No support currently for multipolygons
        var feature = map.featureIndex[site.siteId] && map.featureIndex[site.siteId][0];

        var bounds = sitesViewModel.getSiteBounds(site.siteId);

        /**
         * Calculates a position for the info window located in the top middle of the sites bounds.
         * @param bounds a LatLngBounds object containing the bounds of the site.
         * @return a lat lng literal representing the top middle of the sites bounds.
         */
        function calculateInfoWindowPosition(bounds) {
            var east = bounds.getNorthEast().lng();
            var west = bounds.getSouthWest().lng();
            var middle = west + (east - west)/2;
            return {lat:bounds.getNorthEast().lat(), lng:middle};
        };

        function getSiteInfoHtml() {
            var siteInfoTemplate = document.getElementById('info-window-template');
            ko.applyBindings(self, siteInfoTemplate);
            var siteInfoHtml = siteInfoTemplate.innerHTML;
            ko.cleanNode(siteInfoTemplate);
            return siteInfoHtml;
        }

        var featureDisplayOptions = {strokeColor:'#BB4411',fillColor:'#BB4411',fillOpacity:0.3,strokeWeight:1,zIndex:1,editable:false};
        if (self.reportingComplete) {
            featureDisplayOptions = {strokeColor:'green',fillColor:'green',fillOpacity:0.3,strokeWeight:1,zIndex:1,editable:false};
        }
        feature.setOptions(featureDisplayOptions);

        google.maps.event.clearInstanceListeners(feature);
        var siteInfoWindow = new google.maps.InfoWindow({content:getSiteInfoHtml(), position:calculateInfoWindowPosition(bounds)});

        google.maps.event.addListener(feature, 'mouseover', function (event) {
            siteInfoWindow.open(map.map, feature);
        });
        google.maps.event.addListener(feature, 'mouseout', function (event) {
            siteInfoWindow.close();
        });


        var activity = incompleteActivities.length >= 0 ? incompleteActivities[0] : null;
        if (!activity) {
            activity = _.find(currentStage.activities, function(activity) {
                return activity.siteId == site.siteId;
            });
        }
        if (activity) {
            google.maps.event.addListener(feature, 'click', function(event) {
                window.location.href = activity.editActivityUrl();
            });
        }
    };

    _.each(sitesViewModel.sites, function(site) {
        new SiteStatusModel(site, currentStage, map);
    });

    var SimplifiedReportingViewModel = function() {
        var self = this;

        function isAdminActivity(activity) {
            return !activity.siteId;
        }
        self.finishedReporting = currentStage.canSubmitReport();
        self.finishedAdminReporting = _.every(currentStage.activities, function(activity) {
            return !isAdminActivity(activity) || activity.isComplete();
        });
        self.finishedActivityReporting = _.every(currentStage.activities, function(activity) {
            return isAdminActivity(activity) || activity.isComplete();
        });

        self.hasAdministrativeReports = _.some(currentStage.activities, function(activity) {
            return isAdminActivity(activity);
        });

        self.currentStage = currentStage;
        self.currentReport = currentReport;
        self.adminReportingHelp = ko.pureComputed(function() {
            if (self.finishedAdminReporting) {
                return "You have completed your administrive reporting requirements for this year"
            }
            return "Press the 'Administrative Reporting' button in the 'Actions:' section below to complete your administrative reporting.";
        });
        self.activityReportingHelp = ko.pureComputed(function() {
            if (self.finishedActivityReporting) {
                return "You have completed your site based reporting requirements for this period"
            }
            return "Click on a site to update your progress on the site.  When you have finished data entry for the year, please ensure the 'finished' checkbox on each reporting form is ticked.";
        });
        self.submitReportHelp = ko.pureComputed(function() {
            if (self.currentReport.isSubmitted() || self.currentReport.isApproved()) {
                return "You have submitted your report for this year"
            }
            else if (!self.currentStage.isReportable) {
                return "Your report can't be submitted until "+convertToSimpleDate(currentStage.toDateLabel, false);
            }
            else if (self.currentStage.canSubmitReport()) {
                return "Press the 'Submit reports for approval' button the 'Actions:' section below to submit your report to your grant manager."
            }
            return "Your site and administrative reports need to be marked as 'Finished' before you can submit your report.  You can mark a report as finished by opening the report and checking the 'Finished' button at the bottom of the page.";
        });
        self.approveReportHelp = ko.pureComputed(function() {
            return "Once your reports are submitted, your grant manager will review and approve them or return them to you with comments for further work."
        });

        self.canSubmitReport = ko.pureComputed(function() {
            return self.currentReport.isReportable && self.currentReport.canSubmitReport();
        });

        self.administrativeReporting = function() {
            var nextActivity = _.find(currentStage.activities, function(activity) {
                return isAdminActivity(activity) && !activity.isComplete();
            });
            // Default the form to finished.
            if (nextActivity.progress() == ActivityProgress.finished) {
                document.location.href = nextActivity.editActivityUrl();
            }
            else {
                // This will set the progress and open the form.
                nextActivity.progress(ActivityProgress.finished);
            }
        };

        self.administrativeReportButtonHelp = ko.pureComputed(function() {
            if (currentStage.isReadOnly()) {
                return "Once your reports have been submitted or approved they can no longer be edited.";
            }
            else {
                return "Click to complete your administrative reporting for the year."
            }
        });

    };

    ko.applyBindings(new SimplifiedReportingViewModel(), document.getElementById('reporting'));


});

</r:script>


</body>
</html>