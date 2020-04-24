<div id="activity-list">
<g:if test="${title}">
    <h4>${title}</h4>
</g:if>

    <ul data-bind="visible:details.activities.activities().length > 0, foreach:details.activities.activities">
        <li data-bind="text:$data"></li>
    </ul>

    <span data-bind="visible:details.activities.activities().length == 0">${noneSelectedMessage}</span>
</div>