<%@ page import="au.org.ala.merit.SettingPageType; grails.converters.JSON" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>${project?.name.encodeAsHTML()} | Project | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
        activityEnterDataUrl: "${createLink(controller: 'activity', action: 'enterData')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
        starProjectUrl: "${createLink(controller: 'project', action: 'starProject')}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
        organisationLinkBaseUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${assetPath(src:'/')}",
        documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
        documentDeleteUrl: "${createLink(controller:"document", action:"deleteDocument")}",
        espPhotosUrl:"${createLink(controller:'project', action:'espPhotos', id:project.projectId)}",
        submitReportUrl: "${createLink(controller: 'project', action: 'ajaxSubmitReport', id:project.projectId)}/",
        approveReportUrl: "${createLink(controller: 'project', action: 'ajaxApproveReport', id:project.projectId)}/",
        featuresService: "${createLink(controller: 'proxy', action: 'features')}",
        featureService: "${createLink(controller: 'proxy', action: 'feature')}",
        spatialWms: "${grailsApplication.config.spatial.geoserverUrl}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        tabbedActivityUrl: "${createLink(controller: 'activity', action:'ajaxLoadActivityForm')}",
        dashboardUrl:"${createLink(action:'projectDashboard', id:project.projectId)}",
        searchBieUrl:"${createLink(controller:'species', action:'searchBie')}",
        speciesListUrl:"${createLink(controller:'proxy', action:'speciesItemsForList')}",
        speciesSearchUrl:"${createLink(controller:'project', action:'searchSpecies', id:project.projectId)}",
        speciesImageUrl:"${createLink(controller:'species', action:'speciesImage')}",
        speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}", imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
        sightingsActivityType: "${grailsApplication.config.esp.activities.sightings ?: ""}",
        adminActivityType: "${grailsApplication.config.esp.activities.admin ?: ""}",
        returnTo: "${createLink(controller: 'project', action: 'espOverview', id: project.projectId)}"

    },
        here = window.location.href;


    </script>

    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="esp-overview.css"/>
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
            <g:if test="${fc.userIsSiteAdmin()}">
                <a class="btn" href="${createLink(action:'index', id:project.projectId, params:[template:'index'])}">Grant Manager View</a>
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
        <span class="span6">
            <span class="label label-info label-small">Project ID:</span> ${project.externalId}<br/>
            <span class="label label-info label-small">Reporting Period:</span> <span data-bind="text:reportingFinancialYear"></span><br/>

        </span>
        <span class="span6">
            <g:if test="${projectArea}">
                <ul class="unstyled">
                    <li><fc:siteFacet site="${projectArea}" facet="state" label="State / Territory"/></li>

                    <li><fc:siteFacet site="${projectArea}" facet="nrm" label="NRM"/></li>
                    <li><fc:siteFacet site="${projectArea}" facet="cmz" label="CMZ"/></li>
                </ul>

            </g:if>
        </span>
    </div>



    <ul class="nav nav-tabs">
        <li class="active"><a href="#mysites">My ESP Sites</a></li>
        <li><a href="#species-records-tab">My Species Records</a></li>
        <li><a href="#dashboard-tab">Dashboard</a></li>
        <li><a href="#photographs-tab">Photographs</a></li>
        <li><a href="#documents-tab">Documents</a></li>
        <li><a href="#reporting-tab">Annual Report Submission</a></li>
    </ul>

    <div id="saved-nav-message-holder"></div>

    <div class="tab-content">
        <div class="tab-pane active" id="mysites">
            <p>Click on a site to fill out the report for that site.</p>
            <p>Green sites have finished reports.  Red sites have unfinished reports.</p>
            <div class="row-fluid">
                <!-- ko stopBinding:true -->
                <div id="map" class="span12" style="height:500px; width:100%"></div>
                <!-- /ko -->
            </div>

        </div>
        <div class="tab-pane" id="species-records-tab">
            <div id="species-form">

            </div>
        </div>
        <div class="tab-pane" id="dashboard-tab">
            <h3>Dashboard</h3>
            <div class="row-fluid">
                <div id="dashboard">
                </div>
            </div>
        </div>
        <div class="tab-pane" id="photographs-tab">
            <div id="site-photo-points"></div>
        </div>
        <div class="tab-pane" id="documents-tab">
            <!-- Project Documents -->
            <!-- ko stopBinding:true -->
            <g:render template="docs"/>
            <!-- /ko -->
        </div>
        <div class="tab-pane" id="reporting-tab">
            <div>
                <h4>Report status</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Site </th>
                            <th>Status <fc:iconHelp>Status for all sites must be “finished” before annual report can be submitted.</fc:iconHelp></th>
                        </tr>
                    </thead>
                    <tbody>
                    <!-- ko foreach:siteReports() -->
                        <tr>
                            <td><a data-bind="attr:{href:editActivityUrl()}"><span data-bind="text:description"></span></a></td>
                            <td><button type="button" class="btn btn-small"   data-bind="activityProgress:progress">
                                <span data-bind="text: progress"></span>
                            </button>
                            </td>
                        </tr>
                    <!-- /ko -->
                    </tbody>
                </table>
            </div>
            <div data-bind="visible:!canViewSubmissionReport()">
                <div class="form-actions">
                    Before you can submit your form you must:
                    <br/>
                    <ul>
                        <li>Complete your activity reporting for each of your sites (all reports above should be marked as finished)</li>
                        <li>Complete or mark as not applicable your optional "My Species Records" tab.</li>
                    </ul>
                    <br/>
                    Please note that the report will not be able to be submitted until the end of the reporting period.
                </div>
            </div>
            <div data-bind="visible:currentReport.isSubmitted()">
                <div class="alert alert-info">
                    You have submitted your report for approval by your grant manager.  Please contact your grant manager if you need to make further edits to your report.
                </div>
            </div>
            <div data-bind="visible:currentReport.isApproved()">
                <div class="alert alert-success">
                    Your report has been approved by your grant manager.
                </div>
            </div>
            <div data-bind="visible:canViewSubmissionReport()">
                <div id="admin-form">
                </div>
                <div class="form-actions" data-bind="visible:!currentReport.isSubmitted() && !currentReport.isApproved()">
                    <button class="btn" data-bind="enable:canViewSubmissionReport(), click:submitReport">Submit</button>
                </div>
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

