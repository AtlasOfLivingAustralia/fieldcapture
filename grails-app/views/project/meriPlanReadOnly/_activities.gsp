<div id="activity-list">
    <h4>Activity areas addressed by project</h4>

    <ul data-bind="visible:details.activities().length > 0, foreach:details.activities">
        <li data-bind="text:$data"></li>
    </ul>

    <span data-bind="visible:details.activities().length == 0">No activities have been nominated for this project</span>
</div>