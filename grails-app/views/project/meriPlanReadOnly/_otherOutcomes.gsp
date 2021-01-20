<h4 style="display: ${displayTitle}">${headingTitle ?: "FDF and NRM Outcomes"}</h4>
<table class="table">
    <thead>
    <tr class="header">
        <th class="required" <g:if test="${hideTableOne == true}">style="display: none"</g:if> > ${titleTableHeadingOne ?: "FDF Outcome(s)"}</th>
        <th class="required" <g:if test="${hideTableTwo == true}">style="display: none"</g:if> >${titleTableHeadingTwo ?: "NRM L Outcomes (Select at least 2)"}
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="outcome-priority column-1" <g:if test="${hideTableOne == true}">style="display: none"</g:if>>
            <ul data-bind="foreach:details.outcomes.selectedOtherOutcomesByCategory('${otherOutcomeCategoryTableOne}')">
                <li>
                    <span data-bind="text:$data, checked:details.outcomes.otherOutcomes, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko--></span>
                </li>
            </ul>
        </td>
        <td class="outcome-priority column-1" <g:if test="${hideTableTwo == true}">style="display: none"</g:if> >
            <ul data-bind="foreach:details.outcomes.selectedOtherOutcomesByCategory('${otherOutcomeCategoryTableTwo}')">
                <li>
                    <span data-bind="text:$data, checked:details.outcomes.otherOutcomes, disable: $parent.isProjectDetailsLocked()"> <!--ko text: $data--><!--/ko-->
                    </span>
                </li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>
