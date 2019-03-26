<div class="row-fluid space-after" data-bind="if: isProjectDetailsLocked()">
    <div class="validationEngineContainer announcements">
       <!-- ko stopBinding:true -->
       <div id="edit-announcements">
       <g:render template="announcementsTable" model="${[disableConditionPrefix:'!']}"/>
       </div>
       <!-- /ko -->
        <button type="button" data-bind="click: saveAnnouncements" id="project-announcements-save" class="btn btn-primary">Save changes</button>

    </div>
</div>