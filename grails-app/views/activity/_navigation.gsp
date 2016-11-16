<!-- ko stopBinding:true -->
<div class="form-actions" id="activity-nav">

    <div class="row-fluid" style="position:relative">
        <!-- ko if:hasPrevious() -->
        <a class="btn pull-left" data-bind="attr:{href:previousActivityUrl()}, popover:{title:previousActivity().type, content:previousActivity().description, autoShow:true}"><i class="fa fa-arrow-left fa-2x text-center" style="vertical-align: middle;"></i> &nbsp; <span data-bind="text:previousActivity().type" style="vertical-align: middle;"></span></a>
        <!-- /ko -->
        <!-- ko if:!hasPrevious() -->
        <button class="btn pull-left" disabled="disabled"><i class="fa fa-arrow-left fa-2x text-center"></i></button>
        <!-- /ko -->
        <button type="button" id="cancel" class="btn" style="position:absolute; left:45%;"><i class="fa fa-level-up fa-2x text-center" style="vertical-align: middle;"></i> &nbsp; Return to project</button>
        <!-- ko if:hasNext() -->
        <a class="btn pull-right" data-bind="attr:{href:nextActivityUrl()},  popover:{title:nextActivity().type, placement:'left', content:nextActivity().description, autoShow:true}"><span data-bind="text:nextActivity().type" style="vertical-align: middle;"></span> &nbsp; <i class="fa fa-arrow-right fa-2x text-center" style="vertical-align: middle;"></i></a>
        <!-- /ko -->
        <!-- ko if:!hasNext() -->
        <button class="btn pull-right" disabled="disabled"><i class="fa fa-arrow-right fa-2x text-center"></i></button>
        <!-- /ko -->
    </div>
    <hr/>
    <div>
        <form class="form-inline">
            <label for="stages">Stage: </label> <select id="stages" data-bind="value:selectedStage,options:stages"></select>
            <label for="stages">Activity: </label> <select id="activity" class="input-xxlarge" data-bind="value:selectedActivity,options:stageActivities,optionsText:function(activity) { return activity.type+' - '+ activity.description }"></select>
            <a data-bind="attr:{href:navigateUrl}" class="btn inline pull-right">GO</a>
        </form>
    </div>
</div>

<!-- /ko -->