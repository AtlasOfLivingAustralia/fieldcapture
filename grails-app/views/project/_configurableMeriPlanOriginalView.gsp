<div id="meriplan-original"  class="meri-plan space-after" data-bind="let:{details:meriPlan(), detailsChanged:meriPlanChanged()}">
    MERI-PLAN ORIGINAL TESTING
<g:each var="content" in="${config?.meriPlanContents}">
    <div class="row">
        <div class="col-sm-12 p-3">
        <g:if test="${!(mode in content.excludedModes?:[])}">
            <g:render template="/project/meriPlanChanges/${content.template}" model="${content.model}"/>
        </g:if>
        </div>
    </div>
</g:each>

</div>

