<div id="objectives-list">
    <g:if test="${title}">
        <h4>${title}</h4>
        <g:if test="${explanation}">
            <p>
                ${explanation}
            </p>
        </g:if>
    </g:if>
    <fieldset>
    <g:each var="objective" in="${config.program?.config?.objectives}">
        <div class="form-check">
            <label class="form-check-label"><input type="checkbox" class="form-check-input" data-bind="checked:details.objectives.simpleObjectives, disable: isProjectDetailsLocked()" value="${objective}">${objective}</label>
        </div>
    </g:each>
        <g:if test="${includeOther}">
            <div class="form-check">
                <label class="form-check-label"><input type="checkbox" class="form-check-input" data-bind="checked:details.objectives.simpleObjectives.otherChecked, disable: isProjectDetailsLocked()" value="Other">Other</label>
                <input type="text" class="form-control form-control-sm" data-bind="enable:details.objectives.simpleObjectives.otherChecked(), value:details.objectives.simpleObjectives.otherValue">
            </div>
        </g:if>
    </fieldset>
</div>
