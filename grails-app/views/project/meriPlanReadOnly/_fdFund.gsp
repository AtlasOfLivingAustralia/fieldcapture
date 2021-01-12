<h4>${headingTitle ?: "Additional Benefit"}</h4>
<table class="table" style="display: ${hideFDF}">
    <thead>
    <tr class="header">
        <th>${titleFDF ?: "Future Drought Fund Outcome(s) - Please make this multi-selection"}<th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            <ul data-bind="foreach:details.outcomes.fdf">
                <li data-bind="text:$data"/>
            </ul>
        </td>
    </tr>
    </tbody>
</table>

<table class="table" style="display: ${hideNRM}">
    <thead>
    <tr class="header">
        <th>${titleNRM ?: "Natural Resources Management Landscapes Outcomes (Select at least 2)"}<th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            <ul data-bind="foreach:details.outcomes.nrm">
                <li data-bind="text:$data"/>
            </ul>
        </td>
    </tr>
    </tbody>
</table>
