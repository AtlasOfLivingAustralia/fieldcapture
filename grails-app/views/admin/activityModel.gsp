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
<div class="row-fluid span10">
    <div class="span4">
        <h2>Activities</h2>%{--<span data-bind=""><i class="icon-plus"></i> Add new</span>--}%
        <ul data-bind="sortable:activities" class="sortableList container">
            <li data-bind="click:toggle" class="item">
                <span data-bind="text:name"></span>
                <div data-bind="visible:expanded" class="details" style="display:none;">
                    <div>Type: <span data-bind="text:type"></span></div>
                    <div>Outputs: <ul data-bind="foreach:outputs">
                        <li data-bind="text:$data"></li>
                    </ul></div>
                </div>
            </li>
        </ul>
    </div>
    <div class="span4 pull-right">
        <h2>Outputs</h2>
        <ul data-bind="sortable:outputs" class="sortableList">
            <li data-bind="click:toggle,css:{referenced: isReferenced}" class="item">
                <span data-bind="text:name"></span>
                <div data-bind="visible:expanded" class="details" style="display:none;">
                    <div>Template: <span data-bind="text:template"></span></div>
                    <div>Score name: <span data-bind="text:scoreName"></span></div>
                    <div>Hot: <span data-bind="text:isReferenced"></span></div>
                </div>
            </li>
        </ul>
    </div>
</div>

<span data-bind="text:selectedActivity() ? selectedActivity().name() : 'none'"></span>

<div class="expandable-debug clearfix">
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

        var ActivityModel = function (act, model) {
            var self = this;
            this.name = ko.observable(act.name);
            this.type = ko.observable(act.type);
            this.outputs = ko.observableArray(act.outputs);
            this.expanded = ko.observable(false);
            this.toggle = function (data, event) {
                if (!self.expanded()) {
                    $.each(viewModel.activities(), function (i, obj) {obj.expanded(false)});
                    self.expanded(true);
                    model.selectedActivity(self);
                } else {
                    self.expanded(false);
                }
            };
            this.toJSON = function() {
                var js = ko.toJS(this);
                delete js.expanded;
                return js;
            }
        };

        var OutputModel = function (out, model) {
            var self = this;
            this.name = ko.observable(out.name);
            this.template = ko.observable(out.template);
            this.scoreName = ko.observable(out.scoreName);
            this.scores = ko.observableArray(out.scores);
            this.expanded = ko.observable(false);
            this.toggle = function (data, event) {
                if (!self.expanded()) {
                    $.each(viewModel.outputs(), function (i, obj) {obj.expanded(false)});
                    self.expanded(true);
                } else {
                    self.expanded(false);
                }
            };
            this.isReferenced = ko.computed(function () {
                var current = model.selectedActivity(),
                    referenced = false;
                if (current === undefined) { return false; }
                $.each(current.outputs(), function (k, out) {
                    if (out === self.name()) {
                        referenced = true;
                    }
                });
                return referenced;
            });
            this.toJSON = function() {
                var js = ko.toJS(this);
                delete js.expanded;
                delete js.scores;  // for now
                return js;
            }
        };

        var ViewModel = function (model) {
            var self = this;
            this.activities = ko.observableArray($.map(model.activities, function (obj, i) {
                return new ActivityModel(obj, self);
            }));
            this.selectedActivity = ko.observable();
            this.outputs = ko.observableArray($.map(model.outputs, function (obj, i) {
                return new OutputModel(obj, self);
            }));
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