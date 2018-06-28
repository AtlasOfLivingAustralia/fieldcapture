<!-- Budget table -->
<!-- ko with:details.services -->
<h4>Project Services</h4>

<b>Budget</b>
<table class="table budget-table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="service">Service</th>
        <!-- ko foreach: budget.headers -->
        <th class="budget-cell"><div data-bind="text:data"></div>$</th>
        <!-- /ko -->
        <th class="budget-cell">Total</th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <select data-bind="options: selectableServices, optionsText:'name', optionsCaption: 'Please select', optionsValue:'id', value:serviceId, disable: $root.isProjectDetailsLocked()"></select>
        </td>

        <!-- ko foreach: budget.costs -->
        <td class="budget-cell">
            <input type="number"
                   data-bind="value: dollar, numeric: $root.number, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[custom[number]]"/>
        </td>
        <!-- /ko -->

        <td class="budget-cell">
            <span  data-bind="text: budget.rowTotal.formattedCurrency, disable: $root.isProjectDetailsLocked()"></span>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="icon-remove"
                                                                                   data-bind="click: $parent.removeService"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td class="index"></td>
        <td><b>Total</b></td>

        <!-- ko foreach: budget.columnTotal -->
        <td class="budget-cell"><span data-bind="text:data.formattedCurrency"></span>
        </td>
        <!-- /ko -->
        <td class="budget-cell"><b><span
                data-bind="text:budget.overallTotal.formattedCurrency"></span></b></td>
        <td>
        </td>
    </tr>
    <tr>
        <td colspan="6">
            <button type="button" class="btn btn-small"
                    data-bind="disable: $parent.isProjectDetailsLocked(), click: addService">
                <i class="icon-plus"></i> Add a row</button>
        </td>
    </tr>
    </tfoot>
</table>

<!-- /ko -->

<g:render template="serviceTargets"/>