<h4>Additional benefits</h4>
<table class="table secondary-outcome">
    <thead>
    <tr>
        <th class="outcome-priority">${outcomePriority ?:"Secondary outcome(s)"}</th>
        <th class="priority">${ priority ?:"Secondary Investment Priorities"}</th>
    </tr>
    </thead>
    <tbody>
    <g:set var="max" value="${Math.max(project.custom.details.outcomes?.secondaryOutcomes?.size(), changed.custom.details.outcomes?.secondaryOutcomes?.size()?:0)}"/>
    <g:each in="${(0..<max)}" var="i">
    <tr>
        <td class="outcome-priority">
            <span id="additional-benefits">
                <span>
                    <fc:renderComparison
                            changed="${changed.custom.details.outcomes.secondaryOutcomes ?: []}" i="${i}"
                            original="${project.custom.details.outcomes.secondaryOutcomes ?: []}"
                            property="description"

                    />
                </span>
            </span>
        </td>
        <td>
            <span class="secondary-assets">

                <span><fc:renderComparisonList
                        changed="${changed.custom.details.outcomes.secondaryOutcomes ?: []}" i="${i}"
                        original="${project.custom.details.outcomes.secondaryOutcomes ?: []}"
                        property="assets"
                        objectList="${investmentPriorities}"
                        idProperty="investmentPriorityId"
                        labelProperty="name"
                /></span>

            </span>
        </td>
    </tr>
    </g:each>
    </tbody>
</table>