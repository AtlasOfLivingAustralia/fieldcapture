<r:require modules="datepicker, jqueryGantt, jqueryValidationEngine"/>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid" id="planContainer">
    <div class="fuelux">
        <div class="row-fluid wizard">
            <ul class="steps">
                <li data-bind="css:{active:currentStep() === 1,complete:currentStep()>1},click:backtrack" data-target="#step1"><span class="badge" data-bind="css:{'badge-info':currentStep()===1,'badge-success':currentStep()>1}">1</span>Plan project<span class="chevron"></span></li>
                <li data-bind="css:{active:currentStep() === 2,complete:currentStep()>2},click:backtrack" data-target="#step2"><span class="badge" data-bind="css:{'badge-info':currentStep()===2,'badge-success':currentStep()>2}">2</span>Set targets<span class="chevron"></span></li>
                <li data-bind="css:{active:currentStep() === 3,complete:currentStep()>3},click:backtrack" data-target="#step3"><span class="badge" data-bind="css:{'badge-info':currentStep()===3,'badge-success':currentStep()>3}">3</span>Submit plan<span class="chevron"></span></li>
                <li data-bind="css:{active:currentStep() === 4,complete:currentStep()>4},click:backtrack" data-target="#step4"><span class="badge" data-bind="css:{'badge-info':currentStep()===4,'badge-success':currentStep()>4}">4</span>Approve plan<span class="chevron"></span></li>
                <li data-bind="css:{active:currentStep() === 5,complete:currentStep()>5},click:backtrack" data-target="#step5"><span class="badge" data-bind="css:{'badge-info':currentStep()===5,'badge-success':currentStep()>5}">5</span>Enter activity information<span class="chevron"></span></li>
                <li data-bind="css:{active:currentStep() === 6,complete:currentStep()>6},click:backtrack" data-target="#step6"><span class="badge" data-bind="css:{'badge-info':currentStep()===6,'badge-success':currentStep()>6}">6</span>Report stage<span class="chevron"></span></li>
            </ul>
        </div>
        <div class="step-content">
            <div class="step-pane" id="step1" data-bind="css:{active:currentStep()===1}">
                Create your plan by adding activites.
                <button data-bind="click:newActivity" type="button" class="btn btn-link">Plan new activity</button>
                <button data-bind="click:nextStep" type="button" class="btn btn-small btn-success pull-right">I have finished planning activities <i class="icon-forward icon-white"></i></button>
            </div>
            <div class="step-pane" id="step2" data-bind="css:{active:currentStep()===2}">
                Set project-wide targets based on your planned activites.
                <button data-bind="click:saveOutputTargets" type="button" class="btn btn-small btn-success pull-right">I have finished entering output targets <i class="icon-forward icon-white"></i></button>
            </div>
            <div class="step-pane" id="step3" data-bind="css:{active:currentStep()===3}">
                Review your plan and submit it for approval by your case manager. If you need to make changes, you can return to previous stages in the workflow by clicking on the appropriate numbered section heading.
                <button data-bind="click:nextStep" type="button" class="btn btn-small btn-success pull-right">Submit plan <i class="icon-forward icon-white"></i></button>
            </div>
            <div class="step-pane" id="step4" data-bind="css:{active:currentStep()===4}">
                Waiting for approval by your case manager.
                <button data-bind="click:nextStep" type="button" class="btn btn-small btn-success pull-right">Approve plan <i class="icon-forward icon-white"></i></button>
            </div>
            <div class="step-pane row-fluid" id="step5" data-bind="css:{active:currentStep()===5}">
                <span class="span8">Click <i class="icon-edit no-pointer"></i> edit button to enter activity data.
                Set the status for each activity as it is started and finished. If an activity cannot be finished
                mark it as 'deferred'.</span>
                <span class="span4">
                    <button data-bind="click:nextStep,enable:currentStageReadyForApproval,
                      attr:{title:currentStageReadyForApproval() ? '' :
                      'All activities must be marked as finished or deferred before a stage can be submitted.'}"
                      type="button" class="btn btn-small btn-success pull-right">Submit
                      <b><span data-bind="text:currentProjectStage"></span></b>
                      for approval <i class="icon-forward icon-white"></i></button>
                </span>
            </div>
            <div class="step-pane" id="step6" data-bind="css:{active:currentStep()===6}">
                Waiting for approval of <b><span data-bind="text:currentProjectStage"></span></b>.
            </div>
        </div>
    </div>
    <div id="activityContainer" data-bind="visible: currentStep() != 2">
        <h4>Planned Activities</h4>
        <p data-bind="visible: stages.length == 0">
            This project currently has no activities planned.
        </p>
        <table class="table table-condensed" id="activities">
            <thead>
            <tr data-bind="visible: stages.length > 0">
                <th>Stage</th>
                <th data-bind="attr:{width:canEditActivity()||canDeleteActivity() ? '32px' : '14px'}"></th>
                <th>From</th>
                <th>To</th>
                <th>Activity</th>
                <g:if test="${showSites}">
                    <th>Site</th>
                </g:if>
                <th>Status</th>
            </tr>
            </thead>
            <!-- ko foreach:stages -->
            <tbody data-bind="foreach:activities, css:{activeStage:isCurrentStage, inactiveStage: !isCurrentStage}" id="activityList">
            <tr>
                <!-- ko with:isFirst -->
                <td data-bind="attr:{rowspan:$parents[1].activities.length}" class="stage-display">
                    <span data-bind="text:projectStage%{--, blah:console.log(ko.toJS($data))--}%"></span>
                    <br data-bind="visible:$parents[1].isCurrentStage">
                    <span data-bind="visible:$parents[1].isCurrentStage" class="badge badge-info">Current stage</span>
                    <br data-bind="visible:$parents[1].readyForApproval()">
                    <span data-bind="visible:$parents[1].readyForApproval()" class="badge badge-success"
                      title="Submit this stage for implementation approval by clicking the button in the section above.">Ready for approval</span>
                </td>
                <!-- /ko -->
                <td>
                    <i class="icon-edit" title="Edit Activity" data-bind="click:$root.editActivity, visible:$root.canEditActivity"></i>
                    <i class="icon-print" title="Print activity" data-bind="click:$root.printActivity, visible:$root.canPrintActivity"></i>
                    <i class="icon-remove" title="Delete activity" data-bind="click:del, visible:$root.canDeleteActivity"></i>
                </td>
                <td><span data-bind="text:plannedStartDate.formattedDate"></span></td>
                <td><span data-bind="text:plannedEndDate.formattedDate"></span></td>
                <td>
                    <span data-bind="text:type,click:$root.editActivity, css:{clickable:$root.canEditActivity}"></span>
                </td>
                <g:if test="${showSites}">
                    <td><a class="clickable" data-bind="text:siteName,click:$parents[1].openSite"></a></td>
                </g:if>
                <td>
                    <div data-bind="template:$root.canUpdateStatus() ? 'updateStatusTmpl' : 'viewStatusTmpl'"></div>
                </td>
            </tr>
            </tbody>
            <!-- /ko -->
        </table>
    </div>
    <div id="gantt-container" data-bind="visible: currentStep() != 2"></div>

    <form id="outputTargetsContainer" data-bind="visible: currentStep() >= 2">
        <h4>Output Targets</h4>
        <table id="outputTargets" class="table table-condensed">
            <thead><tr><th>Output Type</th><th>Output</th><th>Target</th></tr></thead>
            <tbody data-bind="foreach:outputTargets">
            <tr>
                <td data-bind="text:outputLabel"></td>
                <td data-bind="text:scoreLabel"></td>
                <td>
                    <input type="text" class="input-small" data-bind="visible:$root.currentStep() == 2,value:target" data-validation-engine="validate[required,custom[number]]"/><span data-bind="visible:$root.currentStep()>2,text:target"></span> <span data-bind="text:units"></span>
                </td>
            </tr>

            </tbody>
        </table>

    </form>
