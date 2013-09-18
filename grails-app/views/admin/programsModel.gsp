<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Programs model - Admin - Data capture - Atlas of Living Australia</title>
    <r:require modules="knockout,jquery_ui,knockout_sortable"/>
</head>

<body>
<content tag="pageTitle">Programs model</content>
<content tag="adminButtonBar">
    <button type="button" data-bind="click:save" class="btn btn-success">Save</button>
    <button type="button" data-bind="click:revert" class="btn">Cancel</button>
</content>
<div class="row-fluid span10">
    <p class="span12">This list controls the programs, sub-programs and themes that can be associated
    with projects and activities.</p>
</div>
<div class="row-fluid span10">
    <div class="span6">
        <h2>Programs</h2>
        <ul data-bind="sortable:{data:programs}" class="sortableList container">
            <li class="item">
                <div data-bind="click:toggle"><span data-bind="text:name"></span></div>
                <div data-bind="visible:expanded" class="details clearfix" style="display:none;">
                    <div data-bind="template: {name: displayMode}"></div>
                </div>
            </li>
        </ul>
        <span data-bind="click:addProgram" class="clickable"><i class="icon-plus"></i> Add new</span>
    </div>
</div>

<script id="viewProgramTmpl" type="text/html">
    <div>Sub-programs: <ul data-bind="foreach:subprograms">
        <li data-bind="text:$data"></li>
    </ul></div>
    <button data-bind="click:$root.removeProgram" type="button" class="btn btn-mini pull-right">Remove</button>
    <button data-bind="click:edit" type="button" class="btn btn-mini pull-right">Edit</button>
</script>

<script id="editProgramTmpl" type="text/html">
    <div style="margin-top:4px"><span class="span2">Name:</span>
        <input type="text" class="input-large pull-right" data-bind="value:name" style="margin-bottom:0;">
    </div>
    <div class="clearfix">
        <span>Sub-programs:</span>
        <ul data-bind="sortable:{data:subprograms}" class="output-drop-target sortableList small">
            <li>
                <input type="text" class="name-edit" data-bind="value:$parent.subprograms()[$index()]">
                <span class="pull-right"><i data-bind="click:$parent.removeSubprogram" class="icon-remove"></i></span>
            </li>
        </ul>
        <span data-bind="click:addSubprogram" class="clickable"><i class="icon-plus"></i> Add new</span>
    </div>
    <button data-bind="click:done" type="button" class="btn btn-mini pull-right">Done</button>
</script>

<div class="expandable-debug clearfix">
    <hr />
    <h3>Debug</h3>
    <div>
        <h4>KO model</h4>
        <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
        <h4>Input model</h4>
        <pre>${programsModel}</pre>
        <h4>Programs</h4>
        <pre data-bind="text:ko.toJSON(programs,null,2)"></pre>
    </div>
</div>

<r:script>
    $(function(){

        var ProgramModel = function (prg, model) {
            var self = this;
            this.name = ko.observable(prg.name);

            // NOTE that because this is an array of simple strings we cannot just use the 'value:$data'
            // binding when iterating. We need to use 'value:$parent.subprograms()[$index()]'
            this.subprograms = ko.observableArray($.map(prg.subprograms, function (obj) {
                return ko.observable(obj);
            }));

            this.expanded = ko.observable(false);
            this.toggle = function (data, event) {
                if (!self.expanded()) {
                    $.each(viewModel.programs(), function (i, obj) {
                        obj.expanded(false); // close all
                        obj.done(); // exit editing mode
                    });
                    self.expanded(true);
                    model.selectedProgram(self);
                } else {
                    self.expanded(false);
                    self.done(); // in case we were editing
                    model.selectedProgram(undefined);
                }
            };
            this.editing = ko.observable(false);
            this.edit = function () { self.editing(true) };
            this.done = function () { self.editing(false) };
            this.displayMode = function () {
                return self.editing() ? 'editProgramTmpl' : 'viewProgramTmpl';
            };
            this.addSubprogram = function (data) {
                self.subprograms.push("new");
            };
            this.removeSubprogram = function (data) {
                self.subprograms.remove(function(item) { return ko.utils.unwrapObservable(item) === data });
            };
            this.toJSON = function() {
                var js = ko.toJS(this);
                delete js.expanded;
                delete js.editing;
                return js;
            }
        };

        var ViewModel = function (model) {
            var self = this;
            this.programs = ko.observableArray($.map(model.programs, function (obj, i) {
                return new ProgramModel(obj, self);
            }));
            this.selectedProgram = ko.observable();
            this.addProgram = function () {
                var act = new ProgramModel({name: 'new program', subprograms: []}, self);
                self.programs.push(act);
                act.expanded(true);
                act.editing(true);
            };
            this.removeProgram = function () {
                self.programs.remove(this);
            };
            this.revert = function () {
                document.location.reload();
            };
            this.save = function () {
                var model = ko.toJS(self);
                $.ajax("${createLink(action: 'updateProgramsModel')}", {
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

        var viewModel = new ViewModel(${programsModel});
        ko.applyBindings(viewModel);
    });
</r:script>
</body>
</html>