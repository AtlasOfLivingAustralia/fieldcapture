<g:if test="${title}">
    <h4>${title}</h4>
</g:if>
<table class="table">
    <thead>
    <tr>
        <th class="required">${tableHeading ?: "Project delivery assumptions"}</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="display:none" class="original" data-bind="text:details.implementation.description"></td>
        <td style="display:none" class="changed" data-bind="text:detailsChanged.implementation.description"></td>
        <td wrap class="diff1"></td>
    </tr>
    </tbody>
</table>
