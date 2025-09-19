<!DOCTYPE HTML>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Manage Investment Priorities | MERIT</title>
    <script>
        window.fcConfig = {
            updateInvestmentPriorityUrl: "${g.createLink(action: 'updateInvestmentPriority')}",
            addInvestmentPriorityUrl: "${g.createLink(action: 'addInvestmentPriority')}",
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

    <div class="pill-pane tab-pane">
        <table class="table w-100 investment-priorities">
            <thead>
            <tr>
                <th class="type">Type</th>
                <th class="name">Name</th>
                <th class="categories">Categories <fc:iconHelp>Program outcomes specify a list of categories that define the investment priority categories associated with that outcome</fc:iconHelp></th>
                <th class="actions">Actions</th>
            </tr>
            </thead>
            <tbody data-bind="foreach: investmentPriorities">
            <tr>
                <td class="name">
                    <span data-bind="text:type"></span>
                </td>
                <td class="name">
                    <!-- ko if: editable -->
                    <input class="form-control form-control-sm" data-bind="value:name"></input>
                    <!-- /ko -->
                    <!-- ko if: !editable() -->
                    <span data-bind="text:name"></span>
                    <!-- /ko -->
                </td>
                <td class="categories">
                    <!-- ko if: !editable() -->
                    <span data-bind="text: categories()"></span>
                    <!-- /ko -->
                    <!-- ko if: editable() -->
                    <select title="Categories allow investment priorities to be associated with an outcome as a group"
                            multiple="multiple" class="form-control form-control-sm"
                            style="width:100%"
                            data-bind="options: $parent.availableCategories, enabled: editable(), multiSelect2:{value: categories}"></select>
                    <!-- /ko -->
                </td>

                <td class="actions">
                    <button class="btn btn-mini deleteTag" title="Delete this investment priority" type="button" data-bind="enable:!editable(), click:$root.deleteInvestmentPriority"><i class="fa fa-trash"></i></button>
                    <!-- ko if:!editable() -->
                    <button class="btn btn-mini editTag" title="Edit this investment priority" type="button" data-bind="if:!editable(), click:edit"><i class="fa fa-edit"></i></button>
                    <!-- /ko -->
                    <!-- ko if:editable() -->
                    <button class="btn btn-mini" title="Cancel editing" type="button" data-bind="if:editable(), click:cancelEdit"><i class="fa fa-remove"></i></button>
                    <!-- /ko -->
                    <button class="btn btn-mini" title="Save changes made to this investment priority" type="button" data-bind="enable: saveable, click:$root.updateInvestmentPriority"><i class="fa fa-save"></i></button>
                </td>
            </tr>
            </tbody>
            <tfoot data-bind="if: canAddNewInvestmentPriority">
            <tr>
                <td class="investment-priority">
                    <input class="form-control form-control-sm" data-bind="value:newInvestmentPriority.name"></input>
                </td>
                <td class="description">
                    <textarea class="form-control form-control-sm" data-bind="value:newInvestmentPriority.description"></textarea>
                </td>
                <td class="admin-actions">
                    <button type="button" class="btn btn-sm btn-success" data-bind="click:addInvestmentPriority, enable:newInvestmentPriority.name()">
                        <i class="fa fa-plus"></i> Add new tag</button>
                </td>
            </tr>
            </tfoot>
        </table>
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
            availableTypes: <fc:modelAsJavascript model="${availableCategories}"/>,
            categoriesByType: <fc:modelAsJavascript model="${categoriesByType}"/>
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
