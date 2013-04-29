<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>Edit | ${activity.activityId ?: 'new'} | ${site.name} | ${site.projectName} | Field Capture</title>
    <md:modelStyles model="${model}"/>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js"></script>
    <r:require modules="knockout,jqueryValidationEngine,datepicker"/>
</head>
<body>
<ul class="breadcrumb">
    <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
    <li><g:link controller="project" id="${site.projectId}">${site.projectName}</g:link> <span class="divider">/</span></li>
    <li><g:link controller="site" id="${site.siteId}">${site.name}</g:link> <span class="divider">/</span></li>
    <g:if test="${create}">
        <li class="active">Create new ouput</li>
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
        <span class="span3">Assessor: <span data-bind="text:collector"></span></span>
    </div>

    <!-- add the dynamic components -->
    <md:modelView model="${model}"/>

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
            <pre>Data model : ${model.dataModel}</pre>
            <pre>View model : ${model.viewModel}</pre>
            <pre>Output : ${output}</pre>
            <pre>Site : ${site}</pre>
            <pre>Activity : ${activity}</pre>
        </div>
    </div>

</div>

<r:script>

    $(function(){

// add any object declarations for the dynamic part of the model
<md:jsModelObjects model="${model}"/>

        function ViewModel () {
            var self = this;
            self.data = {};

// add the properties for the dynamic part of the model
<md:jsViewModel model="${model}"/>

            // add props that are standard for all outputs
            self.assessmentDate = ko.observable("${output.assessmentDate}").extend({simpleDate: false});
            self.collector = ko.observable("${output.collector}")/*.extend({ required: true })*/;
            self.activityId = ko.observable("${activity.activityId}");
            self.activityType = ko.observable("${activity.type}");
            self.activityStartDate = ko.observable("${activity.startDate}").extend({simpleDate: false});
            self.activityEndDate = ko.observable("${activity.endDate}").extend({simpleDate: false});

            self.loadData = function (data) {
// load data for the dynamic part of the model
<md:jsLoadModel model="${model}"/>
            }
        }

        var viewModel = new ViewModel();
        viewModel.loadData(${output.data});

        ko.applyBindings(viewModel);

    });

</r:script>
</body>
</html>>