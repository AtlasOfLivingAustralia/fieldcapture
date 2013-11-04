<r:require modules="datepicker, jqueryGantt, jqueryValidationEngine"/>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid" id="planContainer">
    <div class="actions row-fluid" data-bind="template:planStatusTemplateName">
    </div>
    <div id="activityContainer" class="space-before">
        <h4 class="inline">Planned Activities</h4>
        <i class="icon-lock" data-bind="visible:planStatus()==='submitted'"
            title="Plan cannot be modified once it has been submitted for approval"></i>
        <button type="button" class="btn btn-link" data-bind="visible:planStatus()==='not approved',click:newActivity" style="vertical-align: baseline"><i class="icon-plus"></i> Add new activity</button>
        <span class="pull-right">
            <label class="checkbox inline" style="font-size:0.8em;">
                <input data-bind="checked:userIsCaseManager" type="checkbox"> Impersonate case manager
            </label>
        </span>

        <ul class="nav nav-tabs nav-tab-small space-before">
            <li class="active"><a href="#tablePlan" data-toggle="tab">Tabular</a></li>
            <li><a href="#ganttPlan" data-toggle="tab">Gantt chart</a></li>
        </ul>

        <div class="tab-content" style="padding:0;border:none;overflow:visible">
            <div class="tab-pane active" id="tablePlan">
                <table class="table table-condensed" id="activities">
                    <thead>
                    <tr data-bind="visible: stages.length > 0">
                        <th>Stage</th>
                        <th style="width:50px;">Actions</th>
                        <th style="min-width:64px">From</th>
                        <th style="min-width:64px">To</th>
                        <th>Activity</th>
                        <th style="width:20%;" id="description-column">Description</th>
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
                            <span data-bind="text:$parents[1].label%{--, blah:console.log(ko.toJS($data))--}%"></span>
                            <br data-bind="visible:$parents[1].isCurrentStage">
                            <span data-bind="visible:$parents[1].isCurrentStage" class="badge badge-info">Current stage</span>
                            <br data-bind="visible:$parents[1].isCurrentStage && $parents[2].isApproved()">
                            <button type="button" class="btn btn-success btn-small" style="margin-top:4px;"
                              data-bind="visible:$parents[1].isCurrentStage && $parents[2].isApproved(),disable:!$parents[1].readyForApproval()"
                              title="Submit this stage for implementation approval.">Submit report</button>
                        </td>
                        <!-- /ko -->
                        <td>
                            <button type="button" class="btn btn-container" data-bind="click:$root.editActivity, enable:$root.canEditActivity()||$root.canEditOutputData()"><i class="icon-edit" title="Edit Activity"></i></button>
                            <button type="button" class="btn btn-container" data-bind="click:$root.printActivity, enable:$root.canPrintActivity"><i class="icon-print" title="Print activity"></i></button>
                            <button type="button" class="btn btn-container" data-bind="click:del, enable:$root.canDeleteActivity"><i class="icon-remove" title="Delete activity"></i></button>
                        </td>
                        <td><span data-bind="text:plannedStartDate.formattedDate"></span></td>
                        <td><span data-bind="text:plannedEndDate.formattedDate"></span></td>
                        <td>
                            <span data-bind="text:type,click:$root.editActivity, css:{clickable:$root.canEditActivity}"></span>
                        </td>
                        <td>
                            <span class="truncate" data-bind="text:description"></span>
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
            <div class="tab-pane" id="ganttPlan" style="overflow:hidden;">
                <div id="gantt-container"></div>
            </div>
        </div>
    </div>

    <form id="outputTargetsContainer">
        <h4>Output Targets</h4>
        <table id="outputTargets" class="table table-condensed">
            <thead><tr><th>Output Type</th><th>Output</th><th>Target</th></tr></thead>
            <tbody data-bind="foreach:outputTargets">
            <tr>
                <td data-bind="text:outputLabel"></td>
                <td data-bind="text:scoreLabel"></td>
                <td>
                    <input type="text" class="input-small" data-bind="visible:$root.planStatus()==='not approved',value:target" data-validation-engine="validate[required,custom[number]]"/>
                    <span data-bind="visible:$root.planStatus()!=='not approved',text:target"></span>
                    <span data-bind="text:units"></span>
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
        <li data-bind="css: {'disabled' : $data==$parent.progress() || $data=='planned'}">
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

