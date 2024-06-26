<%@ page import="grails.converters.JSON" %>
<style type="text/css">
    .disabled {
        opacity: 0.5;
    }
</style>
<div class="row title-block well well-small input-block-level">
    <div class="col-sm-10 title-attribute">
        <h1><span data-bind="click:goToProject" class="clickable">${project?.name?.encodeAsHTML() ?: 'no project defined!!'}</span></h1>
        <g:if test="${hasPhotopointData}">
            <div class="row"  style="margin-bottom: 10px;">
                <span class="alert alert-warning">
                    This activity has photo point data recorded.  The site can only be changed on the full activity data entry page.
                </span>
            </div>
            <h2><span class="col-sm-10" data-bind="click:goToSite" class="clickable">Site: ${site.name?.encodeAsHTML()}</span></h2>

        </g:if>
        <g:else>
            <div class="row">
                <div class="col-sm-4">
                    <select data-bind="options:transients.project.sites,optionsText:'name',optionsValue:'siteId',value:siteId,optionsCaption:'Choose a site...'" class="form-control form-control-sm"></select>
                </div>
                <div class="col-sm-3">
                    <p>Leave blank if this activity is not associated with a specific site.</p>
                </div>
            </div>


        </g:else>
        <h3 data-bind="css:{modified:dirtyFlag.isDirty},attr:{title:'Has been modified'}">Activity: <span data-bind="text:type"></span><span class="titleModified"><i class="fa fa-asterisk" data-bind="visible:dirtyFlag.isDirty" title="Has been modified"></i></h3></span>
        <h4><span>${project.associatedProgram?.encodeAsHTML()}</span> <span>${project.associatedSubProgram?.encodeAsHTML()}</span></h4>
    </div>
</div>

<div class="row">
    <div class="col-sm-9">
        <!-- Common activity fields -->
        <div class="row" data-bind="visible:transients.typeWarning()" style="display:none">
            <div class="alert alert-danger">
                <strong>Warning!</strong> This activity has data recorded.  Changing the type of the activity will cause this data to be lost!
            </div>
        </div>
        <div class="row" data-bind="visible:transients.targetsWarning()" style="display:none">
        <div class="alert alert-danger">
            <strong>Warning!</strong> There are output targets defined that require activities of this type.  Changing the type of this activity will cause the targets to be deleted!
        </div>
    </div>


        <div class="row">
            <div class="col-sm-6">
                <label for="type">Type of activity</label>
                <select data-bind="value: type, popover:{title:'', content:transients.activityDescription, trigger:'manual', autoShow:true}" id="type" data-validation-engine="validate[required]" class="form-control form-control-sm">
                    <g:each in="${activityTypes}" var="t" status="i">
                        <g:if test="${i == 0 && create}">
                            <option></option>
                        </g:if>
                        <optgroup label="${t.name}">
                            <g:each in="${t.list}" var="opt">
                                <option>${opt.name}</option>
                            </g:each>
                        </optgroup>
                    </g:each>
                </select>
            </div>
            <div class="col-sm-6">
                <label for="theme">Major theme</label>
                <select id="theme" data-bind="value:mainTheme, options:transients.themes, optionsCaption:'Choose..'" class="form-control form-control-sm"></select>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12 p-3">
                <fc:textArea data-bind="value: description" id="description" label="Description" class="form-control form-control-sm" rows="2" />
            </div>
        </div>

        <div class="row">
            <div class="col-sm-4">
                <label for="stage">Stage
                <fc:iconHelp title="Stage" printable="${printView}">The stage the activity falls into</fc:iconHelp>
                </label>
                <select id="stage" data-bind="options:transients.stages,value:projectStage" class="form-control form-control-sm"></select>
            </div>
            <div class="col-sm-4">
                <label for="plannedStartDate">Planned start date
                <fc:iconHelp title="Planned start date" printable="${printView}">Date the activity is intended to start.</fc:iconHelp>
                </label>
                <div class="input-group">
                    <fc:datePicker targetField="plannedStartDate.date" class="form-control form-control-sm" bs4="true" name="plannedStartDate" data-validation-engine="validate[required,future[${earliestStartDate}]]" printable="${printView}" autocomplete="off"/>
                </div>
            </div>
            <div class="col-sm-4">
                <label for="plannedEndDate">Planned end date
                <fc:iconHelp title="Planned end date" printable="${printView}">Date the activity is intended to finish.</fc:iconHelp>
                </label>
                <div class="input-group">
                    <fc:datePicker targetField="plannedEndDate.date" class="form-control form-control-sm" bs4="true" name="plannedEndDate" data-validation-engine="validate[required,future[plannedStartDate],funcCall[validateEndDate]]" printable="${printView}" autocomplete="off"/>
                </div>
            </div>
        </div>

        <!-- ko if:!activityId -->
        <hr/>

        <h4>Create a duplicate of this activity in other stages</h4>
        <div class="row">
            <div class="col-sm-10">
                <label for="stage">Stage(s)
                <fc:iconHelp title="Stage" printable="${printView}">For each stage selected, a new activity will be created.  All details (including the site) except the stage dates will be duplicated in each activity.</fc:iconHelp>
                </label>
                <ul class="list-unstyled" data-bind="foreach: transients.stages">
                    <!-- ko if:$data -->
                    <li>
                        <label class="checkbox" style="display:inline-block;" data-bind="css:{'disabled':$parent.projectStage() == $data}">
                            <input type="checkbox" class="checkbox" data-bind="attr: { value: $data }, checked: $parent.duplicateStages, enable: $data != $parent.projectStage()" data-validation-engine="min"/>
                            <span data-bind="text: $data"></span>
                        </label>
                    </li>
                    <!-- /ko -->
                </ul>

            </div>



        </div>
        <!-- /ko -->
    </div>
    <div class="col-sm-3">
        <div id="smallMap" class="w-100"></div>
    </div>

