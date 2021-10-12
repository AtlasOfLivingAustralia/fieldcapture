<h4>Program Outcome<g:if test="${helpTextHeading}"> <fc:iconHelp html="true" container="body">${helpTextHeading}</fc:iconHelp></g:if></h4>
<table class="table">
    <thead>
    <tr class="header">
        <th class="outcome-priority required">Primary outcome<g:if test="${helpTextPrimaryOutcome}"> <fc:iconHelp html="true" container="body">${helpTextPrimaryOutcome}</fc:iconHelp></g:if></th>
        <th class="primary-outcome priority required">Primary Investment <span data-bind="if:!isAgricultureProject() && !details.outcomes.primaryOutcomeSupportsMultiplePriorities()">Priority</span><span data-bind="if:isAgricultureProject() || details.outcomes.primaryOutcomeSupportsMultiplePriorities()">Priorities</span>
                <fc:iconHelp html="true" container="body">${priorityHelpText?: 'Enter the primary investment priority/ies for the primary outcome. (drop down list in MERIT) <br/>For outcomes 1-4, only one primary investment priority can be selected.<br/>For outcomes 5-6, select one or a maximum of two primary investment priorities'}</fc:iconHelp>
        </th>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority">
            <select class="form-control form-control-sm" data-validation-engine="validate[required]" data-bind="options:details.outcomes.selectablePrimaryOutcomes, value:details.outcomes.primaryOutcome.description, optionsCaption: 'Please select', disable: isProjectDetailsLocked()" >
            </select>

        </td>
        <td colspan="2" class="priority">
            <!-- ko if:!isAgricultureProject() && !details.outcomes.primaryOutcomeSupportsMultiplePriorities() -->

            <select class="form-control form-control-sm asset w-100" data-validation-engine="validate[required]" data-bind="options:details.outcomes.outcomePriorities(details.outcomes.primaryOutcome.description()), optionsCaption: 'Please select', value:details.outcomes.primaryOutcome.asset, select2:{},  disable: isProjectDetailsLocked()" >
            </select>
            <!-- /ko -->
            <!-- ko if:isAgricultureProject() || details.outcomes.primaryOutcomeSupportsMultiplePriorities() -->
            <ul class="list-unstyled" data-bind="foreach:details.outcomes.outcomePriorities(details.outcomes.primaryOutcome.description())">
                <li class="form-check">
                    <label class="form-check-label"><input type="checkbox" class="form-check-input" name="secondaryPriority" data-validation-engine="validate[minCheckbox[1],maxCheckbox[${maximumPriorities?:'2'}]" data-bind="value:$data, checked:details.outcomes.primaryOutcome.assets, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></label>
                </li>
            </ul>

            <!-- /ko -->
        </td>
    </tr>

    </tbody>
</table>
