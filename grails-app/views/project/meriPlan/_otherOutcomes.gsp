<h4 style="display: ${displayTitle}">${headingTitle ?: "FDF and NRM Outcomes"}</h4>
<table class="table">
    <thead>
    <tr class="header">
        <th class="required" <g:if test="${hideTableOne == true}">style="display: none"</g:if> >${titleTableHeadingOne ?: "FDF Outcomes (Select at least 2)"}</th> <g:if test="${helpTextTableHeadingOne}"> <fc:iconHelp>${helpTextTableHeadingOne}</fc:iconHelp> </g:if>
        <th class="required" <g:if test="${hideTableTwo == true}">style="display: none"</g:if> >${titleTableHeadingTwo ?: "NRM L Outcomes (Select at least 2)"}</th><g:if test="${helpTextTableHeadingTwo}"> <fc:iconHelp>${helpTextTableHeadingTwo}</fc:iconHelp> </g:if>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority column-1" <g:if test="${hideTableOne == true}">style="display: none"</g:if>>
            <ul class="unstyled" data-bind="foreach:details.outcomes.listOfOtherOutcomeCategory('${otherOutcomeCategoryTableOne}')">
                <li>
                    <label class="checkbox"><input class="form-control" type="checkbox" name="fdf" data-validation-engine="validate[minCheckbox[${minimumCheckTableOne?: '2'}],maxCheckbox[${maximumCheckTableOne?:'4'}]" data-bind="value:$data, checked:details.outcomes.otherOutcomes, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></label>
                </li>
            </ul>
        </td>
        <td class="outcome-priority column-2" <g:if test="${hideTableTwo == true}">style="display: none"</g:if> >
            <ul class="unstyled" data-bind="foreach:details.outcomes.listOfOtherOutcomeCategory('${otherOutcomeCategoryTableTwo}')">
                <li>
                    <label class="checkbox"><input class="form-control" type="checkbox" name="nrm" data-validation-engine="validate[minCheckbox[${minimumCheckTableTwo?: '2'}],maxCheckbox[${maximumCheckTableTwo?:'4'}]" data-bind="value:$data, checked:details.outcomes.otherOutcomes, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></label>
                </li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>
