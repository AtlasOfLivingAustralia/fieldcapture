<!-- ko with:details.baseline -->
<h4 class="header-with-help">Monitoring methodology</h4><fc:iconHelp>${titleHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan, which provides guidance on baselines and the monitoring indicators for each RLP outcome. Note, other monitoring indicators can also be used."}</fc:iconHelp>
<br/>
<strong>Project baseline</strong>
<g:set var="baselineHeader">

</g:set>
<table class="table monitoring-baseline extended">
    <tbody data-bind="foreach: rows">
    <tr class="header">
        <th class="code"></th>
        <th class="outcome required">Outcome statement/s</th>
        <th class="monitoring-data required">Baseline data <g:if test="${baselineDataHelpText}"><fc:iconHelp>${baselineDataHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline required">Baseline data description <g:if test="${baselineDataDescriptionHelpText}"><fc:iconHelp>${baselineDataDescriptionHelpText}</fc:iconHelp></g:if></th>
        <th class="service required">Project Service / Target Measure/s <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineServiceHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline-method required">Select the method used to obtain the baseline, or how the baseline will be established if ‘Other’<fc:iconHelp html="true">${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
        <th class="baseline-evidence required">Evidence to be retained <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
    </tr>

    <tr class="baseline-row">
        <td class="code"><span data-bind="text:code"></span></td>
        <td class="outcome">
            <span data-bind="text:relatedOutcomes"></span>
        </td>
        <td class="monitoring-data">
            <span data-bind="text:monitoringDataStatus"></span>
        </td>
        <td class="baseline">
            <span class="textarea-view" data-bind="text: baseline">
            </span>
        </td>
        <td class="service">
            <span data-bind="text:$root.targetMeasureLabels(relatedTargetMeasures)"></span>
        </td>
        <td class="baseline-method">
            <span data-bind="text:protocols"></span>
            <br/>
            <span data-bind="visible:_.contains(protocols(), 'Other'), text: method"></span>
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