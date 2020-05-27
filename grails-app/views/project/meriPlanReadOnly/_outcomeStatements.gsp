<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table">
    <thead>
    <tr>
        <th class="index"></th>
        <th class="outcome">Outcome statement/s</th>
    </tr>
    </thead>
    <tbody data-bind="foreach:details.outcomes.shortTermOutcomes">
    <tr>
        <td class="index" data-bind="text:$index()+1"></td>
        <td class="outcome">
            <span data-bind="text:description"></span>
        </td>
    </tr>
    </tbody>
</table>