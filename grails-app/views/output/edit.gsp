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
    table.grid td:first-child {width: 25%}
    table.grid td:nth-child(2) {width: 8%}
    table.grid td:nth-child(3) {width: 17%}
    table.grid td:nth-child(4) {width: 11%}
    table.grid td:nth-child(5) {width: 11%}
    table.grid td:nth-child(6) {width: 2%}
    table.grid td:last-child {width: 20%}
    table.grid input[type="text"] {margin-bottom: 0}
    </style>
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

        %{--<div class="row-fluid span12">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th id="col1">Weed name</th>
                        <th id="col2">Unknown if weed or native</th>
                        <th id="col3">% Area covered</th>
                        <th id="col4">Cover Rating</th>
                        <th id="col5">Invasive Threat Category</th>
                        <th id="col6">Abundance & Threat Score</th>
                        <th id="col7"></th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: data">
                    <tr>
                        <td data-bind="clickToEdit:name"></td>
                        <td><input data-bind="checked:isUnknownIfWeed" type="checkbox" class="checkbox"/></td>
                        <td data-bind="clickToEdit:areaCovered" data-input-class="input-small"></td>
                        <td data-bind="clickToEdit:coverRating" data-input-class="input-mini"></td>
                        <td data-bind="clickToEdit:invasiveThreatCategory" data-input-class="input-mini"></td>
                        <td data-bind="text:abundanceAndThreatScore" data-input-class="input-mini"></td>
                        <td><button data-bind="click:$root.removeRow" type="button" class="close" title="delete">×</button></td>
                    </tr>
                </tbody>
            </table>
            <button type="button" class="btn btn-small" data-bind="click:addRow">Add a row</button>
        </div>--}%

        <div class="row-fluid span12">
            <table class="table table-bordered grid">
                <thead>
                    <tr>
                        <th>Weed name</th>
                        <th>Unknown if weed or native</th>
                        <th>% Area covered</th>
                        <th>Cover Rating</th>
                        <th>Invasive Threat Category</th>
                        <th>Abundance & Threat Score</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody data-bind="template:{name:templateToUse, foreach:data.weedAbundanceAndThreatScore}"></tbody>
                <tbody>
                    <tr>
                        <td></td>
                        <td>Total cover</td>
                        <td><input data-bind="value:data.totalAreaCovered" type="text" class="input-small"/></td>
                        <td colspan="2">Total Abundance & Threat Score</td>
                        <td data-bind="text:data.totalAbundanceAndThreatScore"></td>
                        <td></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr><td colspan="7">
                        <button type="button" class="btn btn-small" data-bind="click:addRow"><i class="icon-plus"></i> Add a row</button>
                    </td></tr>
                </tfoot>
            </table>
        </div>

        %{--<div class="row-fluid span12">
            <ul data-bind="foreach:data">
                <li data-bind="text:isSelected"></li>
            </ul>
        </div>--}%


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

    <script id="itemsTmpl" type="text/html">
        <tr>
            <td data-bind="text:name"></td>
            <td><i data-bind="visible:isUnknownIfWeed" class="icon-ok"></i></td>
            <td data-bind="text:areaCovered"></td>
            <td data-bind="text:coverRating"></td>
            <td data-bind="text:invasiveThreatCategory"></td>
            <td data-bind="text:abundanceAndThreatScore"></td>
            <td>
                <a class="btn btn-mini" data-bind="click:$root.editRow" href="#" title="edit"><i class="icon-edit"></i> Edit</a>
                <a class="btn btn-mini" data-bind="click:$root.removeRow" href="#" title="remove"><i class="icon-trash"></i> Remove</a>
            </td>
        </tr>
    </script>

    <script id="editTmpl" type="text/html">
        <tr>
            <td><input data-bind="hasFocus:isSelected, value:name" class="input-medium" type="text" data-validation-engine="validate[required]"/>
            %{--<span data-bind="text:isSelected"></span>--}%</td>
            <td><input data-bind="checked:isUnknownIfWeed" type="checkbox" class="checkbox"/></td>
            <td><input data-bind="value:areaCovered" class="input-small" type="text"/></td>
            <td><input data-bind="value:coverRating" class="input-mini" type="text"/></td>
            <td><input data-bind="value:invasiveThreatCategory" class="input-mini" type="text"/></td>
            <td data-bind="text:abundanceAndThreatScore"></td>
            <td>
                <a class="btn btn-success btn-mini" data-bind="click: $root.accept" href="#" title="save">Update</a>
                <a class="btn btn-mini" data-bind="click: $root.cancel" href="#" title="cancel">Cancel</a>
            </td>
        </tr>
    </script>
</div>

<!-- templates -->

