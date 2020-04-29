<div id="objectives-list-view" class="well well-small">
    <g:if test="${title}">
    <h4>${title}s</h4>
    </g:if>
    <ul data-bind="visible:details.objectives.simpleObjectives().length > 0 || details.objectives.simpleObjectives.otherChecked()">
        <!-- ko foreach:details.objectives.simpleObjectives -->
        <li><span data-bind="text:$data"></span></li>
        <!-- /ko -->
        <li data-bind="visible:details.objectives.simpleObjectives.otherChecked(), text:details.objectives.simpleObjectives.otherValue()"></li>
    </ul>

    <span data-bind="visible:details.objectives.simpleObjectives().length == 0 && !details.objectives.simpleObjectives.otherChecked()">No objectives have been nominated for this project</span>
</div>