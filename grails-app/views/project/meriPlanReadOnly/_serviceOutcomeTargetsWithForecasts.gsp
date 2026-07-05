<!-- ko with:details.serviceOutcomes -->
<h4>${title ?: "Project services and outcome targets"}</h4>

<table class="table service-outcomes-targets-with-forcasts-view">
    <thead>
    <tr>
    <tr>
        <th class="index"></th>
        <th data-bind="attr:{colspan:($root.periods.length+2)/2}" class="required service">${serviceName ?: "Project Service"}</th>
        <th data-bind="attr:{colspan:($root.periods.length % 2) == 0 ? ($root.periods.length+2) / 2 : ($root.periods.length+3) / 2}" class="required score">${targetMeasureHeading ?: 'Target measure'}</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : sortedOutcomeTargets">
    <tr class="service-target">
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service" data-bind="attr:{colspan:($root.periods.length+2)/2}">
            <span data-bind="text:serviceLabel"></span>
        </td>
        <td class="score" data-bind="attr:{colspan:($root.periods.length % 2) == 0 ? ($root.periods.length+2) / 2 : ($root.periods.length+3) / 2}">
            <span data-bind="text:scoreLabel"></span>
        </td>
    </tr>
    <tr class="sub-heading">
        <td rowspan="2" class="index"></td>
        <th rowspan="2">${projectOutcomesHeading ?: 'Project Outcome/s'}</th>
        <th rowspan="2">${targetHeading ?: 'Target'}</th>
        <th data-bind="attr:{colspan:periodTargets.length}">${forecastHeading ?: 'Forecast/s'}</th>
    </tr>
    <tr class="sub-heading">
        <!-- ko foreach:periodTargets -->
        <th class="period"><span data-bind="text:period"></span></th>
        <!-- /ko -->
    </tr>
    <!-- ko let: {cellWidth: 100/(periodTargets.length+2) } -->
    <!-- ko foreach:outcomeTargets -->
    <tr class="outcome-target">
        <td class="index"></td>
        <td data-bind="style:{width:cellWidth+'%'}">
            <span data-bind="text:relatedOutcomes"></span>
        </td>
        <td data-bind="style:{width:cellWidth+'%'}">
            <span data-bind="text:target"></span>
        </td>
        <!-- ko foreach:periodTargets -->
        <td class="forecast" data-bind="style:{width:cellWidth+'%'}">
            <span data-bind="text:target"></span>
        </td>
        <!-- /ko -->
    </tr>
    <!-- /ko -->
    <!-- /ko -->
    </tbody>
</table>

<!-- /ko -->