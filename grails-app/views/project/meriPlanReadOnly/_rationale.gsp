<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr>
            <th>${title ?: "Project rationale"}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span data-bind="text:details.rationale"></span></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4>${title ?: "Project rationale"}</h4>
    <div class="consultation-view row-fluid">
        <span class="span12" data-bind="text:details.rationale"></span>
    </div>
</g:else>
