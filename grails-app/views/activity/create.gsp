<%@ page import="grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Create | Activity | Field Capture</title>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">
    <div id="koActivityMainBlock">
        <ul class="breadcrumb">
            <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
            <li>Activities<span class="divider">/</span></li>
                <li class="active">Create new activity</li>
        </ul>

        <div class="row-fluid title-block well input-block-level">
            <div class="space-after"><span>An activity is usually associated with a site and a project. Less commonly, the activity may just be
            linked to a project (usually planning activities).</span></div>
            <div class="span6 title-attribute">
                <span class="pull-right" style="padding:10px 20px 0 0;">${create ? 'OR' : ''}</span>
                <div class="">
                    <h2>Site:</h2>
                    <g:if test="${site}">
                        <h2>${site.name?.encodeAsHTML()}</h2>
                    </g:if>
                    <g:else>
                        <select data-bind="options:transients.sites,optionsText:'name',optionsValue:'siteId',value:siteId,optionsCaption:'Choose a site...'"></select>
                    </g:else>
                </div>
            </div>
            <div class="span5 title-attribute">
                <h2>Project: </h2>
                <g:if test="${project}">
                    <h2>${project.name?.encodeAsHTML()}</h2>
                </g:if>
                <g:else>
                    <select data-bind="options:transients.projects,optionsText:'name',optionsValue:'projectId',value:projectId,optionsCaption:'Choose a project...',disabled:true"></select>
                </g:else>
            </div>
        </div>

        <bs:form action="update" inline="true">
            <div class="row-fluid">
                <div class="span6">
                    <fc:textArea data-bind="value: description" id="description" label="Description" class="span12" rows="3" cols="50"/>
                </div>
                <div class="span6">
                    <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="span12" rows="3" cols="50"/>
                </div>
            </div>

            <div class="row-fluid control-group">
                <div class="span4">
                    <label for="type">Type of activity</label>
                    <select data-bind="value: type" id="type" data-validation-engine="validate[required]" class="input-xlarge">
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

                <div class="span4">
                    <span><label for="planning">Is this activity being entered for planning purposes? <fc:iconHelp title="Planning">Select yes if you are entering details of a planned activity that has not yet been carried out.  For example, if you are inputting your MERI Plan.</fc:iconHelp></label></span>
                    <label class="radio-inline"><input type="radio" id="planning" name="planning" value="planned" data-bind="checked: progress" data-validation-engine="validate[required]"/> Yes</label>
                    <label class="radio"><input class="radio" type="radio" name="planning" value="started" data-bind="checked: progress" data-validation-engine="validate[required]"/> No</label>

                </div>
                %{--<select data-bind="value: type, options: availableTypes, optionsText: 'name'" id="type"></select>--}%
            </div>

            <div data-bind="visible: progress() === 'planned'">
                <div class="row-fluid">
                    <h3>Planning information</h3>
                </div>
                <div class="row-fluid">
                    <div class="span4 control-group">
                        <label for="plannedStartDate">Planned start date
                        <fc:iconHelp title="Planned start date">Start date of the time range in which the activity will be undertaken.</fc:iconHelp>
                        </label>
                        <div class="input-append">
                            <input data-bind="datepicker:plannedStartDate.date" name="startDate" id="plannedStartDate" type="text" size="16"
                                   data-validation-engine="validate[required]" class="input-xlarge"/>
                            <span class="add-on open-datepicker"><i class="icon-th"></i></span>
                        </div>
                    </div>
                    <div class="span4">
                        <label for="plannedEndDate">Planned end date
                        <fc:iconHelp title="Planned end date">End date of the time range in which the activity will be undertaken.</fc:iconHelp>
                        </label>
                        <div class="input-append">
                            <input data-bind="datepicker:plannedEndDate.date" id="plannedEndDate" type="text" size="16"
                                   data-validation-engine="validate[future[startDate]]" class="input-xlarge"/>
                            <span class="add-on open-datepicker"><i class="icon-th"></i></span>
                        </div>
                    </div>
                    <div class="span4">
                        <label for="projectStage">Project stage
                        <fc:iconHelp title="Project stage">If the project is taking a staged approach to implementation, this identifies which project stage the activity in planned for.</fc:iconHelp>
                        </label>
                        <select id="projectStage" data-bind="value:projectStage">
                            <option value="">None</option>
                            <g:each in="${projectStages}">
                                <option value="${it}">${it}</option>
                            </g:each>
                        </select>
                    </div>
                </div>
                <div class="row-fluid">
                    <h4>Activity output measures</h4>
                    <p>The activity output measures describe the intended output from this activity.  For example, a revegetation activity may
                    plan to plant x seeds over an area of y hectares and protect the seedlings with z kilometres of fence.
                    </p>
                </div>
                <div data-bind="visible:type()" class="row-fluid">
                    <div class="span6">
                    <table class="table table-striped">
                        <thead>
                            <tr><td width="45%">Output measure</td><td width="40%">Expected output value</td><td width="15%"></td></tr>
                        </thead>
                        <tbody data-bind="foreach: targets">
                            <tr>
                                <td><select data-bind="value:scoreName, options:transients.scoreNames" data-validation-engine="validate[required]"></select></td>
                                <td><input type="text" data-bind="value:target" data-validation-engine="validate[required]"/></td>
                                <td>
                                    <a class="btn btn-mini" data-bind="click:$root.removeTarget" href="#" title="remove"><i class="icon-trash"></i> Remove</a>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr><td colspan="2"><button type="button" class="btn" data-bind="click:addTarget">Add output measure</button></td></tr>
                        </tfoot>
                    </table>
                    </div>

                </div>
                <div data-bind="visible:!type()" class="row-fluid">
                    <p>Activity output measures will become available for selection once the activity type has been selected.</p>
                </div>
            </div>


            <div data-bind="visible: progress() === 'started'">
                <div class="row-fluid">
                    <h3>Implementation dates</h3>
                </div>
                <div class="row-fluid">
                    <div class="span4 control-group">
                        <label for="startDate">Start date
                        <fc:iconHelp title="Start date">Date the activity was started.</fc:iconHelp>
                        </label>
                        <div class="input-append">
                            <input data-bind="datepicker:startDate.date" name="startDate" id="startDate" type="text" size="16"
                                   data-validation-engine="validate[required]" class="input-xlarge"/>
                            <span class="add-on open-datepicker"><i class="icon-th"></i></span>
                        </div>
                    </div>
                    <div class="span4">
                        <label for="endDate">End date
                        <fc:iconHelp title="End date">Date the activity finished.</fc:iconHelp>
                        </label>
                        <div class="input-append">
                            <input data-bind="datepicker:endDate.date" id="endDate" type="text" size="16"
                                   data-validation-engine="validate[future[startDate]]" class="input-xlarge"/>
                            <span class="add-on open-datepicker"><i class="icon-th"></i></span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="form-actions">
                <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
                <button type="button" id="cancel" class="btn">Cancel</button>
            </div>
        </bs:form>

        <g:if env="development">
            <div class="expandable-debug">
                <hr />
                <h3>Debug</h3>
                <div>
                    <h4>KO model</h4>
                    <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                    <h4>Activity</h4>
                    <pre>${activity}</pre>
                    <h4>Activity types</h4>
                    <pre>${activityTypes}</pre>
                    <h4>Site</h4>
                    <pre>${site?.encodeAsHTML()}</pre>
                    <h4>Sites</h4>
                    <pre>${(sites as JSON).toString()}</pre>
                    <h4>Project</h4>
                    <pre>${project.encodeAsHTML()}</pre>
                    <h4>Projects</h4>
                    <pre>${(projects as JSON).toString()}</pre>
                    %{--<pre>Map features : ${mapFeatures}</pre>--}%
                </div>
            </div>
        </g:if>
    </div>
