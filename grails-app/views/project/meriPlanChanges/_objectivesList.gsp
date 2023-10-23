<div id="objectives-list-view" class="well well-small">
    <g:if test="${title}">
    <h4>${title}</h4>
    </g:if>
    <ul data-bind="visible:details.objectives.rows1().length > 0">
        <!-- ko foreach:details.objectives.rows1 -->
        <li><span data-bind="text:description"></span></li>
        <!-- /ko -->
    </ul>

    <span data-bind="visible:details.objectives.rows1().length == 0">No objectives have been nominated for this project</span>
</div>