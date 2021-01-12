<h4>${headingTitle ?: "Additional Benefit"}</h4>

<table class="table" style="display: ${hideFDF}">
    <thead>
    <tr class="header required">
        <th class="required">${titleFDF ?: "Future Drought Fund Outcome(s) - Please make this multi-selection"}<th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><g:each var="fdf" in="${config.program?.config?.fdf?.collect { it.name } ?: []}">
            <label class="checkbox"><input type="checkbox"
                                           data-bind="checked:details.outcomes.fdf, disable: isProjectDetailsLocked()"
                                           value="${fdf}">${fdf}</label>
        </g:each>
        </td>

    </tr>
    </tbody>
</table>

<table class="table" style="hidden: ${hideNRM}">
    <thead>
    <tr class="header required">
        <th class="required">${titleNRM ?: "Natural Resources Management Landscapes Outcomes (Select at least 2)"}<th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>
        <g:each var="nrm" in="${config.program?.config?.nrm?.collect { it.name } ?: []}">
            <label class="checkbox"><input type="checkbox"
                                               data-bind="checked:details.outcomes.nrm, disable: isProjectDetailsLocked()"
                                               value="${nrm}">${nrm}</label>
        </g:each>
    </td>
    </tr>
    </tbody>
</table>
