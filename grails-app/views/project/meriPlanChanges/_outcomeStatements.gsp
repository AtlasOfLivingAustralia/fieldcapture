<g:set var="outcomeType" value="${outcomeType ?: 'short'}"/>
<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table ${extendedOutcomes ? 'extended' :''}" id="outcome-statements">
    <thead>
    <tr>
        <th class="code"></th>
        <th class="outcome">${subtitle ?: ""} </th>
        <th class="investment-priority">${investmentPriorityHeading ?: 'Investment priority'}</th>
        <th class="program-outcome">${programOutcomeHeading ?: 'Related program outcome/s'}</th>
    </tr>
    </thead>
    <g:if test="${outcomeType == 'mid'}">
        <tbody>
        <g:set var="max" value="${Math.max(project.custom.details.outcomes.midTermOutcomes.size(), changed.custom.details.outcomes?.midTermOutcomes?.size()?:0)}"/>
        <g:each in="${(0..<max)}" var="i">
            <tr>
                <td class="code"><fc:renderComparison changed="${changed.custom.details.outcomes.midTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.midTermOutcomes ?: []}" property="code"/> </td>
                <td class="outcome"><fc:renderComparison changed="${changed.custom.details.outcomes.midTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.midTermOutcomes ?: []}" property="description"/> </td>
                <td class="investment-priority"><fc:renderComparisonList changed="${changed.custom.details.outcomes.midTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.midTermOutcomes ?: []}" property="assets"/> </td>
                <td class="medium-term-outcome"><fc:renderComparison changed="${changed.custom.details.outcomes.midTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.midTermOutcomes ?: []}" property="relatedOutcome"/> </td>
            </tr>
        </g:each>
        </tbody>
    </g:if>
    <g:else>
        <tbody>
        <g:set var="max" value="${Math.max(project.custom.details.outcomes.shortTermOutcomes.size(), changed.custom.details.outcomes?.shortTermOutcomes?.size()?:0)}"/>
        <g:each in="${(0..<max)}" var="i">
            <tr>
                <td class="code"><fc:renderComparison changed="${changed.custom.details.outcomes.shortTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.shortTermOutcomes ?: []}" property="code"/> </td>
                <td class="outcome"><fc:renderComparison changed="${changed.custom.details.outcomes.shortTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.shortTermOutcomes ?: []}" property="description"/> </td>
                <td class="investment-priority"><fc:renderComparisonList changed="${changed.custom.details.outcomes.shortTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.shortTermOutcomes ?: []}" property="assets"/> </td>
                <td class="medium-term-outcome"><fc:renderComparison changed="${changed.custom.details.outcomes.shortTermOutcomes ?: []}" i="${i}" original="${project.custom.details.outcomes.shortTermOutcomes ?: []}" property="relatedOutcome"/> </td>
            </tr>
        </g:each>
        </tbody>
    </g:else>
</table>