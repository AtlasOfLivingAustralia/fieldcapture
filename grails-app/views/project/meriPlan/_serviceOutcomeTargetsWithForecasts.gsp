<!-- ko with:details.serviceOutcomes -->
<h4 class="header-with-help">${title ?: "Project services and outcome targets"}</h4><g:if test="${titleHelpText}"> <fc:iconHelp>${titleHelpText}</fc:iconHelp></g:if>

<table class="table service-outcomes-targets-with-forecasts">
    <thead>
    <tr>
        <th class="index"></th>
        <th data-bind="attr:{colspan:($root.periods.length+2)/2}" class="required service">${serviceName ?: "Project Service"}</th>
        <th data-bind="attr:{colspan:($root.periods.length % 2) == 0 ? ($root.periods.length+2) / 2 : ($root.periods.length+3) / 2}" class="required score">${targetMeasureHeading ?: 'Target measure'}</th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : sortedOutcomeTargets">
    <tr class="service-target">
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td data-bind="attr:{colspan:($root.periods.length+2)/2}" class="service">
            <input readonly="readonly" class="form-control form-control-sm"
                    data-bind="value:serviceLabel, disable: $root.isProjectDetailsLocked()"
                    >
        </td>
        <td data-bind="attr:{colspan:($root.periods.length % 2) == 0 ? ($root.periods.length+2) / 2 : ($root.periods.length+3) / 2}" class="score">
            <input readonly="readonly"  class="form-control form-control-sm"
                    data-bind="value:scoreLabel, disable: $root.isProjectDetailsLocked()"
                   >
        </td>
        <td class="remove">
            <!-- ko if:orphaned -->
            <input type="text" value="" class="hidden-validation-holder" data-validation-engine="validate[required]" data-errormessage="This target is associated with a service not referenced elsewhere in the MERI plan">
            <i data-bind="click:$parent.removeOutcomeTarget" class="fa fa-remove"></i>
            <!-- /ko -->
        </td>
    </tr>

    <tr class="sub-heading">
        <td rowspan="2" class="index"></td>
        <th rowspan="2">${projectOutcomesHeading ?: 'Project Outcome/s'}</th>
        <th rowspan="2">${targetHeading ?: 'Target'}</th>
        <th data-bind="attr:{colspan:periodTargets.length}">${forecastHeading ?: 'Forecast/s'}</th>
        <th class="remove"></th>
    </tr>
    <tr class="sub-heading">
        <!-- ko foreach:periodTargets -->
        <th class="period"><span data-bind="text:period"></span></th>
        <!-- /ko -->
        <th class="remove"></th>
    </tr>
    <!-- ko let: {cellWidth: 100/(periodTargets.length+2) } -->
    <!-- ko foreach:outcomeTargets -->
    <tr class="outcome-target">
        <td class="index">
            <!-- ko if:orphanedOutcomes().length > 0 -->
            <input type="text" value="" class="hidden-validation-holder" data-bind="attr:{'data-errormessage':orphanedOutcomesError()}" data-validation-engine="validate[required]">
            <!-- /ko -->
        </td>
        <td data-bind="style:{width:cellWidth+'%'}">
            <g:if test="${!separateTargetsPerOutcome}">
            <select multiple class="form-select form-select-sm" data-bind="options:availableOutcomes, multiSelect2:{value:relatedOutcomes, templateResult:$root.renderOutcome, tags:false}, disable: $root.isProjectDetailsLocked()">
            </select>
            </g:if>
            <g:else>
            <input type="text" readonly class="form-control form-control-sm" data-bind="value:relatedOutcomes, disable: $root.isProjectDetailsLocked()">
            </g:else>

        </td>
        <td data-bind="style:{width:cellWidth+'%'}">
            <input type="number" class="form-control form-control-sm" data-bind="value:target, disable: $root.isProjectDetailsLocked()" data-validation-engine="validate[required,min[validate[min[0.01]]"></td>
        <!-- ko foreach:periodTargets -->
        <td class="forecast" data-bind="style:{width:cellWidth+'%'}"><input type="number" class="form control form-control-sm" data-bind="value:target, disable: $root.isProjectDetailsLocked()"></input></td>
        <!-- /ko -->
        <td class="remove">
            <!-- ko if:orphanedOutcomes().length > 0 -->
            <span data-bind="if:!$root.isProjectDetailsLocked()">
            <i class="fa fa-remove" data-bind="click:$parent.removeOutcomeTarget, disable: $root.isProjectDetailsLocked()"></i>
            </span>
            <!-- /ko -->
        </td>
    </tr>
    <!-- /ko -->
    <!-- /ko -->
    <g:if test="${!separateTargetsPerOutcome}">
    <tr>
        <td colspan="4">
            <button class="btn btn-sm" data-bind="click:addOutcomeTarget, disable: $root.isProjectDetailsLocked()"><i class="fa fa-plus"></i>Add outcome target</button>
            <!-- ko if:availableOutcomes().length > 0 -->
            <input type="text" value="" class="hidden-validation-holder" data-validation-engine="validate[required]" data-errormessage="There are outcomes related to this service that do not have a target assigned.  Press 'Add Outcome Target' to specify a target">
            <!-- /ko -->
        </td>
    </tr>
    </g:if>
    </tbody>


</table>

<!-- /ko -->
