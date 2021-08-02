<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>${report.name}</title>
    </g:if>
    <g:else>
        <meta name="layout" content="nrm_bs4"/>
        <title>Edit | ${report.name} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script type="text/javascript">
        var fcConfig = {
                serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
                activityUpdateUrl: "${saveReportUrl}",
                contextViewUrl: "${contextViewUrl}/",
                bieUrl: "${grailsApplication.config.getProperty('bie.baseURL')}",
                speciesProfileUrl: "${createLink(controller: 'species', action: 'speciesProfile')}",
                documentUpdateUrl: "${g.createLink(controller:"document", action:"documentUpdate")}",
                documentDeleteUrl: "${g.createLink(controller:"document", action:"deleteDocument")}",
                imageUploadUrl: "${createLink(controller: 'image', action: 'upload')}",
                imageLocation: "${assetPath(src:'/')}",
                savePhotoPointUrl: "${createLink(controller:'site', action:'ajaxUpdatePOI')}",
                deletePhotoPointUrl: "${createLink(controller:'site', action:'ajaxDeletePOI')}",
                excelOutputTemplateUrl: "${createLink(controller: 'activity', action:'excelOutputTemplate')}",
                excelDataUploadUrl: "${createLink(controller:'activity', action:'ajaxUpload')}",
                searchBieUrl: "${createLink(controller:'species', action:'searchBie')}",
                speciesListUrl: "${createLink(controller:'proxy', action:'speciesItemsForList')}",
                speciesSearchUrl: "${createLink(controller:'project', action:'searchSpecies', id:activity.projectId, params:[surveyName:metaModel.name])}",
                speciesImageUrl: "${createLink(controller:'species', action:'speciesImage')}",
                noImageUrl: "${assetPath(src:'nophoto.png')}",
                context:<fc:modelAsJavascript model="${context}"/>,
                prepopUrlPrefix:"${grailsApplication.config.getProperty('grails.serverURL')}",
                useGoogleBaseMap: ${grails.util.Environment.current == grails.util.Environment.PRODUCTION},
                unlockActivityUrl: "${createLink(controller:'activity', action:'ajaxUnlock')}/<fc:currentUserId/>"
            },
            here = document.location.href;
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="activity.css"/>

</head>

<body>
<g:render template="/output/mapInDialogEditTemplate" plugin="ecodata-client-plugin"/>

<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <section aria-labelledby="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <g:link controller="home">Home</g:link>
                    </li>
                    <li class="breadcrumb-item"><a href="${contextViewUrl}">${context.name.encodeAsHTML()}</a></li>
                    <li class="breadcrumb-item active">${report.name}</li>
                </ol>
            </section>
        </g:if>
        <g:render template="${reportHeaderTemplate}"/>
    </div>

    <g:render template="/activity/activityFormContents"/>

    <g:if test="${!printView}">
        <!-- ko stopBinding: true -->
        <div id="report-navigation">
        <div id="floating-save" style="display:none;">
            <div class="transparent-background"></div>
            <div id="nav-buttons">
                <button type="button" class="right btn btn-sm btn-success" data-bind="enable:dirtyFlag.isDirty(), click: save">Save changes</button>
                <button type="button" class="right btn btn-sm" data-bind="click: exitReport, class: saveAndExitButtonClass">Exit report</button>
                <label class="checkbox inline mark-complete" data-bind="visible:activity.progress() != 'corrected'">
                        <input data-bind="checked:activity.transients.markedAsFinished" type="checkbox"> Mark this report as complete.
                </label>
            </div>
        </div>
        <div id="form-actions-anchor" class="form-actions"></div>
        </div>
        <!-- /ko -->
    </g:if>
</div>

<g:render template="/shared/timeoutMessage"
          model="${[url:grailsApplication.config.getProperty('security.cas.loginUrl')+'?service='+ createLink(controller: 'project', action: 'editReport', absolute: true, id: activity.projectId, params: [reportId: report.reportId])]}"/>

<g:render template="/shared/documentTemplate"></g:render>

%{--The modal view containing the contents for a modal dialog used to attach a document--}%
<g:render template="/shared/attachDocument"/>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="enterActivityData.js"/>

