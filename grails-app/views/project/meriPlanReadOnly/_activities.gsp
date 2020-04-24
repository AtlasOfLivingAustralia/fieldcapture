<div id="activity-list">
<g:if test="${title}">
    <h4>${title}</h4>
</g:if>

    <ul data-bind="visible:details.activities.activities().length > 0 || details.activities.activities.otherChecked()">
        <!-- ko foreach:details.activities.activities -->
        <li data-bind="text:$data"></li>
        <!-- /ko -->
        <li data-bind="visible:details.activities.activities.otherChecked(), text:details.activities.activities.otherValue()"></li>
    </ul>

    <span data-bind="visible:details.activities.activities().length == 0 && !details.activities.activities.otherChecked()">${noneSelectedMessage}</span>
</div>