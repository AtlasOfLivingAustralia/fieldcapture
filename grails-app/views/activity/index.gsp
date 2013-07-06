<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>${activity?.activityId}| ${site?.name} | ${site?.projectName} | Field Capture</title>
    <r:require module="knockout"/>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" id="${site?.projectId}">${site?.projectName}</g:link> <span class="divider">/</span></li>
    <li><g:link controller="site" id="${site?.siteId}">${site?.name}</g:link> <span class="divider">/</span></li>
    <li class="active">${activity.type}
        <span data-bind="text:startDate.formattedDate"></span>/<span data-bind="text:endDate.formattedDate"></span>
    </li>
</ul>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="under-rule span12">
            <div class="clearfix">
                <h1 class="pull-left">${project?.name ? project.name +':' : ''} ${site?.name}</h1>
                <g:link action="edit" id="${activity.activityId}" params="${[returnTo:returnTo]}" class="btn pull-right title-edit">Edit activity</g:link>
            </div>

            <h2>Activity: ${activity.type}
                <span data-bind="text:startDate.formattedDate"></span>/<span data-bind="text:endDate.formattedDate"></span></h2>
            <p class="well well-small">${activity.description}</p>
        </div>
    </div>
    <h3>Type</h3>
    <div class="row-fluid">
        <span class="span6"><span class="label">Type:</span> ${activity.type}</span>
        <span class="span3"><span class="label">Starts:</span> <span data-bind="text:startDate.formattedDate"></span></span>
        <span class="span3"><span class="label">Ends:</span> <span data-bind="text:endDate.formattedDate"></span></span>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <h3 style="border-bottom: #eeeeee solid 1px;">Outputs</h3>
            <div data-bind="visible: outputs.length==0">
                <p>Currently no outputs.</p>
            </div>
            <table class="table" data-bind="visible: outputs.length>0">
                <thead>
                <tr><td></td><td>Output id</td><td>Output Scores</td>
                    <td>Assessment date</td><td>Collector</td></tr>
                </thead>
                <tbody data-bind="foreach: outputs">
                <tr>
                    <td><a data-bind="attr: {href: '${createLink(controller: "output", action: "index")}' + '/' + outputId}"><i class="icon-eye-open" title="View"></i></a>
                        <a data-bind="attr: {href: '${createLink(controller: "output", action: "edit")}' + '/' + outputId}"><i class="icon-edit" title="Edit"></i></a>
                        <i data-bind="click: $root.deleteOutput" class="icon-trash" title="Delete"></i>
                    </td>
                    <td><a data-bind="text: outputId, attr: {href: '${createLink(controller: "output", action: "index")}' + '/' + outputId}"> </a></td>
                    <td>
                        <!-- ko foreach: scores -->
                        <span data-bind="text: name + ' = ' + score"></span><br>
                        <!-- /ko -->
                    </td>
                    <td data-bind="text: assessmentDate"></td>
                    <td data-bind="text: collector"></td>
                </tr>
                </tbody>
            </table>
            <button data-bind="click:newOutput" type="button" class="btn">Add an output</button>
        </div>
    </div>
    <h3>Method</h3>
    <div class="row-fluid">
        <span class="span4"><span class="label">Census method:</span> ${activity.censusMethod}</span>
        <span class="span4"><span class="label">Method accuracy:</span> ${activity.methodAccuracy}</span>
        <span class="span4"><span class="label">Collector:</span> ${activity.collector}</span>
    </div>
    <div class="row-fluid">
        <div class="span12">
            <h3>Notes</h3>
            <span class="label">Notes:</span> ${activity.notes}
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12 metadata">
            <span class="label">Created:</span> <span data-bind="text:dateCreated.formattedDate"></span>
        </div>
    </div>
    <div class="row-fluid">
        <div class="span12 metadata">
            <span class="label">Last updated:</span> <span data-bind="text:lastUpdated.formattedDate"></span>
        </div>
    </div>

    <hr />
    <div class="debug">
        <h3 id="debug">Debug</h3>
        <div style="display: none">
            <pre data-bind="text: ko.toJSON($root, null, 2)"></pre>
            <div>Activity : ${activity}</div>
            <div>Site : ${site}</div>
        </div>
    </div>
</div>
<r:script>
    var outputModel = ${activity.outputs};

    $(function(){
        function ViewModel () {
            var self = this;
            self.description = ko.observable("${activity.description}");
            self.notes = ko.observable("${activity.notes}");
            self.startDate = ko.observable("${activity.startDate}").extend({simpleDate: false});
            self.endDate = ko.observable("${activity.endDate}").extend({simpleDate: false});
            self.censusMethod = ko.observable("${activity.censusMethod}");
            self.methodAccuracy = ko.observable("${activity.methodAccuracy}");
            self.collector = ko.observable("${activity.collector}");
            self.fieldNotes = ko.observable("${activity.fieldNotes}");
            self.type = ko.observable("${activity.type}");
            self.siteId = ko.observable("${activity.siteId}");
            self.outputs = ko.observableArray(outputModel);
            self.dateCreated = ko.observable("${activity.dateCreated}").extend({simpleDate: true});
            self.lastUpdated = ko.observable("${activity.lastUpdated}").extend({simpleDate: true});
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
            self.enterData = function () {
                document.location.href = "${createLink(action: 'addData', id: activity.activityId)}"
            };
            self.newOutput = function () {
                var d = {
                    activityId: "${activity.activityId}"
                };
                $.ajax({
                    url: '${createLink(controller: 'output', action: "ajaxUpdate")}',
                    type: 'POST',
                    data: JSON.stringify(d),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            alert(data.detail + ' \n' + data.error);
                        } else {
                            var newOutput = {
                                outputId: data.outputId,
                                activityId: data.activityId
                            };
                            self.outputs.push(newOutput);
                        }
                    },
                    error: function (data) {
                        var status = data.status
                        alert('An unhandled error occurred: ' + data.status);
                    }
                });
            }
        }
        var viewModel = new ViewModel();
        ko.applyBindings(viewModel);
    });

</r:script>
</body>
</html>