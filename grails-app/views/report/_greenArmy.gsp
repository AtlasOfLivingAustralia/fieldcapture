
<head>
    <style type="text/css">
        #Docs tr.selected td {
            background-color: #FFFFCC;
        }
        #greenArmyReport th {
            white-space: normal;
        }
        #greenArmyReport th.participantInfo {
            background-color: #c8d295;
        }
        #greenArmyReport table {
            width:100%;
        }
        #greenArmyReport table.activityTable tfoot {
            border-top: 2px solid black;
        }


    </style>

</head>
<!-- ko stopBinding:true -->
<div id="greenArmyReport">
<h2>Green Army Reporting</h2>

<div class="row-fluid">
    <span class="span3">For financial year:
        <select name="financialYear" data-bind="value:financialYear, options:availableYears, optionsText:'label', optionsValue:'value'">
        </select>
    </span>
    <span class="span8"></span>
    <span class="span1"><asset:image src="green_army_logo.png" alt="Green Army Logo"/></span>
</div>

<g:set var="tabConfig" value="${[[name:'Jul',template:'monthly',title:'July',yearModifier:0], [name:'Aug',template:'monthly', title:'August',yearModifier:0], [name:'Sep',template:'monthly', title:'September',yearModifier:0], [name:'Oct',template:'monthly', title:'October',yearModifier:0], [name:'Nov',template:'monthly',title:'November',yearModifier:0], [name:'Dec',template:'monthly',title:'December',yearModifier:0], [name:'Jan',template:'monthly',title:'January',yearModifier:1], [name:'Feb',template:'monthly', title:'February',yearModifier:1], [name:'Mar',template:'monthly',title:'March',yearModifier:1], [name:'Apr',template:'monthly', title:'April', yearModifier:1], [name:'May',template:'monthly', title:'May',yearModifier:1], [name:'Jun',template:'monthly', title:'June',yearModifier:1],
                                 [name:'Q1',template:'quarterly', yearModifier:0, title:'July - September'], [name:'Q2',template:'quarterly', title:'October - December', yearModifier:0], [name:'Q3',template:'quarterly', title:'January - March', yearModifier:1], [name:'Q4',template:'quarterly', title:'April - June', yearModifier:1], [name:'Docs',template:'docsTemplate']]}"/>
<div class="row-fluid">
    <span class="span12">
        <ul class="nav nav-tabs" data-tabs="tabs">
            <g:each in="${tabConfig}" var="tab" status="i">
                <li class="tab"><a id="${tab.name}-tab" data-toggle="tab" href="#${tab.name}">${tab.name}</a></li>
            </g:each>

        </ul>
    </span>
</div>

<div class="tab-content">

<g:each in="${tabConfig}" var="tab">
    <div class="tab-pane" id="${tab.name}" data-bind="template:{name:'${tab.template}', data:${tab.name}ViewModel, afterRender:initialise}"></div>
</g:each>

</div>