</div>

<!-- templates -->

<r:script>

    var returnTo = "${returnTo}";

    $(function(){

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = returnTo;
        });

        function getProjectsForSite(siteId) {
            if (siteId) {
                return $.getJSON("${createLink(controller:'site', action:'projectsForSite')}/" + siteId);
            } else {
                return [];
            }
        }

        function TargetRow(activityType, activityScores) {
            var self = this;
            self.scoreName = ko.observable();
            self.target = ko.observable();

            self.transients = {};
            self.transients.scoreNames = ko.computed(function() {
                return activityScores[activityType()];
            });
        }

        function ViewModel (act, sites, projects, site, project, activityScores) {
            var self = this;

            self.confirmActivityTypeChange = function() {
                if (self.targets().length) {
                    return window.confirm("Changing the activity type will invalidate the output measures.  Continue?");
                }
                return true;
            };

            self.removeAllTargets = function() {
                self.targets([]);
            };

            self.description = ko.observable(act.description);
            self.notes = ko.observable(act.notes);
            self.type = ko.vetoableObservable(act.type, self.confirmActivityTypeChange, self.removeAllTargets);
            self.startDate = ko.observable(act.startDate).extend({simpleDate: false});
            self.endDate = ko.observable(act.endDate).extend({simpleDate: false});
            self.plannedStartDate = ko.observable(act.plannedStartDate).extend({simpleDate: false});
            self.plannedEndDate = ko.observable(act.plannedEndDate).extend({simpleDate: false});
            self.projectStage = ko.observable();
            self.targets = ko.observableArray();
            self.progress = ko.observable();
            self.censusMethod = ko.observable(act.censusMethod);
            self.methodAccuracy = ko.observable(act.methodAccuracy);
            self.collector = ko.observable(act.collector)/*.extend({ required: true })*/;
            self.fieldNotes = ko.observable(act.fieldNotes);
            self.siteId = ko.observable(act.siteId);
            self.projectId = ko.observable(act.projectId);
            self.transients = {};
            self.transients.site = site;
            self.transients.project = project;
            self.transients.sites = project ? project.sites : sites;
            self.transients.projects = site ? site.projects : projects;
            /*self.transients.site.projects = ko.computed(function () {
                return getProjectsForSite(self.siteId());
            }).extend({async: []});*/


            self.addTarget = function() {
                self.targets.push(new TargetRow(self.type, activityScores));
            };
            self.removeTarget = function (row) {
                self.targets.remove(row);
            };
            self.save = function () {
                if ($('#validation-container').validationEngine('validate')) {
                    var jsData = ko.mapping.toJS(self, {'ignore':['transients']});
                    var json = JSON.stringify(jsData);
                    $.ajax({
                        url: "${createLink(action: 'ajaxUpdate', id: activity.activityId)}",
                        type: 'POST',
                        data: json,
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.error) {
                                alert(data.detail + ' \n' + data.error);
                            } else {
                                // Redirect to the edit page for a new started activity, otherwise go back to
                                // where you came from (the project or site activity list most likely).
                                if (self.progress() != 'planned') {
                                    document.location.href = "${createLink(action: 'edit')}"+'/'+data.activityId+'?returnTo='+returnTo;
                                }
                                else {
                                    document.location.href = returnTo;
                                }
                            }
                        },
                        error: function (data) {
                            var status = data.status;
                            alert('An unhandled error occurred: ' + data.status);
                        }
                    });
                }
            };
            self.removeActivity = function () {
                bootbox.confirm("Delete this entire activity? Are you sure?", function(result) {
                    if (result) {
                        document.location.href = "${createLink(action:'delete',id:activity.activityId,
                            params:[returnTo:grailsApplication.config.grails.serverURL + '/' + returnTo])}";
                    }
                });
            };
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
        }

        var viewModel = new ViewModel(
            ${(activity as JSON).toString()},
            ${((sites ?: []) as JSON).toString()},
            ${((projects ?: []) as JSON).toString()},
            ${site ?: 'null'},
            ${project ?: 'null'},
            ${(activityScores as JSON).toString()} );
        ko.applyBindings(viewModel,document.getElementById('koActivityMainBlock'));

    });

</r:script>
</body>
</html>