<r:require module="datepicker"/>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid fuelux" id="planContainer">
    <div class="row-fluid wizard">
        <ul class="steps">
            <li data-bind="css:{active:step() === 1,complete:step()>1},click:backtrack" data-target="#step1"><span class="badge" data-bind="css:{'badge-info':step()===1,'badge-success':step()>1}">1</span>Create new plan<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 2,complete:step()>2},click:backtrack" data-target="#step2"><span class="badge" data-bind="css:{'badge-info':step()===2,'badge-success':step()>2}">2</span>Add activities<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 3,complete:step()>3},click:backtrack" data-target="#step3"><span class="badge" data-bind="css:{'badge-info':step()===3,'badge-success':step()>3}">3</span>Submit plan<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 4,complete:step()>4},click:backtrack" data-target="#step4"><span class="badge" data-bind="css:{'badge-info':step()===4,'badge-success':step()>4}">4</span>Enter activity information<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 5,complete:step()>5},click:backtrack" data-target="#step5"><span class="badge" data-bind="css:{'badge-info':step()===4,'badge-success':step()>4}">4</span>Report submitted<span class="chevron"></span></li>
        </ul>
    </div>
    <div class="step-content">
        <div class="step-pane" id="step1" data-bind="css:{active:step()===1}">
            Whatever needs to be done to create a plan happens here.
            <button data-bind="click:nextStep" type="button" class="btn btn-small">Create plan</button>
        </div>
        <div class="step-pane" id="step2" data-bind="css:{active:step()===2}">
            Create your plan by adding planned activites.
            <button data-bind="click:newActivity" type="button" class="btn btn-link">Add new activity</button>
            <button data-bind="click:nextStep" type="button" class="btn btn-small">Finished adding activities</button>
        </div>
        <div class="step-pane" id="step3" data-bind="css:{active:step()===3}">
            Click to submit your plan for approval by your case manager.
            <button data-bind="click:nextStep" type="button" class="btn btn-small">Submit plan for approval</button>
        </div>
        <div class="step-pane" id="step4" data-bind="css:{active:step()===4}">
            Click <i class="icon-edit no-pointer"></i> edit button to enter activity data. You can also do this from the
            activities tab.
            <button data-bind="click:nextStep" type="button" class="btn btn-small">Submit report for approval</button>
        </div>
        <div class="step-pane" id="step5" data-bind="css:{active:step()===5}">Report submitted.</div>
    </div>
    <p data-bind="visible: activities().length == 0">
        This project currently has no activities planned.
    </p>
    <table class="table table-condensed" id="activities">
        <thead>
        <tr data-bind="visible: activities().length > 0">
            <th width="34px"></th>
            <th class="sort" data-bind="sortIcon:activitiesSort,click:sortBy" data-column="projectStage">Stage</th>
            <th class="sort" data-bind="sortIcon:activitiesSort,click:sortBy" data-column="startDate">From</th>
            <th class="sort" data-bind="sortIcon:activitiesSort,click:sortBy" data-column="endDate">To</th>
            <th class="sort" data-bind="sortIcon:activitiesSort,click:sortBy" data-column="type">Activity</th>
            <g:if test="${showSites}">
                <th class="sort" data-bind="sortIcon:activitiesSort,click:sortBy" data-column="siteName">Site</th>
            </g:if>
            <th class="status" data-bind="sortIcon:activitiesSort,click:sortBy" data-column="progress">Status</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:activities" id="activityList">
        <tr>
            <td>
                <i class="icon-edit" title="Edit Activity" data-bind="click:editActivity"></i>
                <i class="icon-remove" title="Delete activity" data-bind="click:del"></i>
            </td>
            <td>
                <span data-bind="text:projectStage"></span>
            </td>
            <td><span data-bind="text:plannedStartDate.formattedDate"></span></td>
            <td><span data-bind="text:plannedEndDate.formattedDate"></span></td>
            <td>
                <span data-bind="text:type,click:editActivity" class="clickable"></span>
            </td>
            <g:if test="${showSites}">
                <td><a data-bind="text:siteName,click:$parent.openSite"></a></td>
            </g:if>
            <td><div class="btn-group">
                <button type="button" class="btn btn-small dropdown-toggle" data-toggle="dropdown"
                        data-bind="css: {'btn-warning':progress()=='planned','btn-success':progress()=='started','btn-info':progress()=='finished','btn-inverse':progress()=='finalised'}"
                        style="line-height:16px;min-width:80px;text-align:left;">
                    <span data-bind="text: progress"></span> <span class="caret pull-right" style="margin-top:6px;"></span>
                </button>
                <ul class="dropdown-menu" data-bind="foreach:$root.progressOptions" style="min-width:100px;">
                    <!-- Disable item if selected -->
                    <li data-bind="css: {'disabled' : $data==$parent.progress()}">
                        <a href="#" data-bind="click: $parent.progress"><span data-bind="text: $data"></span></a>
                    </li>
                </ul></div>
                <span data-bind="visible:isSaving"><r:img dir="images" file="ajax-saver.gif"/> saving</span>
            </td>
        </tr>
        </tbody>
    </table>
