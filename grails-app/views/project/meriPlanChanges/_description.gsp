<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr>
            <th>${projectDescHeading ?: 'Project description'}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="display:none" class="original" data-bind="text:details.descriptionComparison"></td>
            <td style="display:none" class="changed" data-bind="text:detailsChanged.descriptionComparison"></td>
            <td wrap class="diff1"></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4>${projectDescHeading ?: 'Project description'}</h4>
    <td style="display:none" class="original" data-bind="text:details.descriptionComparison"></td>
    <td style="display:none" class="changed" data-bind="text:detailsChanged.descriptionComparison"></td>
    <td wrap class="diff1"></td>
</g:else>

