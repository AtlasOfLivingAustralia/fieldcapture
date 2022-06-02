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
    <table class="table table-striped">
        <thead>
        <tr>
            <th class="actions">Actions</th>
            <th class="dataset-name">Title</th>
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
            <td><button type="button" class="btn btn-sm" data-bind="activityProgress:progress">
                <span data-bind="text: progress"></span>
            </button>
            </td>
        </tr>
        </tbody>
    </table>
</div>
<!-- /ko -->
