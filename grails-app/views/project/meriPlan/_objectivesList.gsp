<div id="objectives-list">
    <h4>Program objectives</h4>
    <fieldset>
    <g:each var="objective" in="${config.program?.config?.objectives}">
        <label class="checkbox"><input type="checkbox" data-bind="checked:details.objectives.simpleObjectives, disable: isProjectDetailsLocked()" value="${objective}">${objective}</label>
    </g:each>
    </fieldset>
</div>