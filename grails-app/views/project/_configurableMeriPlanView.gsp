<div class="meri-plan space-after" data-bind="let:{details:meriPlan()}">

<g:each var="content" in="${config?.meriPlanContents}">
    <div class="row">
        <div class="col-sm-12 p-3">
        <g:if test="${!(mode in content.excludedModes?:[])}">
            <g:render template="/project/meriPlanReadOnly/${content.template}" model="${content.model}"/>
        </g:if>
        </div>
    </div>
</g:each>

</div>
