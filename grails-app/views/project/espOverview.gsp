<%@ page import="au.org.ala.merit.SettingPageType; grails.converters.JSON" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${project?.name.encodeAsHTML()} | Project | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
        var fcConfig = {
                serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
                espSupportEmail: "${grailsApplication.config.getProperty('espSupportEmail')}",
                activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
                activityEnterDataUrl: "${createLink(controller: 'activity', action: 'enterData')}",
                activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
                activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
                starProjectUrl: "${createLink(controller: 'project', action: 'starProject')}",
                spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
                spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
                spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
                sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
                sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
                organisationLinkBaseUrl: "${createLink(controller:'organisation', action:'index')}",
                imageLocation:"${assetPath(src:'/')}",
                documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
                documentDeleteUrl: "${createLink(controller:"document", action:"deleteDocument")}",
                espPhotosUrl:"${createLink(controller:'project', action:'espPhotos', id:project.projectId)}",
                submitReportUrl: "${createLink(controller: 'project', action: 'ajaxSubmitReport', id:project.projectId)}/",
                approveReportUrl: "${createLink(controller: 'project', action: 'ajaxApproveReport', id:project.projectId)}/",
                featuresService: "${createLink(controller: 'proxy', action: 'features')}",
                featureService: "${createLink(controller: 'proxy', action: 'feature')}",
                spatialWms: "${grailsApplication.config.getProperty('spatial.geoserverUrl')}",
                tabbedActivityUrl: "${createLink(controller: 'activity', action:'ajaxLoadActivityForm')}",
                dashboardUrl:"${createLink(action:'projectDashboard', id:project.projectId)}",
                searchBieUrl:"${createLink(controller:'species', action:'searchBie')}",
                speciesListUrl:"${createLink(controller:'proxy', action:'speciesItemsForList')}",
                speciesSearchUrl:"${createLink(controller:'project', action:'searchSpecies', id:project.projectId)}",
                speciesImageUrl:"${createLink(controller:'species', action:'speciesImage')}",
                speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}", imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
                sightingsActivityType: "${grailsApplication.config.getProperty('esp.activities.sightings', String, "")}",
                adminActivityType: "${grailsApplication.config.getProperty('esp.activities.admin', String, "")}",
                excelOutputTemplateUrl: "${createLink(controller: 'activity', action:'excelOutputTemplate')}",
                excelDataUploadUrl: "${createLink(controller:'activity', action:'ajaxUpload')}",
                saveReportingDatesUrl:"${createLink(controller:'project', action:'ajaxUpdate', id:project.projectId)}",
                returnTo: "${createLink(controller: 'project', action: 'espOverview', id: project.projectId)}",
                projectReportUrl:"${createLink(controller:'project', action:'projectReport', id:project.projectId)}",
                projectReportPDFUrl:"${createLink(controller:'project', action:'projectReportPDF', id:project.projectId)}",
                projectUrl:"${createLink(controller:'project', action:'index', id:project.projectId)}"

            },
            here = window.location.href;


    </script>

    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="esp-overview.css"/>