<!-- Monthly report -->
<script id="monthly" type="text/html">

    <div class="well">
        <h3>Summary Statistics for <span data-bind="text:title"></span> (all projects)</h3>
        <div class="row-fluid">
            <span class="span6">
                <h4>Projects</h4>
                <div class="row-fluid"><span class="span10">Total number of projects:</span><b><span class="span2 text-center" data-bind="text:numberOfProjects"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of new projects:</span><b><span class="span2 text-center" data-bind="text:numberOfNewProjects"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of projects completed in period:</span><b><span class="span2 text-center" data-bind="text:completedProjects"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of projects not completed in period:</span><b><span class="span2 text-center" data-bind="text:numberOfProjects - completedProjects"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of projects behind schedule:</span><b><span class="span2 text-center" data-bind="text:projectsNotOnTrack"></span></b></div>

            </span>
            <span class="span6">
                <div class="row-fluid"><span class="span10"><h4>Participants and Training</h4></span></div>
                <div class="row-fluid"><span class="span10">Number of Indigenous Participants who commenced on projects:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Indigenous Participants who commenced projects'] || 0"></span></b></div>
                <div class="row-fluid"><span class="span10">Total number of Participants who commenced on projects:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Participants who commenced projects'] || 0"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of participants who did not complete projects in period:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Indigenous Participants who commenced projects'] || 0"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of participants who completed projects in period:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Participants who completed projects'] || 0"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of participants who commenced accredited training in period:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Participants who completed training'] || 0"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of participants who exited training in period:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Participants who exited training'] || 0"></span></b></div>
                <div class="row-fluid"><span class="span10">Number of participants who completed training in period:</span><b><span class="span2 text-center" data-bind="text:scores['No. of Participants who completed training'] || 0"></span></b></div>
            </span>

        </div>
    </div>

    <div class="well">
        <h3>Project-by-project Monthly Report for <span data-bind="text:title"></span></h3>
        <div class="row-fluid">
            <span class="span12">
                <table class="activityTable table table-striped">
                    <thead>

                    </thead>
                    <tfoot>
                    <tr class=""><td colspan="2">Totals</td></tr>
                    </tfoot>
                    <tbody></tbody>
                </table>
            </span>

        </div>

    </div>



</script>

<!-- Quarterly report -->

<script id="quarterly" type="text/html">


    <div class="well">
        <h3>Year-to-date Quarterly Report Summary</h3>
        <div class="row-fluid">
            <span class="span12">
                <table  class="summaryTable table-striped">
                    <thead>
                        <tr><th colspan="4">Project data</th><th colspan="7">Participant and Training Data</th></tr>
                        <tr>
                            <th style="width:10%;">Period</th>
                            <th style="width:9%;">Total projects</th>
                            <th style="width:9%;">Projects completed</th>
                            <th style="width:9%;">Projects not completed</th>
                            <th style="width:9%;" class="participantInfo">No. commencing projects</th>
                            <th style="width:9%;" class="participantInfo">No. indigenous commencing projects</th>
                            <th style="width:9%;" class="participantInfo">No. not completing projects</th>
                            <th style="width:9%;" class="participantInfo">No. completing projects</th>
                            <th style="width:9%;" class="participantInfo">No. starting training</th>
                            <th style="width:9%;" class="participantInfo">No. who exited training</th>
                            <th style="width:9%;" class="participantInfo">No. who completed training</th>
                        </tr>

                    </thead>
                    <tbody data-bind="foreach:{data:quarterlyScores, as:'scores'}">
                        <tr>
                            <!-- ko foreach:$parent.scoreLabels -->
                            <td data-bind="text:scores[$data]"></td>
                            <!-- /ko -->
                        </tr>

                    </tbody>
                </table>
            </span>

        </div>

    </div>

    <div class="well">
        <h3>Quarterly Report for <span data-bind="text:title"></span></h3>
        <div class="row-fluid">
            <span class="span12">
                <table class="activityTable table table-striped">
                    <th>
                        <tr>
                            <th colspan="7">Project Data</th>
                            <th colspan="7">Participant and Training Data</th>
                        </tr>
                        <tr>
                            <th>

                            </th>
                        </tr>
                    </th>
                </table>
            </span>

        </div>
    </div>

</script>

<!-- Ad hoc report -->

<script id="docsTemplate" type="text/html">


    <div class="well">
        <h3>Ad-hoc Documents</h3>
        <div class="row-fluid">
            <span class="span6">
                <table id="documents" class="table table-striped">
                    <thead>
                        <tr>

                        </tr>
                    </thead>

                    <tbody></tbody>
                </table>
            </span>
            <span class="span6" data-bind="with:selectedProject">
                <strong>Documents for Project <span data-bind="text:$parent.selectedGrantId"></span></strong>
                <table style="width:100%;">
                    <thead>
                        <tr>
                            <th>Date attached</th>
                            <th>Document type</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach:reports">
                        <tr>
                            <td><span data-bind="text:dateCreated.formattedDate()"></span></td>
                            <td><a data-bind="attr:{href:fcConfig.activityViewUrl+'/'+activityId+'?returnTo=javascript:window.close();'}" target="attachedDocument" title="View the document"><span data-bind="text:type"></span> </a></td>
                        </tr>

                    </tbody>
                </table>
            </span>
        </div>
    </div>
