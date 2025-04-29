<!DOCTYPE HTML>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Manage Tags | MERIT</title>
    <script>
        window.fcConfig = {
            updateTagUrl: "${g.createLink(action: 'updateTag')}",
            addTagUrl: "${g.createLink(action: 'addTag')}",
            deleteTagUrl: "${g.createLink(action: 'deleteTag')}",
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
            <li class="breadcrumb-item">Manage tags</li>
        </ol>
    </section>
    <h3>Manage Tags</h3>
    <p>
       To add a new tag, first search for the tag you want to add. If it doesn't exist, you can create a new one. You can also edit or delete existing tags.
    </p>

    <hr/>

    <div id="tags" class="pill-pane tab-pane">
        <div class="mb-4">
        <form class="form form-inline d-flex justify-content-end mb-10">
            <!-- ko if: filter() && matchedTags() == 0 -->
            <span data-bind="text:'Add new tag with value: &quot'+filter()+'&quot'"></span>
            <!-- /ko -->
            <button class="btn btn-info ml-1" disabled data-bind="enable: filter() && matchedTags() == 0, click:addTag">New tag</button>
        </form>
        </div>
        <table class="table w-100 tags-table">
            <thead>
            <tr>
                <th class="tag">Tag</th>
                <th class="admin-actions">Actions</th>
            </tr>
            </thead>
            <tbody data-bind="foreach: tags">
            <tr>
                <td class="tag">
                    <!-- ko if: editable -->
                    <input class="form-control form-control-sm" data-bind="value:tag"></input>
                    <!-- /ko -->
                    <!-- ko if: !editable() -->
                    <span data-bind="text:tag"></span>
                    <!-- /ko -->
                </td>
                <td class="admin-actions">
                    <button class="btn btn-mini deleteTag" title="Delete this tag" type="button" data-bind="click:$root.deleteTag"><i class="fa fa-remove"></i></button>
                    <button class="btn btn-mini editTag" title="Edit this tag" type="button" data-bind="enable:!editable(), click:edit"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-mini updateTag" title="Save changes made to this tag" type="button" data-bind="enable: saveable, click:$root.updateTag"><i class="fa fa-save"></i></button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="select2/js/select2.full.js"/>
<asset:javascript src="forms-knockout-bindings.js"/>
<asset:javascript src="admin.js"/>

<asset:script>

    const tags = <fc:modelAsJavascript model="${tags}"/>;

    $(function () {

        const viewModel = new ManageTagsViewModel(tags, fcConfig);
        ko.applyBindings(viewModel, document.getElementById('wrapper'));

        // This needs to be done after the table is rendered by the applyBindings call.
        viewModel.initialiseDataTable('#tags table');

    });

</asset:script>

<asset:deferredScripts/>
</body>

</html>
