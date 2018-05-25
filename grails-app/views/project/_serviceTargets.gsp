<!-- ko with:details.services -->
<h4>Project services and minimum targets</h4>

<table class="table budget-table">
    <thead>
    <tr>
        <th colspan="3"></th>
        <th data-bind="attr:{colspan:periods.length+2}">Minimum targets</th>
    </tr>
    <tr>
        <th class="index"></th>
        <th class="service required">Service</th>
        <th class="score required">Target measure</th>
        <th class="budget-cell required">Total <fc:iconHelp>The total amount to be delivered across the length of the project.</fc:iconHelp></th>
        <!-- ko foreach: periods -->
        <th class="budget-cell"><div data-bind="text:$data"></div></th>
        <!-- /ko -->
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <select data-bind="options: selectableServices, optionsText:'name', optionsValue:'id', optionsCaption: 'Please select', value:serviceId, disable: $root.isProjectDetailsLocked()"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="score">
            <select data-bind="options: selectableScores, optionsText:'label', optionsValue:'scoreId', optionsCaption: 'Please select', value:scoreId, disable: $root.isProjectDetailsLocked()"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="budget-cell">
            <input type="number" data-bind="value: target, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[min[0.01]]">
        </td>

        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <input type="number"
                   data-bind="value: target, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[custom[number]]"/>
        </td>
        <!-- /ko -->


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