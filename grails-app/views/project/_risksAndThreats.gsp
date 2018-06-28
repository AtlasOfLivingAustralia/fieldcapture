
<div id="project-risks-threats" class="well well-small">

    <div align="right">Overall project risk profile : <span style="color: red;">*</span>
        <span class="ratingStyling">
            <select data-validation-engine="validate[required]"
                    data-bind="options: ratingOptions, value:risks.overallRisk, optionsCaption: 'Please select', css: overAllRiskHighlight, disable:risksDisabled"
                    id="overall-risk"></select>
        </span>
    </div>
    <table style="width:100%;">
        <thead>
        <tr>
            <th>Type of threat / risk <span style="color: red;"><b>*</b></span></th>
            <th>Description <span style="color: red;"><b>*</b></span></th>
            <th>Likelihood <span style="color: red;"><b>*</b></span></th>
            <th>Consequence <span style="color: red;"><b>*</b></span></th>
            <th>Risk rating</th>
            <th>Current control / <br/>Contingency strategy <span style="color: red;"><b>*</b></span></th>
            <th>Residual risk <span style="color: red;"><b>*</b></span></th>
            <th></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : risks.rows">
        <tr>
            <td width="18%">
                <select style="width:98%;" data-validation-engine="validate[required]"
                        data-bind="options: $parent.threatOptions, value: threat, optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td width="20%">
                <textarea style="width:97%;" data-validation-engine="validate[required]" class="input-xlarge"
                          data-bind="value: description, disable:$parent.risksDisabled" rows="5"></textarea>
            </td>
            <td width="10%">
                <select style="width:98%;" data-validation-engine="validate[required]"
                        data-bind="options: $parent.likelihoodOptions, value: likelihood, optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td width="10%">
                <select style="width:98%;" data-validation-engine="validate[required]"
                        data-bind="options: $parent.consequenceOptions, value: consequence,  optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td width="8%">
                <b><span style="width:98%;" data-bind="text:riskRating"></span></b>
            </td>
            <td width="20%">
                <textarea style="width:98%;" data-validation-engine="validate[required]"
                          data-bind="value : currentControl, disable:$parent.risksDisabled" rows="5"></textarea>
            </td>
            <td width="10%">
                <!-- Residual risk -->
                <select style="width:98%;" data-validation-engine="validate[required]"
                        data-bind="options: $parent.ratingOptions, value: residualRisk, optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td width="4%">
                <span data-bind="if: $index() && !$parent.risksDisabled()"><i class="icon-remove" data-bind="click: $parent.removeRisk"></i>
                </span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="8" style="text-align:right;">
                <button type="button" class="btn btn-small" data-bind="click: addRisks, disable:risksDisabled">
                    <i class="fa fa-plus"></i> Add a row</button></td>
        </tr>
        </tfoot>

    </table>

</div>
