<h4>Project risks & threats </h4>
<g:render template="/shared/restoredData"
          model="[id: 'restoredRiskData', saveButton: 'Save risks & threats', cancelButton: 'Cancel edits to risks & threats']"/>
<p>Please enter the details of risks and threats to the project and the mitigation strategies being used to address them. These should be updated at each reporting period:</p>

<div id="project-risks-threats" class="well well-small">

    <div align="right">Overall project risk profile : <span style="color: red;">*</span>
        <span class="ratingStyling">
            <select data-validation-engine="validate[required]"
                    data-bind="options: ratingOptions, value:risks.overallRisk, optionsCaption: 'Please select', css: overAllRiskHighlight, disable:risksDisabled"
                    id="overall-risk"></select>
        </span>
    </div>
    <table class="table">
        <thead>
        <tr>
            <th class="risk-type required">Type of threat / risk </th>
            <th class="risk-description required">Description </th>
            <th class="risk-likelihood required">Likelihood </th>
            <th class="risk-consequence required">Consequence </th>
            <th class="risk-rating">Risk rating</th>
            <th class="risk-control required">Current control / <br/>Contingency strategy </th>
            <th class="residual-risk required">Residual risk </th>
            <th class="risk-actions remove"></th>
        </tr>
        </thead>
        <tbody data-bind="foreach : risks.rows">
        <tr>
            <td class="risk-type">
                <select data-validation-engine="validate[required]"
                        data-bind="options: $parent.threatOptions, value: threat, optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td class="risk-description">
                <textarea data-validation-engine="validate[required]" class="input-xlarge"
                          data-bind="value: description, disable:$parent.risksDisabled" rows="5"></textarea>
            </td>
            <td class="risk-likelihood">
                <select data-validation-engine="validate[required]"
                        data-bind="options: $parent.likelihoodOptions, value: likelihood, optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td class="risk-consequence">
                <select data-validation-engine="validate[required]"
                        data-bind="options: $parent.consequenceOptions, value: consequence,  optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td class="risk-rating">
                <b><span data-bind="text:riskRating"></span></b>
            </td>
            <td class="risk-control">
                <textarea data-validation-engine="validate[required]"
                          data-bind="value : currentControl, disable:$parent.risksDisabled" rows="5"></textarea>
            </td>
            <td class="residual-risk">
                <!-- Residual risk -->
                <select data-validation-engine="validate[required]"
                        data-bind="options: $parent.ratingOptions, value: residualRisk, optionsCaption: 'Please select', disable:$parent.risksDisabled"></select>
            </td>
            <td class="risk-actions remove">
                <span data-bind="if: $index() && !$parent.risksDisabled()"><i class="fa fa-remove" data-bind="click: $parent.removeRisk"></i>
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
