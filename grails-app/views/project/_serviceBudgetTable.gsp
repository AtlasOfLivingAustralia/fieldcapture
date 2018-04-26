<!-- Budget table -->

<label><b>Project Budget</b></label>
<table class="table budget-table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="service">Service</th>
        <!-- ko foreach: details.budget.headers -->
        <th class="budget-cell"><div data-bind="text:data"></div>$</th>
        <!-- /ko -->
        <th class="budget-cell">Total</th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : details.budget.rows">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <select data-bind="options: $root.transients.services, optionsCaption: 'Please select', value:shortLabel, disable: $parent.isProjectDetailsLocked()"></select>
        </td>

        <!-- ko foreach: costs -->
        <td class="budget-cell">
            <input
                   data-bind="value: dollar, numeric: $root.number, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[custom[number]]"/>
        </td>
        <!-- /ko -->

        <td class="budget-cell">
            <span  data-bind="text: rowTotal.formattedCurrency, disable: $parent.isProjectDetailsLocked()"></span>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                   data-bind="click: $parent.removeBudget"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td class="index"></td>
        <td><b>Total</b></td>

        <!-- ko foreach: details.budget.columnTotal -->
        <td class="budget-cell"><span data-bind="text:data.formattedCurrency"></span>
        </td>
        <!-- /ko -->
        <td class="budget-cell"><b><span
                data-bind="text:details.budget.overallTotal.formattedCurrency"></span></b></td>
        <td>
        </td>
    </tr>
    <tr>
        <td colspan="6">
            <button type="button" class="btn btn-small"
                    data-bind="disable: isProjectDetailsLocked(), click: addBudget">
                <i class="icon-plus"></i> Add a row</button>
        </td>
    </tr>
    </tfoot>
</table>