<g:render template="/shared/declaration" model="${[declarationType:au.org.ala.merit.SettingPageType.ESP_DECLARATION]}"/>
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

        var simplifiedReportingViewModel = new SimplifiedReportingViewModel(project, fcConfig);
        ko.applyBindings(simplifiedReportingViewModel);

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

        // Don't draw the project area on the homepage.
        var worksSites = _.filter(project.sites, function(site) { return site.type != 'projectArea'; });
        var sitesViewModel = new SitesViewModel(worksSites, map, mapFeatures, userIsEditor, project.projectId);

        ko.applyBindings(sitesViewModel, document.getElementById('map'));
        sitesViewModel.displayAllSites();

        _.each(sitesViewModel.sites, function(site) {
            new SiteStatusModel(site, simplifiedReportingViewModel.currentStage, map, sitesViewModel);
        });

        var adminActivity = simplifiedReportingViewModel.administrativeReport && simplifiedReportingViewModel.administrativeReport;
        var speciesActivity = simplifiedReportingViewModel.optionalReport && simplifiedReportingViewModel.optionalReport;

        var photopointSelector = '#site-photo-points';
        var tabs = {
            'photographs-tab': {
                selector:photopointSelector,
                url:fcConfig.espPhotosUrl,
                initialiser: function() {
                    initialisePhotos(photopointSelector, '#public-images-slider');
                }
            },
            'dashboard-tab': {
                selector:'#dashboard',
                url:fcConfig.dashboardUrl
            },
            'documents-tab': {
                initialiser: function() {
                    var selector = '#documents';
                    var documentsModel = new Documents();
                    var docs = _.map(project.documents || [], function(document) {
                        return new DocumentViewModel(document);
                    });
                    documentsModel.documents(docs);
                    ko.applyBindings(documentsModel, $(selector)[0]);
                    initialiseDocumentTable(selector);
                }
            }
        };
        if (adminActivity) {
            tabs['reporting-tab'] = {
                selector: '#admin-form',
                url: fcConfig.tabbedActivityUrl + '/' + adminActivity.activityId,
                initialiser: function () {
                    initialiseESPActivity(adminActivity);
                }
            }
        }
        if (speciesActivity) {
            tabs['species-records-tab'] = {
                selector:'#species-form',
                url:fcConfig.tabbedActivityUrl+'/'+speciesActivity.activityId+'?includeFormActions=true',
                initialiser: function() {
                    initialiseESPActivity(speciesActivity);
                }
            }
        }

        $('.nav a').click(function() {
            $(this).tab('show');

            var tabContentTarget = $(this).attr('href');
            var tabId = tabContentTarget.substring(1, tabContentTarget.length);
            var tab = tabs[tabId];
            if (tab && !tab.initialised) {
                tab.initialised = true;
                // Get the remote content
                if (tab.url) {
                    $(tab.selector).html('<asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>');

                    $.get(tab.url, function(data) {
                        $(tab.selector).html(data);
                        if (tab.initialiser) {
                            tab.initialiser();
                        }
                    });
                }
                else {
                    tab.initialiser();
                }

            }
        });
        // Star button click event
        $("#starBtn").click(function(e) {
            var isStarred = ($("#starBtn i").attr("class") == "icon-star");
            toggleStarred(isStarred, '${user?.userId?:''}', '${project.projectId}');
        });
    });

</script>

</body>
</html>