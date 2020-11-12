<div id="project-data-sets">
    <h3>Project data sets</h3>

    <!-- ko stopBinding: true -->

    <table class="table table-striped" id="data-sets-list">
        <thead>
            <tr>
                <th class="actions">Actions</th>
                <th class="dataset-name">Title</th>
                <th></th>
            </tr>
        </thead>
        <tbody data-bind="foreach:dataSets">
            <tr>
                <td class="actions">
                    <a class="btn btn-container" data-bind="attr:{href:editUrl}">
                        <i class="fa fa-edit" title="Edit this dataset"></i>
                    </a>
                    <a class="btn btn-container" href="#" data-bind="click:deleteDataSet">
                        <i class="fa fa-remove" title="Delete this dataset"></i>
                    </a>
                </td>
                <td class="dataset-name" data-bind="text:name"></td>
                <td></td>
            </tr>
        </tbody>

    </table>
    <!-- /ko -->

</div>