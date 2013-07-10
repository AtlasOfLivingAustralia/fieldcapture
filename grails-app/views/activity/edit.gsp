<%@ page import="grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>
        <g:if test="create">Create | Activity</g:if>
        <g:else>Edit | ${activity.type}</g:else>
        | Field Capture</title>
    <style type="text/css">
    legend {
        border: none;
        margin-bottom: 5px;
    }
    .popover {
        border-width: 2px;
    }
    .popover-content {
        font-size: 14px;
        line-height: 20px;
    }
    h1 input[type="text"] {
        color: #333a3f;
        font-size: 28px;
        /*line-height: 40px;*/
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        height: 42px;
    }
    .no-border { border-top: none !important; }
    </style>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">
    <legend>
        <table style="width: 100%">
            <tr>
                <td><g:link class="discreet" controller="home" action="index">Home</g:link><fc:navSeparator/>Activities<fc:navSeparator/>
                <g:if test="${create}">create</g:if>
                <g:else>
                    <span data-bind="text:type"></span>
                    <span data-bind="text:startDate.formattedDate"></span>/<span data-bind="text:endDate.formattedDate"></span>
                </g:else>
                </td>
                <g:if test="${!create}">
                    <td style="text-align: right"><span><button data-bind="click:removeActivity" id="btnDeleteAll" class="btn btn-danger btn-small"><i class="icon-remove icon-white"></i>&nbsp;Delete activity</button></span></td>
                </g:if>
            </tr>
        </table>
    </legend>

    <div class="row-fluid title-block well input-block-level">
        <div class="space-after"><span>An activity is usually associated with a site. Less commonly, the activity may just be
        linked to a project (usually planning activities). Select either a site or a project below. When a site is
        selected, the project or projects associated with that site will be shown.</span></div>
        <div class="span6 title-attribute">
            <span class="pull-right" style="padding:10px 20px 0 0;">OR</span>
            <div class="">
                <h2>Site:</h2>
                <select data-bind="options:transients.sites,optionsText:'name',optionsValue:'siteId',value:siteId,optionsCaption:'Choose a site...'"></select>
            </div>
            <div>
                <h3>Site projects:</h3>
                <!-- ko foreach:transients.site.projects -->
                    <a data-bind="text:name,attr:{'href':'${createLink(controller:'project',action:'index')}/' + projectId}"></a>
                <!-- /ko -->
            </div>
        </div>
        <div class="span5 title-attribute">
            <h2>Project: </h2>
            <select data-bind="options:transients.projects,optionsText:'name',optionsValue:'projectId',value:projectId,optionsCaption:'Choose a project...',disabled:true"></select>
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
            %{--<select data-bind="value: type, options: availableTypes, optionsText: 'name'" id="type"></select>--}%
        </div>

        <div class="row-fluid">
            <div class="span4 control-group">
                <label for="startDate">Start date
                <fc:iconHelp title="Start date">Date the activity was started.</fc:iconHelp>
                </label>
                <div class="input-append">
                    <input data-bind="datepicker:startDate.date" id="startDate" type="text" size="16"
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
                       data-validation-engine="validate[required]" class="input-xlarge"/>
                    <span class="add-on open-datepicker"><i class="icon-th"></i></span>
                </div>
            </div>
        </div>

        <div class="row-fluid">
            <div class="span4">
                <label for="censusMethod">Census method</label>
                <input data-bind="value: censusMethod" id="censusMethod" type="text" class="span12"/>
            </div>
            <div class="span4">
                <label for="methodAccuracy">Method accuracy</label>
                <input data-bind="value: methodAccuracy" id="methodAccuracy" type="text" class="span12"/>
            </div>
            <div class="span4">
                <label for="collector">Collector</label>
                <input data-bind="value: collector" id="collector" type="text" class="span12"/>
            </div>
        </div>

        <div class="row-fluid">
            <fc:textArea data-bind="value: fieldNotes" id="fieldNotes" label="Field notes" class="span12" rows="3" cols="50"/>
        </div>

        <div class="form-actions">
            <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
        </div>
    </bs:form>

    <div class="expandable-debug">
        <hr />
        <h3>Debug</h3>
        <div>
            <h4>KO model</h4>
            <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
            <h4>Activity</h4>
            <pre>${activity}</pre>
            <h4>Site</h4>
            <pre>${site}</pre>
            <h4>Sites</h4>
            <pre>${(sites as JSON).toString()}</pre>
            <h4>Projects</h4>
            <pre>${(projects as JSON).toString()}</pre>
            %{--<pre>Map features : ${mapFeatures}</pre>--}%
        </div>
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

        function ViewModel (act, sites, projects, site) {
            var self = this;
            self.description = ko.observable(act.description);
            self.notes = ko.observable(act.notes);
            self.startDate = ko.observable(act.startDate).extend({simpleDate: false});
            self.endDate = ko.observable(act.endDate).extend({simpleDate: false});
            self.censusMethod = ko.observable(act.censusMethod);
            self.methodAccuracy = ko.observable(act.methodAccuracy);
            self.collector = ko.observable(act.collector)/*.extend({ required: true })*/;
            self.fieldNotes = ko.observable(act.fieldNotes);
            self.type = ko.observable(act.type);
            self.siteId = ko.observable(act.siteId);
            self.projectId = ko.observable(act.projectId);
            self.transients = {};
            self.transients.sites = sites;
            self.transients.projects = projects;
            self.transients.site = site;
            self.transients.site.projects = ko.computed(function () {
                return getProjectsForSite(self.siteId());
            }).extend({async: []});
            self.save = function () {
                if ($('#validation-container').validationEngine('validate')) {
                    var jsData = ko.toJS(self);
                    delete jsData.transients;
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
                                document.location.href = returnTo;
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
            ${(sites as JSON).toString()},
            ${((projects ?: []) as JSON).toString()},
            ${site ?: [:]});
        ko.applyBindings(viewModel);

    });

</r:script>
</body>
</html>