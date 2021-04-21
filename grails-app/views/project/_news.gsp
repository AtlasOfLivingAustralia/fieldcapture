<div class="row">
    <span class="col-sm-6">
        <div class="well">
            <div class="well-title">News and events</div>
            <div data-bind="html:newsAndEvents()?newsAndEvents.markdownToHtml():'Nothing at this time'"></div>

        </div>
    </span>
    <span class="col-sm-6">
        <div class="well">
            <div class="well-title">Project stories</div>
            <div data-bind="html:projectStories()?projectStories.markdownToHtml():'Nothing at this time'"></div>
        </div>
    </span>
</div>
