<script id="imageDocTmpl" type="text/html">
<span class="pull-left float-left" style="width:32px;height:32px;">
    <img class="media-object img-rounded col-sm-1" data-bind="attr:{src:thumbnailUrl, alt:name}" style="width:32px;height:32px;" width="32" height="32" alt="document icon">
</span>
<div class="media-body">
    <a class="pull-right float-right" data-bind="attr:{href:url}" target="_blank">
        <i class="fa fa-download"></i>
    </a>
    <span>
        <small class="media-heading" data-bind="text:name() || filename()"></small>
    </span>
    <span class="muted" data-bind="if:$data.attribution">
        <br/><small data-bind="text:attribution"></small>
    </span>
</div>
</script>

<script id="objDocTmpl" type="text/html">
<span class="pull-left float-left">
    <img class="media-object" data-bind="attr:{src:filetypeImg(), alt:name}" alt="document icon}">
</span>
<div class="media-body">
    <a class="pull-right float-right" data-bind="attr:{href:url}" target="_blank">
        <i class="fa fa-download"></i>
    </a>
    <span>
        <small class="media-heading" data-bind="text:name() || filename()"></small>
    </span>
    <span class="muted" data-bind="if:$data.attribution">
        <br/><small data-bind="text:attribution"></small>
    </span>
</div>
</script>

<script id="imageDocEditTmpl" type="text/html">
    <div class="row">
        <g:if test="${fc.userIsAlaAdmin() || !fc.userHasReadOnlyAccess()}">
        <div class="col-sm-1">
            <div class="btn-group document-edit-buttons">
                <button class="btn btn-sm deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
                <button class="btn btn-sm editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
            </div>
        </div>
        </g:if>
        <div class="col-sm-1">
            <a data-bind="attr:{href:url}" target="_blank">
                <img class="media-object img-rounded" data-bind="attr:{src:thumbnailUrl, alt:name}" alt="document icon}">
            </a>
            <p class="muted" data-bind="if:$data.attribution">
                <small data-bind="text:attribution"></small>
            </p>
        </div>
        <div class="title-heading col-sm-9">
            <a data-bind="attr:{href:url}" target="_blank" class="downloadDocument">
                <p class="media-heading" data-bind="text:name() || filename()"></p>
            </a>
        </div>
        <div class="col-sm-1">
            <a data-bind="attr:{href:url}" target="_blank">
                <i class="fa fa-download"></i>
            </a>
        </div>
    </div>
</script>

<script id="objDocEditTmpl" type="text/html">
    <div class="row">
        <g:if test="${fc.userIsAlaAdmin() || !fc.userHasReadOnlyAccess()}">
        <div class="col-sm-1">
            <div class="btn-group  test1 document-edit-buttons">
                <button class="btn btn-mini deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
                <button class="btn btn-mini editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
            </div>
        </div>
        </g:if>
        <div class="col-sm-1">
            <a data-bind="attr:{href:url}">
                <img class="media-object img-fluid" data-bind="attr:{src:filetypeImg(), alt:name}" alt="document icon}">
            </a>
        </div>
        <div class="title-heading col-sm-9">
            <a data-bind="attr:{href:url}" target="_blank" class="downloadDocument">
                <p class="media-heading" data-bind="text:name() || filename()"></p>
            </a>
            <p class="muted" data-bind="if:$data.attribution">
                <small data-bind="text:attribution"></small>
            </p>
        </div>
        <div class="col-sm-1">
            <a data-bind="attr:{href:url}" target="_blank">
                <i class="fa fa-download"></i>
            </a>
        </div>
    </div>
</script>

<script id="embeddedVideoEditTmpl" type="text/html">
    <div class="row">
        <div class="col-sm-1">
            <div class="btn-group  embeddedVideo">
                <button class="btn btn-sm deleteDocument" type="button"
                        data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
                <button class="btn btn-sm editDocument" type="button"
                        data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
            </div>
        </div>

        <div class="col-sm-1">
            <i class="pull-left float-left ml-2 fa fa-file-video-o fa-2x"></i>

            <p class="muted" data-bind="if:$data.attribution">
                <small data-bind="text:attribution"></small>
            </p>
        </div>
        <div class="col-sm-10">
            <span data-bind="text:name() || 'embedded video'"></span><i class="fa fa-question-circle"
                                                                  data-bind="popover:{content:'Embedded videos are not downloadable.  Please use the Documents tab to view the video.'}"></i>
        </div>
    </div>
</script>

<script id="documentEditTemplate" type="text/html">
    <div class="clearfix space-after col-sm-12" data-bind="template:ko.utils.unwrapObservable(role) === 'embeddedVideo' ? 'embeddedVideoEditTmpl' : (ko.utils.unwrapObservable(type) === 'image' ? 'imageDocEditTmpl' : 'objDocEditTmpl')"></div>
</script>
<script id="documentViewTemplate" type="text/html">
    <div class="clearfix space-after col-sm-12" data-bind="template:ko.utils.unwrapObservable(type) === 'image' ? 'imageDocTmpl' : 'objDocTmpl'"></div>
</script>

