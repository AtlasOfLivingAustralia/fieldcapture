<!DOCTYPE HTML>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Manage Investment Priorities | MERIT</title>
    <script>
        window.fcConfig = {
            saveInvestmentPriorityUrl: "${g.createLink(action: 'saveInvestmentPriority')}",
            deleteInvestmentPriorityUrl: "${g.createLink(action: 'deleteInvestmentPriority')}",
        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="select2/css/select2.css"/>
    <asset:stylesheet src="select2-theme-bootstrap4/select2-bootstrap.css"/>
</head>
<body>
<div id="wrapper" class="${containerType}">
    <section aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <li class="breadcrumb-item"><g:link controller="admin">Admin</g:link></li>
            <li class="breadcrumb-item">Manage investment priorities</li>
        </ol>
    </section>
    <h3>Manage Investment Priorities</h3>
    <p>
        To add a new investment priority, first search for the investment priority you want to add. If it doesn't exist, you can create a new one. You can also edit or delete existing investment priorities.
    </p>

    <hr/>
    <p>
        To create a new category of investment priorities and bulk assign it to investment priorities for use in a program:
        <ol>
        <li>If possible, perform a search of the investment priorities to narrow the values you might want to select</li>
        <li>Press the "Copy" button above the table below, if you haven't performed a search all investment priorities will be copied</li>
        <li>Paste into a new Excel spreadsheet</li>
        <li>Delete the row for any investment priority you don't want in the new category</li>
        <li>Press add category and attach the Excel spreadsheet</li>
        </ol>
        Note that if the category already exists, new investment priorities will be added to the existing category.
        Investment priorities already in the category but not in the uploaded spreadsheet will not be removed from the category as it could affect existing programs.
    </p>
    <button class="btn btn-info" data-bind="click:showUpdateCategory">Add or edit a category</button>


    <div class="pill-pane tab-pane">
        <table class="table w-100 investment-priorities">
            <thead>
            <tr>
                <th class="investment-priority-id">Investment Priority ID</th>
                <th class="type">Type</th>
                <th class="name">Name</th>
                <th class="categories">Categories <fc:iconHelp>Program outcomes specify a list of categories that define the investment priority categories associated with that outcome</fc:iconHelp></th>
                <th id="management-units" class="management-units">Management units <fc:iconHelp>Management unit/s in which this investment priority occurs</fc:iconHelp></th>
                <th class="actions"><span class="visually-hidden">Actions</span></th>
            </tr>
            </thead>
            <tbody data-bind="foreach: investmentPriorities">
            <tr>
                <td class="Customize Toolbar…">
                    <span data-bind="text:investmentPriorityId"></span>
                </td>
                <td class="name">
                    <span data-bind="text:type"></span>
                </td>
                <td class="name">
                    <span data-bind="text:name"></span>
                </td>
                <td class="categories">
                    <span data-bind="text: categories().join(', ')"></span>
                </td>
                <td class="management-units">
                    <textarea aria-labelledby="management-units" name="management-units" class="form-control" readonly data-bind="text: managementUnitLabels()" rows="4"></textarea>
                </td>

                <td class="actions">
                    <button class="btn btn-mini editTag" title="Edit this investment priority" type="button" data-bind="click:$parent.edit"><i class="fa fa-edit"></i></button>
                </td>
            </tr>
            </tbody>
            <tfoot data-bind="if: canAddNewInvestmentPriority">
            <tr>
                <td colspan="6" class="admin-actions">
                    <button type="button" class="btn btn-sm btn-success" disabled data-bind="enable:canAddNewInvestmentPriority, click:newInvestmentPriority">
                        <i class="fa fa-plus"></i> Add new investment priority</button>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>

    <div id="editInvestmentPriority" class="modal" tabindex="-1"  data-bind="with:editableInvestmentPriority">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"><span data-bind="text:isNew ? 'Add' : 'Edit'"></span> investment priority</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="type" class="form-label">Type of investment priority <fc:iconHelp>This value is used for the investment priority type facet on the Project Explorer</fc:iconHelp></label>
                            <select id="type" class="form-select form-select-sm" data-bind="value:type, options:investmentPriorityTypes">
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" id="name" class="form-control form-control-sm" data-bind="value:name">
                        </div>
                        <div class="mb-3">
                            <label for="categories" class="form-label">Categories <fc:iconHelp>Investment priority categories are used to restrict the investment priorities available for selection for a specific program</fc:iconHelp></label>
                            <select id="categories" multiple="multiple" class="form-select form-select-sm"
                                    style="width:100%" <%-- select 2 needs this hint --%>
                                    data-bind="options: availableCategories, enabled: editable(), multiSelect2:{value: categories}"></select>
                        </div>
                        <div class="mb-3">
                            <label for="management-unit" class="form-label">Management units <fc:iconHelp>If a project is assigned to a Management Unit, only investment priorities in that management unit will be available for selection.  Leave this blank for investment priorities that should be available in all management units</fc:iconHelp></label>
                            <select title="Management unit/s in which this investment priority occurs"
                                    style="width:100%" <%-- select 2 needs this hint --%>
                                    multiple="multiple" class="form-select form-select-sm"
                                    data-bind="options: $parent.availableManagementUnits, optionsValue:'managementUnitId', optionsText:'name', enabled: editable(), multiSelect2:{value: managementUnits}"></select>

                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bind="enable:saveable, click:function() { isNew ? $parent.addInvestmentPriority(this) : $parent.updateInvestmentPriority(this) }">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <div id="editCategory" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Bulk add or edit an investment priority category</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <g:uploadForm class="updateCategory" action="updateInvestmentPriorityCategory">
                <div class="modal-body">

                        <div class="mb-3">
                            <label class="form-label" for="category">Category</label>
                            <input id="category" type="text" name="category" class="form-control form-control-sm" required>

                        </div>
                        <div class="mb-3">
                            <label for="investmentPriorities">Please attach a spreadsheet containing the list of investment priorities to include in this category</label>
                            <input class="form-control" id="investmentPriorities" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="investmentPriorities">
                        </div>


                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button id="btnUpdateProjectOrgs" class="btn btn-sm btn-info" title="Bulk create organisations">Upload</button>
                </div>
                    </g:uploadForm>
            </div>
        </div>
</div>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="select2/js/select2.full.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
<asset:javascript src="admin.js"/>

<asset:script>

    const investmentPriorities = <fc:modelAsJavascript model="${investmentPriorities}"/>;

    $(function () {

        let config = _.extend({
            availableTypes: <fc:modelAsJavascript model="${availableTypes}"/>,
            categoriesByType: <fc:modelAsJavascript model="${categoriesByType}"/>,
            availableManagementUnits: <fc:modelAsJavascript model="${managementUnits}"/>,
            modalSelector:'#editInvestmentPriority',
            categoryUpdateModalSelector:'#editCategory'
        }, window.fcConfig);

        const viewModel = new ManageInvestmentPrioritiesViewModel(investmentPriorities, config);
        ko.applyBindings(viewModel, document.getElementById('wrapper'));

        // This needs to be done after the table is rendered by the applyBindings call.
        viewModel.initialiseDataTable('table.investment-priorities');

    });

</asset:script>

<asset:deferredScripts/>
</body>

</html>
