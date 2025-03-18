<!-- ko with:details.serviceOutcomes -->
<h4>${title ?: "Project services and outcome targets"}</h4>

<table class="table service-outcomes-targets-view">
    <thead>
    <tr>
    <tr>
        <th class="index"></th>
        <th class="service required">${serviceName ?: "Project Service"}</th>
        <th class="score required">${targetMeasureHeading ?: 'Target measure'}</th>
    </tr>
    </thead>
    <tbody data-bind="foreach : outcomeTargets">
    <tr class="service-target">
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
        <th>${projectOutcomesHeading ?: 'Project Outcome/s'}</th>
        <th>${targetHeading ?: 'Target'}</th>
    </tr>
    <!-- ko foreach:outcomeTargets -->
    <tr class="outcome-target">
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