<!-- ko with:details.serviceOutcomes -->
<h4>${title ?: "Project services and outcome targets"}</h4>

<table class="table service-outcomes-targets">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="required service">${serviceName ?: "Service"}</th>
        <th class="required score">Target measure</th>
        <th></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : outcomeTargets">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <input readonly="readonly" class="form-control form-control-sm"
                    data-bind="value:serviceLabel, disable: $root.isProjectDetailsLocked()"
                    >
        </td>
        <td class="score">
            <input readonly="readonly"  class="form-control form-control-sm"
                    data-bind="value:scoreLabel, disable: $root.isProjectDetailsLocked()"
                   >
        </td>
        <td>
            <!-- ko if:orphaned -->
            <input type="text" value="" class="hidden-validation-holder" data-validation-engine="validate[required]" data-errormessage="This target is associated with a service not referenced elsewhere in the MERI plan">
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
        <td class="service">
            <!-- ko if:orphanedOutcomes().length > 0 -->
            <input type="text" value="" class="hidden-validation-holder" data-bind="attr:{'data-errormessage':orphanedOutcomesError()}" data-validation-engine="validate[required]">
            <!-- /ko -->
            <select multiple class="form-control form-control-sm" data-bind="options:availableOutcomes, multiSelect2:{value:relatedOutcomes, templateResult:$root.renderOutcome, tags:false}, disable: $root.isProjectDetailsLocked()">
            </select>
        </td>
        <td class="score"><input type="number" class="form-control form-control-sm" data-bind="value:target, disable: $root.isProjectDetailsLocked()"></td>
        <td>
            <span data-bind="if:!$root.isProjectDetailsLocked()">
            <i class="fa fa-remove" data-bind="click:$parent.removeOutcomeTarget, disable: $root.isProjectDetailsLocked()"></i>
            </span>
        </td>
    </tr>
    <!-- /ko -->
    <tr>
        <td colspan="4">
            <button class="btn btn-sm" data-bind="click:addOutcomeTarget, disable: $root.isProjectDetailsLocked()"><i class="fa fa-plus"></i>Add outcome target</button>
            <!-- ko if:availableOutcomes().length > 0 -->
            <input type="text" value="" class="hidden-validation-holder" data-validation-engine="validate[required]" data-errormessage="There are outcomes related to this service that do not have a target assigned.  Press 'Add Outcome Target' to specify a target">
            <!-- /ko -->
        </td>
    </tr>
    </tbody>


</table>

<!-- /ko -->
