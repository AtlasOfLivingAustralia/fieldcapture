<g:set var="outcomeType" value="${outcomeType ?: 'short'}"/>
<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table ${extendedOutcomes ? 'extended' :''}">
    <thead>
    <tr>
        <g:if test="${!extendedOutcomes}">
            <th class="index"></th>
        </g:if>
        <g:else>
            <th class="code"></th>
        </g:else>
        <th class="outcome">${subtitle ?: ""} </th>
        <g:if test="${extendedOutcomes}">
            <th class="investment-priority">Investment priority</th>
            <th class="program-outcome">Related program outcome/s</th>
        </g:if>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.${outcomeType}TermOutcomes">
    <tr>
        <g:if test="${!extendedOutcomes}">
            <td class="index" data-bind="text:$index()+1"></td>
        </g:if>
        <g:else>
            <td class="code"><span data-bind="text:code"></span></td>
        </g:else>
        <td class="outcome">
            <span data-bind="text:description"></span>
        </td>
        <g:if test="${extendedOutcomes}">
            <td class="investment-priority">
                <span data-bind="text:asset"></span>
            </td>
            <td class="medium-term-outcome">
                <span data-bind="text:relatedOutcome"></span>
            </td>
        </g:if>
    </tr>
    </tbody>
</table>