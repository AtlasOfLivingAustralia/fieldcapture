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
        <td class="outcome-priority">
            <g:each var="fdf" in="${config.program?.config?.fdf?.collect { it.name } ?: []}">
                <label class="checkbox"><input type="checkbox" name="fdf" data-validation-engine="validate[minCheckbox[2],maxCheckbox[${maximumFDF?:'4'}]" data-bind="checked:details.outcomes.fdf, disable: isProjectDetailsLocked()" value="${fdf}">${fdf}</label>
            </g:each>

        </td>
        <td colspan="2" class="priority">
            <g:each var="nrm" in="${config.program?.config?.nrm?.collect { it.name } ?: []}">
                <label class="checkbox"><input type="checkbox" name="nrm" data-validation-engine="validate[minCheckbox[2],maxCheckbox[${maximumNRM?:'4'}]" data-bind="checked:details.outcomes.nrm, disable: isProjectDetailsLocked()" value="${nrm}">${nrm}</label>
            </g:each>
        </td>
    </tr>
    </tbody>
</table>
