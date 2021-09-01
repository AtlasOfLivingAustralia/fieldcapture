<h4>${title}</h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>
<div class="community-engagement row">
    <div class="col-sm-12">
        <textarea class="form-control form-control-sm" rows="5"
                  data-validation-engine="validate[required,maxSize[${maxSize ?: 1500}]]"
                  data-bind="value:details.communityEngagement, disable: isProjectDetailsLocked()"
                  placeholder="${placeholder ?: ""}"></textarea>
    </div>
</div>
