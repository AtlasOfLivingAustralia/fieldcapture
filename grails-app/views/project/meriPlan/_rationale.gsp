<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr class="header required">
            <th class="required">${title ?: "Project rationale"}<fc:iconHelp>Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them.</fc:iconHelp></th>
        <g:if test="${explanation}">
            ${explanation}
        </g:if>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4 class="header-with-help">${title ?: "Project rationale"}</h4><fc:iconHelp>Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them.</fc:iconHelp>
    <g:if test="${explanation}">
        ${explanation}
    </g:if>
    <div class="rationale row-fluid">
        <textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>
    </div>
</g:else>
