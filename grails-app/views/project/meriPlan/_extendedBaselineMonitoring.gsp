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
        <th class="outcome required">Outcome statement</th>
        <th class="monitoring-data required">Monitoring data</th>
        <th class="baseline required">Baseline data description <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineHelpText}</fc:iconHelp></g:if></th>
        <th class="service required">Project Service / Target Measure/s</th>
        <th class="baseline-method required">Describe the method used to obtain the baseline, or how the baseline will be established <fc:iconHelp>${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
        <th class="evidence required">Evidence</th>
        <th class="remove"></th>
    </tr>

    <tr>
        <td class="code"><span data-bind="text:code"></span></td>
        <td class="outcome">
            <select class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="foreach:$root.selectedOutcomes, value:relatedOutcome, disable: $root.isProjectDetailsLocked()">
                <option data-bind="text:code, attr:{title:description}"></option>
            </select>
        </td>
        <th class="monitoring-data">
            <select class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="value:monitoringDataStatus, disable: $root.isProjectDetailsLocked()">
                <option></option>
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
                    data-bind="options:$root.allTargetMeasures, optionsText:'label', optionsValue:'scoreId', multiSelect2:{value:relatedTargetMeasures, preserveColumnWidth:20}, disable: $root.isProjectDetailsLocked()"></select>
        </td>
        <td class="baseline-method">
            <select class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="options:$root.monitoringProtocols, optionsText:'name', optionsValue:'name', value:protocol, optionsCaption:'Please select...', disable: $root.isProjectDetailsLocked()">
                <option value="other">Other</option>
            </select>

            <textarea
                    class="form-control form-control-sm"
                    data-validation-engine="validate[required]"
                    data-bind="visible:protocol() == 'Other', value: method, disable: $root.isProjectDetailsLocked()"
                    rows="4"></textarea>
        </td>
        <td class="evidence">
            <textarea
                    class="form-control form-control-sm"
                    data-bind="value:evidence, disable: $root.isProjectDetailsLocked()"
                    rows="3"
                    data-validation-engine="validate[required,maxSize:4000]"></textarea>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                 data-bind="click: $parent.removeRow"></i>
            </span>
        </td>
    </tr>
    <tr><td class="code"></td><th colspan="7">Monitoring indicators for this baseline</th></tr>
<tr>
    <td class="code" data-bind="text:code"></td>
    <td colspan="8" class="embedded-monitoring">


    <g:render template="/project/meriPlan/monitoringIndicators"
              model="${[monitoringValidation:true, extendedMonitoring:true,indictorSelectorExpression:'$root.monitoringIndicators(code)', addIndictorExpression:'function() {$root.addMonitoringIndicator(code)}', removeIndictorExpression:'$root.removeMonitoringIndicator']}"/>

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