</div>

<script id="updateStatusTmpl" type="text/html">
    <div class="btn-group">
    <button type="button" class="btn btn-small dropdown-toggle" data-toggle="dropdown"
            data-bind="css: {'btn-warning':progress()=='planned','btn-success':progress()=='started','btn-info':progress()=='finished','btn-danger':progress()=='deferred','btn-inverse':progress()=='cancelled'}"
            style="line-height:16px;min-width:86px;text-align:left;">
        <span data-bind="text: progress"></span> <span class="caret pull-right" style="margin-top:6px;"></span>
    </button>
    <ul class="dropdown-menu" data-bind="foreach:$root.progressOptions" style="min-width:100px;">
        <!-- Disable item if selected -->
        <li data-bind="css: {'disabled' : $data==$parent.progress()}">
            <a href="#" data-bind="click: $parent.progress"><span data-bind="text: $data"></span></a>
        </li>
    </ul></div>
    <span data-bind="visible:isSaving"><r:img dir="images" file="ajax-saver.gif"/> saving</span>
</script>

<script id="viewStatusTmpl" type="text/html">
    <button type="button" class="btn btn-small"
            data-bind="css: {'btn-warning':progress()=='planned','btn-success':progress()=='started','btn-info':progress()=='finished','btn-danger':progress()=='deferred','btn-inverse':progress()=='cancelled'}"
            style="line-height:16px;min-width:75px;text-align:left;cursor:default;color:white">
        <span data-bind="text: progress"></span>
    </button>
