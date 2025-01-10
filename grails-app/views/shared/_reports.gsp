
<table id="report" class="table">
    <thead>
        <tr>
            <th class="sorting">MERIT Project ID</th>
            <th class="sorting">Programme</th>
            <th class="sorting">Sub-programme</th>
            <th class="sorting" width="30%">Project name</th>
            <th class="sorting">Organisation / Service Provider</th>
            <th class="sorting">Current Report Status</th>
            <th class="sorting">Current Phase</th>
            <th class="sorting">Reporting History</th>
            <g:if test="${allowProjectRecommendation}">
            <th>Recommend as case study (tick box)</th>
            </g:if>
        </tr>
    </thead>
    <tbody data-bind="foreach:projects">
        <tr>
            <td><a data-bind="attr:{href:fcConfig.projectViewUrl+'/'+projectId}"><span data-bind="text:grantId"></span></a></td>
            <td data-bind="text:associatedProgram"></td>
            <td data-bind="text:associatedSubProgram"></td>
            <td class="project"><a data-bind="attr:{href:fcConfig.projectViewUrl+'/'+projectId}"><span data-bind="text:name"></span></a></td>
            <td class="organisations">
                <!-- ko foreach:currentAssociatedOrgs -->
                <div class="organisationName">
                    <a data-bind="visible:ko.utils.unwrapObservable($data.organisationId),attr:{href:fcConfig.organisationLinkBaseUrl+'/'+ko.utils.unwrapObservable($data.organisationId)}">
                        <span data-bind="text:$data.name"></span>
                    </a>
                    <span data-bind="visible:!ko.utils.unwrapObservable($data.organisationId),text:$data.name"></span>
                </div>
                <!-- /ko -->
            </td>
            <td>
                <div class="layout-container">
                <div data-bind="text:currentStatus, css:{late:isOverdue}" style="margin-right:2em;"></div><i class="see-more fa pointer" data-bind="visible:extendedStatus.length>0, click:toggleExtendedStatus, css:{'fa-plus':!extendedStatusVisible(), 'fa-minus':extendedStatusVisible()}"></i>
                <ul class="unstyled" data-bind="visible:extendedStatusVisible">
                    <!-- ko foreach:extendedStatus -->
                    <hr/>
                    <li data-bind="text:$data"></li>
                    <!-- /ko -->
                </ul>
                </div>

            </td>
            <td data-bind="text:meriPlanStatus()"></td>
            <td data-bind="click:toggleHistory">
                <div class="layout-container">
                    <em data-bind="visible:!historyVisible()">Show history </em><i data-bind="visible:!historyVisible()" class="see-more fa fa-plus pointer"></i>
                    <em data-bind="visible:historyVisible()">Hide history </em><i data-bind="visible:historyVisible()" class="fa fa-minus see-more pointer"></i>
                </div>
            </td>
            <g:if test="${allowProjectRecommendation}">
            <td><label class="checkbox"><input type="checkbox" data-bind="checked:recommendAsCaseStudy"><span data-bind="visible:savingCaseStudy"><asset:image src="ajax-saver.gif" alt="saving icon"/> saving</span></label></td>
            </g:if>
        </tr>
</tbody>
</table>

<table id="dataTable" data-bind="delegatedHandler: 'click'"></table>

<asset:script>
$(function() {
    var options = {
        userProjectsUrl: fcConfig.userProjectsUrl,
        tableSelector: '#report'
    };
    var projects = <fc:modelAsJavascript model="${memberProjects}" default="[]"/>;
    var viewModel = new ProjectReportingViewModel(projects, options);
    ko.applyBindings(viewModel, document.getElementById('report'));


});
</asset:script>
