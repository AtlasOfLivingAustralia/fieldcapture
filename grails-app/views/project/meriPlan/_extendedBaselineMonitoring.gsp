<!-- ko with:details.baseline -->
<h4 class="header-with-help">Monitoring methodology</h4><fc:iconHelp>${titleHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design. Refer to the Regional Land Partnerships Evaluation Plan, which provides guidance on baselines and the monitoring indicators for each RLP outcome. Note, other monitoring indicators can also be used."}</fc:iconHelp>
<br/>
<strong>Project baseline</strong>
<table class="table monitoring-baseline extended">
    <thead>
    <th class="code"></th>
    <th class="outcome">Outcome statement</th>
    <th class="monitoring-data">Monitoring data</th>
    <th class="baseline required">Baseline data description <g:if test="${baselineHelpText}"><fc:iconHelp>${baselineHelpText}</fc:iconHelp></g:if></th>
    <th class="service">Project Service / Target Measure/s</th>
    <th class="baseline-method required">Describe the method used to obtain the baseline, or how the baseline will be established <fc:iconHelp>${baselineMethodHelpText ?: "Describe the project baseline(s) units of measure or data which will be used to report progress towards this project's outcomes (short-term, medium-term and 5 year program outcome), and the monitoring design."}</fc:iconHelp></th>
    <th class="evidence">Evidence</th>
    <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach: rows">
    <tr>
        <td class="code"><span data-bind="text:code"></span></td>
        <td class="outcome">
            <select class="form-control form-control-sm" data-bind="foreach:$root.selectedOutcomes,  value:relatedOutcome">
                <option data-bind="text:code, attr:{title:description}"></option>
            </select>
        </td>
        <th class="monitoring-data">
            <select class="form-control form-control-sm" data-bind="value:monitoringDataStatus">
                <option>Needs to be collected</option>ataStatus">
                <option></option>
                <option>Data exists</option>
            </select>
        </th>
        <td class="baseline">
            <textarea rows="4" class="form-control form-control-sm" data-validation-engine="validate[required]"
                      data-bind="value: baseline, disable: $root.isProjectDetailsLocked()">
            </textarea>
        </td>
        <td class="service">
            <select multiple="true" class="form-control form-control-sm" data-bind="options:$root.allTargetMeasures, optionsText:'label', optionsValue:'scoreId', multiSelect2:{value:relatedTargetMeasures, preserveColumnWidth:20}"></select>
        </td>
        <td class="baseline-method">
            <select data-bind="options:$root.monitoringProtocols, optionsText:'name', optionsValue:'name', value:protocol, optionsCaption:'Please select...'">
                <option value="other">Other</option>
            </select>

            <textarea class="form-control form-control-sm" data-validation-engine="validate[required]"
                                              data-bind="visible:protocol() == 'Other', value: method, disable: $root.isProjectDetailsLocked()"
                                              rows="4"></textarea>
        </td>
        <td class="evidence">
            <textarea data-bind="value:evidence" rows="3"></textarea>
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
              model="${[monitoringValidation:true, extendedMonitoring:true,indictorSelectorExpression:'$root.monitoringIndicators(code)', addIndictorExpression:'$root.addMonitoringIndicator(code)', removeIndictorExpression:'$root.removeMonitoringIndicator']}"/>

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