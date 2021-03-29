<h4>${title}<g:if test="${helpTextHeading}"> <fc:iconHelp html="true" container="body">${helpTextHeading}</fc:iconHelp></g:if></h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>
<div class="consultation row-fluid">
    <textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.consultation, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>
</div>
