<!-- ko with:details.services -->
<h4>${title ?: "Project services and minimum targets"}</h4>

<table class="table service-targets">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="required" rowspan="2">${serviceName ?: "Service"}</th>
        <th class="required" rowspan="2" style="min-width: 500px;">Target measure</th>
        <th></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="">
            <select readonly="readonly" class="form-control form-control-sm"
                    data-bind="options: selectableServices, optionsText:'name', optionsValue:'id', optionsCaption: 'Please select', value:serviceId, disable: $root.isProjectDetailsLocked()"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="">
            <select readonly="readonly"  class="form-control form-control-sm"
                    data-bind="options: selectableScores, optionsText:'label', optionsValue:'scoreId', optionsCaption: 'Please select', value:scoreId, disable: $root.isProjectDetailsLocked()"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td></td>
    </tr>

<tr>
        <td class="index"></td>
        <th>Project Outcome/s</th>
        <th>Target</th>
        <th></th>
    <tr>
        <td class="index"></td>
        <td>
            <select multiple>
                <option>MT1</option>
                <option>MT2</option>
                <option>ST1</option>
            </select>
        </td>
        <td><input type="number" class="form-control form-control-sm"></td>
        <td>x</td>
    </tr>
    <tr>
        <td class="index"></td>
        <td>
            <select multiple>
                <option>MT1</option>
                <option>MT2</option>
                <option>ST1</option>
            </select>
        </td>
        <td><input type="number" class="form-control form-control-sm"></td>
        <td>x</td>
    </tr>
    <tr><td colspan="4">
        <button class="btn btn-sm"><i class="fa fa-plus"></i>Add another outcome target</button>
    </td>
    </tr>
    </tbody>
    <tfoot>

    <tr>
        <td data-bind="attr:{colspan:periods.length+${showTargetDate ? 6 : 5}}">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: $parent.isProjectDetailsLocked(), click: addService">
                <i class="fa fa-plus"></i> Add a row</button>
        </td>
    </tr>
    </tfoot>
</table>

<!-- /ko -->