<script id="planningTmpl" type="text/html">
    <span class="span3">
        <span class="badge badge-warning" style="font-size:13px;">This plan is not yet approved</span>
    </span>
    <span class="span9">
        Build your plan by adding activities and entering project targets. Submit your plan when it is built.
        <button type="button" data-bind="click:submitPlan" class="btn btn-success"><i class="icon-thumbs-up icon-white"></i> Submit plan</button>
    </span>
</script>

<script id="submittedTmpl" type="text/html">
    <span class="span4">
        <span class="badge badge-info" style="font-size:13px;">This plan has been submitted for approval</span>
    </span>
    <span data-bind="visible:!userIsCaseManager()" class="span8">
        <span>Your plan is locked until it is approved by your case manager. Once your plan is approved
        you can start entering activity information.</span>
    </span>
    <span data-bind="visible:userIsCaseManager" class="span8">
        <span>Case manager actions: </span>
        <span class="btn-group">
            <button type="button" data-bind="click:approvePlan" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve plan</button>
            <button type="button" data-bind="click:rejectPlan" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject plan</button>
        </span>
    </span>
</script>

<script id="approvedTmpl" type="text/html">
    <span class="span3">
        <span class="badge badge-success" style="font-size:13px;">This plan has been approved</span>
    </span>
    <span data-bind="visible:!userIsCaseManager()" class="span9">
        <span>Enter information into each activity. When all activities in a stage are finished (or
         cancelled or deferred) you can submit the stage for validation by clicking the 'report' button.</span>
    </span>
    <span data-bind="visible:userIsCaseManager" class="span8">
        <span>Case manager actions: </span>
        <span class="btn-group">
            <button type="button" data-bind="click:rejectPlan" class="btn btn-info" title="Allow the user to vary and re-submit the plan">
                <i class="icon-repeat icon-white"></i> Modify plan
            </button>
        </span>
    </span>
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

    function drawGanttChart(ganttData) {
        if (ganttData.length > 0) {
            $("#gantt-container").gantt({
                source: ganttData,
                navigate: "keys",
                scale: "weeks",
                itemsPerPage: 30,
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
                        drawGanttChart(planViewModel.getGanttData());
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

        var PlanStage = function (stageLabel, activities, isCurrentStage, timeline) {
            // Note that the two $ transforms used to extract activities are not combined because we
            // want the index of the PlannedActivity to be relative to the filtered set of activities.
            var self = this,
                activitiesInThisStage = $.grep(activities, function (act, index) {
                    return findStageFromDate(timeline, act.plannedEndDate) === stageLabel;
                });
            this.label = stageLabel;
            this.isCurrentStage = isCurrentStage;
            // sort activities by planned start date
            activitiesInThisStage.sort(function (a,b) {
                return a.plannedStartDate > b.plannedStartDate;
            });
            this.activities = $.map(activitiesInThisStage, function (act, index) {
                act.projectStage = stageLabel;
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
            this.userIsCaseManager = ko.observable(${user.isAdmin});
            this.planStatus = ko.observable(project.planStatus || 'not approved');
            this.planStatusTemplateName = ko.computed(function () {
                return self.planStatus() === 'not approved' ? 'planningTmpl' : self.planStatus() + 'Tmpl';
            });
            this.isApproved = ko.computed(function () {
                return (self.planStatus() === 'approved');
            });
            this.currentStep = ko.observable(project.currentStep === undefined ? 1 : project.currentStep);
            this.canEditActivity = ko.computed(function () {
                return self.planStatus() === 'not approved';
            });
            this.canEditOutputData = ko.computed(function () {
                return self.planStatus() === 'approved';
            });
            this.canPrintActivity = ko.computed(function () {
                return true;
            });
            this.canDeleteActivity = ko.computed(function () {
                return self.planStatus() === 'not approved';
            });
            this.canUpdateStatus = ko.computed(function () {
                return self.planStatus() === 'approved';
            });
            //this.currentDate = ko.observable("2014-02-03T00:00:00Z"); // mechanism for testing behaviour at different dates
            this.currentDate = ko.observable(new Date().toISOStringNoMillis()); // mechanism for testing behaviour at different dates
            this.currentProjectStage = findStageFromDate(project.timeline,this.currentDate());
            this.loadActivities = function (activities) {
                var stages = [];

                // group activities by stage
                $.each(project.timeline, function (index, stage) {
                    stages.push(new PlanStage(stage.name, activities, stage.name === self.currentProjectStage, project.timeline));
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
                var url;
                if (self.canEditOutputData()) {
                    url = fcConfig.activityEnterDataUrl;
                    document.location.href = url + "/" + activity.activityId +
                        "?returnTo=" + here;
                } else if (self.canEditActivity) {
                    url = fcConfig.activityEditUrl;
                    document.location.href = url + "/" + activity.activityId +
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
            // save plan status updates as they happen
            this.planStatus.subscribe(function (newValue) {
                var payload = {planStatus: newValue, projectId: project.projectId};
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
            this.submitPlan = function () {
                self.planStatus('submitted');
            };
            this.approvePlan = function () {
                self.planStatus('approved');
            };
            this.rejectPlan = function () {
                self.planStatus('not approved');
            };
            this.getGanttData = function () {
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
            self.addOutputTarget = function(target) {
                var newOutputTarget = outputTarget(target);
                self.outputTargets.push(newOutputTarget);
                newOutputTarget.target.subscribe(function() {self.saveOutputTargets();});
            };
            self.activityScores = ${activityScores as grails.converters.JSON};

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



        }

        var planViewModel = new PlanViewModel(
            ${activities ?: []},
            ${project.outputTargets ?: '{}'},
            checkAndUpdateProject(${project})
        );
        ko.applyBindings(planViewModel, document.getElementById('planContainer'));

        // the following code handles resize-sensitive truncation of the description field
        $.fn.textWidth = function(text, font) {
            if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
            $.fn.textWidth.fakeEl.html(text || this.val() || this.text()).css('font', font || this.css('font'));
            return $.fn.textWidth.fakeEl.width();
        };

        function adjustTruncations () {
            function truncate (cellWidth, originalTextWidth, originalText) {
                var fractionThatFits = cellWidth/originalTextWidth,
                    truncationPoint = Math.floor(originalText.length * fractionThatFits) - 4;
                return originalText.substr(0,truncationPoint) + '..';
            }
            $('.truncate').each( function () {
                var $span = $(this),
                    text = $span.html(),
                    textWidth = $span.textWidth(),
                    textLength = text.length,
                    original = $span.data('truncation');
                // store original values if first time in
                if (original === undefined) {
                    original = {
                        text: text,
                        textWidth: textWidth,
                        textLength: textLength
                    };
                    $span.data('truncation',original);
                }
                var cellWidth = $span.parent().width(),
                    isTruncated = original.text !== text;
                if (cellWidth > 0 && textWidth > cellWidth) {
                    $span.attr('title',original.text);
                    $span.html(truncate(cellWidth, original.textWidth, original.text));
                } else if (isTruncated && cellWidth > textWidth + 4) {
                    // check whether the text can be fully expanded
                    if (original.textWidth < cellWidth) {
                        $span.html(original.text);
                        $span.removeAttr('title');
                    } else {
                        $span.html(truncate(cellWidth, original.textWidth, original.text));
                    }
                }
            });
        }

        // throttle the resize events so it doesn't go crazy
        (function() {
             var timer;
             $(window).resize(function () {
                 if(timer) {
                     clearTimeout(timer);
                 }
                 timer = setTimeout(adjustTruncations, 50);
             });
        }());

        // only initialise truncation when the table is visible else we will get 0 widths
        $(document).on('planTabShown', function () {
            // initial adjustments
            adjustTruncations();
        });

        // the following draws the gantt chart
        drawGanttChart(planViewModel.getGanttData());

        $('#outputTargetsContainer').validationEngine('attach', {scroll:false});

    });

</r:script>
