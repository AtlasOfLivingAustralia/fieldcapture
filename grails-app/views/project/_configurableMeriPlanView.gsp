<div data-bind="let:{details:meriPlan()}">

<g:each var="template" in="${config?.meriPlanContents}">
    <div class="row-fluid">
        <div class="span12">
            <g:render template="meriPlanReadOnly/${template}"/>
        </div>
    </div>
</g:each>

</div>