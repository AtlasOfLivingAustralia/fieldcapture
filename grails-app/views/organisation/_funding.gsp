<!-- ko with:reportingTargetsAndFunding().funding -->
<div class="funding">

    <label><b>Funding</b><fc:iconHelp title="Funding">${budgetHelpText?:"Enter the total value of contracts at the date of the review"}</fc:iconHelp></label>
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
                <input type="number" class="form-control form-control-sm" data-bind="value: dollar, numeric: $root.number, enable: $parents[1].isEditable" data-validation-engine="validate[custom[number],min[0]"/>
            </td>
            <!-- /ko -->
        </tr>
        </tbody>
    </table>

</div>
<!-- /ko -->
