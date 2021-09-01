<table class="table">
    <thead>
    <tr class="header">
        <th class="index"></th>
        <th class="outcome">Medium-term outcome statement/s <fc:iconHelp html="true" container="body">Medium-term Project outcomes should:
            <ul>
                <li>Contribute to the 5-year Outcome and relate to the short-term outcome. </li>
                <li>Outline the degree of impact having undertaken the Services for up to 5 years, such as "Reduce woody weed cover to less than 5% in 400 hectares of remnant native vegetation within the Ramsar site by 2023" Or "Increase average annual groundcover by 20% on 400 hectares of grazing land by 2023"</li>
                <li>Be expressed as a SMART Statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the proposed outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li>
            </ul>
            <b>Please note</b>: Projects more than 3 years in duration must set medium-term Project outcomes achievable at the Project's completion.
        </fc:iconHelp></th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.midTermOutcomes">
    <tr>
        <td class="index" data-bind="text:$index()+1"></td>
        <td class="outcome"><textarea class="form-control form-control-sm" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea></td>
        <td class="remove">
            <span data-bind="if: !$parent.isProjectDetailsLocked()">
                <i class="fa fa-remove" data-bind="click: $parent.removeMidTermOutcome"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="3">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: isProjectDetailsLocked(), click: addMidTermOutcome">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