</div>
<r:script>
    $(window).load(function () {
        function PlanViewModel(activities, sites) {
            var self = this;
            this.loadActivities = function (activities) {
                var acts = ko.observableArray([]);
                $.each(activities, function (i, act) {
                    var activity = {
                        activityId: act.activityId,
                        siteId: act.siteId,
                        siteName: self.lookupSiteName(act.siteId),
                        type: act.type,
                        projectStage: act.projectStage,
                        description: act.description,
                        startDate: ko.observable(act.startDate).extend({simpleDate:false}),
                        endDate: ko.observable(act.endDate).extend({simpleDate:false}),
                        plannedStartDate: ko.observable(act.plannedStartDate).extend({simpleDate:false}),
                        plannedEndDate: ko.observable(act.plannedEndDate).extend({simpleDate:false}),
                        progress: ko.observable(act.progress),
                        isSaving: ko.observable(false),
                        outputs: ko.observableArray([]),
                        collector: act.collector,
                        metaModel: act.model || {},
                        editActivity: function () {
                            document.location.href = fcConfig.activityEditUrl + "/" + this.activityId +
                                "?returnTo=" + here;
                        },
                        printActivity: function() {
                            open(fcConfig.activityPrintUrl + "/" + this.activityId, "fieldDataPrintWindow");
                        },
                        del: function () {
                            var self = this;
                            // confirm first
                            bootbox.confirm("Delete this activity? Are you sure?", function(result) {
                                if (result) {
                                    $.getJSON(fcConfig.activityDeleteUrl + '/' + self.activityId,
                                        function (data) {
                                            if (data.code < 400) {
                                                document.location.reload();
                                            } else {
                                                alert("Failed to delete activity - error " + data.code);
                                            }
                                        });
                                }
                            });
                        }
                    };
                    activity.progress.subscribe(function (newValue) {
                        var payload = {progress: newValue, activityId: activity.activityId}
                        activity.isSaving(true);
                        // save new status
                        $.ajax({
                            url: "${createLink(controller:'activity', action:'ajaxUpdate')}/" + activity.activityId,
                            type: 'POST',
                            data: JSON.stringify(payload),
                            contentType: 'application/json',
                            success: function (data) {
                                if (data.error) {
                                    alert(data.detail + ' \n' + data.error);
                                }
                            },
                            error: function (data) {
                                alert('An unhandled error occurred: ' + data.status);
                            },
                            complete: function () {
                                activity.isSaving(false);
                            }
                        });

                    });
                    $.each(act.outputs, function (j, out) {
                        activity.outputs.push({
                            outputId: out.outputId,
                            name: out.name,
                            collector: out.collector,
                            assessmentDate: out.assessmentDate,
                            scores: out.scores
                        });
                    });
                    acts.push(activity);
                });
                return acts;
            };
            self.progressOptions = ['planned','started','finished','finalised'];
            self.lookupSiteName = function (siteId) {
                var site;
                if (siteId !== undefined && siteId !== '') {
                    site = $.grep(sites, function(obj, i) {
                            return (obj.siteId === siteId);
                    });
                    if (site.length > 0) {
                         return site[0].name;
                    }
                }
                return '';
            };
            self.activities = self.loadActivities(activities);
            self.activitiesSort = {};
            self.activitiesSort.by = ko.observable("");
            self.activitiesSort.order = ko.observable("");
            self.sortActivities = function (sortBy, sortDir) {
                if (sortBy !== undefined) { self.activitiesSort.by(sortBy) }
                if (sortDir !== undefined) { self.activitiesSort.order(sortDir) }
                var field = self.activitiesSort.by(),
                    order = self.activitiesSort.order();
                self.activities.sort(function (left, right) {
                    var l = ko.utils.unwrapObservable(left[field]),
                        r = ko.utils.unwrapObservable(right[field]);
                    return l == r ? 0 : (l < r ? -1 : 1);
                });
                if (order === 'desc') {
                    self.activities.reverse();
                }
            };
            self.sortBy = function (data, event) {
                var element = event.currentTarget;
                state = $(element).find('i').hasClass('icon-chevron-up');
                self.activitiesSort.order(state ? 'desc' : 'asc');
                self.activitiesSort.by($(element).data('column'));
                self.sortActivities();
            };
            self.newActivity = function () {
                var context = '',
                    projectId = "${project?.projectId}",
                    siteId = "${site?.siteId}",
                    returnTo = '?returnTo=' + document.location.href;
                if (projectId) {
                    context = '&projectId=' + projectId;
                } else if (siteId) {
                    context = '&siteId=' + siteId;
                }
                document.location.href = fcConfig.activityCreateUrl + returnTo + context;
            };
            self.openSite = function () {
                var siteId = this.siteId;
                if (siteId !== '') {
                    document.location.href = fcConfig.siteViewUrl + '/' + siteId;
                }
            };
            self.step = ko.observable(self.activities().length === 0 ? 1 : 2);
            self.nextStep = function () {
                self.step(self.step() + 1);
            };
            self.backtrack = function (data, event) {
                var step = $(event.currentTarget).attr('data-target'),
                    stepNumber = Number(step.substring(step.length-1));
                if (stepNumber < self.step()) {
                    self.step(stepNumber);
                }
            };
        }

        var planViewModel = new PlanViewModel(${activities ?: []}, ${sites ?: []});
        ko.applyBindings(planViewModel, document.getElementById('planContainer'));
        planViewModel.sortActivities("projectStage");
    });

</r:script>
<!-- /ko -->
