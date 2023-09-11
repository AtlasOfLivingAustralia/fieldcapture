<h4>Additional benefits</h4>
<table class="table secondary-outcome">
    <thead>
    <tr>
        <th class="outcome-priority">Secondary outcome(s)</th>
        <th class="priority">${ priority ?:"Secondary Investment Priorities"}</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority" id="secondaryOutcomes">
            <span>
                <g:set var="max" value="${Math.max(project.custom.details.outcomes?.secondaryOutcomes?.size(), changed.custom.details.outcomes?.secondaryOutcomes?.size()?:0)}"/>
                <g:each in="${(0..<max)}" var="i">
                    <span><fc:renderComparison changed="${changed.custom.details.outcomes.secondaryOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.secondaryOutcomes ?: []}" property="description"/></span>
                </g:each>
            </span>
        </td>
        <td>
            <span id="secondaryAssets">
                <g:set var="max" value="${Math.max(project.custom.details.outcomes?.secondaryOutcomes?.assets?.size(), changed.custom.details.outcomes?.secondaryOutcomes?.assets?.size()?:0)}"/>
                <g:each in="${(0..<max)}" var="i">
                    <span><fc:renderComparison changed="${changed.custom.details.outcomes.secondaryOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.secondaryOutcomes ?: []}" property="assets"/></span>
                </g:each>
            </span>
        </td>
    </tr>
    </tbody>
</table>