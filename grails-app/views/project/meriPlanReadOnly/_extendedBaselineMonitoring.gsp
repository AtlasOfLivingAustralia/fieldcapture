<!-- ko with:details.baseline -->
<h4 class="header-with-help">${title?:'Monitoring methodology'}</h4><fc:iconHelp>${titleHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan, which provides guidance on baselines and the monitoring indicators for each RLP outcome. Note, other monitoring indicators can also be used."}</fc:iconHelp>
<br/>
<strong>${subtitle?:'Project baseline'}</strong>
<g:set var="baselineHeader">

</g:set>
<table class="table monitoring-baseline extended">
    <tbody data-bind="foreach: rows">
    <tr class="header">
        <th class="code"></th>
        <th class="outcome required">${outcomeStatementHeading ?: 'Outcome statement/s'}</th>
        <th class="monitoring-data required">${baseLineHeading ?: 'Baseline data'} <g:if test="${baselineDataHelpText}"><fc:iconHelp>${baselineDataHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline required">${baseLineDescHeading ?: 'Baseline data description'} <g:if test="${baselineDataDescriptionHelpText}"><fc:iconHelp>${baselineDataDescriptionHelpText}</fc:iconHelp></g:if></th>
        <th class="service required">${servicesHeading ?: 'Project Service / Target Measure/s'} <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineServiceHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline-method required">${methodBaseLineHeading ?: 'Select the method used to obtain the baseline, or how the baseline will be established if ‘Other’'}<fc:iconHelp html="true">${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
        <th class="baseline-evidence required">${evidenceHeading ?: 'Evidence to be retained'} <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
    </tr>

    <tr class="baseline-row">
        <td class="code"><span data-bind="text:code"></span></td>
        <td class="outcome">
            <span data-bind="arrayAsCommaSeparatedText:relatedOutcomes"></span>
        </td>
        <td class="monitoring-data">
            <span data-bind="text:monitoringDataStatus"></span>
        </td>
        <td class="baseline">
            <span class="textarea-view" data-bind="text: baseline">
            </span>
        </td>
        <td class="service">
            <g:render template="/project/meriPlanReadOnly/arrayAsList" model="${[source:'$root.targetMeasureLabels(relatedTargetMeasures)']}"/>
        </td>
        <td class="baseline-method">
            <g:render template="/project/meriPlanReadOnly/arrayAsList" model="${[source:'protocols()', otherSource:'method()']}"/>
        </td>
        <td class="evidence">
            <span class="textarea-view" data-bind="text:evidence"></span>
        </td>

    </tr>
    <tr><td class="code"></td><th colspan="7">Monitoring indicators</th></tr>
    <tr>
        <td class="code" data-bind="text:code"></td>
        <td colspan="8" class="embedded-monitoring">


            <g:render template="/project/meriPlanReadOnly/monitoringIndicators"
                      model="${[monitoringValidation:true, extendedMonitoring:true,indictorSelectorExpression:'$root.monitoringIndicators(code)', addIndictorExpression:'function() {$root.addMonitoringIndicator(code)}', removeIndictorExpression:'$root.removeMonitoringIndicator']}"/>

        </td>
    </tr>
    </tbody>
</table>

<!-- /ko -->