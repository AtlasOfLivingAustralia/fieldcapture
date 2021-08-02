
<div class="row row-eq-height" id="${containerId}">
    <div class="col-sm-5 filterDocumentHolder">
            <div id="filter-by-stage" class="document-filter-group btn-group pull-right dropdown">
                <a class="btn dropdown-toggle" data-toggle="dropdown" id="filterDropDown" href="#">
                    <i class="fa fa-filter"></i> Filter by report
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="filterDropDown" data-bind="foreach:distinctDocumentProperty('reportName')">
                    <li><a href="#" class="dropdown-item"><label class="checkbox"> <input data-column="2" name="doc-filter" class="checkbox" type="checkbox" data-bind="attr:{value:$data}"> <span data-bind="text:$data"></span></label></a> </li>
                </ul>

            </div>
        <div></div>
        <table class="docs-table table"  style="table-layout:fixed">
            <thead>
            <tr>
                <th style="width:35px"></th>
                <th style="width:40%">Name</th>
                <th style="width:30%; min-width:60px;">Related report</th>
                <th style="width:20%">Date last updated</th>
                <th></th>
                <th></th>
                <th style="width:2em"></th>
            </tr>

            </thead>
            <tbody data-bind="foreach: filteredDocuments">
                <!-- ko if:(role() == '${filterBy}' || 'all' == '${filterBy}') && !(_.contains(${raw((ignore as grails.converters.JSON).toString())}, role())) && role() != 'variation' -->
                <tr data-bind="click: $parent.selectDocument">
                    <td>
                        <!-- ko if:embeddedVideo() -->
                        <i class="fa fa-file-video-o fa-2x"></i>
                        <!-- /ko -->
                        <!-- ko if:!embeddedVideo() -->
                        <img class="media-object" data-bind="attr:{src:iconImgUrl(), alt:contentType, title:name}" alt="document icon">
                        <!-- /ko -->
                    </td>
                    <td style="word-wrap:break-word">
                         <span data-bind="text:name() || filename()"></span>
                    </td>
                    <td>
                        <span data-bind="text:reportName()"></span>
                    </td>

                    <td>
                        <span data-bind="text:uploadDate.formattedDate()"></span>
                    </td>
                    <td>
                        <span data-bind="text:uploadDate"></span>
                    </td>
                    <td>
                        %{--  Just for filtering purposes, this is an invisible column --}%
                        <span data-bind="text:role"></span>
                    </td>

                    <td>
                        <!-- ko if:!embeddedVideo() -->
                        <a data-bind="attr:{href:url}" target="_blank">
                            <i class="fa fa-download"></i>
                        </a>
                        <!-- /ko -->
                        <!-- ko if:embeddedVideo() -->

                        <i class="fa fa-question-circle" data-bind="popover:{content:'Embedded videos are not downloadable.'}"></i>

                        <!-- /ko -->

                    </td>
                </tr>
                <!-- /ko -->
            </tbody>
        </table>

    </div>
    <div class="fc-resource-preview-container col-sm-7" data-bind="{ template: { name: previewTemplate } }"></div>
</div>

<script id="iframeViewer" type="text/html">
<div class="well fc-resource-preview-well">
    <iframe class="fc-resource-preview" data-bind="attr: {src: selectedDocumentFrameUrl}" style="width: 94%">
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
<asset:script>
    var imageLocation = "${imageUrl}",
        useExistingModel = ${useExistingModel};

    $(function () {

        if (!useExistingModel) {

            var docListViewModel = new DocListViewModel(${documents ?: []});
            ko.applyBindings(docListViewModel, document.getElementById('${containerId}'));
        }
    });

</asset:script>
