<!-- ko with:details.serviceOutcomes -->
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
    <tbody data-bind="foreach : outcomeTargets">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="">
            <input readonly="readonly" class="form-control form-control-sm"
                    data-bind="value:serviceLabel, disable: $root.isProjectDetailsLocked()"
                    >
        </td>
        <td class="">
            <input readonly="readonly"  class="form-control form-control-sm"
                    data-bind="value:scoreLabel, disable: $root.isProjectDetailsLocked()"
                   >
        </td>
        <td>
            <!-- ko if:orphaned -->
            <input type="text" value="" class="hidden-validation-holder" data-validation-engine="validate[required]" data-errormessage="This target is not associated with any outcomes">
            <i data-bind="click:$parent.removeOutcomeTarget" class="fa fa-remove"></i>
            <!-- /ko -->
        </td>
    </tr>

<tr>
        <td class="index"></td>
        <th>Project Outcome/s</th>
        <th>Target</th>
        <th></th>
    </tr>
    <!-- ko foreach:outcomeTargets -->
    <tr>
        <td class="index"></td>
        <td>
            <select multiple class="form-control form-control-sm" data-bind="options:$root.selectedOutcomes, optionsText:'code', optionsValue:'code', multiSelect2:{value:relatedOutcomes}">
            </select>
        </td>
        <td><input type="number" class="form-control form-control-sm" data-bind="value:target"></td>
        <td><i class="fa fa-remove" data-bind="click:$parent.removeOutcomeTarget"></i></td>
    </tr>
    <!-- /ko -->
    <tr>
        <td colspan="4">
            <button class="btn btn-sm" data-bind="click:addOutcomeTarget"><i class="fa fa-plus"></i>Add outcome target</button>
        </td>
    </tr>
    </tbody>


</table>

<!-- /ko -->
