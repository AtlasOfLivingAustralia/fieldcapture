<h4>Program Outcome</h4>
<table class="table primary-outcome">
    <thead>
    <tr>
        <th class="outcome-priority">Primary outcome</th>
        <th class="primary-outcome priority">Primary Investment <span data-bind="if:!isAgricultureProject() && !details.outcomes.primaryOutcomeSupportsMultiplePriorities()">Priority</span><span data-bind="if:isAgricultureProject() || details.outcomes.primaryOutcomeSupportsMultiplePriorities()">Priorities</span></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority"><span
                data-bind="text:details.outcomes.primaryOutcome.description"></span>
        </td>
        <td class="priority">
            <!-- ko if:!isAgricultureProject() && !details.outcomes.primaryOutcomeSupportsMultiplePriorities() -->
            <span data-bind="text:details.outcomes.primaryOutcome.asset"></span>
            <!-- /ko -->
            <!-- ko if:isAgricultureProject() || details.outcomes.primaryOutcomeSupportsMultiplePriorities() -->
            <ul data-bind="foreach:details.outcomes.primaryOutcome.assets">
                <li data-bind="text:$data"></li>
            </ul>
            <!-- /ko -->

        </td>
    </tr>

    </tbody>
</table>