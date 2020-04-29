<div id="activity-list">
    <g:if test="${title}">
        <h4>${title}</h4>
        <g:if test="${explanation}">
            <p>
                ${explanation}
            </p>
        </g:if>
    </g:if>

    <g:each var="activity" in="${config.program?.config?.activities ?: []}">
        <label class="checkbox"><input type="checkbox" data-bind="checked:details.activities.activities, disable: isProjectDetailsLocked()" value="${activity}">${activity}</label>
    </g:each>
    <g:if test="${includeOther}">
        <label class="checkbox"><input type="checkbox" data-bind="checked:details.activities.activities.otherChecked" value="Other">Other</label>
        <input type="text" data-bind="enable:details.activities.activities.otherChecked() && !isProjectDetailsLocked(), value:details.activities.activities.otherValue">
    </g:if>
</div>