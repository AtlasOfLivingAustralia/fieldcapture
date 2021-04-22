<div class="meri-plan" data-bind="let:{details:meriPlan()}">

<g:each var="content" in="${config?.meriPlanContents}">
    <div class="row">
        <div class="col-sm-12">
            <g:render template="/project/meriPlan/${content.template}" model="${content.model}"/>
        </div>
    </div>
</g:each>

</div>
