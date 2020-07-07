<!-- ko with:details.services -->
<h4>Project services and minimum targets</h4>

<table class="table service-targets-view">
    <thead>
    <tr>
        <th class="index" rowspan="2"></th>
        <th class="service" rowspan="2">Service</th>
        <th class="score" rowspan="2">Target measure</th>
        <th class="budget-cell" rowspan="2">Total to be delivered</th>
        <th data-bind="attr:{colspan:periods.length+1}">Minimum annual targets</th>
    </tr>
    <tr>
        <!-- ko foreach: periods -->
        <th class="budget-cell"><div data-bind="text:$data"></div></th>
        <!-- /ko -->
    </tr>
    </thead>
    <tbody data-bind="foreach : services">
    <tr>
        <td class="index"><span data-bind="text:$index()+1"></span></td>
        <td class="service">
            <span data-bind="text:service() ? service().name : ''"></span>
        </td>
        <td class="score">
            <span data-bind="text:score() ? score().label : ''"></span>
        </td>
        <td class="budget-cell">
            <span data-bind="text: target"></span>
        </td>

        <!-- ko foreach: periodTargets -->
        <td class="budget-cell">
            <span data-bind="text: target"/>
        </td>
        <!-- /ko -->

    </tr>
    </tbody>
</table>

<!-- /ko -->