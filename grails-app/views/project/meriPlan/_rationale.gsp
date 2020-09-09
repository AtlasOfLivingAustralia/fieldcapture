<h4>${title ?: "Project rationale"}<fc:iconHelp>Provide a rationale of why the targeted investment priorities are being addressed and explain (using evidence) how the methodology will address them.</fc:iconHelp></h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>
<div class="rationale row-fluid">
    <textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.rationale, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>
</div>