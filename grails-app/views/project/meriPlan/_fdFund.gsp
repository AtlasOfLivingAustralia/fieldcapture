<h4 style="display: ${displayTitle}">${headingTitle ?: "FDF and NRM Outcomes"}</h4>
<table class="table">
    <thead>
    <tr class="header">
        <th class="required">${titleFDF ?: "FDF Outcome(s)"}</th> <g:if test="${helpTextFDF}"> <fc:iconHelp>${helpTextFDF}</fc:iconHelp> </g:if>
        <th class="required">${titleNRM ?: "NRM L Outcomes (Select at least 2)"}</th><g:if test="${helpTextNRM}"> <fc:iconHelp>${helpTextNRM}</fc:iconHelp> </g:if>
        <th class="remove"></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority fdf">
            <ul class="unstyled" data-bind="foreach:details.outcomes.fdFundOutcomeByCategory('fdf')">
                <li>
                    <label class="checkbox"><input type="checkbox" name="fdf" data-validation-engine="validate[minCheckbox[2],maxCheckbox[${maximumFDF?:'4'}]" data-bind="value:$data, checked:details.outcomes.otherOutcomes, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></label>
                </li>
            </ul>
        </td>
        <td class="outcome-priority nrm">
            <ul class="unstyled" data-bind="foreach:details.outcomes.fdFundOutcomeByCategory('nrm')">
                <li>
                    <label class="checkbox"><input type="checkbox" name="nrm" data-validation-engine="validate[minCheckbox[2],maxCheckbox[${maximumNRM?:'4'}]" data-bind="value:$data, checked:details.outcomes.otherOutcomes, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></label>
                </li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>
