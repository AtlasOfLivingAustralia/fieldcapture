<!-- ko with:reportingTargetsAndFunding().funding -->
<div class="funding">

    <label><b>Funding</b><fc:iconHelp title="Funding">${budgetHelpText?:"Enter the total value of contracts at the date of the review"}</fc:iconHelp></label>
    <p>The 'Current funding' in the table below is used to calculate the Indigenous supply chain performance metric on the dashboard and is determined by the most recent non-zero funding amount starting from the current year.
    Future funding amounts will not affect the current funding.</p>

    <table class="table">
        <thead>
        <tr>
            <th class="budget-amount">
                Current funding<fc:iconHelp>The current funding is used to calculate the Indigenous supply chain performance metric on the dashboard and is determined by the most recent non-zero funding amount starting from the current year</fc:iconHelp>
            </th>
            <!-- ko foreach: headers -->
            <th class="budget-amount"><div data-bind="text:data.label"></div>$</th>
            <!-- /ko -->

        </tr>
        </thead>
        <tbody data-bind="foreach : rows">
        <tr>
            <td class="budget-amount">
                <input type="number" readonly class="form-control form-control-sm" data-bind="value: rowTotal">
            </td>
            <!-- ko foreach: costs -->
            <td class="budget-amount">
                <input type="number" class="form-control form-control-sm" data-bind="value: dollar, numeric: $root.number, enable: $parents[1].isEditable" data-validation-engine="validate[custom[number],min[0]"/>
            </td>
            <!-- /ko -->
        </tr>
        </tbody>
    </table>

</div>
<!-- /ko -->
