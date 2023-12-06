<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<g:if test="${explanation}">
    <p>${explanation}</p>
</g:if>

<!-- ko with:details.threats -->
<table class="table threats-view extended-threats">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="related-outcomes">Outcome Statement/s</th>
        <th class="threat-code">Threats / Threatening processes</th>
        <th class="threat required">Description <fc:iconHelp>${threatHelpText ?: "Describe the key threats (or key threatening processes) to the primary investment priority"}</fc:iconHelp></th>
        <th class="services">Project service / Target measure/s to address threats</th>
        <th class="intervention required">Methodology <fc:iconHelp>${interventionHelpText ?: "Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome."}</fc:iconHelp></th>
        <th class="evidence">Evidence to be retained <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
    </tr>
    </thead>
    <tbody>
    <g:set var="max" value="${Math.max(project.custom.details.threats.rows.size(), changed.custom.details.threats?.rows?.size()?:0)}"/>
    <g:each in="${(0..<max)}" var="i">
        <tr>
            <td class="index"><span data-bind="text:${i}+1"></span></td>
            <td class="related-outcomes">
                <fc:renderComparison changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="relatedOutcomes"/>
            </td>
            <td class="threat-code">
                <fc:renderComparison changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="threatCode"/>
            </td>
            <td class="threat">
                <fc:renderComparison changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="threat"/>
            </td>
            <td class="services">
                <fc:renderComparisonScoreLabel changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="relatedTargetMeasures"/>
            </td>
            <td class="intervention">
                <fc:renderComparison changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="intervention"/>
            </td>
            <td class="evidence">
                <fc:renderComparison changed="${changed.custom.details.threats.rows ?: []}" i="${i}" original="${project.custom.details.threats.rows ?: []}" property="evidence"/>
            </td>
        </tr>
    </g:each>
    </tbody>
</table>
<!-- /ko -->
