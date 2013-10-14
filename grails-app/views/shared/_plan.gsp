<r:require modules="datepicker, jqueryGantt"/>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid fuelux" id="planContainer">
    <div class="row-fluid wizard">
        <ul class="steps">
            <li data-bind="css:{active:step() === 1,complete:step()>1},click:backtrack" data-target="#step1"><span class="badge" data-bind="css:{'badge-info':step()===1,'badge-success':step()>1}">1</span>Plan project<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 2,complete:step()>2},click:backtrack" data-target="#step2"><span class="badge" data-bind="css:{'badge-info':step()===2,'badge-success':step()>2}">2</span>Set targets<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 3,complete:step()>3},click:backtrack" data-target="#step3"><span class="badge" data-bind="css:{'badge-info':step()===3,'badge-success':step()>3}">3</span>Approve plan<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 4,complete:step()>4},click:backtrack" data-target="#step4"><span class="badge" data-bind="css:{'badge-info':step()===4,'badge-success':step()>4}">4</span>Enter activity information<span class="chevron"></span></li>
            <li data-bind="css:{active:step() === 5,complete:step()>5},click:backtrack" data-target="#step5"><span class="badge" data-bind="css:{'badge-info':step()===4,'badge-success':step()>4}">4</span>Report stage<span class="chevron"></span></li>
        </ul>
    </div>
    <div class="step-content">
        <div class="step-pane" id="step1" data-bind="css:{active:step()===1}">
            Create your plan by adding activites.
            <button data-bind="click:newActivity" type="button" class="btn btn-link">Plan new activity</button>
            <button data-bind="click:nextStep" type="button" class="btn btn-small pull-right">I have finished planning activities <i class="icon-forward"></i></button>
        </div>
        <div class="step-pane" id="step2" data-bind="css:{active:step()===2}">
            Set project-wide targets based on your planned activites.
            <button data-bind="click:nextStep" type="button" class="btn btn-small pull-right">Submit plan for approval <i class="icon-forward"></i></button>
        </div>
        <div class="step-pane" id="step3" data-bind="css:{active:step()===3}">
            Waiting for approval by your case manager.
            <button data-bind="click:nextStep" type="button" class="btn btn-small pull-right">Approve plan <i class="icon-forward"></i></button>
        </div>
        <div class="step-pane" id="step4" data-bind="css:{active:step()===4}">
            Click <i class="icon-edit no-pointer"></i> edit button to enter activity data. Set the status for each
            activity as it is started and finished. If an activity cannot be finished mark it as 'deferred'.
            <button data-bind="click:nextStep" type="button" class="btn btn-small pull-right">Submit stage for approval <i class="icon-forward"></i></button>
        </div>
        <div class="step-pane" id="step5" data-bind="css:{active:step()===5}">
            Waiting for approval of stage x.
        </div>
    </div>
    <p data-bind="visible: activities().length == 0">
        This project currently has no activities planned.
    </p>
    <table class="table table-condensed" id="activities">
        <thead>
        <tr data-bind="visible: activities().length > 0">
            <th>Stage</th>
            <th width="34px"></th>
            <th>From</th>
            <th>To</th>
            <th>Activity</th>
            <g:if test="${showSites}">
                <th>Site</th>
            </g:if>
            <th>Status</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:activities" id="activityList">
        <tr>
            <!-- ko foreach:stageCells -->
            <td data-bind="attr:{rowspan:count}">
                <span data-bind="text:label"></span>
            </td>
            <!-- /ko -->
            <td>
                <i class="icon-edit" title="Edit Activity" data-bind="click:editActivity"></i>
                <i class="icon-remove" title="Delete activity" data-bind="click:del"></i>
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
<div id="gantt-container"></div>
<r:script>
    $(window).load(function () {
        function PlanViewModel(activities, sites) {
            var self = this;
            this.loadActivities = function (activities) {
                var acts = ko.observableArray([]);

                // sort activities list first so we can group by project stage
                activities.sort(function (a,b) {
                    if (a.projectStage > b.projectStage)
                      return 1;
                    if (a.projectStage < b.projectStage)
                      return -1;
                    return 0;
                });

                $.each(activities, function (index, act) {
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
                    // this controls the merging of the stage cell across rows where they have the same value
                    activity.stageCells = ko.computed(function () {
                        var previousActivity = index === 0 ? null : activities[index -1],
                            isFirstOfItsValue = previousActivity === null ||
                                previousActivity.projectStage !== activity.projectStage,
                            numTheSame = 1, cellData, i = index + 1;
                        if (isFirstOfItsValue) {
                            // calculate how many of the current value
                            while (i < activities.length && activities[i].projectStage === activity.projectStage) {
                                i++; numTheSame++;
                            }
                            cellData = {label: activity.projectStage, count: numTheSame};
                            return [cellData];
                        } else {
                            return [];
                        }
                    });
                    // save progress updates as soon as they happen
                    activity.progress.subscribe(function (newValue) {
                        var payload = {progress: newValue, activityId: activity.activityId};
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
            self.progressOptions = ['planned','started','finished','deferred'];
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
            self.getGanttData = function () {
                var values = [],
                    previousStage = '';
                $.each(self.activities(), function (i, act) {
                    var statusClass = 'gantt-' + act.progress(),
                        startDate = act.plannedStartDate.date().getTime(),
                        endDate = act.plannedEndDate.date().getTime();
                    if (!isNaN(startDate)) {
                        values.push({
                            name:act.projectStage === previousStage ? '' : act.projectStage,
                            desc:act.type,
                            values: [{
                                label: act.type,
                                from: "/Date(" + startDate + ")/",
                                to: "/Date(" + endDate + ")/",
                                customClass: statusClass,
                                dataObj: act
                            }]
                        });
                    }
                    previousStage = act.projectStage;
                });
                return values;
            }
        }

        var planViewModel = new PlanViewModel(${activities ?: []}, ${sites ?: []});
        ko.applyBindings(planViewModel, document.getElementById('planContainer'));

        $("#gantt-container").gantt({
            source: planViewModel.getGanttData(),
            navigate: "scroll",
            //minScale: "days",
            itemsPerPage: 10,
            onItemClick: function(data) {
                alert(data.type + ' (' + data.progress() + ')');
            }/*,
            onAddClick: function(dt, rowId) {
                alert("Empty space clicked - add an item!");
            },
            onRender: function() {
                if (window.console && typeof console.log === "function") {
                    console.log("chart rendered");
                }
            }*/
        });
    });

</r:script>
<!-- /ko -->
