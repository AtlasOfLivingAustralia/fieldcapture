<!-- ko with:details.serviceOutcomes -->
<h4>${title ?: "Project services and outcome targets"}</h4>

<table class="table service-outcomes-targets-view">
    <thead>
    <tr>
    <tr>
        <th class="index"></th>
        <th class="service required">${serviceName ?: "Service"}</th>
        <th class="score required">Target measure</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : outcomeTargets">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <span data-bind="text:serviceLabel"></span>
        </td>
        <td class="score">
            <span data-bind="text:scoreLabel"></span>
        </td>
    </tr>
    <tr>
        <td class="index"></td>
        <th>Project Outcome/s</th>
        <th>Target</th>
    </tr>
    <!-- ko foreach:outcomeTargets -->
    <tr>
        <td class="index"></td>
        <td class="service">
            <span data-bind="text:relatedOutcomes"></span>
        </td>
        <td class="score">
            <span data-bind="text:target"></span>
        </td>
    </tr>
    <!-- /ko -->
    </tbody>
</table>

<!-- /ko -->