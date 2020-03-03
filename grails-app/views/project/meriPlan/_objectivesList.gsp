<div id="objectives-list">
    <h4>Program objectives</h4>
    <g:each var="objective" in="${config.outcomes}">
        <label class="checkbox"><input type="checkbox">${objective.outcome}</label>
    </g:each>
</div>