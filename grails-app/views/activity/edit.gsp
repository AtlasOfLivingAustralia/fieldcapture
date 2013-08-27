<%@ page import="grails.converters.JSON; org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Edit | ${activity.type} | Field Capture</title>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        projectViewUrl: "${createLink(controller: 'project', action: 'index')}/",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}/"
        },
        here = document.location.href;
    </r:script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">
  <div id="koActivityMainBlock">
      <ul class="breadcrumb">
            <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
            <li>Activities<span class="divider">/</span></li>
            <li class="active">
                <span data-bind="text:type"></span>
                <span data-bind="text:startDate.formattedDate"></span>/<span data-bind="text:endDate.formattedDate"></span>
            </li>
        </ul>

        <div class="row-fluid title-block well well-small input-block-level">
            <div class="span12 title-attribute">
                <h1 data-bind="click:goToProject" class="clickable">${project.name}</h1>
                <g:if test="${site}">
                    <h2 data-bind="click:goToSite" class="clickable">Site: ${site.name}</h2>
                </g:if>
                <g:else>
                    <select data-bind="options:transients.sites,optionsText:'name',optionsValue:'siteId',value:siteId,optionsCaption:'Choose a site...'"></select>
                </g:else>
                <h3>Activity: <span data-bind="text:type"></span></h3>
            </div>
        </div>

        <div class="row-fluid">
            <div class="span6">
                <fc:textArea data-bind="value: description" id="description" label="Description" class="span12" rows="3" cols="50"/>
            </div>
            <div class="span6">
                <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="span12" rows="3" cols="50"/>
            </div>
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
            <div class="span4">
                <label for="censusMethod">Method</label>
                <input data-bind="value: censusMethod" id="censusMethod" type="text" class="span12"/>
            </div>
        </div>

        <div class="well well-small">
            <ul class="unstyled" data-bind="foreach:transients.metaModel.outputs">
                <li class="row-fluid">
                    <span class="span4" data-bind="text:$data"></span>
                    <span class="span4"><a data-bind="editOutput:$data">Add data</a></span>
                </li>
            </ul>
        </div>

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
              <h4>Project</h4>
              <pre>${project}</pre>
              <h4>Activity model</h4>
              <pre>${metaModel}</pre>
          </div>
      </div>
    </div>

    <g:each in="${metaModel.outputs}" var="outputName">
        <div class="output-block">
            <div>${outputName}</div>
        </div>
    </g:each>

    <div class="form-actions">
        <button type="button" id="save" class="btn btn-primary">Save changes</button>
        <button type="button" id="cancel" class="btn">Cancel</button>
    </div>

</div>

<!-- templates -->

<r:script>

    var returnTo = "${returnTo}";

    $(function(){

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#save').click(function () {
            viewModel.save();
        });

        $('#cancel').click(function () {
            document.location.href = returnTo;
        });

        ko.bindingHandlers.editOutput = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var outputName = ko.utils.unwrapObservable(valueAccessor()),
                    activity = bindingContext.$root,
                    outputId;

                // search for corresponding outputs in the activity data
                $.each(activity.outputs, function (i,output) { // iterate output data in the activity to
                                                                  // find any matching the meta-model name
                    if (output.name === outputName) {
                        outputId = output.outputId;
                        %{--$.each(output.scores, function (k, v) {
                            scores.push({key: k, value: v});
                        });--}%
                    }
                });
                if (outputId) {
                    // build edit link
                    $(element).html('Edit data');
                    $(element).attr('href', fcConfig.serverUrl + "/output/edit/" + outputId +
                        "?returnTo=" + here);
                } else {
                    // build create link
                    $(element).attr('href', fcConfig.serverUrl + '/output/create?activityId=' + activity.activityId +
                        '&outputName=' + encodeURIComponent(outputName) +
                        "&returnTo=" + here);
                }
            }
        };

        function ViewModel (act, site, project, metaModel) {
            var self = this;
            self.activityId = act.activityId;
            self.description = ko.observable(act.description);
            self.notes = ko.observable(act.notes);
            self.startDate = ko.observable(act.startDate).extend({simpleDate: false});
            self.endDate = ko.observable(act.endDate).extend({simpleDate: false});
            self.censusMethod = ko.observable(act.censusMethod);
            self.methodAccuracy = ko.observable(act.methodAccuracy);
            self.collector = ko.observable(act.collector);
            self.fieldNotes = ko.observable(act.fieldNotes);
            self.type = ko.observable(act.type);
            self.siteId = ko.observable(act.siteId);
            self.projectId = act.projectId;
            self.outputs = act.outputs;
            self.transients = {};
            self.transients.site = site;
            self.transients.project = project;
            self.transients.metaModel = metaModel || {};
            self.goToProject = function () {
                if (self.projectId) {
                    document.location.href = fcConfig.projectViewUrl + self.projectId;
                }
            };
            self.goToSite = function () {
                if (self.siteId()) {
                    document.location.href = fcConfig.siteViewUrl + self.siteId();
                }
            };
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
            ${site ?: 'null'},
            ${project ?: 'null'},
            ${metaModel});
        ko.applyBindings(viewModel,document.getElementById('koActivityMainBlock'));

    });

</r:script>
</body>
</html>