<script type="text/javascript">

    $(function () {
        var returnTo = "${returnTo}";
        var activity = <fc:modelAsJavascript model="${activity}" default="{}"/>
        var reportSite;
        var recoveryDataStorageKey = "activity-${activity.activityId}";

        /** This function is called if an exception is thrown during the report model initialisation */
        var initialisationErrorCallback = function(e) {
            console.log(e);
            if (amplify.store(recoveryDataStorageKey)) {
                bootbox.alert("An error was encountered attempting to restore unsaved data for this form.  <p>The page will be reloaded when you press OK.  If this error persists, please contact support.</p>", function () {
                    // Delete the stored data that may have caused the restoration error, then reload the page.
                    amplify.store(recoveryDataStorageKey, null);
                    window.location.reload();
                });
            } else {
                throw e;
            }
        }
        try {

            if (amplify.store(recoveryDataStorageKey)) {
                var localStorage = amplify.store(recoveryDataStorageKey);
                var restoredSite = $.parseJSON(localStorage);
                reportSite = restoredSite.site
            } else {

                reportSite = <fc:modelAsJavascript model="${reportSite}" default="{}"/>
            }

            var projectArea = <fc:modelAsJavascript model="${projectArea}" default="{}"/>
            var reportId = '${report.reportId}';

            var context = {
                owner: fcConfig.context,
                reportId: reportId,
                activity: activity,
                documents: activity.documents,
                site: activity.site
            };

            var locked = ${locked};
            var metaModel = <fc:modelAsJavascript model="${metaModel}" default="{}"/>
            var master = null;
            var mapPopupSelector = '#map-modal';
            var features = <fc:modelAsJavascript model="${features}" default="{}"/>
            var reportMasterOptions = {
                locked: locked,
                activityUpdateUrl: fcConfig.activityUpdateUrl,
                healthCheckUrl: fcConfig.healthCheckUrl
            };
            if (metaModel.supportsSites) {
                // Workaround for problems with IE11 and leaflet draw
                L.Browser.touch = false;


                var mapOptions = {};
                if (fcConfig.useGoogleBaseMap) {
                    mapOptions.baseLayersName = 'Google'; // Default is Open Street Maps
                }
                var planningSitesCategory = 'Planning Sites';
                if (features && _.isArray(features)) {
                    var planningFeatures = [];
                    var allFeatures = [];
                    _.each(features, function (feature) {
                        // Group the planning sites together into a single collection
                        if (feature.properties && feature.properties.category && feature.properties.category == planningSitesCategory) {
                            planningFeatures.push(feature);
                        } else {
                            allFeatures.push(feature);
                        }
                    });
                    if (planningFeatures.length > 0) {
                        allFeatures.unshift({
                            type: 'Feature Collection',
                            features: planningFeatures,
                            properties: {category: planningSitesCategory, name: planningSitesCategory}
                        });
                    }
                    mapOptions.selectableFeatures = allFeatures;


                }

                var formFeatures = new ecodata.forms.FeatureCollection(reportSite ? reportSite.features : []);
                context.featureCollection = formFeatures;
                try {

                    var map = ecodata.forms.maps.featureMap(mapOptions);
                    if (projectArea && projectArea.type) {
                        map.fitToBoundsOf(projectArea);
                    }
                    ko.applyBindings(map, $(mapPopupSelector)[0]);
                } catch (e) {
                    console.log("Unable to initialise map, could be because no map elements are on display: " + e);
                }

                master = new ReportMaster(reportId, activity.activityId, reportSite, formFeatures,  reportMasterOptions);
            } else {
                master = new ReportMaster(reportId, activity.activityId, undefined, undefined, reportMasterOptions);
            }

            var themes = <fc:modelAsJavascript model="${themes}" default="{}"/>

            var viewModel = new ActivityHeaderViewModel(activity, {}, fcConfig.context, metaModel, themes);

            ko.applyBindings(viewModel);

            if (metaModel.formVersion != activity.formVersion) {
                viewModel.formVersion(metaModel.formVersion);
            }
            viewModel.dirtyFlag.reset();

            <g:if test="${params.progress}">
            var newProgress = '${params.progress}';
            if (newProgress == 'corrected') {
                viewModel.progress(newProgress);
            } else {
                viewModel.transients.markedAsFinished(newProgress == 'finished');
            }
            </g:if>

            master.register('activityModel', viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset, viewModel.updateIdsAfterSave);

            var url = '${g.createLink(controller: 'activity', action:'activitiesWithStage', id:activity.projectId)}';
            var activityUrl = '${g.createLink(controller:'activity', action:'enterData')}';
            var activityId = '${activity.activityId}';
            var projectId = '${activity.projectId}';
            var siteId = '${activity.siteId?:""}';
            var options = {navigationUrl: url, activityUrl: activityUrl, returnTo: returnTo};
            options.navContext = '${navContext}';
            options.activityNavSelector = '#activity-nav';
            options.savedNavMessageSelector = '#saved-nav-message-holder';

            var outputModelConfig = {
                activityId: activityId,
                projectId: projectId,
                disablePrepop: ${activity.progress == au.org.ala.merit.ActivityService.PROGRESS_FINISHED},
                speciesConfig:<fc:modelAsJavascript model="${speciesConfig}"/>,
                recoveryDataStorageKey: recoveryDataStorageKey
            };
            outputModelConfig = _.extend(fcConfig, outputModelConfig);

            <g:each in="${metaModel?.outputs}" var="outputName">

                <g:if test="${outputName != 'Photo Points'}">
                <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
                <g:set var="model" value="${outputModels[outputName]}"/>
                <g:set var="output" value="${activity.outputs.find {it.name == outputName} ?: [name: outputName]}"/>

                var blockId = "${blockId}";
                var output = <fc:modelAsJavascript model="${output}"/>;

                var config = <fc:modelAsJavascript model="${metaModel.outputConfig?.find{it.outputName == outputName}}" default="{}"/>;

                config.recoveryDataStorageKey = recoveryDataStorageKey;
                config.model = <fc:modelAsJavascript model="${model}"/>;
                config.featureCollection = context.featureCollection;
                config.namespace = blockId;

                config = _.extend({}, outputModelConfig, config);
                master.createAndBindOutput(output, context, config);

                </g:if>

            </g:each>

            if (config.featureCollection) {
                config.featureCollection.loadComplete();
            }

            var navElement = document.getElementById('report-navigation');
            var options = {
                returnTo: returnTo,
                anchorElementSelector: "#form-actions-anchor",
                navContentSelector: "#nav-buttons",
                floatingNavSelector: "#floating-save"
            };
            var navigator = new ReportNavigationViewModel(master, viewModel, options);
            ko.applyBindings(navigator, navElement);

            $('.helphover').popover({animation: true, trigger: 'hover'});

            var $validationContainer = $('#validation-container');
            $validationContainer.validationEngine('attach', {scroll: true});

            navigator.initialiseScrollPosition($validationContainer, activity.progress);

            $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({
                type: 'image',
                autoSize: true,
                nextEffect: 'fade',
                preload: 0,
                'prevEffect': 'fade'
            });
        }
        catch (ex) {
            initialisationErrorCallback(ex);
        }
    });
</script>
<asset:deferredScripts/>
</body>
</html>
