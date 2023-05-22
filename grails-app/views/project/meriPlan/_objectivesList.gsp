<div id="objectives-list">
    <g:if test="${title}">
        <h4>${title}</h4>
        <g:if test="${explanation}">
            <p>
                ${explanation}
            </p>
        </g:if>
    </g:if>
    <div class="objective" data-bind='foreach:${config.program?.config?.objectives}'>
        <div class="form-check">
            <input type="checkbox" class="form-check-input"
                   data-bind="value: $data,checked:details.objectives.simpleObjectives, disable: $root.isProjectDetailsLocked(), attr: {'id': 'objective'+$index()}">
            <label class="form-check-label"
                   data-bind="value: $data, disable: $root.isProjectDetailsLocked(), attr: {'for': 'objective'+$index()}"><!--ko text: $data--><!--/ko--></label>
        </div>
    </div>
    <g:if test="${includeOther}">
        <div class="form-check">
            <input type="checkbox" id="other" class="form-check-input"
                   data-bind="checked:details.objectives.simpleObjectives.otherChecked, disable: isProjectDetailsLocked()"
                   value="Other">
            <label class="form-check-label" for="other">Other</label>
        </div>
        <input type="text" class="form-control form-control-sm otherInput"
               data-bind="enable:details.objectives.simpleObjectives.otherChecked(), value:details.objectives.simpleObjectives.otherValue">
    </g:if>
</div>
