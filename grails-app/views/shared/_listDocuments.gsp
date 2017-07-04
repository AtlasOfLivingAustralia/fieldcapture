
<div class="row-fluid row-eq-height" id="${containerId}">
    <div class="span5">
        <div class="row-fluid">
            <div id="filter-by-stage" class="btn-group pull-right">
                <a class="btn dropdown-toggle" href="#">
                    <i class="fa fa-filter"></i> Filter by stage
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" data-bind="foreach:distinctDocumentProperty('stage')">
                    <li><a href="#"><label class="checkbox"> <input name="stage-filter" class="checkbox" type="checkbox" data-bind="attr:{value:$data}"> Stage <span data-bind="text:$data"></span></label></a> </li>
                </ul>

            </div>


        </div>
        <div></div>
        %{-- The use of the width attribute (as opposed to a css style) is to allow for correct resizing behaviour of the DataTable --}%
        <table class="docs-table table" width="100%">
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Stage</th>
                <th>Date last updated</th>
                <th></th>
                <th></th>
            </tr>

            </thead>
            <tbody data-bind="foreach: filteredDocuments">
                <!-- ko if:(role() == '${filterBy}' || 'all' == '${filterBy}') && role() != '${ignore}' && role() != 'variation' -->
                <tr data-bind="click: $parent.selectDocument">
                    <td>
                        <!-- ko if:embeddedVideo() -->
                        <i class="fa fa-file-video-o fa-2x"></i>
                        <!-- /ko -->
                        <!-- ko if:!embeddedVideo() -->
                        <img class="media-object" data-bind="attr:{src:iconImgUrl(), alt:contentType, title:name}" alt="document icon">
                        <!-- /ko -->
                    </td>
                    <td>
                         <span data-bind="text:name() || filename()"></span>
                    </td>
                    <td>
                        <span data-bind="text:stage"></span>
                    </td>
                    <td>
                        <span data-bind="text:uploadDate.formattedDate()"></span>
                    </td>
                    <td>
                        <span data-bind="text:uploadDate"></span>
                    </td>

                    <td>
                        <!-- ko if:!embeddedVideo() -->
                        <a data-bind="attr:{href:url}" target="_blank">
                            <i class="fa fa-download"></i>
                        </a>
                        <!-- /ko -->
                        <!-- ko if:embeddedVideo() -->

                        <i class="icon-question-sign" data-bind="popover:{content:'Embedded videos are not downloadable.'}"></i>

                        <!-- /ko -->

                    </td>
                </tr>
                <!-- /ko -->
            </tbody>
        </table>

    </div>
    <div class="fc-resource-preview-container span7" data-bind="{ template: { name: previewTemplate } }"></div>
</div>

<script id="iframeViewer" type="text/html">
<div class="well fc-resource-preview-well">
    <iframe class="fc-resource-preview" data-bind="attr: {src: selectedDocumentFrameUrl}">
        <p>Your browser does not support iframes <i class="fa fa-frown-o"></i>.</p>
    </iframe>
</div>
</script>

<script id="xssViewer" type="text/html">
<div class="well fc-resource-preview-well" data-bind="html: selectedDocument().embeddedVideo"></div>
</script>

<script id="noPreviewViewer" type="text/html">
<div class="well fc-resource-preview-well">
    <p>There is no preview available for this file.</p>
</div>
</script>

<script id="noViewer" type="text/html">
<div class="well fc-resource-preview-well">
    <p>Select a document to preview it here.</p>
</div>
</script>

<g:render template="/shared/documentTemplate"></g:render>
<r:script>
    var imageLocation = "${imageUrl}",
        useExistingModel = ${useExistingModel};

    $(function () {

        if (!useExistingModel) {

            var docListViewModel = new DocListViewModel(${documents ?: []});
            ko.applyBindings(docListViewModel, document.getElementById('${containerId}'));
        }
    });

</r:script>