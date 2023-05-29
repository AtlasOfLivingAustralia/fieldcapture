<!-- ko with:details.serviceOutcomes -->
<h4>${title ?: "Project services forecasts"}</h4>

<table class="table service-targets">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="required" rowspan="2">${serviceName ?: "Service"}</th>
        <th class="required" rowspan="2" style="min-width: 500px;">Target measure</th>
        <!-- ko if: forecastPeriods && forecastPeriods.length -->
        <th data-bind="attr:{colspan:forecastPeriods.length+1}">Annual target forecast (indicative only) <fc:iconHelp>${minHelptext ?:"Specify the minimum total target for each Project Service to be delivered each financial year. Note: the sum of these targets will not necessarily equal the total services to be delivered."}</fc:iconHelp></th>
        <!-- /ko -->
    </tr>
    <tr>

        <!-- ko foreach: forecastPeriods -->
        <th class="budget-cell"><div data-bind="text:$data"></div></th>
        <!-- /ko -->
    </tr>
    </thead>
    <tbody data-bind="foreach : outcomeTargets">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="">
            <span data-bind="text:serviceLabel"></span>
        </td>
        <td class="">
            <span data-bind="text:scoreLabel"></span>
        </td>
        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <span data-bind="text:target"></span>
        </td>
        <!-- /ko -->
    </tr>
    </tbody>
</table>

<!-- /ko -->
