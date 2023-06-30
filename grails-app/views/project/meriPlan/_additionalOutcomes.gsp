<h4 class="header-with-help">${title ?:"Additional benefits"}</h4><g:if test="${helpTextHeading}"> <fc:iconHelp html="true" container="body">${helpTextHeading}</fc:iconHelp></g:if>
<table class="table secondary-outcome">

    <thead>

    <tr class="header">
        <th class="outcome-priority">${outcomePriority ?:"Secondary outcome(s)"}</th>
        <th class="priority">${ priority ?:"Secondary Investment Priorities"} <fc:iconHelp container="body"> ${priorityHelpText ?:"Other investment priorities that will benefit from the project.  Delete the row if there are no secondary outcomes."}</fc:iconHelp></th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.secondaryOutcomes">
    <tr>
        <td class="outcome-priority"><select class="form-control form-control-sm" data-validation-engine="validate[required]"
                                             data-bind="value:description, options: details.outcomes.selectableSecondaryOutcomes, optionsCaption: 'Please select', select2:{preserveColumnWidth:48}, disable: $parent.isProjectDetailsLocked()"></select>
        </td>
        <td class="priority">
            <!-- ko if:!details.outcomes.secondaryOutcomeSupportsMultiplePriorities($data.description()) -->
            <select data-bind="value:asset, options: details.outcomes.outcomePriorities(description()), optionsCaption: 'Please select', select2:{preserveColumnWidth:48}, disable: $parent.isProjectDetailsLocked()" class="form-control form-control-sm asset"></select>
            <!-- /ko -->
            <!-- ko if:details.outcomes.secondaryOutcomeSupportsMultiplePriorities($data.description()) -->
            <ul class="list-unstyled" data-bind="foreach:details.outcomes.outcomePriorities(description())">
                <li class="form-check">
                    <label class="form-check-label"><input type="checkbox" class="form-check-input" name="secondaryPriority" data-validation-engine="validate[minCheckbox[1],maxCheckbox[${maximumPriorities?:'2'}]" data-bind="value:$data, checked:$parent.assets, disable: $root.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></label>
                </li>
            </ul>
            <!-- /ko -->
        </td>
        <td class="remove">
            <span data-bind="if:!$parent.isProjectDetailsLocked()">
                <i class="fa fa-remove" data-bind="click: $parent.removeSecondaryOutcome"></i>
            </span>
        </td>
    </tr>

    </tbody>
    <tfoot>
    <tr>
        <td colspan="3">
            <button type="button" class="btn btn-sm"
                    data-bind="disable: details.outcomes.secondaryOutcomes().length >= ${maxAdditonalOutcomes ?: 5} || isProjectDetailsLocked(), click: addSecondaryOutcome">
                <i class="fa fa-plus"></i> Add a row</button></td>
    </tr>
    </tfoot>
</table>
