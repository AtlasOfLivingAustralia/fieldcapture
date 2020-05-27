<h4>Project description</h4>
<g:if test="${explanation}">
    ${explanation}
</g:if>
<div class="project-description row-fluid">

    <textarea class="span12" rows="5" data-validation-engine="validate[required,maxSize[${maxSize?:1500}]]" data-bind="value:details.description, disable: isProjectDetailsLocked()" placeholder="${placeholder?:""}"></textarea>

</div>
