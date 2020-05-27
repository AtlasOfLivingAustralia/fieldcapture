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
        <label class="checkbox"><input type="checkbox" data-bind="checked:details.objectives.simpleObjectives, disable: isProjectDetailsLocked()" value="${objective}">${objective}</label>
    </g:each>
        <g:if test="${includeOther}">
            <label class="checkbox"><input type="checkbox" data-bind="checked:details.objectives.simpleObjectives.otherChecked, disable: isProjectDetailsLocked()" value="Other">Other</label>
            <input type="text" data-bind="enable:details.objectives.simpleObjectives.otherChecked(), value:details.objectives.simpleObjectives.otherValue">
        </g:if>
    </fieldset>
</div>