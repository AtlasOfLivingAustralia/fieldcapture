<div class="row-fluid space-after">
    <div class="required">
        <div id="project-risks-threats" class="well well-small">
            <h4>Project risks & threats</h4>
            <div align="right">
                <b> Overall project risk profile : <span data-bind="text: risks.overallRisk, css: overAllRiskHighlight" ></span></b>
            </div>
            <table>
                <thead>
                <tr>
                    <th class="risk-type">Type of threat / risk</th>
                    <th class="risk-description">Description</th>
                    <th class="risk-likelihood">Likelihood</th>
                    <th class="risk-consequence">Consequence</th>
                    <th class="risk-rating">Risk rating</th>
                    <th class="risk-control">Current control / Contingency strategy</th>
                    <th class="residual-risk">Residual risk</th>
                </tr>
                </thead>
                <tbody data-bind="foreach : risks.rows" >
                <tr>
                    <td class="risk-type">
                        <label data-bind="text: threat" ></label>
                    </td>
                    <td class="risk-description">
                        <label data-bind="text: description" ></label>
                    </td>
                    <td class="risk-likelihood">
                        <label data-bind="text: likelihood" ></label>
                    </td>
                    <td class="risk-consequence">
                        <label data-bind="text: consequence" ></label>
                    </td>
                    <td class="risk-rating">
                        <label data-bind="text: riskRating" ></label>
                    </td>
                    <td class="risk-control">
                        <label data-bind="text: currentControl" ></label>
                    </td>
                    <td class="residual-risk">
                        <label data-bind="text: residualRisk" ></label>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>