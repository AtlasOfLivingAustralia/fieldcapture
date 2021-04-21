<div class="row space-after" data-bind="if: isProjectDetailsLocked()">
    <div class="validationEngineContainer announcements">
       <!-- ko stopBinding:true -->

       <div id="edit-announcements" data-bind="let:{details:meriPlan()}">

       <g:render template="announcementsTable" model="${[disableConditionPrefix:'!']}"/>
       </div>
       <!-- /ko -->
        <button type="button" data-bind="click: saveAnnouncements" id="project-announcements-save" class="btn btn-sm btn-primary">Save changes</button>

    </div>
</div>
