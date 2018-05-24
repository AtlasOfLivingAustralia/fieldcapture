<!-- ko with:details.services -->
<h4>Project Services</h4>

<table class="table budget-table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="service">Service</th>
        <th class="score">Target measure</th>
        <!-- ko foreach: periods -->
        <th class="budget-cell"><div data-bind="text:$data"></div>$</th>
        <!-- /ko -->
        <th class="budget-cell">Overall Target</th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <select data-bind="options: selectableServices, optionsText:'name', optionsCaption: 'Please select', value:service, disable: $root.isProjectDetailsLocked()"></select>
        </td>
        <td class="score">
            <select data-bind="options: selectableScores, optionsText:'label', optionsCaption: 'Please select', value:score, disable: $root.isProjectDetailsLocked()"></select>
        </td>

        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <input type="number"
                   data-bind="value: target, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[custom[number]]"/>
        </td>
        <!-- /ko -->

        <td class="budget-cell">
            <input type="number"data-bind="value: target, disable: $root.isProjectDetailsLocked()">
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
        <td colspan="6">
            <button type="button" class="btn btn-small"
                    data-bind="disable: $parent.isProjectDetailsLocked(), click: addService">
                <i class="icon-plus"></i> Add a row</button>
        </td>
    </tr>
    </tfoot>
</table>

<!-- /ko -->