<h4 class="header-with-help">Monitoring methodology</h4><fc:iconHelp>${titleHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan, which provides guidance on baselines and the monitoring indicators for each RLP outcome. Note, other monitoring indicators can also be used."}</fc:iconHelp>
<br/>
<strong>Project baseline</strong>
<g:set var="baselineHeader">

</g:set>
<table class="table monitoring-baseline extended">
    <tbody>
    <g:set var="max" value="${Math.max(project.custom.details.baseline?.rows.size(), changed.custom.details.baseline?.rows?.size()?:0)}"/>
    <g:each in="${(0..<max)}" var="i">
    <g:set var="code" value="${project.custom.details.baseline.rows.code.get([i])}"/>
    <g:set var="monitoringModel" value="${changed.custom.details.monitoring?.rows.find {it.relatedBaseline == code}}"/>
    <tr class="header">
        <th class="code"></th>
        <th class="outcome required">Outcome statement</th>
        <th class="monitoring-data required">Baseline data <g:if test="${baselineDataHelpText}"><fc:iconHelp>${baselineDataHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline required">Baseline data description <g:if test="${baselineDataDescriptionHelpText}"><fc:iconHelp>${baselineDataDescriptionHelpText}</fc:iconHelp></g:if></th>
        <th class="service required">Project Service / Target Measure/s <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineServiceHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline-method required">Select the method used to obtain the baseline, or how the baseline will be established if ‘Other’<fc:iconHelp html="true">${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
        <th class="baseline-evidence required">Evidence to be retained <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
    </tr>

    <tr class="baseline-row">
        <td class="code"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="code"/> </td>
        <td class="outcome"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="relatedOutcomes"/> </td>
        <td class="monitoring-data required"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="monitoringDataStatus"/> </td>
        <td class="baseline"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="baseline"/> </td>
        <td class="service"><fc:renderComparisonScoreLabel changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="relatedTargetMeasures"/> </td>
        <td class="baseline-method"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="protocols"/> </td>
        <td class="evidence"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="evidence"/> </td>
    </tr>
    <tr><td class="code"></td><th colspan="7"> Monitoring indicators </th></tr>
    <tr>
        <td class="code"><fc:renderComparison changed="${changed.custom.details.baseline.rows ?: []}" i="${i}" original="${project.custom.details.baseline.rows ?: []}" property="code"/> </td>
        <td colspan="8" class="embedded-monitoring">
            <g:render template="/project/meriPlanChanges/monitoringIndicators"
                      model="${[monitoringValidation:true,
                                indictorSelectorExpression:monitoringModel,
                                code:code,
                                extendedMonitoring:true]}"/>

        </td>
    </tr>
    </g:each>
    </tbody>
</table>