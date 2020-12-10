<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr>
            <th>Project description</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span data-bind="text:details.description"></span></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4>Project description</h4>
    <span data-bind="text:details.description"></span>
</g:else>

