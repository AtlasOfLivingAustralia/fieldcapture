<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Activity model - Admin - Data capture - Atlas of Living Australia</title>
    <r:require modules="knockout,jquery_ui,knockout_sortable"/>
</head>

<body>
<content tag="pageTitle">Activity model</content>
<content tag="adminButtonBar">
    <button type="button" data-bind="click:save" class="btn btn-success">Save</button>
    <button type="button" data-bind="click:revert" class="btn">Cancel</button>
</content>
<div class="row-fluid">
    <div class="span4">
        <h2>Activities</h2>
        <ul data-bind="sortable:activities" class="sortableList container">
            <li data-bind="text:name" class="item"></li>
        </ul>
    </div>
    <div class="span4 pull-right">
        <h2>Outputs</h2>
        <ul data-bind="sortable:outputs" class="sortableList">
            <li data-bind="text:name"></li>
        </ul>
    </div>
</div>

<div class="expandable-debug">
    <hr />
    <h3>Debug</h3>
    <div>
        <h4>KO model</h4>
        <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
        <h4>Input model</h4>
        <pre>${activitiesModel}</pre>
        <h4>Activities</h4>
        <pre data-bind="text:ko.toJSON(activities,null,2)"></pre>
        <h4>Outputs</h4>
        <pre data-bind="text:ko.toJSON(outputs,null,2)"></pre>
    </div>
</div>

<r:script>
    $(function(){

        /*var ActivityModel = function (act) {
            var self = this;
            this.name = ko.observable(act.name);
        };*/

        var ViewModel = function (model) {
            var self = this;
            this.activities = ko.mapping.fromJS(model.activities);
            this.outputs = ko.observableArray(model.outputs);
            this.revert = function () {
                document.location.reload();
            };
            this.save = function () {
                var model = ko.toJS(self);
                $.ajax("${createLink(action: 'updateActivitiesModel')}", {
                    type: 'POST',
                    data: vkbeautify.json(model,2),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data !== 'error') {
                            document.location.reload();
                        } else {
                            alert(data);
                        }
                    },
                    error: function () {
                        alert('failed');
                    },
                    dataType: 'text'
                });
            };
        };

        var viewModel = new ViewModel(${activitiesModel});
        ko.applyBindings(viewModel);
    });
</r:script>
</body>
</html>