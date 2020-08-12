<div class="meri-plan" data-bind="let:{details:meriPlan()}">

<g:each var="content" in="${config?.meriPlanContents}">
    <div class="row-fluid">
        <div class="span12">
            <g:render template="/project/meriPlanReadOnly/${content.template}" model="${content.model}"/>
        </div>
    </div>
</g:each>

</div>