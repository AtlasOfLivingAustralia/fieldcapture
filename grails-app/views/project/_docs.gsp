<div class="well" >
    <h4>Project documents</h4>
    <div class="row text-center">
        <div class="col-sm-12 text-left">
            <div id="documents">
                <div data-bind="visible:documents().length == 0">
                    No documents are currently attached to this project.
                    <g:if test="${user?.isAdmin}">To add a document use the Documents section of the Admin tab.</g:if>
                </div>
                <g:render template="/shared/listDocuments"
                          model="[useExistingModel: true, editable: false, filterBy: 'all', ignore: ['projectLogic', 'contractAssurance', 'variation', 'approval'], imageUrl:assetPath(src:'/'),containerId:'overviewDocumentList']"/>
            </div>
        </div>

    </div>
</div>
