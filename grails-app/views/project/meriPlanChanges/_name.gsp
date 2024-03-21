<g:if test="${tableFormatting}">
<table class="table">
    <thead>
    <tr>
        <th>Project</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="display:none" class="original" data-bind="text:details.nameComparison"></td>
        <td style="display:none" class="changed" data-bind="text:detailsChanged.nameComparison"></td>
        <td wrap class="diff1"></td>
    </tr>
    </tbody>
</table>
</g:if>
<g:else>
<h4>Project name</h4>
    <span style="display:none" class="original" data-bind="text:details.nameComparison"></span>
    <span style="display:none" class="changed" data-bind="text:detailsChanged.nameComparison"></span>
    <span wrap class="diff1"></span>
</g:else>
