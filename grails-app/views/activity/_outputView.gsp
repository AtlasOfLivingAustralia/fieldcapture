

<md:modelStyles model="${model}" edit="true"/>
<div class="output-block" id="ko${blockId}">
    <g:set var="title" value="${model?.title ?: outputName}"/>
    <div class="row">
    <div class="col-sm-10">
        <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{ title:'Has been modified'}">${title}</h3><g:if test="${model?.description}"><span class="output-help"><fc:iconHelp titleCode="n/a" title="${title}">${model?.description}</fc:iconHelp></span></g:if>
    </div>
</div>

    <div data-bind="if:transients.optional || outputNotCompleted()">
        <label class="checkbox"><input type="checkbox" data-bind="checked:outputNotCompleted">
            <span data-bind="text:transients.questionText"></span>
        </label>
    </div>

    <div id="${blockId}-content" data-bind="visible:!outputNotCompleted()" class="col-sm-12">
        <!-- add the dynamic components -->
        <md:modelView model="${model}" site="${site}" edit="true" output="${outputName}"
                      printable="${printView}"/>
    </div>

</div>
