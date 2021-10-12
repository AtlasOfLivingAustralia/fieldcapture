<g:if test="${tableFormatting}">
    <table class="table">
        <thead>
        <tr class="header required">
            <th class="required">${title ?: "Project rationale"}<fc:iconHelp>${rationaleHelpText?: "Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them."}</fc:iconHelp></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><textarea class="form-control form-control-sm" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea></td>
        </tr>
        </tbody>
    </table>
</g:if>
<g:else>
    <h4 class="header-with-help">${title ?: "Project rationale"}</h4><fc:iconHelp>${rationaleHelpText?: "Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them."}</fc:iconHelp>
    <g:if test="${explanation}">
        ${explanation}
    </g:if>
    <div class="rationale row">
        <div class="col-sm-12">
            <textarea class="form-control form-control-sm" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>
        </div>
    </div>
</g:else>
