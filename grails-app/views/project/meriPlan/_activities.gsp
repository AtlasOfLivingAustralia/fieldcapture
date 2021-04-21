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
        <select data-bind="optionsCaption:'Please select... ', value:details.activities.activities.singleSelection, options:details.activities.activities.selectableActivities" class="form-control form-control-sm input-medium">
        </select>

        <input class="form-control form-control-sm input-medium" type="text" data-bind="enable:details.activities.activities.otherChecked() && !isProjectDetailsLocked(), value:details.activities.activities.otherValue">
    </g:if>
    <g:else>
        <g:each var="activity" in="${config.program?.config?.activities?.collect{it.name} ?: []}">
            <label class="checkbox"><input type="checkbox" data-bind="checked:details.activities.activities, disable: isProjectDetailsLocked()" value="${activity}">${activity}</label>
        </g:each>
        <g:if test="${includeOther}">
            <label class="checkbox"><input type="checkbox" data-bind="checked:details.activities.activities.otherChecked" value="Other">Other</label>
            <input class="form-control form-control-sm input-medium" type="text" data-bind="enable:details.activities.activities.otherChecked() && !isProjectDetailsLocked(), value:details.activities.activities.otherValue">
        </g:if>
    </g:else>

</div>
