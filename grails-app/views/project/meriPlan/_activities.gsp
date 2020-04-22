<div id="activity-list">
    <g:if test="${title}">
        <h4>${title}</h4>
        <g:if test="${explanation}">
            <p>
                ${explanation}
            </p>
        </g:if>
    </g:if>

    <g:each var="activity" in="${config.program?.config?.activities ?: []}">
        <label class="checkbox"><input type="checkbox" data-bind="checked:details.activities" value="${activity}">${activity}</label>
    </g:each>
</div>