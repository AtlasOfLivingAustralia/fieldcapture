<div id="objectives-list" class="well well-small">
    <h4>Program objectives</h4>
    <g:each var="objective" in="${config.outcomes}">
        <label><input type="checkbox">${objective.outcome}</label>
    </g:each>
</div>