<r:script>

    // returns blank string if the property is undefined, else the value
    function orBlank(v) {
        return v === undefined ? '' : v;
    }
    function orFalse(v) {
        return v === undefined ? false : v;
    }
    function orZero(v) {
        return v === undefined ? 0 : v;
    }

    // returns blank string if the object or the specified property is undefined, else the value
    function exists(parent, prop) {
        return parent === undefined ? '' : (parent[prop] === undefined ? '' : parent[prop]);
    }

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

        ko.bindingHandlers.clickToEdit = {
            init: function(element, valueAccessor) {
                var observable = valueAccessor(),
                    link = document.createElement("a"),
                    input = document.createElement("input");

                // add any classes specified for the link element
                $(link).addClass($(element).attr('data-link-class'));
                // add any classes specified for the input element
                $(input).addClass($(element).attr('data-input-class'));

                element.appendChild(link);
                element.appendChild(input);

                observable.editing = ko.observable(false);

                ko.applyBindingsToNode(link, {
                    text: ko.computed(function() {
                        // todo: style default text as grey
                        return ko.utils.unwrapObservable(observable) !== "" ? observable() : 'Click to enter';
                    }),
                    visible: ko.computed(function() {
                        return !observable.editing();
                    }),
                    click: observable.editing.bind(null, true)
                });

                ko.applyBindingsToNode(input, {
                    value: observable,
                    visible: observable.editing,
                    hasfocus: observable.editing
                });
            }
        };

        var Row = function (data) {
            var self = this;
            if (!data) data = {};
            this.name = ko.protectedObservable(orBlank(data.name));
            this.isUnknownIfWeed = ko.protectedObservable(orFalse(data.isUnknownIfWeed));
            this.areaCovered = ko.protectedObservable(orBlank(data.areaCovered));
            this.coverRating = ko.protectedObservable(orZero(data.coverRating));
            this.invasiveThreatCategory = ko.protectedObservable(orZero(data.invasiveThreatCategory));
            this.abundanceAndThreatScore = ko.computed(function () {
                if (isNaN(Number(self.coverRating())) || isNaN(Number(self.invasiveThreatCategory()))) {
                    return 0;
                }
                return Number(self.coverRating()) * Number(self.invasiveThreatCategory());
            });
            this.isSelected = ko.observable(true);
            this.commit = function () {
                self.doAction('commit');
            };
            this.reset = function () {
                self.doAction('reset');
            };
            this.doAction = function (action) {
                var prop, item;
                for (prop in self) {
                    if (self.hasOwnProperty(prop)) {
                        item = self[prop];
                        if (ko.isObservable(item) && item[action]) {
                           item[action]();
                        }
                    }
                }
            };
            this.hasData = function () {
                return !(self.name()===''&&!self.isUnknownIfWeed()&&self.areaCovered()===''&&
                self.invasiveThreatCategory()==0&&self.coverRating()==0);
            };
            this.toJSON = function () {
                var js = ko.toJS(this);
                delete js.isSelected;
                return js;
            };
        };

        function ViewModel () {
            var self = this;
            self.assessmentDate = ko.observable("${output.assessmentDate}").extend({simpleDate: false});
            self.collector = ko.observable("${output.collector}")/*.extend({ required: true })*/;
            self.activityId = ko.observable("${activity.activityId}");
            self.activityType = ko.observable("${activity.type}");
            self.data = {};
            self.data.weedAbundanceAndThreatScore = ko.observableArray([]);
            self.data.totalAreaCovered = ko.observable("${output.data?.totalAreaCovered}");
            self.selectedRow = ko.observable();
            self.data.totalAbundanceAndThreatScore = ko.computed(function () {
                var total = 0;
                for(var i = 0; i < self.data.weedAbundanceAndThreatScore().length; i++) {
                    var row = self.data.weedAbundanceAndThreatScore()[i];
                    total = total + row.abundanceAndThreatScore();
                }
                return total;
            });
            self.transients = {};
            self.transients.activityStartDate = ko.observable("${activity.startDate}").extend({simpleDate: false});
            self.transients.activityEndDate = ko.observable("${activity.endDate}").extend({simpleDate: false});

            self.addRow = function () {
                var newRow = new Row();
                self.data.weedAbundanceAndThreatScore.push(newRow);
                self.editRow(newRow);
            };
            self.removeRow = function (row) {
                self.data.weedAbundanceAndThreatScore.remove(row);
                self.selectedRow(null);
            };
            self.templateToUse = function (row) {
                return self.selectedRow() === row ? 'editTmpl' : 'itemsTmpl';
            };
            self.editRow = function (row) {
                self.selectedRow(row);
                row.isSelected(true);
            };
            self.accept = function (row) {
                // todo: validation
                row.commit();
                self.selectedRow(null);
                row.isSelected(false);
            };
            self.cancel = function (row) {
                if (row.hasData()) {
                    row.reset();
                    self.selectedRow(null);
                    row.isSelected(false);
                } else {
                    self.removeRow(row);
                }
            };
            self.save = function () {
                if ($('#validation-container').validationEngine('validate')) {
                    var jsData = ko.toJS(self);
                    // get rid of any transient observables
                    delete jsData.selectedRow;
                    delete jsData.activityType;
                    delete jsData.transients;
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
                if (data.weedAbundanceAndThreatScore !== undefined) {
                    $.each(data.weedAbundanceAndThreatScore, function (i, obj) {
                        self.data.weedAbundanceAndThreatScore.push(new Row(obj));
                    })
                }
            };
        }

        var viewModel = new ViewModel();
        viewModel.loadData(${output.data});

        ko.applyBindings(viewModel);

    });

</r:script>
</body>
</html>