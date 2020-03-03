<div id="activity-list">
    <h4>Activity areas addressed by project</h4>
    <ul>
    <g:each var="activity" in="${config.program?.config?.services ?: []}">
        <li>${activity.name}</li>
    </g:each>
    </ul>
</div>