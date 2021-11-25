<!-- ko with:details.services -->
<h4>${title ?: "Project services and minimum targets"}</h4>

<table class="table service-targets">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="service required" rowspan="2">${serviceName ?: "Service"}</th>
        <th class="score required" rowspan="2" style="width: 20px">Target measure</th>
        <th class="budget-cell required" rowspan="2">Total to be delivered <g:if test="${totalHelpText}"> <fc:iconHelp> ${totalHelpText} </fc:iconHelp></g:if> <g:else><fc:iconHelp html="true">The overall total of Project Services to be delivered during the project delivery period.
            <b>Note: this total is not necessarily the sum of the minimum annual targets set out for the service.</b></fc:iconHelp></g:else> </th>
        <g:if test="${showTargetDate}">
            <th class="target-date required" rowspan="2">
                Delivery date <g:if test="${deliveryHelpText}"> <fc:iconHelp> ${deliveryHelpText} </fc:iconHelp> </g:if>
            </th>
        </g:if>
        <!-- ko if: periods && periods.length -->
        <th data-bind="attr:{colspan:periods.length+1}">Minimum annual targets <fc:iconHelp>${minHelptext ?:"Specify the minimum total target for each Project Service to be delivered each financial year. Note: the sum of these targets will not necessarily equal the total services to be delivered."}</fc:iconHelp></th>
        <!-- /ko -->
    </tr>
    <tr>

        <!-- ko foreach: periods -->
        <th class="budget-cell"><div data-bind="text:$data"></div></th>
        <!-- /ko -->
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <select class="form-control form-control-sm" data-bind="options: selectableServices, optionsText:'name', optionsValue:'id', optionsCaption: 'Please select', value:serviceId, disable: $root.isProjectDetailsLocked()"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="score">
            <select class="form-control form-control-sm" data-bind="options: selectableScores, optionsText:'label', optionsValue:'scoreId', optionsCaption: 'Please select', value:scoreId, disable: $root.isProjectDetailsLocked()"
                    data-validation-engine="validate[required]"></select>
        </td>
        <td class="budget-cell">
            <input class="form-control form-control-sm" type="number" data-bind="value: target, disable: $root.isProjectDetailsLocked(), warningPopup:minimumTargetsValid"
                   data-validation-engine="validate[min[0.01]]"  data-warningmessage="The sum of the minimum targets must be less than or equal to the overall target">
        </td>

        <g:if test="${showTargetDate}">
            <td class="target-date">
                <div class="input-group">
                    <input class="form-control form-control-sm" data-bind="datepicker:targetDate.date, disable: $root.isProjectDetailsLocked()" type="text" size="16" data-validation-engine="validate[required]">
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
                   data-bind="value: target, disable: $root.isProjectDetailsLocked()"
                   data-validation-engine="validate[custom[number],min[0]]"/>
        </td>
        <!-- /ko -->


        <td class="remove">
            <span data-bind="if: $index() && !$root.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                 data-bind="click: $parent.removeService"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>

    <tr>
        <td data-bind="attr:{colspan:periods.length+${showTargetDate ? 6 : 5}}">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: $parent.isProjectDetailsLocked(), click: addService">
                <i class="fa fa-plus"></i> Add a row</button>
        </td>
    </tr>
    </tfoot>
</table>

<!-- /ko -->
