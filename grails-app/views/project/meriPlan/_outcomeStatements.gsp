<h4>Project outcomes</h4>
<table class="table">
    <thead>
    <tr class="header">
        <th class="index"></th>
        <th class="outcome required">Outcome statement/s <fc:iconHelp html="true" container="body">Outcomes should be expressed as a SMART statement. SMART stands for Specific, Measurable, Attainable, Realistic, and Time-bound. Ensure the outcomes are measurable with consideration to the baseline and proposed monitoring regime.</li>
        </fc:iconHelp> </th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
    <tr>
        <td class="index" data-bind="text:$index()+1"></td>
        <td class="outcome">
            <textarea data-validation-engine="validate[required]" data-bind="value:description, disable: $parent.isProjectDetailsLocked()"></textarea>
        </td>
        <td class="remove">
            <span data-bind="if: $index() && !$parent.isProjectDetailsLocked()"><i class="fa fa-remove"
                                                                                   data-bind="click: $parent.removeShortTermOutcome"></i>
            </span>
        </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="3">
            <button type="button" class="btn btn-small"
                    data-bind="disable: isProjectDetailsLocked(), click: addShortTermOutcome">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>