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
            <span data-bind="text:activityStartDate.formattedDate"></span>-<span data-bind="text:activityEndDate.formattedDate"></span>
        </g:link><span class="divider">/</span></li>
        <li class="active">Output</li>
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
                <span data-bind="text:activityStartDate.formattedDate"></span>/<span data-bind="text:activityEndDate.formattedDate"></span>
            </div>
        </h2>
    </div>

    <div class="row-fluid span12">
        <span class="span3">Assessment date: <span data-bind="text:assessmentDate.formattedDate"></span></span>
        <span class="span3">Collector: <span data-bind="text:collector"></span></span>
    </div>

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
                </tr>
            </thead>
            <tbody data-bind="foreach: data.weedAbundanceAndThreatScore">
                <tr>
                    <td data-bind="text:name"></td>
                    <td><i data-bind="visible:isUnknownIfWeed" class="icon-ok"></i></td>
                    <td data-bind="text:areaCovered"></td>
                    <td data-bind="text:coverRating"></td>
                    <td data-bind="text:invasiveThreatCategory"></td>
                    <td data-bind="text:abundanceAndThreatScore"></td>
                </tr>
            </tbody>
            <tfoot>
            <tr>
                <td></td>
                <td>Total cover</td>
                <td data-bind="text:data.totalAreaCovered"></td>
                <td colspan="2">Total Abundance & Threat Score</td>
                <td data-bind="text:data.totalAbundanceAndThreatScore"></td>
            </tr>
            </tfoot>
        </table>
    </div>

    <div class="row-fluid span12">
        <button type="button" class="btn"
                onclick="document.location.href='${createLink(action:"edit", id:"${output.outputId}")}'"
        >Edit this data</button>
    </div>

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
            self.activityStartDate = ko.observable("${activity.startDate}").extend({simpleDate: false});
            self.activityEndDate = ko.observable("${activity.endDate}").extend({simpleDate: false});
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
</html>>