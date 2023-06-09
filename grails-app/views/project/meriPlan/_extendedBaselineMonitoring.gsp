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
        <th class="monitoring-data required">Monitoring data</th>
        <th class="baseline required">Baseline data description <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineHelpText}</fc:iconHelp></g:if></th>
        <th class="service required">Project Service / Target Measure/s <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineServiceHelpText}</fc:iconHelp></g:if></th>
        <th class="baseline-method required">Select the method used to obtain the baseline, or how the baseline will be established if ‘Other’<fc:iconHelp>${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
        <th class="evidence required">Evidence to be retained <g:if test="${evidenceHelpText}"><fc:iconHelp>${evidenceHelpText}</fc:iconHelp></g:if></th>
        <th class="remove"></th>
    </tr>

    <tr class="baseline-row">
        <td class="code"><span data-bind="text:code"></span></td>
        <td class="outcome">
            <select multiple="true"
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="options:$root.selectedOutcomes, optionsCaption:'Please select...', optionsText:'code', optionsValue:'code', multiSelect2:{value:relatedOutcomes, templateResult:$root.renderOutcome, preserveColumnWidth:10}, disable: $root.isProjectDetailsLocked()">
            </select>
        </td>
        <th class="monitoring-data">
            <select class="form-control form-control-sm" data-validation-engine="validate[required]" placeholder="Please select..." data-bind="value:monitoringDataStatus,disable: $root.isProjectDetailsLocked()">
                <option value="">Please select...</option>
                <option>Needs to be collected</option>
                <option>Data exists</option>
            </select>
        </th>
        <td class="baseline">
            <textarea rows="4" class="form-control form-control-sm" data-validation-engine="validate[required]"
                      data-bind="value: baseline, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="service">
            <select
                    multiple="true"
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="options:$root.allTargetMeasures, optionsText:'label', optionsValue:'scoreId', multiSelect2:{value:relatedTargetMeasures, preserveColumnWidth:20}, disable: monitoringDataStatus() != 'Needs to be collected' || $root.isProjectDetailsLocked()"></select>
        </td>
        <td class="baseline-method">
            <select multiple="multiple"
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="options:$root.monitoringProtocols, multiSelect2:{value:protocols, preserveColumnWidth:20}, optionsCaption:'Please select...', disable: monitoringDataStatus() != 'Needs to be collected' || $root.isProjectDetailsLocked()">
            </select>

            <!-- ko if: _.contains(protocols(), 'Other') -->
            <textarea
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    placeholder="Details of method here..."
                    data-bind="value: method, disable: monitoringDataStatus() != 'Needs to be collected' || $root.isProjectDetailsLocked()"
                    rows="4"></textarea>
            <!-- /ko -->
        </td>
        <td class="evidence">
            <textarea
                    class="form-control form-control-sm"
                    data-bind="value:evidence, disable: monitoringDataStatus() != 'Needs to be collected' || $root.isProjectDetailsLocked()"
                    rows="3"
                    data-validation-engine="validate[required,maxSize:4000]"></textarea>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                 data-bind="click: $parent.removeRow"></i>
            </span>
        </td>
    </tr>
    <tr><td class="code"></td><th colspan="7">Monitoring indicators</th></tr>
<tr>
    <td class="code" data-bind="text:code"></td>
    <td colspan="8" class="embedded-monitoring">


    <g:render template="/project/meriPlan/monitoringIndicators"
              model="${[monitoringValidation:true, extendedMonitoring:true,indictorSelectorExpression:'$root.monitoringIndicators(code)', addIndictorExpression:'function() {$root.addMonitoringIndicator(this)}', removeIndictorExpression:'$root.removeMonitoringIndicator']}"/>

</td>
</tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="8">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: $root.isProjectDetailsLocked(), click: addRow">
                <i class="fa fa-plus"></i> Add a baseline</button></td>
    </tr>
    </tfoot>
</table>

<!-- /ko -->