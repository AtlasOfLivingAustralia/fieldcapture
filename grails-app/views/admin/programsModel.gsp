<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Programs model - Admin - Data capture - Atlas of Living Australia</title>
    <r:require modules="knockout,jquery_ui,knockout_sortable,jqueryValidationEngine"/>
</head>

<body>
<content tag="pageTitle">Programs model</content>
<content tag="adminButtonBar">
    <button type="button" data-bind="click:save" class="btn btn-success">Save</button>
    <button type="button" data-bind="click:revert" class="btn">Cancel</button>
</content>
<div class="row-fluid span10">
    <p class="span12">These lists control the programs, sub-programs and themes that can be associated
    with projects and activities.</p>
    <p><b>Click</b> an item to select it and show its properties. <b>Double-click</b> to edit a name.
    <b>Drag</b> to rearrange the order of items.</p>
</div>
<form id="validation-container">
<div class="row-fluid">
    <div class="span4">
        <h2>Programs</h2>
        <ul data-bind="sortable:{data:programs}" class="sortableList">
            <li class="item" data-bind="css:{referenced:isSelected}">
                <div data-bind="click:select">
                    <span data-bind="clickToEdit:name" data-edit-on-dblclick="true" data-input-class="auto-width"></span>%{--<span data-bind="visible:!name()">new</span>--}%
                    <span class="pull-right" data-bind="visible:isSelected"><i data-bind="click:$parent.removeProgram" class="icon-remove"></i></span>
                </div>
            </li>
        </ul>
        <span data-bind="click:addProgram" class="clickable"><i class="icon-plus"></i> Add another</span>
    </div>
    <div class="span4">
        <h2>Sub-programs</h2>
        <ul data-bind="sortable:{data:transients.displayedSubprograms}" class="sortableList">
            <li class="item" data-bind="css:{referenced:isSelected}">
                <div data-bind="click:select">
                    <span data-bind="clickToEdit:name" data-edit-on-dblclick="true" data-input-class="auto-width"></span>
                    <span class="pull-right" data-bind="visible:isSelected"><i data-bind="click:$parent.removeSubprogram" class="icon-remove"></i></span>
                </div>
            </li>
        </ul>
        <span data-bind="click:addSubprogram, visible:transients.selectedProgram()" class="clickable"><i class="icon-plus"></i> Add another</span>
    </div>
    <div class="span4">
        <h2>Themes</h2>
        <ul data-bind="sortable:{data:transients.displayedThemes}" class="sortableList">
            <li class="item" data-bind="css:{referenced:isSelected}">
                <div data-bind="click:select">
                    <span data-bind="clickToEdit:name" data-edit-on-dblclick="true" data-input-class="auto-width"></span>
                    <span class="pull-right" data-bind="visible:isSelected"><i data-bind="click:$parent.removeTheme" class="icon-remove"></i></span>
                </div>
            </li>
        </ul>
        <span data-bind="click:addTheme, visible:transients.selectedSubprogram()" class="clickable"><i class="icon-plus"></i> Add another</span>
    </div>
</div>

</form>

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

        $('#validationContainer').validationEngine();

        var ProgramModel = function (prg, model) {
            var self = this;
            this.name = ko.observable(prg.name);

            this.subprograms = ko.observableArray($.map(prg.subprograms, function (obj) {
                return new SubprogramModel(obj, model);
            }));

            this.select = function () {
                model.transients.selectedProgram(this);
                model.transients.selectedSubprogram(undefined);
            };
            this.isSelected = ko.computed(function () {
                return self === model.transients.selectedProgram();
            });
            this.toJSON = function() {
                var js = ko.toJS(this);
                delete js.isSelected;
                return js;
            }
        };

        var SubprogramModel = function (prg, model) {
            var self = this;
            this.name = ko.observable(prg.name);

            this.themes = ko.observableArray($.map(prg.themes, function (obj) {
                return new ThemeModel(obj, model);
            }));

            this.select = function () {
                model.transients.selectedSubprogram(this);
            };
            this.isSelected = ko.computed(function () {
                return self === model.transients.selectedSubprogram();
            });
            this.toJSON = function() {
                var js = ko.toJS(this);
                delete js.isSelected;
                return js;
            }
        };

        var ThemeModel = function (theme, model) {
            var self = this;
            this.name = ko.observable(theme.name);

            this.select = function () {
                model.transients.selectedTheme(this);
            };

            this.isSelected = ko.computed(function () {
                return self === model.transients.selectedTheme();
            });
            this.toJSON = function() {
                var js = ko.toJS(this);
                delete js.isSelected;
                return js;
            }
        };

        var ViewModel = function (model) {
            var self = this;
            this.transients = {};
            this.transients.selectedProgram = ko.observable();
            this.transients.selectedSubprogram = ko.observable();
            this.transients.selectedTheme = ko.observable();

            this.programs = ko.observableArray($.map(model.programs, function (obj, i) {
                return new ProgramModel(obj, self);
            }));

            this.transients.displayedSubprograms = ko.computed(function () {
                return (self.transients.selectedProgram() !== undefined) ?
                    self.transients.selectedProgram().subprograms() : [];
            });
            this.transients.displayedThemes = ko.computed(function () {
                if (self.transients.selectedProgram() === undefined) { return [] }
                if (self.transients.selectedSubprogram() === undefined) { return [] }
                return self.transients.selectedSubprogram().themes();
            });
            this.addProgram = function (item, event) {
                var act = new ProgramModel({name: "", subprograms: []}, self);
                self.programs.push(act);
                act.name.editing(true);
            };
            this.addSubprogram = function (item, event) {
                var newSub = new SubprogramModel({name:"", themes:[]}, self);
                self.transients.selectedProgram().subprograms.push(newSub);
                newSub.name.editing(true);
            };
            this.addTheme = function (item, event) {
                var newTheme = new ThemeModel({name:""}, self);
                self.transients.selectedSubprogram().themes.push(newTheme);
                newTheme.name.editing(true);
            };
            this.removeProgram = function () {
                self.programs.remove(this);
            };
            this.removeSubprogram = function () {
                self.transients.selectedProgram().subprograms.remove(this);
            };
            this.removeTheme = function () {
                self.transients.selectedSubprogram().themes.remove(this);
            };
            this.revert = function () {
                document.location.reload();
            };
            this.save = function () {
                var model = ko.toJS(self);
                delete model.transients;
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