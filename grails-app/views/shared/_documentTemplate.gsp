<script id="imageDocTmpl" type="text/html">
<span class="pull-left float-left" style="width:32px;height:32px;">
    <img class="media-object img-rounded col-sm-1" data-bind="attr:{src:thumbnailUrl}" style="width:32px;height:32px;" width="32" height="32">
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
    <img class="media-object" data-bind="attr:{src:filetypeImg()}">
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
    <div class="col-sm-1 pl-0 ml-0">
        <div class="btn-group pull-left float-left document-edit-buttons">
            <button class="btn btn-sm deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
            <button class="btn btn-sm editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
        </div>
    </div>

<a class="pull-left float-left ml-2" data-bind="attr:{href:url}" target="_blank">
    <img class="media-object img-rounded" data-bind="attr:{src:thumbnailUrl}">
</a>
<div data-bind="template:'mediaBody'" class="media-body-template col-sm-10"></div>
</script>

<script id="objDocEditTmpl" type="text/html">
    <div class="col-sm-1 pl-0 ml-0">
        <div class="btn-group  test1 document-edit-buttons">
            <button class="btn btn-mini deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
            <button class="btn btn-mini editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
        </div>
    </div>
    <a class="pull-left float-left ml-2" data-bind="attr:{href:url}">
        <img class="media-object img-fluid" data-bind="attr:{src:filetypeImg()}">
    </a>
    <div data-bind="template:'mediaBody'" class="media-body-template col-sm-10"></div>
</script>

<script id="embeddedVideoEditTmpl" type="text/html">
    <div class="col-sm-1 pl-0 ml-0">
        <div class="btn-group pull-left float-left embeddedVideo" style="margin-top:4px;">
            <button class="btn btn-sm deleteDocument" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
            <button class="btn btn-sm editDocument" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
        </div>
    </div>
    <i class="pull-left float-left ml-2 fa fa-file-video-o fa-2x"></i>
    <div class="col-sm-10"><span data-bind="text:name() || 'embedded video'" style="margin-left: 0.4rem"></span><i class="fa fa-question-circle" data-bind="popover:{content:'Embedded videos are not downloadable.  Please use the Documents tab to view the video.'}"></i></div>
    <span class="muted" data-bind="if:$data.attribution">
        <br/><small data-bind="text:attribution"></small>
    </span>

</script>

<script id="mediaBody" type="text/html">

    <div class="title-heading">
        <a data-bind="attr:{href:url}" target="_blank" class="ml-2 downloadDocument">
            <span class="media-heading" data-bind="text:name() || filename()"></span>
        </a>
    </div>
    <a class="pull-right float-right customMargin" data-bind="attr:{href:url}" target="_blank">
        <i class="fa fa-download"></i>
    </a>
    <span class="muted" data-bind="if:$data.attribution">
        <br/><small data-bind="text:attribution"></small>
    </span>
</script>


<script id="documentEditTemplate" type="text/html">
    <div class="clearfix space-after media col-sm-12" data-bind="template:ko.utils.unwrapObservable(role) === 'embeddedVideo' ? 'embeddedVideoEditTmpl' : (ko.utils.unwrapObservable(type) === 'image' ? 'imageDocEditTmpl' : 'objDocEditTmpl')"></div>
</script>
<script id="documentViewTemplate" type="text/html">
    <div class="clearfix space-after media col-sm-12" data-bind="template:ko.utils.unwrapObservable(type) === 'image' ? 'imageDocTmpl' : 'objDocTmpl'"></div>
</script>

