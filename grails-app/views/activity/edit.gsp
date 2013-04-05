<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>Edit | ${activity.activityId ?: 'new'} | ${site.name} | ${site.projectName} | Field Capture</title>
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
    <r:require module="knockout"/>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" id="${site.projectId}">${site.projectName}</g:link> <span class="divider">/</span></li>
    <li><g:link controller="site" id="${site.siteId}">${site.name}</g:link> <span class="divider">/</span></li>
    <g:if test="${activity.activityId}">
        <li><g:link controller="activity" id="${activity.activityId}">${activity.activityId}</g:link> <span class="divider">/</span></li>
        <li class="active">Edit</li>
    </g:if>
    <g:else>
        <li class="active">Create new activity</li>
    </g:else>
</ul>
<div class="container-fluid">
    <div class="row-fluid span12" style="padding-bottom: 15px;">
        <h2><div class="span6">
            Project: <g:link controller="project" action="index" id="${site.projectId}">${site.projectName}</g:link>
        </div>
        <div class="span6">
            Site: <g:link controller="site" action="index" id="${site.siteId}">${site.name}</g:link>
        </div></h2>
    </div>

    <bs:form action="update" inline="true">
        <div class="row-fluid span12">
            <div class="span6">
                <fc:textArea data-bind="value: description" id="description" label="Description" class="span12" rows="3" cols="50"/>
            </div>
            <div class="span6">
                <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="span12" rows="3" cols="50"/>
            </div>
        </div>

        <div class="row-fluid span12">
            <div class="span4">
                <label for="startDate">Start date
                <fc:iconHelp title="Start date">Date the activity was started.</fc:iconHelp>
                </label>
                <input data-bind="value:startDate" id="startDate" type="text" class="span12"/>
            </div>
            <div class="span4">
                <label for="endDate">End date
                <fc:iconHelp title="End date">Date the activity finished.</fc:iconHelp>
                </label>
                <input data-bind="value:endDate" id="endDate" type="text" class="span12"/>
            </div>
        </div>

        <div class="row-fluid span12">
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

        <div class="row-fluid span12">
            <fc:textArea data-bind="value: fieldNotes" id="fieldNotes" label="Field notes" class="span12" rows="3" cols="50"/>
        </div>

        <div class="form-actions span12">
            <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
        </div>
    </bs:form>

    <hr />
    <div class="debug">
        <h2>Debug</h2>
        <div>Site : ${site}</div>
        <div>Activity : ${activity}</div>
        <div>Types : ${json}</div>
        %{--<div data-bind="text: ko.toJSON($root)"></div>--}%
    </div>
</div>

<!-- templates -->

<r:script>

    // returns blank string if the property is undefined, else the value
    function orBlank(v) {
        return v === undefined ? '' : v;
    }

    // returns blank string if the object or the specified property is undefined, else the value
    function exists(parent, prop) {
        return parent === undefined ? '' : (parent[prop] === undefined ? '' : parent[prop]);
    }

    var modelData = $.parseJSON('${json}');

    $(function(){
        //$('.dropdown-toggle').dropdown();
        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = "${createLink(action: 'index', id: site.siteId)}";
        });

        function ViewModel () {
            var self = this;
            self.description = ko.observable("${activity.description}");
            self.notes = ko.observable("${activity.notes}");
            self.startDate = ko.observable("${activity.startDate}");
            self.endDate = ko.observable("${activity.endDate}");
            self.censusMethod = ko.observable("${activity.censusMethod}");
            self.methodAccuracy = ko.observable("${activity.methodAccuracy}");
            self.collector = ko.observable("${activity.collector}");
            self.fieldNotes = ko.observable("${activity.fieldNotes}");
            self.types = ko.observableArray(${activity.types});
            self.siteId = "${activity.siteId}";

            self.save = function () {
                var jsData = ko.toJS(self);
                var json = ko.toJSON(self);
                $.ajax({
                    url: "${createLink(action: 'ajaxUpdate', id: activity.activityId)}",
                    type: 'POST',
                    data: json,
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            alert(data.detail + ' \n' + data.error);
                        } else {
                            var activityId = "${activity.activityId}" || data.activityId;
                            if (data.message === 'created') {
                                document.location.href = "${createLink(controller: 'site', action: 'index', id: "${site.siteId}")}";
                            } else {
                                document.location.href = "${createLink(action: 'index')}/" + activityId;
                            }
                        }
                    },
                    error: function (data) {
                        var status = data.status
                        alert('An unhandled error occurred: ' + data.status);
                    }
                });
            };
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
        }

        var viewModel = new ViewModel();

        ko.applyBindings(viewModel);

        var dump = ko.toJS(viewModel);
        var dumpJson = ko.toJSON(viewModel);

    });

</r:script>
</body>
</html>