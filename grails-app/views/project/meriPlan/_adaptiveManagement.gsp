<div id="adaptive-management" class="row-fluid">
    <div class="span12">
        <g:if test="${title}">
            <h4>${title}</h4>
            <g:if test="${explanation}">
                <p>
                    ${explanation}
                </p>
            </g:if>
        </g:if>
    <textarea placeholder="[Free text (3000 character limit [approx. 500 words])"
              maxlength="3000"
              data-validation-engine="validate[required,maxSize[3000]"
              data-bind="value:details.adaptiveManagement, disable: isProjectDetailsLocked()"
              class="input-xlarge" rows="5" ></textarea>
    </div>
</div>