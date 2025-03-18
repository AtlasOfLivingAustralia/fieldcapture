<!-- ko with:details.serviceOutcomes -->
<h4 class="header-with-help">${title ?: "Project services forecasts"}</h4><g:if test="${titleHelpText}"> <fc:iconHelp>${titleHelpText}</fc:iconHelp></g:if>

<table class="table service-targets forecasts">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="service required" rowspan="2">${serviceName ?: "Service"}</th>
        <th class="score required" rowspan="2" style="min-width: 500px;">${targetMeasureHeading ?: 'Target measure'}</th>
        <!-- ko if: forecastPeriods && forecastPeriods.length -->
        <th data-bind="attr:{colspan:forecastPeriods.length+1}">${annualTargetHeading ?: 'Annual target forecast (indicative only)'} <fc:iconHelp>${minHelptext ?:"Specify the minimum total target for each Project Service to be delivered each financial year. Note: the sum of these targets will not necessarily equal the total services to be delivered."}</fc:iconHelp></th>
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
        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <input class="form-control form-control-sm" type="number"
                   data-bind="value: target, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[required,custom[number],min[0]]"/>
        </td>
        <!-- /ko -->
    </tr>
    </tbody>


</table>

<!-- /ko -->
