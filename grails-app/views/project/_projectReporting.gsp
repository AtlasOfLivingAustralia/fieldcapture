<div id="project-reporting">
<table class="table table-striped">
    <thead>
        <th></th>
        <th>
            Milestone
        </th>
        <th>
            Report
        </th>
        <th>
            Due date
        </th>
        <th>
            Status
        </th>
    </thead>
    <tbody>
        <!-- ko foreach:reports -->
        <tr>
            <td><i class="fa fa-edit" data-bind="click:$parent.openReport"></i></td>
            <td data-bind="text:label"></td>
            <td data-bind="text:reportType"></td>
            <td data-bind="text:convertToSimpleDate(toDateLabel)"></td>
            <td data-bind="text:''"></td>
        </tr>
        <!-- /ko -->
    </tbody>
</table>
</div>

<asset:script>

    $(function() {
        var today = '${today}';
        var config = {
            openReportUrl: '${createLink([controller:'project', action:'reportPrototype', id:project.projectId])}'
        };
        _.extend(config, fcConfig);
        var viewModel = new ProjectReportingTabViewModel(fcConfig.project, today, config);
        ko.applyBindings(viewModel, document.getElementById('project-reporting'));
    });


</asset:script>
