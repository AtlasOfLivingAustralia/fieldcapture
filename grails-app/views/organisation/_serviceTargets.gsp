<!-- ko with:reportingTargetsAndFunding() -->
<h4>${title ?: "Organisation targets"}</h4>
<p>The overall targets in the table below is calculated as the average of every non-blank target in the table.  If future year targets are entered in to the table, they will be included in the overall target calculation.</p>
<p>The overall target is display on the Organisation dashboard tab.</p>
<!-- ko with: services -->
<table class="table service-targets">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="service required" rowspan="2">${serviceName ?: "Service"}</th>
        <th class="score required" rowspan="2" style="width: 20px">Target measure</th>
        <th class="budget-cell required" rowspan="2">Overall % target <g:if test="${totalHelpText}"> <fc:iconHelp> ${totalHelpText} </fc:iconHelp></g:if></th>
        <g:if test="${showTargetDate}">
            <th class="target-date required" rowspan="2">
                Delivery date <g:if test="${deliveryHelpText}"> <fc:iconHelp> ${deliveryHelpText} </fc:iconHelp> </g:if>
            </th>
        </g:if>
        <!-- ko if: periods && periods.length -->
        <th data-bind="attr:{colspan:periods.length+1}">${periodTargetsLabel ?: " % targets by date"}</th>
        <!-- /ko -->
    </tr>
    <!-- ko if: periods && periods.length -->
    <tr>

        <!-- ko foreach: periods -->
        <th class="budget-cell"><div data-bind="text:$data.label"></div></th>
        <!-- /ko -->
    </tr>
    <!-- /ko -->
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <select class="form-control form-control-sm" data-bind="options: selectableServices, optionsText:'name', optionsValue:'id',  value:serviceId, enable: $parent.areTargetsEditable"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="score">
            <select class="form-control form-control-sm" data-bind="options: selectableScores, optionsText:'label', optionsValue:'scoreId',  value:scoreId, enable: $parent.areTargetsEditable"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="budget-cell">
            <input class="form-control form-control-sm" type="number" disabled data-bind="value: target"
                   data-validation-engine="validate[min[0]]"  data-warningmessage="The sum of the minimum targets must be less than or equal to the overall target">
        </td>

        <g:if test="${showTargetDate}">
            <td class="target-date">
                <div class="input-group">
                    <input class="form-control form-control-sm" data-bind="datepicker:targetDate.date, enable: $parent.areTargetsEditable" type="text" size="16" data-validation-engine="validate[required]">
                    <div class="input-group-append open-datepicker">
                        <span class="input-group-text">
                            <i class="fa fa-th ">&nbsp;</i>
                        </span>
                    </div>
                </div>
            </td>
        </g:if>

        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <input class="form-control form-control-sm" type="number"
                   data-bind="value: target, enable: $parents[1].areTargetsEditable"
                   data-validation-engine="validate[custom[number],min[0]]"/>
        </td>
        <!-- /ko -->
    </tr>
    </tbody>

</table>
<!-- /ko -->
<!-- /ko -->
<button class="btn btn-sm btn-primary" data-bind="click: saveCustomFields, enable:areTargetsAndFundingEditable">Save changes</button>