</script>

<script type="text/javascript">

    $(function() {


        function findOutputByName(activity, name) {

            var output = ko.utils.arrayFirst(activity.outputs, function(output) {
                return output.name === name;
            });
            return output;

        }

        function getOutputValue(activity, outputName, dataItem) {

            var output = findOutputByName(activity, outputName);
            return output ? output.data[dataItem]?output.data[dataItem]:'' : '';
        };

        var monthlyReports = <fc:modelAsJavascript model="${monthlyActivities}"/>;
        var quarterlyReports = <fc:modelAsJavascript model="${quarterlyReports}"/>;

        var outputValueRenderer = function(data) {
            var previous = data.previous;
            var current = data.current;

            if (!current) {
                return '';
            }
            if (!previous) {
                return current;
            }
            else if (current == previous) {
                return current;
            }
            return '<span title="Last month: '+previous+'" style="color:red">'+current+'</span>';

        }

        var MonthlyReportViewModel = function(title, activities, lastMonthsActivities, scores) {

            var self = this;

            var rows = [];

            var header = [
                {title:'${g.message(code:'label.merit.projectID')}', width:"15%"},
                {title:'Project status', width:"15%", source:{output:'Monthly Status Report Data', dataItem:'projectStatus'}, render:outputValueRenderer},
                {title:'Total No. commencing projects', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCommenced'}, render:outputValueRenderer},
                {title:'Total No. completing projects', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsCompleted'}, render:outputValueRenderer},
                {title:'No. not completing projects', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'totalParticipantsNotCompleted'}, render:outputValueRenderer},
                {title:'No. of indigenous participants commenced', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'totalIndigenousParticipantsCommenced'}, render:outputValueRenderer},
                {title:'Commenced accredited training', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'trainingCommencedAccredited'}, render:outputValueRenderer},
                {title:'Exited training', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'trainingNoExited'}, render:outputValueRenderer},
                {title:'Completed training', width:"10%", source:{output:'Monthly Status Report Data', dataItem:'trainingNoCompleted'}, render:outputValueRenderer}];

            $.each(activities, function(i, activity) {

                var row = [];
                row.push(activity.grantId);

                var previousMonth = undefined;
                if (lastMonthsActivities) {
                    previousMonth = $.grep(lastMonthsActivities, function (previousActivity) {
                        return activity.projectId == previousActivity.projectId;
                    });
                    if (previousMonth.length) {
                        previousMonth = previousMonth[0];
                    }
                    else {
                        previousMonth = undefined;
                    }
                }

                for (var j=1; j<header.length; j++) {

                    var item = {current:getOutputValue(activity, header[j].source.output, header[j].source.dataItem)};
                    if (previousMonth) {
                        item.previous = getOutputValue(previousMonth, header[j].source.output, header[j].source.dataItem);
                    }
                    row.push(item);
                }
                rows.push(row);

            });


            self.title = title;
            self.initialise = function(element) {
                $(element).find('.activityTable').dataTable( {
                    "aaData": rows,
                    "aoColumns": header,
                    "autoWidth":false,
                    "initComplete": function ( settings, json ) {
                        var api = this.api();

                        var projectColumns = [0,1];
                        var participantColumns = [2, 3, 4, 5, 6, 7, 8];
                        api.columns(projectColumns).header().to$().addClass('projectInfo');
                        api.columns(participantColumns).header().to$().addClass('participantInfo');

                        var header = api.table().header();
                        $(header).prepend('<tr><th colspan="'+projectColumns.length+'">Project Data</th><th colspan="'+participantColumns.length+'">Participant and Training Data</th></tr>')


                    },
                    "footerCallback": function ( tfoot, data, start, end, display ) {
                        var api = this.api();

                        // Remove the formatting to get integer data for summation
                        var intVal = function ( i ) {
                            return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                                    typeof i === 'number' ?
                                            i : 0;
                        };

                        // Total over all numerical columns and all pages
                        for (var i=2; i<=8; i++) {


                            var data = api.column(i).data();
                            var total = data
                                    .reduce(function (a, b) {
                                        return intVal(a) + intVal(b.current);
                                    }, 0);

                            // Total over this page
                            var pageTotal = api
                                    .column(i, {page: 'current'})
                                    .data()
                                    .reduce(function (a, b) {
                                        return intVal(a) + intVal(b.current);
                                    }, 0);

                            // Update footer
                            var footerRow = $(api.table().footer()).find('tr');
                            var col = footerRow.find('td.col'+i);
                            if (!col.length) {
                                footerRow.append('<td class="col'+i+'">'+pageTotal + ' ('+total + ' total)</td>');
                            }
                            else {
                                col.text(pageTotal + ' ('+total + ' total)');
                            }

                        }
                    }
                } );
            };

            self.numberOfProjects = activities.length;

            self.scores = {};
            if (scores) {
                $.each(scores.results, function(i, score) {

                    if (score.results && score.results[0]) {
                        self.scores[score.results[0].label] = score.results[0].result;
                    }

                });
            }
            var projectsByStatus = self.scores['Count of projects by project status'];
            var newProjects = 0, completedProjects = 0, onTrack = 0, notOnTrack = 0;
            if (projectsByStatus && projectsByStatus.results && projectsByStatus.results[0]) {
                newProjects = projectByStatus.results[0].result['Commenced'] || 0;
                completedProjects = projectByStatus.results[0].result['Completed'] || 0;
                onTrack = (projectByStatus.results[0].result['Progressing - on schedule'] || 0);
                notOnTrack = (projectByStatus.results[0].result['Progressing - behind schedule'] || 0) +
                               (projectByStatus.results[0].result['Cancelled'] || 0);

            }

            self.numberOfNewProjects = newProjects;
            self.completedProjects = completedProjects;
            self.projectsOnTrack = onTrack;
            self.projectsNotOnTrack = notOnTrack;
        };

        var QuarterlyReportViewModel = function(title, activities, scores, showOrganisation) {

            var self = this;
            self.title = title;

            var output = 'Three Monthly Report';
            var header = [
                {title:'No. of incidents', width:"6.25%", source:{output:output, dataItem:'incidentCount'}},
                {title:'No. of complaints', width:"6.25%", source:{output:output, dataItem:'complaintCount'}},
                {title:'No. of training activities', width:"6.25%", source:{output:output, dataItem:'complaintCount'}},
                {title:'No. of withdrawals', width:"6.25%", source:{output:output, dataItem:'complaintCount'}},
                {title:'No. of exits', width:"6.25%", source:{output:output, dataItem:'complaintCount'}},
                {title:'No. starting training', width:"6.25%", source:{output:output, dataItem:'complaintCount'}},
                {title:'No. who exited training', width:"6.25%", source:{output:output, dataItem:'complaintCount'}},
                {title:'17 yrs', width:"6.25%", source:{output:output, dataItem:'no17Years'}},
                {title:'18 yrs', width:"6.25%", source:{output:output, dataItem:'no18Years'}},
                {title:'19 yrs', width:"6.25%", source:{output:output, dataItem:'no19Years'}},
                {title:'20 yrs', width:"6.25%", source:{output:output, dataItem:'no20Years'}},
                {title:'21 yrs', width:"6.25%", source:{output:output, dataItem:'no21Years'}},
                {title:'22 yrs', width:"6.25%", source:{output:output, dataItem:'no22Years'}},
                {title:'23 yrs', width:"6.25%", source:{output:output, dataItem:'no23Years'}},
                {title:'24 yrs', width:"6.25%", source:{output:output, dataItem:'no24Years'}},
                {title:'Total participants', width:"6.25%", source:{output:output, dataItem:'totalParticipants'}}];


            var rows = [];
            if (activities) {
                $.each(activities, function (i, activity) {

                    var row = [];
                    if (showOrganisation) {
                        row.push(activity.organisationName);
                    }

                    for (var j = 0; j < header.length; j++) {
                        row.push(getOutputValue(activity, header[j].source.output, header[j].source.dataItem));
                    }
                    rows.push(row);

                });
            }

            if (showOrganisation) {
                header = [].concat({sTitle:'Organisation'}, header);
            }

            function findScoreByLabel(scores, label) {
                for (var i=0; i<scores.length; i++) {
                    if (scores[i].results && scores[i].results[0]) {
                        if (scores[i].results[0].label == label) {
                            return scores[i].results[0].result;
                        }
                    }
                }
            }
            self.scoreLabels = ['group', 'Total projects', 'Projects completed', 'Projects not completed', 'No. of Participants who commenced projects', 'No. of Indigenous Participants who commenced projects', 'No. of Participants who did not complete projects', 'No. of Participants who completed projects', 'No. participants starting accredited training', 'No. of Participants who exited training', 'No. of Participants who completed training'];
            self.quarterlyScores = [];
            if (scores) {
                $.each(scores, function(i, groupedScores) {

                    var group = groupedScores.group;
                    if (group.indexOf('Before') < 0 && group.indexOf('After') < 0) {
                        var row = {group:group};

                        for (var j=1; j<4; j++) {
                            row[self.scoreLabels[j]] = ko.observable(); // These will be initialised from the monthly reports.
                        }
                        for (var j=4; j<self.scoreLabels.length; j++) {
                            row[self.scoreLabels[j]] = findScoreByLabel(groupedScores.results, self.scoreLabels[j]);
                        }
                        self.quarterlyScores.push(row);
                    }
                });
            }

            this.initialise = function(element, model) {

                var months = [['Jul', 'Aug', 'Sep'], ['Oct', 'Nov', 'Dec'], ['Jan', 'Feb', 'Mar'], ['Apr', 'May', 'Jun']];
                for (var quarter = 0; quarter < months.length; quarter++) {
                    var numberOfProjects = 0;
                    var completedProjects = 0;
                    for (var i=0; i<months[quarter].length; i++) {
                        numberOfProjects += model[months[quarter][i]+'ViewModel'].numberOfProjects;
                        completedProjects += model[months[quarter][i]+'ViewModel'].completedProjects;
                    }
                    self.quarterlyScores[quarter]['Total projects'](numberOfProjects);
                    self.quarterlyScores[quarter]['Projects completed'](completedProjects);
                    self.quarterlyScores[quarter]['Projects not completed'](numberOfProjects = completedProjects);

                }

                var options = {
                    "data": rows,
                    "columns": header,
                    "autoWidth":false,
                    "initComplete": function ( settings, json ) {
                        var api = this.api();

                        var projectColumns = [0, 1];
                        var participantColumns = [2, 3, 4, 5, 6] ;
                        var participantDemographicColumns = [7, 8, 9, 10, 11, 12, 13, 14, 15];
                        if (showOrganisation) {
                            projectColumns = [0, 1, 2];
                            participantColumns = [3, 4, 5, 6, 7];
                            participantDemographicColumns = [8, 9, 10, 11, 12, 13, 14, 15, 16];
                        }
                        var header = api.table().header();
                        $(header).prepend('<tr><th colspan="'+projectColumns.length+'">Project Data</th><th colspan="'+participantColumns.length+'">Participant and Training Data</th><th colspan="'+participantDemographicColumns.length+'">Participant Deomographics</th></tr>')

                        api.columns(projectColumns).header().to$().addClass('projectInfo');
                        api.columns(participantColumns).header().to$().addClass('participantInfo');
                        api.columns(participantDemographicColumns).header().to$().addClass('participantInfo');
                    }
                };
                if (!showOrganisation) {
                    options.paging = false;
                    options.searching = false;
                }
                $(element).find('.activityTable').dataTable( options );
            };
        };

        var reportCategories = [{type:'Green Army - Desktop Audit Checklist', title:'Audits undertaken'}, {type:'Green Army - Change or Absence of Team Supervisor', title:'Team supervisor notification'}, {type:'', title:'Other'}];

        var ProjectReportsViewModel = function(grantId, projectId, reports) {
            var self = this;
            self.grantId = grantId;
            self.reports = [];
            self.projectId = projectId;


            $.each(reportCategories, function(i, category) {
                self[category.title] = 0;
            });

            // Do a count for each category.
            $.each(reports, function(i, report) {
                var found = false;
                $.each(reportCategories, function(i, category) {
                    if (category.type == report.type) {
                        found = true;
                        self[category.title]++;
                        return false;
                    }
                });
                if (!found) {
                    self['Other']++;
                }
                self.reports.push({
                    dateCreated:ko.observable(report.dateCreated).extend({simpleDate:false}),
                    type:report.type,
                    activityId:report.activityId
                })

            });

        };
        var AdHocReportsViewModel = function(projectReports) {

            var self = this;
            self.categories = $.map(reportCategories, function(category) {
                return category.title;
            });

            self.projects = [];

            $.each(projectReports, function(i, project) {
                self.projects.push(new ProjectReportsViewModel(project.grantId, project.projectId, project.reports));
            });

            var columns = [
                {"title":"${g.message(code:'label.merit.projectID')}", "data":"grantId"}
            ];
            $.each(reportCategories, function(i, category) {
                columns.push({"title":category.title, "data":category.title});
            });

            self.selectedGrantId = ko.observable();
            self.selectedProjectId = ko.observable();

            if (self.projects.length > 0) {
                self.selectedGrantId(self.projects[0].grantId);
                self.selectedProjectId(self.projects[0].projectId);
            }

            self.selectedProject = ko.computed(function() {
                var project = $.grep(self.projects, function(project) {
                    return project.projectId == self.selectedProjectId();
                });
                if (project[0]) {
                    return project[0];
                }
                return self.projects[0];
            });

            this.initialise = function() {
                var $table = $('#documents');
                $table.dataTable({
                    columns:columns,
                    data:self.projects,
                    initComplete:function(settings, json) {

                        if (self.projects.length > 0) {
                            var api = this.api();
                            $(api.row(0).node()).addClass('selected');
                            $('#documents tbody').on('click', 'tr', function () {
                                $table.find('tr.selected').removeClass('selected');
                                $(this).addClass('selected');
                                var selectedRow = api.row('.selected');
                                if (selectedRow && selectedRow.data()) {
                                    var grantId = selectedRow.data().grantId
                                    self.selectedGrantId(grantId);
                                    self.selectedProjectId(selectedRow.data().projectId);
                                }
                            });
                        }
                    }
                });
            };

        };

        var projectReports = <fc:modelAsJavascript model="${adHocReports}"/>;
        var monthlySummaryScores = <fc:modelAsJavascript model="${monthlySummary.outputData}"/>;
        var quarterlySummaryScores = <fc:modelAsJavascript model="${quarterlySummary.outputData}"/>;
        var availableYears = <fc:modelAsJavascript model="${availableYears}"/>;

        var ViewModel = function(availableYears, selectedYear) {


            var self = this;
            self.availableYears = availableYears;
            self.financialYear = ko.observable(selectedYear);

            self.financialYear.subscribe(function(year) {

                if (year != selectedYear) {
                var $content = $('#dashboard-content');
                var $loading = $('.loading-message');
                $content.hide();
                $loading.show();

                var reportType = $('#dashboardType').val();

                $.get(fcConfig.dashboardUrl, {report:reportType, financialYear:year}).done(function(data) {
                    $content.html(data);
                    $loading.hide();
                    $content.show();

                });
                }
            });

            var year = selectedYear;
            var title;
            var shortTitle;

            var prevTitle;
            <g:each in="${tabConfig}" var="tab">

                <g:if test="${tab.template != 'docsTemplate'}">
                var tabYear = year+${tab.yearModifier};
                title = '${tab.title} '+ tabYear;
                shortTitle = '${tab.name} ' + tabYear;

                <g:if test="${tab.template == 'monthly'}">
                var monthlyScores = $.grep(monthlySummaryScores, function(results) {
                    return results.group == shortTitle;
                })[0];

                self.${tab.name}ViewModel = new MonthlyReportViewModel(title, monthlyReports[title], monthlyReports[prevTitle], monthlyScores);
                </g:if>
                <g:if test="${tab.template == 'quarterly'}">
                self.${tab.name}ViewModel = new QuarterlyReportViewModel(title, quarterlyReports['${tab.name}'], quarterlySummaryScores, ${includeOrganisationName});
                </g:if>
                </g:if>
                <g:if test="${tab.template == 'docsTemplate'}">
                self.${tab.name}ViewModel = new AdHocReportsViewModel(projectReports);
                </g:if>

                prevTitle = title;

            </g:each>

            self.initialise = function(element, model) {
                model.initialise(element, self);

            };
            $('#${tabConfig[0].name}-tab').click();
        };
        ko.applyBindings(new ViewModel(availableYears, ${financialYear}), document.getElementById('greenArmyReport'));


    });


    </script>

