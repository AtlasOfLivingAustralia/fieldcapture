<g:if test="${tableFormatting}">
<table class="table">
    <thead>
    <tr>
        <th>Project</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td style="display:none" class="original" data-bind="text:details.name"></td>
        <td style="display:none" class="changed" data-bind="text:detailsChanged.name"></td>
        <td wrap class="diff1"></td>

    </tr>
    </tbody>
</table>
</g:if>
<g:else>
<h4>Project name</h4>
    <span style="display:none" class="original" data-bind="text:detailsChanged.name"></span>
    <span style="display:none" class="changed" data-bind="text:detailsChanged.name"></span>
    <span wrap class="diff1"></span>
</g:else>
