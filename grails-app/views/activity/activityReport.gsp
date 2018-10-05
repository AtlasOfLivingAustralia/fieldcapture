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
        <div class="form-actions">
            <button type="button" id="save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
            <label class="checkbox inline" data-bind="visible:progress() != 'corrected'">
                <input data-bind="checked:transients.markedAsFinished"
                       type="checkbox"> Mark this report as complete.
            </label>
        </div>

        <g:render template="/activity/navigation"></g:render>
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
        var reportSite = JSON.parse('${reportSite ? (reportSite as JSON).toString().replace("'", "\\u0027") : '{}'}');
        var projectArea = '${projectArea ? (projectArea as JSON).toString().replace("'", "\\u0027") : '{}'}';
        var reportId = '${report.reportId}';

        var context = {
            owner: fcConfig.context,
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
        if (metaModel.supportsSites) {
            // Workaround for problems with IE11 and leaflet draw
            L.Browser.touch = false;
            var features = {};

            var mapOptions = {};
            if (features && features.type) {
                mapOptions = {selectableFeatures: features};
            }

            var formFeatures = new ecodata.forms.FeatureCollection(reportSite ? reportSite.features : []);
            context.featureCollection = formFeatures;
            try {
                var map = ecodata.forms.featureMap(mapOptions);
                if (projectArea && projectArea.type) {
                    map.fitToBoundsOf(projectArea);
                }
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

        var navigationMode = '${navigationMode}';
        var activityNavigationModel = new ActivityNavigationViewModel(navigationMode, projectId, activityId, siteId, options);

        var outputModelConfig = {
            activityId: activityId,
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

        var viewModel = ecodata.forms.initialiseOutputViewModel(blockId, config.model.dataModel, output, config, context);
        // register with the master controller so this model can participate in the save cycle
        master.register(viewModel, viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset);

        </g:if>
        </g:each>

        ko.applyBindings(activityNavigationModel, document.getElementById('activity-nav'));

        $('.helphover').popover({animation: true, trigger: 'hover'});

        $('#save').click(function () {
            master.save(activityNavigationModel.afterSave);
        });

        $('#cancel').click(function () {
            master.deleteSavedData();
            activityNavigationModel.cancel();
        });

        $('#validation-container').validationEngine('attach', {scroll: true});

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