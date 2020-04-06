<div id="activity-list">
    <h4>Activity areas addressed by project</h4>

    <g:each var="activity" in="${config.program?.config?.activities ?: []}">
        <label class="checkbox"><input type="checkbox" data-bind="checked:details.activities" value="${activity}">${activity}</label>
    </g:each>
</div>