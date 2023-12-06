<h4>Additional benefits</h4>
<table class="table secondary-outcome">

    <thead>

    <tr>
        <th class="outcome-priority">${outcomePriority ?:"Secondary outcome(s)"}</th>
        <th class="priority">${ priority ?:"Secondary Investment Priorities"}</th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.secondaryOutcomes">
    <tr>
        <td class="outcome-priority"><span
                data-bind="text:description"></span>
        </td>
        <td class="priority">
            <!-- ko if:!details.outcomes.secondaryOutcomeSupportsMultiplePriorities($data.description()) -->
            <span data-bind="text:asset"></span>
            <!-- /ko -->

            <!-- ko if:details.outcomes.secondaryOutcomeSupportsMultiplePriorities($data.description()) -->
            <ul data-bind="foreach:assets">
                <li data-bind="text:$data"></li>
            </ul>
            <!-- /ko -->
        </span>
        </td>
    </tr>

    </tbody>
</table>