</script>

<!-- /ko -->
<r:script>

    var sites = ${sites ?: []};
    function lookupSiteName (siteId) {
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
    }

    $(window).load(function () {

        var PlannedActivity = function (act, isFirst) {
            var self = this;
            this.activityId = act.activityId;
            this.isFirst = isFirst ? this : undefined;
            this.siteId = act.siteId;
            this.siteName = lookupSiteName(act.siteId);
            this.type = act.type;
            this.projectStage = act.projectStage;
            this.description = act.description;
            this.startDate = ko.observable(act.startDate).extend({simpleDate:false});
            this.endDate = ko.observable(act.endDate).extend({simpleDate:false});
            this.plannedStartDate = ko.observable(act.plannedStartDate).extend({simpleDate:false});
            this.plannedEndDate = ko.observable(act.plannedEndDate).extend({simpleDate:false});
            this.progress = ko.observable(act.progress);
            this.isSaving = ko.observable(false);
            // save progress updates as soon as they happen
            this.progress.subscribe(function (newValue) {
                var payload = {progress: newValue, activityId: self.activityId};
                self.isSaving(true);
                // save new status
                $.ajax({
                    url: "${createLink(controller:'activity', action:'ajaxUpdate')}/" + self.activityId,
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
                        self.isSaving(false);
                    }
                });
            });
            this.del = function () {
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
            };
        };

        var PlanStage = function (stageLabel, activities, isCurrentStage) {
            // Note that the two $ transforms used to extract activities are not combined because we
            // want the index of the PlannedActivity to be relative to the filtered set of activities.
            var self = this,
                activitiesInThisStage = $.grep(activities, function (act, index) {
                    return act.projectStage === stageLabel;
                });
            this.label = stageLabel;
            this.isCurrentStage = isCurrentStage;
            this.activities = $.map(activitiesInThisStage, function (act, index) {
                return new PlannedActivity(act, index === 0);
            });
            this.readyForApproval = ko.computed(function() {
                return self.isCurrentStage ?
                    $.grep(self.activities, function (act, i) {
                        return !(act.progress() === 'finished' || act.progress() === 'deferred');
                    }).length === 0 :
                    false;
            }, this, {deferEvaluation: true});
            this.approveStage = function () {

            };
        };

        var outputTarget = function(target) {
            return {
                outputLabel:target.outputLabel,
                scoreName:target.scoreName,
                scoreLabel:target.scoreLabel,
                target:ko.observable(target.value),
                units:target.units
            };
        };

        function PlanViewModel(activities, outputTargets, project) {
            var self = this;
            this.currentStep = ko.observable(project.currentStep === undefined ? 1 : project.currentStep);
            this.canEditActivity = ko.computed(function () {
                return self.currentStep() === 5;
            });
            this.canPrintActivity = ko.computed(function () {
                return true;
            });
            this.canDeleteActivity = ko.computed(function () {
                return self.currentStep() === 1;
            });
            this.canUpdateStatus = ko.computed(function () {
                return self.currentStep() === 5;
            });
            this.currentDate = ko.observable(); // mechanism for testing behaviour at different dates
            this.currentProjectStage = project.currentStage === undefined ? 'Stage 1' : project.currentStage;
            this.loadActivities = function (activities) {
                var stages = [],
                    stageLabels = [];

                // sort activities list first so we can group by project stage
                activities.sort(function (a,b) {
                    if (a.projectStage > b.projectStage)
                      return 1;
                    if (a.projectStage < b.projectStage)
                      return -1;
                    return 0;
                });

                // get unique stage labels
                $.each(activities, function(idx, act) {
                    if ($.inArray(act.projectStage, stageLabels) == -1) {
                        stageLabels.push(act.projectStage);
                    }
                });

                // group activities by stage
                $.each(stageLabels, function (index, label) {
                    stages.push(new PlanStage(label, activities, label === self.currentProjectStage));
                });

                return stages;
            };
            self.stages = self.loadActivities(activities);
            self.currentStageReadyForApproval = ko.computed(function () {
                var currPlanStage = $.grep(self.stages, function(stage) {
                    return stage.label === self.currentProjectStage;
                });
                return currPlanStage.length > 0 ? currPlanStage[0].readyForApproval() : false;
            });
            self.progressOptions = ['planned','started','finished','deferred','cancelled'];
            self.newActivity = function () {
                var context = '',
                    projectId = project.projectId,
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
            self.editActivity = function (activity) {
                if (self.canEditActivity()) {
                    document.location.href = fcConfig.activityEditUrl + "/" + activity.activityId +
                        "?returnTo=" + here;
                }
            };
            self.printActivity = function(activity) {
                open(fcConfig.activityPrintUrl + "/" + activity.activityId, "fieldDataPrintWindow");
            };
            self.nextStep = function () {
                self.currentStep(self.currentStep() + 1);
            };
            self.backtrack = function (data, event) {
                var currentStep = $(event.currentTarget).attr('data-target'),
                    stepNumber = Number(currentStep.substring(currentStep.length-1));
                if (stepNumber < self.currentStep()) {
                    self.currentStep(stepNumber);
                }
            };
            // save step updates as they happen
            this.currentStep.subscribe(function (newValue) {
                var payload = {currentStep: newValue, projectId: project.projectId};
                // save new status
                $.ajax({
                    url: "${createLink(action:'ajaxUpdate')}/" + project.projectId,
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
                    }
                });

            });
            self.getGanttData = function () {
                var values = [],
                    previousStage = '',
                    hasAnyValidPlannedEndDate = false;
                $.each(self.stages, function (i, stage) {
                    $.each(stage.activities, function (j, act) {
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
                        hasAnyValidPlannedEndDate |= !isNaN(endDate);
                        previousStage = act.projectStage;
                    });
                });
                // don't return any data if there is no valid end date because the lib will throw an error
                return hasAnyValidPlannedEndDate ? values : [];
            };
            self.outputTargets = ko.observableArray([]);
            self.addOutputTarget = function(target) {
                self.outputTargets.push(outputTarget(target));
            };
            self.activityScores = ${activityScores as grails.converters.JSON};

            self.saveOutputTargets = function() {
                outputTargetsViewModel.save();
                self.nextStep();
            };

            self.hasOutputTarget = function(score) {
                var hasTarget = false;
                $.each(self.outputTargets(), function(i, target) {
                    if (score.outputName === target.outputLabel && score.name === target.scoreName) {
                        hasTarget = true;
                        return false;
                    }
                });
                return hasTarget;
            };

            self.loadOutputTargets = function() {
                var activityTypes = {};
                $.each(activities, function(i, activity) {

                    if (!activityTypes[activity.type] && self.activityScores[activity.type]) {
                        activityTypes[activity.type] = true;

                        $.each(self.activityScores[activity.type], function(j, score) {
                            if (!self.hasOutputTarget(score)) {
                                if (score.aggregationType === 'SUM' || score.aggregationType === 'AVERAGE') {
                                    self.addOutputTarget({units: score.units, outputLabel:score.outputName, scoreName:score.name, scoreLabel:score.label, value:0});
                                }
                            }
                        });
                    }

                });

                // Populate the target score for each target that we already have defined.
                $.each(self.outputTargets(), function(i, outputTarget) {
                    $.each(outputTargets, function(j, existingTarget) {
                        if (existingTarget.scoreName === outputTarget.scoreName) {
                            outputTarget.target(existingTarget.target);
                        }
                    });

                });
            };
            self.loadOutputTargets();

            self.saveOutputTargets = function() {
                if ($('#outputTargetsContainer').validationEngine('validate')) {
                    var project = {projectId:'${project.projectId}', outputTargets:ko.toJS(self.outputTargets)};
                    var json = JSON.stringify(project);
                    var id = "${'/' + project.projectId}";
                    $.ajax({
                        url: "${createLink(action: 'ajaxUpdate')}" + id,
                        type: 'POST',
                        data: json,
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.error) {
                                alert(data.detail + ' \n' + data.error);
                            }
                            else {
                                self.nextStep();
                            }
                        },
                        error: function (data) {
                            var status = data.status;
                            alert('An unhandled error occurred: ' + data.status);
                        }
                    });
                }
            };

        }

        var planViewModel = new PlanViewModel(${activities ?: []}, ${project.outputTargets ?: '{}'},${project});
        ko.applyBindings(planViewModel, document.getElementById('planContainer'));

        var ganttData = planViewModel.getGanttData();
        if (ganttData.length > 0) {
            $("#gantt-container").gantt({
                source: ganttData,
                navigate: "scroll",
                scale: "weeks",
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
        }
        $('#outputTargetsContainer').validationEngine('attach', {scroll:false});

    });

</r:script>
