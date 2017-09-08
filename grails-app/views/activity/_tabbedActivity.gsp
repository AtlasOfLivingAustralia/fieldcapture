<%@ page import="au.org.ala.merit.ActivityService; grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>

<div id="activity-${activity.activityId}" class="validationEngineContainer">
<!-- ko stopBinding: true -->
    <g:each in="${metaModel?.outputs}" var="outputName">
        <g:if test="${outputName != 'Photo Points'}">
            <g:set var="blockId" value="${fc.toSingleWord([name: outputName])}"/>
            <g:set var="model" value="${outputModels[outputName]}"/>
            <g:set var="output" value="${activity.outputs.find { it.name == outputName }}"/>
            <g:if test="${!output}">
                <g:set var="output" value="[name: outputName]"/>
            </g:if>
            <md:modelStyles model="${model}" edit="true"/>
            <div class="output-block" id="ko${blockId}">
                <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">${model?.title ?: outputName}</h3>

                <div data-bind="if:transients.optional || outputNotCompleted()">
                    <label class="checkbox"><input type="checkbox" data-bind="checked:outputNotCompleted"> <span
                            data-bind="text:transients.questionText"></span></label>
                </div>

                <div id="${blockId}-content" data-bind="visible:!outputNotCompleted()">
                    <!-- add the dynamic components -->
                    <md:modelView model="${model}" site="${site}" edit="true" output="${output.name}"
                                  printable="${printView}"/>
                </div>
                <g:render template="/output/outputJSModel" plugin="ecodata-client-plugin"
                          model="${[viewModelInstance: blockId + 'ViewModel', edit: true, activityId: activity.activityId, model: model, outputName: output.name]}"></g:render>

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
            master.save();
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
            speciesConfig:<fc:modelAsJavascript model="${speciesConfig}"/>
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