<!-- ko stopBinding:true -->
<div id="saved-nav-message-holder"></div>
<div class="form-actions" id="activity-nav" data-bind="visible:stayOnPage">

    <div class="row">
        <div class="col-sm-4">
            <!-- ko if:hasPrevious() -->
            <a class="btn pull-left" data-bind="attr:{href:previousActivityUrl()}, popover:{title:previousActivity().type, content:previousActivity().description, autoShow:true}"><i class="fa fa-arrow-left fa-2x text-center" style="vertical-align: middle;"></i> &nbsp; <span data-bind="text:previousActivity().type" style="vertical-align: middle;"></span></a>
            <!-- /ko -->
            <!-- ko if:!hasPrevious() -->
            <button class="btn btn-sm pull-left" disabled="disabled"><i class="fa fa-arrow-left fa-2x text-center"></i></button>
            <!-- /ko -->
        </div>

        <div class="col-sm-4">
            <a class="btn" data-bind="attr:{href:returnUrl}" style="position:absolute; left:45%;"><i class="fa fa-level-up fa-2x text-center" style="vertical-align: middle;"></i> &nbsp; <span data-bind="text:returnText"></span></a>
        </div>

        <div class="col-sm-4">
            <!-- ko if:hasNext() -->
            <a class="btn float-right text-right pull-right" data-bind="attr:{href:nextActivityUrl()},  popover:{title:nextActivity().type, placement:'left', content:nextActivity().description, autoShow:true}"><span data-bind="text:nextActivity().type" style="vertical-align: middle;"></span> &nbsp; <i class="fa fa-arrow-right fa-2x text-center" style="vertical-align: middle;"></i></a>
            <!-- /ko -->
            <!-- ko if:!hasNext() -->
            <button class="btn btn-sm float-right text-right pull-right" disabled="disabled"><i class="fa fa-arrow-right fa-2x text-center"></i></button>
            <!-- /ko -->
        </div>
    </div>
    <hr/>
    <div class="row">
        <div class="col-sm-4">
            <label for="stages">Stage: </label> <select class="form-control form-control-sm col-sm-2" id="stages" data-bind="value:selectedStage,options:stages"></select>
        </div>

        <div class="col-sm-4">
            <label for="activity">Activity: </label> <select id="activity" class="form-control form-control-sm col-sm-6" data-bind="value:selectedActivity,options:stageActivities,optionsText:function(activity) { return activity.type+' - '+ activity.description }"></select>
        </div>

        <div class="col-sm-4">
            <a data-bind="attr:{href:navigateUrl}" class="btn btn-sm inline pull-right">GO</a>
        </div>
    </div>
</div>

<!-- /ko -->