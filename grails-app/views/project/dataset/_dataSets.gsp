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
    <table class="table table-striped w-100" data-bind="dataTable:dataTableConfig">
        <thead>
        <tr>
            <th class="actions">Actions</th>
            <th class="dataset-name">Title</th>
            <th class="date-created">Date Created</th>
            <th class="date-created-hidden">Date created (ISO format)</th>
            <th class="last-updated">Date last updated</th>
            <th class="last-updated-hidden">Date last updated (ISO format)</th>
            <th class="created-in">Created in</th>
            <th class="dataset-progress">Status</th>
        </tr>
        </thead>
        <tbody data-bind="foreach:dataSets">
        <tr>
            <td class="actions">
                <a class="btn btn-container btn-sm" data-bind="attr:{href:viewUrl}">
                    <i class="fa fa-eye" title="View this dataset"></i>
                </a>
                <a class="btn btn-container btn-sm" data-bind="attr:{href:editUrl}">
                    <i class="fa fa-edit" title="Edit this dataset"></i>
                </a>
                <a class="btn btn-container btn-sm" href="#" data-bind="click:deleteDataSet">
                    <i class="fa fa-remove" title="Delete this dataset"></i>
                </a>
            </td>
            <td class="dataset-name" data-bind="text:name"></td>
            <td class="date-created" data-bind="text:dateCreated.formattedDate"></td>
            <td class="date-created-hidden" data-bind="text:dateCreated"></td>
            <td class="last-updated" data-bind="text:lastUpdated.formattedDate"></td>
            <td class="last-updated-hidden" data-bind="text:lastUpdated"></td>
            <td class="created-in" data-bind="text:createdIn"></td>
            <td><button type="button" class="btn btn-sm" data-bind="activityProgress:progress">
                <span data-bind="text: progress"></span>
                </button>
            </td>
        </tr>
        </tbody>
    </table>
</div>
<!-- /ko -->
