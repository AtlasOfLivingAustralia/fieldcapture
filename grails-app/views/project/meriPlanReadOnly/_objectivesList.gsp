<div id="objectives-list" class="well well-small">
    <h4>Program objectives</h4>
    <ul>
    <g:each var="objective" in="${config.outcomes}">
        <li>${objective.outcome}</li>
    </g:each>
    </ul>
</div>