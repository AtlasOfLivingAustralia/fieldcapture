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
        <th class="threat-code">Key threat(s) and/or key threatening processes</th>
        <th class="threat required">Description <fc:iconHelp>${threatHelpText ?: "Describe the key threats (or key threatening processes) to the primary investment priority"}</fc:iconHelp></th>
        <th class="services">Project service measure/s to address threats</th>
        <th class="intervention required">Methodology <fc:iconHelp>${interventionHelpText ?: "Describe the proposed interventions to address the threat and how this will deliver on the 5 year outcome."}</fc:iconHelp></th>
        <th class="evidence">Evidence to be retained <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
        <th class="related-outcomes">ST/MT Outcome Statement</th>
    </tr>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="threat-code">
            <span data-bind="text:threatCode"></span>
        </td>
        <td class="threat">
            <span class="textarea-view" data-bind="text: threat">
            </span>
        </td>
        <td class="services">
            <span data-bind="text:$root.targetMeasureLabels(relatedTargetMeasures)"></span>
        </td>
        <td class="intervention">
            <span class="textarea-view" data-bind="text: intervention"></span>
        </td>
        <td class="evidence">
            <span class="textarea-view" data-bind="text:evidence"></span>
        </td>
        <td class="related-outcomes">
            <span data-bind="text:relatedOutcomes"></span>
        </td>

    </tr>
    </tbody>
</table>
<!-- /ko -->
