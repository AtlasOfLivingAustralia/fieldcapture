<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>Edit | ${activity.activityId ?: 'new'} | ${site.name} | ${site.projectName} | Field Capture</title>
    <md:modelStyles model="${model}" edit="true"/>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker"/>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" id="${site.projectId}">${site.projectName}</g:link> <span class="divider">/</span></li>
    <li><g:link controller="site" id="${site.siteId}">${site.name}</g:link> <span class="divider">/</span></li>
    <g:if test="${create}">
        <li class="active">Create new activity</li>
    </g:if>
    <g:else>
        <li><g:link controller="activity" id="${activity.activityId}">${activity.type}
            <span data-bind="text:transients.activityStartDate.formattedDate"></span>-<span data-bind="text:transients.activityEndDate.formattedDate"></span>
        </g:link><span class="divider">/</span></li>
        <li class="active">Edit</li>
    </g:else>
</ul>
<div class="container-fluid">
    <div class="row-fluid span12">
        <h2><div class="span6">
            Project: <g:link controller="project" action="index" id="${site.projectId}">${site.projectName}</g:link>
        </div>
        <div class="span6">
            Site: <g:link controller="site" action="index" id="${site.siteId}">${site.name}</g:link>
        </div></h2>
    </div>
    <div class="row-fluid span12" style="padding-bottom: 15px;">
        <h2>
            <div class="span12">Activity: <span data-bind="text:activityType"></span>
                <span data-bind="text:transients.activityStartDate.formattedDate"></span>/<span data-bind="text:transients.activityEndDate.formattedDate"></span>
            </div>
        </h2>
    </div>

    <form id="form">

        <div class="row-fluid span12">
            <div class="span4 control-group">
                <label for="assessmentDate">Assessment date
                <fc:iconHelp title="Start date">Date the data was collected.</fc:iconHelp>
                </label>
                <div class="input-append">
                    <input data-bind="datepicker:assessmentDate.date" type="text" size="12" id="assessmentDate"
                       data-validation-engine="validate[required]"/>
                    <span class="add-on open-datepicker"><i class="icon-th"></i></span>
                </div>
            </div>
            <div class="span4">
                <label for="collector">Collector</label>
                <input data-bind="value: collector" id="collector" type="text"
                       data-validation-engine="validate[required]"/>
            </div>
        </div>

<!-- add the dynamic components -->
<md:modelView model="${model}" edit="true"/>

        <div class="form-actions span12">
            <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
        </div>
    </form>

    <hr />
    <div class="debug row-fluid">
        <h3 id="debug">Debug</h3>
        <div style="display:none">
            <pre data-bind="text: ko.toJSON($root, null, 2)"></pre>
            <pre>Output : ${output}</pre>
            <pre>Site : ${site}</pre>
            <pre>Activity : ${activity}</pre>
        </div>
    </div>

</div>

<!-- templates -->

<r:script>

    $(function(){

        $('input').live('focus', function () {
            console.log('got focus');
        });

        $('#form').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = "${create ? createLink(controller: 'site', action: 'index', id: site.siteId) :
                createLink(action: 'index', id: activity.activityId)}";
        });

// load dynamic models - usually objects in a list
<md:jsModelObjects model="${model}" edit="true"/>

        function ViewModel () {
            var self = this;
            self.assessmentDate = ko.observable("${output.assessmentDate}").extend({simpleDate: false});
            self.collector = ko.observable("${output.collector}")/*.extend({ required: true })*/;
            self.activityId = ko.observable("${activity.activityId}");
            self.activityType = ko.observable("${activity.type}");
            self.data = {};
            self.transients = {};
            self.transients.activityStartDate = ko.observable("${activity.startDate}").extend({simpleDate: false});
            self.transients.activityEndDate = ko.observable("${activity.endDate}").extend({simpleDate: false});

// add declarations for dynamic data
<md:jsViewModel model="${model}" edit="true"/>

            // this will be called from the save method to remove transient properties
            self.removeBeforeSave = function (jsData) {
// add code to remove any transients added by the dynamic tags
<md:jsRemoveBeforeSave model="${model}"/>
                delete jsData.activityType;
                delete jsData.transients;
                return jsData;
            };
            self.save = function () {
                if ($('#form').validationEngine('validate')) {
                    var jsData = ko.toJS(self);
                    // get rid of any transient observables
                    jsData = self.removeBeforeSave(jsData);
                    var json = JSON.stringify(jsData);
                    $.ajax({
                        url: '${createLink(action: "ajaxUpdate", id: "${output.outputId}")}',
                        type: 'POST',
                        data: json,
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.error) {
                                alert(data.detail + ' \n' + data.error);
                            } else {
                                var outputId = "${output.outputId}" || data.outputId;
                                document.location.href = "${createLink(controller: 'activity', action: 'index', id: "${activity.activityId}")}";
                            }
                        },
                        error: function (data) {
                            var status = data.status
                            alert('An unhandled error occurred: ' + data.status);
                        }
                    });
                }
            };
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
            self.loadData = function (data) {
// load dynamic data
<md:jsLoadModel model="${model}"/>
            };
        }

        var viewModel = new ViewModel();
        viewModel.loadData(${output.data});

        ko.applyBindings(viewModel);

    });

</r:script>
</body>
</html>