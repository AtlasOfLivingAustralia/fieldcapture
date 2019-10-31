<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <g:if test="${printView}">
        <meta name="layout" content="nrmPrint"/>
        <title>${report.name}</title>
    </g:if>
    <g:else>
        <meta name="layout" content="${hubConfig.skin}"/>
        <title>Edit | ${report.name} | MERIT</title>
    </g:else>

    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script type="text/javascript">
        var fcConfig = {
                serverUrl: "${grailsApplication.config.grails.serverURL}",
                activityUpdateUrl: "${saveReportUrl}",
                contextViewUrl: "${contextViewUrl}/",
                bieUrl: "${grailsApplication.config.bie.baseURL}",
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
                context:${fc.modelAsJavascript(model:context)},
                prepopUrlPrefix:"${grailsApplication.config.grails.serverURL}",
                useGoogleBaseMap: ${grails.util.Environment.current == grails.util.Environment.PRODUCTION},
                unlockActivityUrl: "${createLink(controller:'activity', action:'ajaxUnlock')}/<fc:currentUserId/>"
            },
            here = document.location.href;
    </script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="activity.css"/>

</head>

<body>
<g:render template="/output/mapInDialogEditTemplate" plugin="ecodata-client-plugin"/>

<div class="${containerType} validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <g:if test="${!printView}">
            <ul class="breadcrumb">
                <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
                <li><a href="${contextViewUrl}">${context.name.encodeAsHTML()}</a> <span class="divider">/</span></li>
                <li class="active">
                    ${report.name}
                </li>
            </ul>
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
                <button class="right btn btn-success" data-bind="enable:dirtyFlag.isDirty(), click: save">Save changes</button>
                <button class="right btn" data-bind="click: exitReport, class: saveAndExitButtonClass">Exit report</button>
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
          model="${[url: createLink(action: 'enterData', id: activity.activityId, params: [returnTo: returnTo])]}"/>

<g:render template="/shared/documentTemplate"></g:render>

%{--The modal view containing the contents for a modal dialog used to attach a document--}%
<g:render template="/shared/attachDocument"/>

<g:render template="/output/formsTemplates" plugin="ecodata-client-plugin"/>

<asset:javascript src="common.js"/>
<asset:javascript src="enterActivityData.js"/>

<script type="text/javascript">

    $(function () {
        var returnTo = "${returnTo}";
        var activity = JSON.parse('${(activity as JSON).toString().encodeAsJavaScript()}');
        var reportSite = ${reportSite?.encodeAsJSON() ?: '{}' };
        var projectArea = ${projectArea?.encodeAsJSON() ?: '{}'};

        var reportId = '${report.reportId}';

        var context = {
            owner: fcConfig.context,
            reportId: reportId,
            activity: activity,
            documents: activity.documents,
            site: activity.site
        };


        // Release the lock when leaving the page.  async:false is deprecated but is still the easiest solution to achieve
        // an unconditional lock release when leaving a page.
        var locked = ${locked};
        if (locked) {
            var unlockActivity = function () {
                $.ajax(fcConfig.unlockActivityUrl + '/' + activity.activityId, {method: 'POST', async: false});
            };
            window.onunload = unlockActivity;
        }

        var metaModel = ${metaModel};

        var master = null;
        var mapPopupSelector = '#map-modal';
        var features = ${features?.encodeAsJSON() ?: '[]'}  ;
        if (metaModel.supportsSites) {
            // Workaround for problems with IE11 and leaflet draw
            L.Browser.touch = false;

            var mapOptions = {useGoogleBaseMap: fcConfig.useGoogleBaseMap};
            var planningSitesCategory = 'Planning Sites';
            if (features && _.isArray(features)) {
                var planningFeatures = [];
                var allFeatures = [];
                _.each(features, function(feature) {
                    // Group the planning sites together into a single collection
                    if (feature.properties && feature.properties.category && feature.properties.category == planningSitesCategory) {
                        planningFeatures.push(feature);
                    }
                    else {
                        allFeatures.push(feature);
                    }
                });
                if (planningFeatures.length > 0) {
                    allFeatures.unshift({type:'Feature Collection', features:planningFeatures, properties:{category:planningSitesCategory, name:planningSitesCategory}});
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
            }
            catch (e) {
                console.log("Unable to initialise map, could be because no map elements are on display: " + e);
            }

            var master = new ReportMaster(reportId, activity.activityId, reportSite, formFeatures, {activityUpdateUrl: fcConfig.activityUpdateUrl});
        }
        else {
            master = new ReportMaster(reportId, activity.activityId, undefined, undefined, {activityUpdateUrl: fcConfig.activityUpdateUrl});
        }


        var themes = ${themes};

        var viewModel = new ActivityHeaderViewModel(activity, {}, fcConfig.context, metaModel, themes);

        ko.applyBindings(viewModel);

        // We need to reset the dirty flag after binding but doing so can miss a transition from planned -> started
        // as the "mark activity as finished" will have already updated the progress to started.
        if (activity.progress == viewModel.progress()) {
            viewModel.dirtyFlag.reset();
        }
        if (metaModel.formVersion != activity.formVersion) {
            viewModel.formVersion(metaModel.formVersion);
        }

        <g:if test="${params.progress}">
        var newProgress = '${params.progress}';
        if (newProgress == 'corrected') {
            viewModel.progress(newProgress);
        }
        else {
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
            recoveryDataStorageKey: 'activity-' + activityId
        };
        outputModelConfig = _.extend(fcConfig, outputModelConfig);

        <g:each in="${metaModel?.outputs}" var="outputName">
        <g:if test="${outputName != 'Photo Points'}">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>
        <g:set var="output" value="${activity.outputs.find {it.name == outputName} ?: [name: outputName]}"/>

        var blockId = "${blockId}";
        var output = <fc:modelAsJavascript model="${output}"/>;
        var config = ${fc.modelAsJavascript(model:metaModel.outputConfig?.find{it.outputName == outputName}, default:'{}')};

        config.model = ${fc.modelAsJavascript(model:model)};
        config.featureCollection = context.featureCollection;

        config = _.extend({}, outputModelConfig, config);

        var outputViewModel = ecodata.forms.initialiseOutputViewModel(blockId, config.model.dataModel, output, config, context);
        // register with the master controller so this model can participate in the save cycle
        master.register(outputViewModel, outputViewModel.modelForSaving, outputViewModel.dirtyFlag.isDirty, outputViewModel.dirtyFlag.reset);

        </g:if>
        </g:each>

        if (config.featureCollection) {
            config.featureCollection.loadComplete();
        }

        var navElement = document.getElementById('report-navigation');
        var options = {
            returnTo:returnTo,
            anchorElementSelector:"#form-actions-anchor",
            navContentSelector:"#nav-buttons",
            floatingNavSelector:"#floating-save"
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
    });
</script>
<asset:deferredScripts/>
</body>
</html>