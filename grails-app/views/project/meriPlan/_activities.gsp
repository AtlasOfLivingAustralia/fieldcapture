<div id="activity-list">
    <h4>Activity areas addressed by project</h4>

    <g:each var="activity" in="${config.services}">
        <label class="checkbox"><input type="checkbox">${activity.name}</label>
    </g:each>
</div>