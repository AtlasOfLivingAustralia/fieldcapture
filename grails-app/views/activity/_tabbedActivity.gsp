<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>

<!-- ko stopBinding: true -->
<g:each in="${metaModel?.outputs}" var="outputName">
    <g:if test="${outputName != 'Photo Points'}">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>
        <g:set var="output" value="${activity.outputs.find {it.name == outputName}}"/>
        <g:if test="${!output}">
            <g:set var="output" value="[name: outputName]"/>
        </g:if>
        <md:modelStyles model="${model}" edit="true"/>
        <div class="output-block" id="ko${blockId}">
            <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">${model?.title ?: outputName}</h3>
            <div data-bind="if:transients.optional || outputNotCompleted()">
                <label class="checkbox" ><input type="checkbox" data-bind="checked:outputNotCompleted"> <span data-bind="text:transients.questionText"></span> </label>
            </div>
            <div id="${blockId}-content" data-bind="visible:!outputNotCompleted()">
                <!-- add the dynamic components -->
                <md:modelView model="${model}" site="${site}" edit="true" output="${output.name}" printable="${printView}" />
            </div>
            <g:render template="/output/outputJSModel" plugin="ecodata-client-plugin" model="${[viewModelInstance:blockId+'ViewModel', edit:true, activityId:activity.activityId, model:model, outputName:output.name]}"></g:render>

        </div>
    </g:if>
</g:each>
<!-- /ko -->

<g:if test="${metaModel.supportsPhotoPoints}">
    <div class="output-block" data-bind="with:transients.photoPointModel">
        <h3>Photo Points</h3>

        <g:render template="/site/photoPoints"></g:render>

    </div>
</g:if>
<g:if test="${!printView}">
    <div class="form-actions">
        <button type="button" id="save" class="btn btn-primary">Save changes</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
        <label class="checkbox inline" data-bind="visible:progress() != 'corrected'">
            <input data-bind="checked:transients.markedAsFinished" type="checkbox"> Mark this activity as finished.
        </label>
    </div>

</g:if>

<asset:deferredScripts/>

<script type="text/javascript">

    $(function(){
        var returnTo = "${returnTo}";
        var activity = JSON.parse('${(activity as JSON).toString().encodeAsJavaScript()}');


        var master = new Master(activity.activityId, {saveActivityUrl: fcConfig.saveActivityUrl});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#save').click(function () {
            master.save();
        });

        $('#cancel').click(function () {
            document.location.href = returnTo;
        });

        $('#reset').click(function () {
            master.reset();
        });



        var site = null;
        <g:if test="${site}">
        site = JSON.parse('${(site as JSON).toString().encodeAsJavaScript()}');
        </g:if>
        var metaModel = ${metaModel};
        var themes = ${themes};
        var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
        var viewModel = new ActivityHeaderViewModel(activity, site, fcConfig.project, metaModel, themes);

        %{--ko.applyBindings(viewModel);--}%
        %{--viewModel.initialiseMap(mapFeatures);--}%
        %{--// We need to reset the dirty flag after binding but doing so can miss a transition from planned -> started--}%
        %{--// as the "mark activity as finished" will have already updated the progress to started.--}%
        %{--if (activity.progress == viewModel.progress()) {--}%
            %{--viewModel.dirtyFlag.reset();--}%
        %{--}--}%

        %{--<g:if test="${params.progress}">--}%
        %{--var newProgress = '${params.progress}';--}%
        %{--if (newProgress == 'corrected') {--}%
            %{--viewModel.progress(newProgress);--}%
        %{--}--}%
        %{--else {--}%
            %{--viewModel.transients.markedAsFinished(newProgress == 'finished');--}%
        %{--}--}%
        %{--</g:if>--}%

        master.register('activityModel', viewModel.modelForSaving, viewModel.dirtyFlag.isDirty, viewModel.dirtyFlag.reset, viewModel.updateIdsAfterSave);

        var url = '${g.createLink(controller: 'activity', action:'activitiesWithStage', id:activity.projectId)}';
        var activityUrl = '${g.createLink(controller:'activity', action:'enterData')}';
        var activityId = '${activity.activityId}';
        var projectId = '${activity.projectId}';
        var siteId = '${activity.siteId?:""}';
        var options = {navigationUrl:url, activityUrl:activityUrl, returnTo:returnTo};
        options.navContext = '${navContext}';

        var outputModelConfig = {
            projectId:projectId,
            activityId:activityId,
            stage:  stageNumberFromStage('${activity.projectStage}'),
            disablePrepop : ${activity.progress == au.org.ala.merit.ActivityService.PROGRESS_FINISHED},
            speciesConfig :<fc:modelAsJavascript model="${speciesConfig}"/>
        };
        outputModelConfig = _.extend(fcConfig, outputModelConfig);

        <g:each in="${metaModel?.outputs}" var="outputName">
        <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
        <g:set var="model" value="${outputModels[outputName]}"/>
        <g:set var="output" value="${activity.outputs.find {it.name == outputName} ?: [name: outputName]}"/>

        var viewModelName = "${blockId}ViewModel",
            elementId = "ko${blockId}";

        var output = <fc:modelAsJavascript model="${output}"/>;
        var config = ${fc.modelAsJavascript(model:metaModel.outputConfig?.find{it.outputName == outputName}, default:'{}')};
        config.model = ${fc.modelAsJavascript(model:model)},
            config = _.extend({}, outputModelConfig, config);

        initialiseOutputViewModel(viewModelName, config.model.dataModel, elementId, activity, output, master, config);
        </g:each>



        $('.imageList a[target="_photo"]').attr('rel', 'gallery').fancybox({type:'image', autoSize:true, nextEffect:'fade', preload:0, 'prevEffect':'fade'});

    });
</script>