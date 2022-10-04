

<md:modelStyles model="${model}" edit="true"/>
<div class="output-block" id="ko${blockId}">
    <g:set var="title" value="${model?.title ?: outputName}"/>
    <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{ title:'Has been modified'}">${title}</h3><g:if test="${model?.description}"><span class="output-help"><fc:iconHelp titleCode="n/a" title="${title}">${model?.description}</fc:iconHelp></span></g:if>
    <!-- ko if:transients.description -->
        <div>
            <button data-bind="toggleVisibility:{blockId: ${blockId}, collapsedByDefault: transients.collapsedByDefault}"></button>
            <span data-bind="if:transients.collapsibleHeading">
                <span class="font-weight-bold" data-bind="text:transients.collapsibleHeading"></span>
            </span>
            <span data-bind="if:!transients.collapsibleHeading">
                <span class="font-weight-bold"><g:message code="label.collapsible.heading"/> ${title}</span>
            </span>
            <div data-bind="if:transients.collapsedByDefault">
                <div id="${blockId}" data-bind="html:transients.description"></div>
            </div>
            <div data-bind="if:!transients.collapsedByDefault">
                <div id="${blockId}" data-bind="html:transients.description" style="display: none"></div>
            </div>
        </div>
        <br>
    <!-- /ko -->
    <div data-bind="if:transients.optional">
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
