<h4>${title ?: "Project services and outcome targets"}</h4>
<g:set var="originalNumPeriods" value="${project.outputTargets ? (project.outputTargets[0]?.periodTargets?.size() ?: 0) : 0}"/>
<g:set var="changedNumPeriods" value="${changed.outputTargets ? (changed.outputTargets[0]?.periodTargets?.size() ?: 0) : 0}"/>

<g:set var="numPeriods" value="${Math.max(originalNumPeriods, changedNumPeriods)}"/>

<table class="table service-outcomes-targets-view service-outcome-changed">
    <thead>
    <tr>
        <th class="index"></th>
        <th colspan="${(numPeriods+2)/2}" class="service required">${serviceName ?: "Project Service"}</th>
        <th colspan="${(numPeriods % 2 == 0) ? (numPeriods+2)/2 : (numPeriods+3)/2}" class="score required">${targetMeasureHeading ?: 'Target measure'}</th>
    </tr>
    </thead>
    <tbody>

    <fc:sortedServiceTargetMeasures
            originalOutputTargets="${project.outputTargets}"
            changedOutputTargets="${changed.outputTargets}"
            programConfig="${config}">


        <g:set var="originalTarget" value="${(project.outputTargets ?: []).find{it.scoreId == scoreId}}"/>
        <g:set var="changedTarget" value="${(changed.outputTargets ?: []).find{it.scoreId == scoreId}}"/>

        <g:set var="changedOutcomesTargets" value="${changedTarget?.outcomeTargets}"/>
        <g:set var="originalOutcomeTargets" value="${originalTarget?.outcomeTargets}"/>

        <tr class="service-target">
            <td class="index"><span data-bind="text:${i}+1"></span></td>
            <td colspan="${(numPeriods+2)/2}" class="service">

                <fc:renderComparisonService programConfig="${config}" changed="${changedTarget?[changedTarget]:[]}" i="${0}" original="${originalTarget?[originalTarget]:[]}"/>
            </td>
            <td colspan="${(numPeriods % 2 == 0) ? (numPeriods+2)/2 : (numPeriods+3)/2}" class="score">

                <fc:renderComparisonScoreLabel config="${config}" changed="${changedTarget?[changedTarget]:[]}" i="${0}" original="${originalTarget?[originalTarget]:[]}" property="scoreId"/>
            </td>
        </tr>
        <tr class="sub-heading">
            <td rowspan="2" class="index"></td>
            <th rowspan="2">${projectOutcomesHeading ?: 'Project Outcome/s'}</th>
            <th rowspan="2">${targetHeading ?: 'Target'}</th>
            <th colspan="${numPeriods}">${forecastHeading ?: 'Forecast/s'}</th>
        </tr>
        <tr class="sub-heading">
            <g:each in="${0..(numPeriods-1)}" var="p">
            <th class="period-changes">
                <fc:renderComparison changed="${changedTarget?.periodTargets ?: []}" i="${p}" original="${originalTarget?.periodTargets ?: []}" property="period"/>
            </th>
            </g:each>
        </tr>
        <g:set var="maxOutcomeTargets" value="${Math.max((changedOutcomesTargets?.size() ?: 0), (originalOutcomeTargets?.size() ?: 0))}"/>
        <g:each in="${0..(maxOutcomeTargets-1)}" var="i">

        <g:set var="cellWidth" value="${100/(numPeriods+2)}"/>
        <g:set var="changedPeriodTargets" value="${(changedOutcomesTargets && changedOutcomesTargets.size() > i) ? changedOutcomesTargets[i]?.periodTargets : []}"/>
        <g:set var="originalPeriodTargets" value="${(originalOutcomeTargets && originalOutcomeTargets.size() > i) ? originalOutcomeTargets[i]?.periodTargets : []}"/>
        <tr class="outcome-target">
            <td class="index"></td>
            <td style="width:${cellWidth}%">
                <fc:renderComparisonOutputTargets changed="${changedOutcomesTargets?:[]}" i="${i}" original="${originalOutcomeTargets ?: []}" property="relatedOutcomes"/>
            </td>
            <td style="width:${cellWidth}%">
                <fc:renderComparisonOutputTargets changed="${changedOutcomesTargets?:[]}" i="${i}" original="${originalOutcomeTargets ?: []}" property="target"/>
            </td>
            <g:each in="${0..(numPeriods-1)}" var="p">
            <td class="forecast" style="width:${cellWidth}%">
                <fc:renderComparison changed="${changedPeriodTargets ?: []}" i="${p}" original="${originalPeriodTargets ?: []}" property="target"/>
            </td>
            </g:each>
        </tr>
        </g:each>
    </fc:sortedServiceTargetMeasures>
    </tbody>
</table>