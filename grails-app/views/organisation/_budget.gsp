<!-- ko with:reportingTargetsAndFunding().funding -->
<div class="funding">

    <label><b>Funding</b><fc:iconHelp title="Project Budget">${budgetHelpText?:"Enter the budget as reviewed each year"}</fc:iconHelp></label>
    <g:if test="${explanation}">
        <p>${explanation}</p>
    </g:if>
    <table class="table">
        <thead>
        <tr>
            <!-- ko foreach: headers -->
            <th class="budget-amount"><div data-bind="text:data.label"></div>$</th>
            <!-- /ko -->

        </tr>
        </thead>
        <tbody data-bind="foreach : rows">
        <tr>
            <!-- ko foreach: costs -->
            <td class="budget-amount">
                <input type="number" class="form-control form-control-sm" data-bind="value: dollar, numeric: $root.number, disable: $root.isProjectDetailsLocked()" data-validation-engine="validate[custom[number]]"/>
            </td>
            <!-- /ko -->
        </tr>
        </tbody>
    </table>

</div>
<!-- /ko -->
