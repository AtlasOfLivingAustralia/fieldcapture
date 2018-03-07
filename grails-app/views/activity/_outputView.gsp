

<md:modelStyles model="${model}" edit="true"/>
<div class="output-block" id="ko${blockId}">
    <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">${model?.title ?: outputName}</h3>

    <div data-bind="if:transients.optional || outputNotCompleted()">
        <label class="checkbox"><input type="checkbox" data-bind="checked:outputNotCompleted">
            <span data-bind="text:transients.questionText"></span>
        </label>
    </div>

    <div id="${blockId}-content" data-bind="visible:!outputNotCompleted()">
        <!-- add the dynamic components -->
        <md:modelView model="${model}" site="${site}" edit="true" output="${outputName}"
                      printable="${printView}"/>
    </div>

</div>