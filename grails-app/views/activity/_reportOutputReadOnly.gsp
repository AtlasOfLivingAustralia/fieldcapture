<g:set var="blockId" value="${divId?:(activity.activityId+fc.toSingleWord([name: outputName]))}"/>
<g:set var="output" value="${activity.outputs.find {it.name == outputName}}"/>
<g:if test="${!output}">
    <g:set var="output" value="[name: outputName]"/>
</g:if>
<md:modelStyles model="${outputModel}" edit="true"/>
<div class="output-block" id="ko${blockId}">
    <h3>${outputModel?.title ?: outputName}</h3>
    <div data-bind="if:outputNotCompleted">
        <label class="checkbox" ><input type="checkbox" disabled="disabled" data-bind="checked:outputNotCompleted"> <span data-bind="text:transients.questionText"></span> </label>
    </div>
    <g:if test="${!output.outputNotCompleted}">
        <!-- add the dynamic components -->
        <md:modelView model="${outputModel}" site="${site}" printable="${printable}"/>
    </g:if>
    <asset:script>
        $(function(){

            var viewModelName = "${fc.toSingleWord(name:outputName)}ViewModel";
            var viewModelInstance = "${blockId}Instance";

            var output = <fc:modelAsJavascript model="${output}"/>;
            var config = <fc:modelAsJavascript model="${activityModel.outputConfig?.find{it.outputName == outputName}}" default='{}'/>;
            config = _.defaults(config, fcConfig);
            config.model = <fc:modelAsJavascript model="${outputModel}" />;
            config.excelOutputTemplateUrl = fcConfig.excelOutputTemplateUrl;
            config.disablePrepop = ${disablePrepop != null ? Boolean.valueOf(disablePrepop) : true};
            config.readonly = true;

            var activity = <fc:modelAsJavascript model="${activity}" />;
            var reportId = '${report.reportId}'

            var context = {
                owner: fcConfig.context,
                documents: activity.documents,
                reportId: reportId,
                site: activity.site,
                activity: activity
            };

            ecodata.forms[viewModelInstance] = new ecodata.forms[viewModelName](output, config.model.dataModel, context, config);
            ecodata.forms[viewModelInstance].initialise(output.data);

            ko.applyBindings(ecodata.forms[viewModelInstance], document.getElementById("ko${blockId}"));
        });

    </asset:script>
</div>