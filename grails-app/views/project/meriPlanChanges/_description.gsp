<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr>
            <th>Project description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="display:none" class="original" data-bind="text:details.description"></td>
            <td style="display:none" class="changed" data-bind="text:detailsChanged.description"></td>
            <td wrap class="diff1"></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4>Project description</h4>
    <td style="display:none" class="original" data-bind="text:details.description"></td>
    <td style="display:none" class="changed" data-bind="text:detailsChanged.description"></td>
    <td wrap class="diff1"></td>
</g:else>