</head>
<body>
<div class="${containerType}">
    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item">Project</li>
            <li class="breadcrumb-item">${project?.name}</li>
        </ol>
        <div class="pull-right">
            <g:if test="${fc.userIsSiteAdmin()}">
                <a href="${createLink(action:'index', id:project.projectId, params:[template:'index'])}"><button type="button" class="btn btn-sm">Grant Manager View</button></a>
            </g:if>
            <g:set var="disabled">${(!user) ? "disabled='disabled' title='login required'" : ''}</g:set>
            <g:if test="${isProjectStarredByUser}">
                <button class="btn btn-sm float-right" id="starBtn"><i class="fa fa-star"></i> <span>Remove from favourites</span></button>
            </g:if>
            <g:else>
                <button class="btn btn-sm float-right" id="starBtn" ${disabled}><i class="fa fa-star-o"></i> <span>Add to favourites</span></button>
            </g:else>
        </div>
    </section>



    <h2>${project.name}</h2>
    <g:if test="${flash.errorMessage || flash.message}">
        <div class="row">
            <div class="col-sm-5">
                <div class="alert alert-danger">
                    <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                    ${flash.errorMessage?:flash.message}
                </div>
            </div>
        </div>

    </g:if>
    <g:render template="banner"/>

    <p>${project.description}</p>
    <div class="row">
        <span class="col-sm-6">
            <span class="label label-info label-small">Project ID:</span> ${project.externalId}<br/>
            <span class="label label-info label-small">Reporting Period:</span>
            <span class="reportingPeriodSpan">
                <select id="type" data-bind="options:reportSelectionList, optionsText: 'label', optionsValue: 'value', value:selectedChoice, event: {change: selectionChanged }, select2:{width:'350px', templateSelection:formatEspReportOption, templateResult: formatEspReportOption}"></select>
            </span>
        </span>
        <span class="col-sm-6">
            <g:if test="${projectArea}">
                <ul class="unstyled">
                    <li><fc:siteFacet site="${projectArea}" facet="state" label="State / Territory"/></li>

                    <li><fc:siteFacet site="${projectArea}" facet="nrm" label="NRM"/></li>
                    <li><fc:siteFacet site="${projectArea}" facet="cmz" label="CMZ"/></li>
                </ul>

            </g:if>
        </span>
    </div>



    <ul class="nav nav-tabs" data-tab="tab" id="espProjectsTab" role="tablist">
        <li class="nav-item active"><a class="nav-link active" id='sites-tab' href="#mysites">My ESP Sites</a></li>
        <li class="nav-item"><a class="nav-link" href="#species-records-tab">My Species Records</a></li>
        <li class="nav-item"><a class="nav-link" href="#photographs-tab">Photographs</a></li>
        <li class="nav-item"><a class="nav-link" href="#documents-tab">Documents</a></li>
        <li class="nav-item"><a class="nav-link" id="annual-submission-report-tab" href="#reporting-tab">Annual Report Submission</a></li>
        <li class="nav-item"><a class="nav-link" id="stage-report-pdf-tab" href="#stage-report-pdf">Download Report</a></li>
    </ul>

    <div id="saved-nav-message-holder"></div>

    <div class="tab-content">
        <div class="tab-pane active" id="mysites">
            <p>Click on a site to fill out the report for that site.</p>
            <p>Green sites have finished reports.  Red sites have unfinished reports.</p>
            <div class="row">
                <!-- ko stopBinding:true -->
                <div class="col-sm-12">
                    <div id="map" class="w-100" style="height:500px;"></div>
                </div>

                <!-- /ko -->
            </div>

        </div>
        <div class="tab-pane" id="species-records-tab">
            <div id="species-form">

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
            <div data-bind="visible:currentReport.isSubmitted()">
                <div class="alert alert-info submitted-report-message">
                    You have submitted your report for approval by your grant manager.  Please contact your grant manager if you need to make further edits to your report.
                </div>
            </div>
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
                        <td><button type="button" class="btn btn-sm"   data-bind="activityProgress:progress">
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
                        <li>Optionally record any species you have observed during the reporting period on the "My Species Records" tab.</li>
                    </ul>
                    <br/>
                    Please note that the report will not be able to be submitted until the end of the reporting period.
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
                    <button class="btn btn-success" data-bind="enable:canViewSubmissionReport(), click:submitReport">Submit</button>
                </div>
            </div>

        </div>

        <div class="tab-pane " id="stage-report-pdf">

            <h4 class="modal-title">Download Report</h4>
            <p>Select the financial year of the report you want to download then press the "Generate Report (PDF)" button</p>
            <hr/>

            <form class="form-horizontal" id = "stageReportPDF">

                <div class="form-group row">
                    <label class="col-sm-2 col-form-label" for="stageToReport">Report to download: </label>
                    <div class="col-sm-6">
                        <select id="stageToReport" class="form-control form-control-sm" data-bind="value:stageToReport, options:reportSelectionList, optionsText: 'label', optionsValue: 'stage' " ></select>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label" for="orientation">PDF Orientation: <fc:iconHelp>If your PDF includes activities with wide tables, the Landscape setting may improve the result.  This setting has no effect on the HTML view. </fc:iconHelp></label>
                    <div class="col-sm-2">
                        <select class="form-control form-control-sm" id="orientation" data-bind="value:orientation">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-sm btn-success"
                            data-bind="click:generateProjectReportHTML">Generate Report (HTML)</button>
                    <button type="button" class="btn btn-sm btn-success"
                            data-bind="click:generateProjectReportPDF">Generate Report (PDF)</button>
                </div>
            </form>
        </div>
    </div>

</div>

<div id="report-selection" class="modal fade" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="title">Please enter your reporting dates</h4>
            </div>
            <div class="modal-body">
                <p>
                    As this your first time reporting into the Monitoring, Evaluation, Reporting, Improvement Tool (MERIT), please input the dates for the period against which you are reporting activity.
                </p>

                <form class="form-horizontal">
                    <div class="control-group">
                        <label class="control-label">Reporting period start: </label>
                        <div class="controls">
                            <fc:datePicker class="input input-small form-control form-control-sm" bs4="true" targetField="reportingPeriodStart"/>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">Reporting period end: </label>
                        <div class="controls">
                            <input type="text" class="input input-small form-control form-control-sm" readonly="readonly" data-bind="value:reportingPeriodEnd.formattedDate">
                        </div>
                    </div>

                    <p>
                        If you do not know or are having any issues with this, please email: <a href="mailto:${grailsApplication.config.getProperty('espSupportEmail')}">${grailsApplication.config.getProperty('espSupportEmail')}</a>
                    </p>
                </form>
            </div>
            <div class="modal-footer control-group">
                <div class="controls">
                    <button type="button" class="btn btn-success" data-bind="click:saveReportingDates">OK</button>

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
    <span class="badge badge-danger" data-bind="if:isReadOnly">Reporting is disabled for this site</span>
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

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="projects.js"/>
<asset:javascript src="esp-overview.js"/>
<asset:deferredScripts/>

<script type="text/javascript">
    var organisations = <fc:modelAsJavascript model="${organisations}"/>;
    var sites = JSON.parse('${raw((sites as grails.converters.JSON).toString())}');

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
            },
            'stage-report-pdf-tab': {
                initialiser: function(){

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

        // Automatically display the annual report submission tab once all of the SMU/PMU/Zone reports are finished.
        if (simplifiedReportingViewModel.canViewSubmissionReport() && adminActivity) {

            var $mySites = $('#sites-tab');
            $mySites.on('shown.bs.tab', function() {
                map.map.fitBounds(map.featureBounds);
            });

            var $adminTab = $('#annual-submission-report-tab');
            $adminTab.click();
        }

        // Star button click event
        $("#starBtn").click(function(e) {
            var isStarred = ($("#starBtn i").attr("class") === "fa fa-star");
            toggleStarred(isStarred, '${user?.userId?:''}', '${project.projectId}');
        });
    });

</script>

</body>
</html>
