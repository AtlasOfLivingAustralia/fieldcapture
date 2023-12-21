<h4>${title ?: "Project services and outcome targets"}</h4>

<table class="table service-outcomes-targets-view service-outcome-changed">
    <thead>
    <tr>
    <tr>
        <th class="index"></th>
        <th class="service required">${serviceName ?: "Project Service"}</th>
        <th class="score required">Target measure</th>
    </tr>
    </thead>
    <tbody>
    <g:set var="max" value="${Math.max(changed.outputTargets.size(), project.outputTargets.size()?:0)}"/>
    <g:each in="${(0..<max)}" var="i">

    <tr class="service-target">
        <td class="index"><span data-bind="text:${i}+1"></span></td>
        <td class="service">
            <fc:renderComparisonService programConfig="${config}"  changed="${changed.outputTargets ?: []}" i="${i}" original="${project.outputTargets ?: []}"/>
        </td>
        <td class="score">
            <fc:renderComparisonScoreLabel config="${config}" changed="${changed.outputTargets ?: []}" i="${i}" original="${project.outputTargets ?: []}" property="scoreId"/>
        </td>
    </tr>
    <tr>
        <td class="index"></td>
        <th>Project Outcome/s</th>
        <th>Target</th>
    </tr>
    <tr class="outcome-target">
        <td class="index"></td>
        <td class="service">
            <fc:renderComparisonOutputTargets changed="${changed.outputTargets.outcomeTargets ?: []}" i="${i}" original="${project.outputTargets.outcomeTargets ?: []}" property="relatedOutcomes"/>
        </td>
        <td class="score">
            <fc:renderComparisonOutputTargets changed="${changed.outputTargets.outcomeTargets ?: []}" i="${i}" original="${project.outputTargets.outcomeTargets ?: []}" property="target"/>
        </td>
    </tr>
    </g:each>
    </tbody>
</table>