</div>




%{--<div>--}%

    %{--<fc:groupedTable elementId="gatable" scores="${--}%
        %{--['No. non indigenous participants starting accredited training', 'No. indigenous participants starting accredited training', 'No. non indigenous participants commencing non-accredited training', 'No. indigenous participants commencing non-accredited training',--}%
         %{--'No. of non indigenous Participants who exited training during period', 'No. of indigenous Participants who exited training during period', 'No. of non indigenous Participants who completed training in period', 'No. of indigenous Participants who completed training in period',--}%
        %{--'No. of non indigenous Participants who commenced projects in period', 'No. of indigenous Participants who commenced projects in period', 'No. of non indigenous Participants who did not complete projects in period', 'No. of indigenous Participants who did not complete projects in period',--}%
        %{--'No. of non indigenous Participants who completed projects in period', 'No. of indigenous Participants who completed projects in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%

%{--<div>--}%
    %{--Indigenous Training participation by Month--}%
    %{--<fc:groupedChart elementId="trainingchartindigenous" scores="${['No. indigenous participants starting accredited training', 'No. indigenous participants commencing non-accredited training', 'No. of indigenous Participants who exited training during period', 'No. of indigenous Participants who completed training in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%

%{--<div>--}%
    %{--Non-Indigenous Training participation by Month--}%
    %{--<fc:groupedChart elementId="trainingchartnonindigenous" scores="${['No. non indigenous participants starting accredited training', 'No. non indigenous participants commencing non-accredited training', 'No. of non indigenous Participants who exited training during period', 'No. of non indigenous Participants who completed training in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%


%{--<div>--}%
    %{--Indigenous Project participation by Month--}%
    %{--<fc:groupedChart elementId="projectchartindigenous" scores="${['No. of indigenous Participants who commenced projects in period', 'No. of indigenous Participants who did not complete projects in period', 'No. of indigenous Participants who completed projects in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%

%{--<div>--}%
    %{--Non-Indigenous Project participation by Month--}%
    %{--<fc:groupedChart elementId="projectchartnonindigenous" scores="${['No. of non indigenous Participants who commenced projects in period', 'No. of non indigenous Participants who did not complete projects in period', 'No. of Participants who completed Projects in period'].collect{[label:it]}}" data="${report.outputData}"/>--}%
%{--</div>--}%


%{--<div>--}%


    %{--<g:each in="${report.outputData}" var="group">--}%

        %{--<div>--}%
            %{--<h4>${group.group}</h4>--}%
            %{--<g:each in="${group.results}" var="score">--}%
                %{--<fc:renderScore score="${score}"/>--}%
            %{--</g:each>--}%
        %{--</div>--}%


    %{--</g:each>--}%


%{--</div>--}%
</div>

<!-- /ko -->