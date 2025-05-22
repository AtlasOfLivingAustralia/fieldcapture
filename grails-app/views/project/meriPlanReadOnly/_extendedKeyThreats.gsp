<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<g:if test="${explanation}">
    <p>${explanation}</p>
</g:if>
<!-- ko with:details.threats -->
<table class="table threats-view threats extended-threats">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="related-outcomes">${outcomeStatementHeading ?: 'Outcome Statement/s'}</th>
        <th class="threat-code">${threatsHeading ?:'Threats / Threatening processes'}</th>
        <th class="threat required">${descriptionHeading ?: 'Description'} <fc:iconHelp>${threatHelpText ?: "Describe the key threats (or key threatening processes) to the primary investment priority"}</fc:iconHelp></th>
        <th class="services">${servicesHeading ?: 'Project service / Target measure/s to address threats'}</th>
        <th class="intervention required">${methodologyHeading ?: 'Methodology'} <fc:iconHelp>${interventionHelpText ?: "Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome."}</fc:iconHelp></th>
        <th class="evidence">${evidenceHeading ?: 'Evidence to be retained'} <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
    </tr>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="related-outcomes">
            <span data-bind="arrayAsCommaSeparatedText:relatedOutcomes"></span>
        </td>
        <td class="threat-code">
            <span data-bind="text:threatCode"></span>
        </td>
        <td class="threat">
            <span class="textarea-view" data-bind="text: threat">
            </span>
        </td>
        <td class="services">
            <g:render template="/project/meriPlanReadOnly/arrayAsList" model="${[source:'$root.targetMeasureLabels(relatedTargetMeasures)']}"/>
        </td>
        <td class="intervention">
            <span class="textarea-view" data-bind="text: intervention"></span>
        </td>
        <td class="evidence">
            <span class="textarea-view" data-bind="text:evidence"></span>
        </td>


    </tr>
    </tbody>
</table>
<!-- /ko -->
