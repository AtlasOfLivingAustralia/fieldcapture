<!-- ko with:details.serviceOutcomes -->
<h4>${title ?: "Project services forecasts"}</h4>

<table class="table service-targets">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="required" rowspan="2">${serviceName ?: "Service"}</th>
        <th class="required" rowspan="2" style="min-width: 500px;">Target measure</th>
        <!-- ko if: periodTargets && periodTargets.length -->
        <th data-bind="attr:{colspan:periodTargets.length+1}">Annual target forecast (indicative only) <fc:iconHelp>${minHelptext ?:"Specify the minimum total target for each Project Service to be delivered each financial year. Note: the sum of these targets will not necessarily equal the total services to be delivered."}</fc:iconHelp></th>
        <!-- /ko -->
    </tr>
    <tr>

        <!-- ko foreach: periodTargets -->
        <th class="budget-cell"><div data-bind="text:$data"></div></th>
        <!-- /ko -->
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
        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <input class="form-control form-control-sm" type="number"
                   data-bind="value: target, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[custom[number],min[0]]"/>
        </td>
        <!-- /ko -->
    </tr>
    </tbody>


</table>

<!-- /ko -->
