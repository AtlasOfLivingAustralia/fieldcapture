<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>

<div id="activity-${activity.activityId}" class="validationEngineContainer">

    <g:render template="activityFormContents"/>
    <g:if test="${params.includeFormActions}">
        <div class="form-actions">
            <button type="button" id="save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
        </div>
    </g:if>
</div>

<asset:deferredScripts/>

<script type="text/javascript">

    $(function () {
        var returnTo = "${returnTo}";
        var activity = JSON.parse('${(activity as JSON).toString().encodeAsJavaScript()}');
        var formSelector = '#activity-' + activity.activityId;


        var master = new Master(activity.activityId, {
            activityUpdateUrl: fcConfig.activityUpdateUrl + '/' + activity.activityId,
            validationContainerSelector: formSelector
        });

        $('.helphover').popover({animation: true, trigger: 'hover'});

        $('#save').click(function () {
            master.save(function() {$.unblockUI();});
        });

        $('#cancel').click(function () {
            document.location.href = returnTo;
        });

        $('#reset').click(function () {
            master.reset();
        });

        // export the model so it can be used on the page in which this tabbed activity is being displayed.
        ecodata.forms[activity.activityId] = master;

        var activityId = '${activity.activityId}';
        var projectId = '${activity.projectId}';

        var outputModelConfig = {
            projectId: projectId,
            activityId: activityId,
            stage: stageNumberFromStage('${activity.projectStage}'),
            disablePrepop: ${activity.progress == au.org.ala.merit.ActivityService.PROGRESS_FINISHED},
            speciesConfig:<fc:modelAsJavascript model="${speciesConfig}"/>,
            recoveryDataStorageKey: 'activity-'+activityId
        };
        outputModelConfig = _.extend(fcConfig, outputModelConfig);

        <g:each in="${metaModel?.outputs}" var="outputName">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>
        <g:set var="output" value="${activity.outputs.find {it.name == outputName} ?: [name: outputName]}"/>

        var blockId = "${blockId}";


        var output = <fc:modelAsJavascript model="${output}"/>;
        var config = ${fc.modelAsJavascript(model:metaModel.outputConfig?.find{it.outputName == outputName}, default:'{}')};
        config.model = ${fc.modelAsJavascript(model:model)};
        config = _.extend({}, outputModelConfig, config);

        var context = {
            project:fcConfig.project,
            activity:activity,
            documents:activity.documents,
            site:activity.site
        };

        var viewModel = ecodata.forms.initialiseOutputViewModel(blockId, config.model.dataModel, output, config, context);
        // register with the master controller so this model can participate in the save cycle
        master.register(viewModel, viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset);

        </g:each>


        $(formSelector).validationEngine('attach', {scroll: true});
        $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({
            type: 'image',
            autoSize: true,
            nextEffect: 'fade',
            preload: 0,
            'prevEffect': 'fade'
        });

    });
</script>