<h4>${title}</h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>
<div class="community-engagement row-fluid">
    <textarea class="form-control span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.communityEngagement, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>
</div>