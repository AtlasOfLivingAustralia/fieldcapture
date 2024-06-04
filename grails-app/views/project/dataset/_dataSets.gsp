<!-- ko stopBinding: true -->
<div id="project-data-sets">
    <h3>Project data set summaries</h3>
    <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.DATA_SET_DESCRIPTION}"/>
    <div class="row">
        <div class="col-sm-12">
            <div class="form-group form-actions">
                <button class="btn btn-sm btn-primary" type="button" data-bind="click:newDataSet">New data set summary</button>
            </div>
        </div>
    </div>
    <table class="table table-striped w-100" data-bind="dataTable:dataTableConfig, css: { 'dataset-summary-with-dates':supportsDateColumn, 'dataset-summary':!supportsDateColumn }">
        <thead>
        <tr>
            <th class="actions">Actions</th>
            <th class="dataset-name">Title</th>
            <th class="service">Service <fc:iconHelp>This data set can only be reported against the service specified</fc:iconHelp></th>
            <th class="report">Report <fc:iconHelp>If this data set has been used in a report, it is displayed here</fc:iconHelp></th>
            <th class="date-created">Date created</th>
            <th class="date-created-hidden">Date created (ISO format)</th>
            <th class="last-updated">Date last updated</th>
            <th class="last-updated-hidden">Date last updated (ISO format)</th>
            <th class="created-in">Created in</th>
            <th class="dataset-progress">Status  <fc:iconHelp html="true">

                <div class="row mb-2">
                    <span class="col-4"><span class="btn btn-success">started</span></span>
                    <span class="col-8">Data entry has started but the 'This form is complete' checkbox has not been selected</span>
                </div>
                <div class="row mb-2">
                    <span class="col-4"><span class="btn btn-info">finished</span></span>
                    <span class="col-8">Data entry has finished and the data set summary is ready for use in reporting forms</span>
                </div>
                <div class="row mb-2">
                    <span class="col-4"><span class="btn btn-warning">sync in progress</span></span>
                    <span class="col-8">The Monitor app is syncing the data set with MERIT</span>
                </div>
                <div class="row mb-2">
                    <span class="col-4"><span class="btn btn-danger">sync error</span></span>
                    <span class="col-8">There was an error syncing data from the Monitor app</span>
                </div>

            </fc:iconHelp></th>

        </tr>
        </thead>
        <tbody data-bind="foreach:dataSets">
        <tr>
            <td class="actions">
                <a class="btn btn-container btn-sm" data-bind="attr:{href:viewUrl}">
                    <i class="fa fa-eye" title="View this dataset"></i>
                </a>
                <a class="btn btn-container btn-sm" data-bind="visible:!readOnly,attr:{href:editUrl}">
                    <i class="fa fa-edit" title="Edit this dataset"></i>
                </a>
                <a class="btn btn-container btn-sm" href="#" data-bind="visible:!readOnly,click:deleteDataSet">
                    <i class="fa fa-remove" title="Delete this dataset"></i>
                </a>
            </td>
            <td class="dataset-name" data-bind="text:name"></td>
            <td class="service" data-bind="text:service"></td>
            <th class="report"><a data-bind="text:report, attr:{href:reportUrl}"></a></th>
            <td class="date-created" data-bind="text:dateCreated.formattedDate"></td>
            <td class="date-created-hidden" data-bind="text:dateCreated"></td>
            <td class="last-updated" data-bind="text:lastUpdated.formattedDate"></td>
            <td class="last-updated-hidden" data-bind="text:lastUpdated"></td>
            <td class="created-in" data-bind="text:createdIn"></td>
            <td>
                <report-status params="reportStatus:publicationStatus"></report-status>
                <button type="button" class="btn btn-sm" data-bind="activityProgress:progress">
                <span data-bind="text: progress"></span>
                </button>

            </td>
        </tr>
        </tbody>
    </table>
</div>
<!-- /ko -->
