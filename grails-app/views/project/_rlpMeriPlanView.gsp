<div class="meri-plan space-after" data-bind="let:{details:meriPlan()}">
   <g:render template="/project/meriPlanReadOnly/programOutcome"/>
   <g:render template="/project/meriPlanReadOnly/additionalOutcomes"/>

    <h4>Project outcomes</h4>
    <table class="table">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="outcome">Short-term outcome statement/s</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
        <tr>
            <td class="index" data-bind="text:$index()+1"></td>
            <td class="outcome">
                <span data-bind="text:description"></span>
            </td>
        </tr>
        </tbody>
    </table>

    <g:render template="/project/meriPlanReadOnly/mediumTermOutcomes"/>

    <g:render template="/project/meriPlanReadOnly/nameAndDescription"/>

    <!-- ko if:isAgricultureProject -->
    <table class="table">
       <thead>
        <tr>
            <th>Project rationale</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span data-bind="text:details.rationale"></span></td>
        </tr>
        </tbody>

    </table>
    <!-- /ko -->

    <!-- ko if:!isAgricultureProject() -->
    <g:render template="/project/meriPlanReadOnly/keyThreats"/>
    <!-- /ko -->

    <g:render template="/project/meriPlanReadOnly/projectMethodology"/>

    <g:render template="/project/meriPlanReadOnly/monitoringBaseline"/>

    <table class="table monitoring-indicators-view">
        <thead>
        <tr>
            <th class="index"></th>
            <th class="baseline required">Project monitoring indicators</th>
            <th class="baseline-method required">Project monitoring indicator approach</th>
        </tr>
        </thead>
        <tbody data-bind="foreach : details.keq.rows">
        <tr>
            <td class="index"><span data-bind="text:$index()+1"></span></td>
            <td class="baseline">
                <span data-bind="text: data1">
                </span>
            </td>
            <td class="baseline-method">
                <span data-bind="text: data2"></span>
            </td>
        </tr>
        </tbody>
    </table>

    <g:render template="/project/meriPlanReadOnly/projectReview"/>

    <g:render template="/project/meriPlanReadOnly/nationalAndRegionalPlans"/>

    <g:render template="/project/meriPlanReadOnly/serviceTargets"/>

    <g:if test="${risksAndThreatsVisible}">
        <g:render template="/project/meriPlanReadOnly/risksAndThreats"/>
    </g:if>

</div>
