<div id="activity-list">
    <g:if test="${title}">
        <h4>${title}</h4>
        <g:if test="${explanation}">
            <p>
                ${explanation}
            </p>
        </g:if>
    </g:if>

    <g:if test="${singleSelection}">
        <select data-bind="optionsCaption:'Please select... ', value:details.activities.activities.singleSelection, options:details.activities.activities.selectableActivities" class="form-control form-control-sm"></select>
        <input type="text" data-bind="enable:details.activities.activities.otherChecked() && !isProjectDetailsLocked(), value:details.activities.activities.otherValue">
    </g:if>
    <g:else>
        <g:each var="activity" in="${config.program?.config?.activities?.collect{it.name} ?: []}">
            <div class="form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" data-bind="checked:details.activities.activities, disable: isProjectDetailsLocked()" value="${activity}">
                    ${activity}
                </label>
            </div>
        </g:each>
        <g:if test="${includeOther}">
            <div class="form-check">
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input" data-bind="checked:details.activities.activities.otherChecked" value="Other">
                    Other
                </label>
                <input type="text" data-bind="enable:details.activities.activities.otherChecked() && !isProjectDetailsLocked(), value:details.activities.activities.otherValue">
            </div>

        </g:if>
    </g:else>
</div>
