<div id="edit-documents" class="pill-pane tab-pane">
    <div class="span10 attachDocumentModal">
        <h3 style="display:inline-block">Project Documents</h3>
        <button class="btn btn-info pull-right project-document-action" id="doAttach" data-bind="click:attachDocument">Attach Document</button>
        <form class="form-inline pull-right project-document-action"><label>Filter documents:</label> <select data-bind="optionsCaption:'No filter', options:documentRoles, optionsText:'name', optionsValue:'id', value:documentFilter"></select></form>
    </div>
    <div class="clearfix"></div>
    <hr/>
    <div class="row">
        <div class="col-sm-12 ml-3 ">
            <g:render template="/shared/editDocuments"
                      model="[useExistingModel: true,editable:true, filterBy: 'all', ignore: '', imageUrl:assetPath(src:'filetypes'),containerId:'adminDocumentList']"/>
        </div>
    </div>
    %{--The modal view containing the contents for a modal dialog used to attach a document--}%
    <g:render template="/shared/attachDocument"/>

</div>