</div>

<g:if test="${!printView}">
    <div class="form-actions">
        <button type="button" id="save" class="btn btn-sm btn-primary" data-bind="click:save">Save changes</button>
        <button type="button" id="cancel" class="btn btn-sm btn-danger" data-bind="click:cancel">Cancel</button>
    </div>
</g:if>

<!-- templates -->
<g:render template="/shared/timeoutMessage" model="${[url:fc.loginUrl(loginReturnToUrl:createLink(action:'edit', id:activity.activityId, absolute: true))]}"/>

<asset:script>

    var returnTo = "${returnTo}";

    $(function(){

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        let ACTIVITY_STORAGE_KEY = 'activity-${activity.activityId}';

        function ViewModel (act, site, project, activityTypes, themes, targetMetadata) {
            var self = this;

            self.activityId = act.activityId;
            self.description = ko.observable(act.description);
            self.notes = ko.observable(act.notes);
            self.startDate = ko.observable(act.startDate).extend({simpleDate: false});
            self.endDate = ko.observable(act.endDate || act.plannedEndDate).extend({simpleDate: false});
            self.plannedStartDate = ko.observable(act.plannedStartDate).extend({simpleDate: false});
            self.plannedEndDate = ko.observable(act.plannedEndDate).extend({simpleDate: false});
            self.eventPurpose = ko.observable(act.eventPurpose);
            self.associatedProgram = ko.observable(act.associatedProgram);
            self.associatedSubProgram = ko.observable(act.associatedSubProgram);
            self.projectStage = ko.observable(act.projectStage || "");
            self.progress = ko.observable(act.progress || 'started');
            self.mainTheme = ko.observable(act.mainTheme);
            self.type = ko.observable(act.type);
            self.siteId = ko.observable(act.siteId);
            self.projectId = act.projectId;
            self.duplicateStages = ko.observableArray();
            self.transients = {};
            self.transients.site = ko.observable(site);
            self.transients.project = project;
            self.transients.themes = $.map(themes, function (obj, i) { return obj.name });
            self.transients.targetsWarning = ko.computed(function() {
                if (self.type() === act.type || !act.type) {
                    return false;
                }
                var outputTargets = new OutputTargets(project.activities || [], project.outputTargets, false, targetMetadata, {saveOutputTargetsUrl:fcConfig.saveOuputTargetsUrl});

                return !outputTargets.safeToRemove(act.type);
            });
            self.transients.typeWarning = ko.computed(function() {
                if (act.outputs === undefined || act.outputs.length === 0) {
                    return false;
                }
                if (!self.type()) {
                    return false;
                }
                return (self.type() !== act.type);
            });

            self.transients.activityDescription = ko.computed(function() {
                var result = "";
                if (self.type()) {
                    $.each(activityTypes, function(i, obj) {
                        $.each(obj.list, function(j, type) {
                            if (type.name === self.type()) {
                                result = type.description;
                                return false;
                            }
                        });
                        if (result) {
                            return false;
                        }
                    });
                }
                return result;
            });
            self.transients.stages = [''];
            $.each(project.reports, function(i, report) {
                if (!report.publicationStatus || report.publicationStatus === 'unpublished') {
                    self.transients.stages.push(report.name);
                }
            });

            self.siteId = ko.observable();

            self.siteId.subscribe(function(siteId) {

                var matchingSite = $.grep(self.transients.project.sites, function(site) { return siteId == site.siteId})[0];

                if (matchingSite) {

                    alaMap.clearFeatures();
                    alaMap.replaceAllFeatures([matchingSite.extent.geometry]);
                }
                else {
                    alaMap.clearFeatures();
                }
                self.transients.site(matchingSite);
            });

            self.goToProject = function () {
                if (self.projectId) {
                    document.location.href = fcConfig.projectViewUrl + self.projectId;
                }
            };
            self.goToSite = function () {
               if (self.siteId()) {
                    var url = fcConfig.siteViewUrl + self.siteId();
                    if (self.projectId) {
                        url += '?projectId='+self.projectId;
                    }
                    document.location.href = url;
                }
            };
            self.modelForSaving = function () {
                // get model as a plain javascript object
                var jsData = ko.toJS(self);
                delete jsData.transients;
                // If we leave the site or theme undefined, it will be ignored during JSON serialisation and hence
                // will not overwrite the current value on the server.
                var possiblyUndefinedProperties = ['siteId', 'mainTheme'];

                $.each(possiblyUndefinedProperties, function(i, propertyName) {
                    if (jsData[propertyName] === undefined) {
                        jsData[propertyName] = '';
                    }
                });

                // reset the progress to planned if the activity type is changed.
                if (self.transients.typeWarning()) {
                    jsData.progress = 'planned';
                }
                return jsData;
            };
            self.modelAsJSON = function () {
                return JSON.stringify(self.modelForSaving());
            };

            self.save = function (callback, key) {
            };

            if(amplify.store(ACTIVITY_STORAGE_KEY)) {
                self.dirtyFlag = ko.dirtyFlag(self, true);
           } else {
                self.dirtyFlag = ko.dirtyFlag(self, false);
            }

            var ignoreStageChanges = false;
            self.projectStage.subscribe(function(newStage) {
                if (!ignoreStageChanges) {
                    ignoreStageChanges = true;

                    var matchingStage = $.grep(project.reports, function(report) {
                        return report.name == newStage;
                    })[0];

                    if (matchingStage) {
                        self.plannedStartDate(matchingStage.fromDate);
                        if (matchingStage.toDate > project.plannedEndDate) {
                            self.plannedEndDate(project.plannedEndDate);
                        }
                        else {
                            var endDate = moment(matchingStage.toDate).subtract(1, 'days');
                            self.plannedEndDate(endDate.toDate().toISOStringNoMillis());
                        }
                        var index = self.duplicateStages.indexOf(newStage);
                        if (index >= 0) {
                            self.duplicateStages.splice(index, 1);
                        }
                    }

                    ignoreStageChanges = false;
                }
            });

            function findStage(endDate) {
                var matchingStage = $.grep(project.reports, function(report) {
                    return report.fromDate < endDate && report.toDate >= endDate;
                })[0];
                return matchingStage;
            }

            self.plannedEndDate.subscribe(function(newEndDate) {
                if (!ignoreStageChanges) {
                    ignoreStageChanges = true;

                    var matchingStage = findStage(newEndDate);

                    if (matchingStage) {
                        self.projectStage(matchingStage.name);
                    }

                    ignoreStageChanges = false;
                }
            });

            /** Used by the jQueryValidationEngine */
            self.validatePlannedEndDate = function() {
                var endDate = self.plannedEndDate();
                if (endDate > project.plannedEndDate) {
                    return "The activity cannot end after the project end date";
                }
                if (endDate < project.plannedStartDate) {
                    return "The activity cannot end before the project start date";
                }

                var activityStage = findStage(endDate);
                if (activityStage && activityStage.publicationStatus == 'published' || activityStage.publicationStatus == 'pendingApproval') {
                    return "The activity end date cannot fall into a submitted or approved stage";
                }
                return undefined; // This is how a successful validation is flagged.
            };

            /**
             * Makes an ajax call to save any sections that have been modified. This includes the activity
             * itself and each output.
             *
             * Modified outputs are injected as a list into the activity object. If there is nothing to save
             * in the activity itself, then the root is an object that is empty except for the outputs list.
             *
             * NOTE that the model for each section must register itself to be included in this save.
             *
             * Validates the entire page before saving.
             */
            self.save = function () {

                if ($('#validation-container').validationEngine('validate')) {

                    if (!self.dirtyFlag.isDirty()) {
                        alert("Nothing to save.");
                        return;
                    }

                    var activityData = self.modelAsJSON();
                    blockUIWithMessage("Saving activity data...");
                    $.ajax({
                        url: "${createLink(action: 'ajaxUpdate', id: activity.activityId)}",
                        type: 'POST',
                        data: activityData,
                        contentType: 'application/json',
                        success: function (data) {
                            var errorText = "";
                            if (data.errors) {
                                errorText = "<span class='label label-important'>Important</span><h4>There was an error while trying to save your changes.</h4>";
                                $.each(data.errors, function (i, error) {
                                    errorText += "<p>Saving <b>" +
                                    (error.name === 'activity' ? 'the activity context' : error.name) +
                                    "</b> threw the following error:<br><blockquote>" + error.error + "</blockquote></p>";
                                });
                                errorText += "<p>Any other changes should have been saved.</p>";
                                bootbox.alert(errorText);
                            } else {

                                if (act.type && act.type != self.type()) {
                                    var outputTargets = new OutputTargets(project.activities || [], project.outputTargets, false, targetMetadata, {saveTargetsUrl:fcConfig.saveOuputTargetsUrl});
                                    if (outputTargets.onlyActivityOfType(act.type)) {
                                        outputTargets.removeTargetsAssociatedWithActivityType(act.type);
                                        var result = outputTargets.saveOutputTargets();
                                        if (result) {
                                            result.always(function() {
                                                self.saved();
                                            });
                                        }
                                        else {
                                            self.saved();
                                        }
                                    }
                                    else {
                                        self.saved();
                                    }
                                }
                                else {
                                    self.saved();
                                }
                            }
                        },
                        error: function (data) {
                            var status = data.status;
                            let toSave = JSON.stringify(activityData)
                            amplify.store(ACTIVITY_STORAGE_KEY, toSave);
                            $('#logout-warning').show();
                            var unloadHandler = window.onbeforeunload;
                            window.onbeforeunload = null;
                            bootbox.alert($("#timeoutMessage").html(),
                                function() {
                                    window.onbeforeunload = unloadHandler;
                            });
                        }
                    });
                }

            };
            self.saved = function () {
                amplify.store(ACTIVITY_STORAGE_KEY, null)
                document.location.href = returnTo;
            };

            self.cancel = function() {
                amplify.store(ACTIVITY_STORAGE_KEY, null)
                document.location.href = returnTo;
            };
        };

        var activity;
        if(amplify.store(ACTIVITY_STORAGE_KEY)) {
            let localSavedActivity = amplify.store(ACTIVITY_STORAGE_KEY)
            let restored =  JSON.parse(localSavedActivity)
            activity = JSON.parse(restored); // this parse will converted into JSON object
            bootbox.alert("Unsaved data has been found for this form.  Please press 'Save' to keep this data or 'Cancel' to discard it");
        }else {
            activity = <fc:modelAsJavascript model="${activity ?: [:]}"/>;
        };

        var viewModel = new ViewModel(
    activity,
    <fc:modelAsJavascript model="${site ?: null}"/>,
    <fc:modelAsJavascript model="${project?: null}"/>,
    <fc:modelAsJavascript model="${activityTypes}"/>,
    <fc:modelAsJavascript model="${themes ?: null}"/>,
    <fc:modelAsJavascript model="${outputTargetMetadata ?: [:]}"/>);

        var mapFeatures = $.parseJSON('${mapFeatures?mapFeatures.encodeAsJavaScript():"{}"}');

        if (!mapFeatures) {
            mapFeatures = {zoomToBounds: true, zoomLimit: 15, highlightOnHover: true, features: []};
        }

        init_map_with_features({
                mapContainer: "smallMap",
                zoomToBounds:true,
                zoomLimit:16,
                featureService: "${createLink(controller: 'proxy', action:'feature')}",
                wmsServer: "${grailsApplication.config.getProperty('spatial.geoserverUrl')}",
                polygonMarkerAreaKm2:-1
            },
            mapFeatures
        );

        ko.applyBindings(viewModel,document.getElementById('koActivityMainBlock'));
        window.validateEndDate = viewModel.validatePlannedEndDate; // Needs to be resolvable from the global scope

        if (activity.siteId) {
            viewModel.siteId(activity.siteId);
        }
    });
</asset:script>
