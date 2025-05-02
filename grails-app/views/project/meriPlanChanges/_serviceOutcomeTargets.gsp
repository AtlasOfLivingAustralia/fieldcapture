<h4>${title ?: "Project services and outcome targets"}</h4>

<table class="table service-outcomes-targets-view service-outcome-changed">
    <thead>
    <tr>
    <tr>
        <th class="index"></th>
        <th class="service required">${serviceName ?: "Project Service"}</th>
        <th class="score required">${targetMeasureHeading ?: 'Target measure'}</th>
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
        <g:set var="originalOutcomeTargets" value="${originalTarget.outcomeTargets}"/>

        <tr class="service-target">
            <td class="index"><span data-bind="text:${i}+1"></span></td>
            <td class="service">

                <fc:renderComparisonService programConfig="${config}"  changed="${changedTarget?[changedTarget]:[]}" i="${0}" original="${originalTarget?[originalTarget]:[]}"/>
            </td>
            <td class="score">

                <fc:renderComparisonScoreLabel config="${config}" changed="${changedTarget?[changedTarget]:[]}" i="${0}" original="${originalTarget?[originalTarget]:[]}" property="scoreId"/>
            </td>
        </tr>
        <tr>
            <td class="index"></td>
            <th>${projectOutcomesHeading ?: 'Project Outcome/s'}</th>
            <th>${targetHeading ?: 'Target'}</th>
        </tr>
        <tr class="outcome-target">
            <td class="index"></td>
            <td class="service">
                <fc:renderComparisonOutputTargets changed="${changedOutcomesTargets?[changedOutcomesTargets]:[]}" i="${0}" original="${originalOutcomeTargets ? [originalOutcomeTargets]: []}" property="relatedOutcomes"/>
            </td>
            <td class="score">
                <fc:renderComparisonOutputTargets changed="${changedOutcomesTargets?[changedOutcomesTargets]:[] ?: []}" i="${0}" original="${originalOutcomeTargets ? [originalOutcomeTargets]: []}" property="target"/>
            </td>
        </tr>
    </fc:sortedServiceTargetMeasures>
    </tbody>
</table>