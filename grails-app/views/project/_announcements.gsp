<div class="row-fluid space-after" data-bind="if: isProjectDetailsLocked()">
    <div class="validationEngineContainer announcements">
       <g:render template="announcementsTable" model="${[disableConditionPrefix:'!']}"/>

        <button type="button" data-bind="click: saveAnnouncements" id="project-announcements-save" class="btn btn-primary">Save changes</button>

    </div>
</div>