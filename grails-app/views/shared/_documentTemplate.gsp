<script id="imageDocTmpl" type="text/html">
<span class="pull-left float-left" style="width:32px;height:32px;">
    <img class="media-object img-rounded span1" data-bind="attr:{src:thumbnailUrl}, alt:name" style="width:32px;height:32px;" width="32" height="32" alt="image preview icon">
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
    <img class="media-object" data-bind="attr:{src:filetypeImg(), alt:name}" alt="document icon">
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
<div class="btn-group pull-left document-edit-buttons">
    <button class="btn btn-mini" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
    <button class="btn btn-mini" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
</div>
<a class="pull-left" data-bind="attr:{href:url}" target="_blank">
    <img class="media-object img-rounded span1" data-bind="attr:{src:thumbnailUrl, alt:name}"  alt="image preview icon">
</a>
<div data-bind="template:'mediaBody'" class="media-body-template"></div>
</script>

<script id="objDocEditTmpl" type="text/html">
<div class="btn-group pull-left document-edit-buttons">
    <button class="btn btn-mini" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
    <button class="btn btn-mini" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
</div>
<a class="pull-left float-left" data-bind="attr:{href:url}">
    <img class="media-object" data-bind="attr:{src:filetypeImg(), alt:name}" alt="document icon">
</a>
<div data-bind="template:'mediaBody'" class="media-body-template"></div>
</script>

<script id="embeddedVideoEditTmpl" type="text/html">
<div class="btn-group pull-left float-left" style="margin-top:4px;">
    <button class="btn btn-mini" type="button" data-bind="enable:!readOnly,click:$root.deleteDocument"><i class="fa fa-remove"></i></button>
    <button class="btn btn-mini" type="button" data-bind="enable:!readOnly,click:$root.editDocumentMetadata"><i class="fa fa-edit"></i></button>
</div>
    <i class="fa fa-file-video-o fa-2x"></i>
    <span data-bind="text:name() || 'embedded video'"></span> <i class="fa fa-question-circle" data-bind="popover:{content:'Embedded videos are not downloadable.  Please use the Documents tab to view the video.'}"></i>
    <span class="muted" data-bind="if:$data.attribution">
        <br/><small data-bind="text:attribution"></small>
    </span>

</script>

<script id="mediaBody" type="text/html">
<div class="media-body attached_document ">
    <a class="pull-right float-right" data-bind="attr:{href:url}" target="_blank">
        <i class="fa fa-download"></i>
    </a>
    <a data-bind="attr:{href:url}" target="_blank" class="downloadDocument">
        <span class="media-heading" data-bind="text:name() || filename()"></span>
    </a>
    <span class="muted" data-bind="if:$data.attribution">
        <br/><small data-bind="text:attribution"></small>
    </span>
</div>
</script>


<script id="documentEditTemplate" type="text/html">
    <div class="clearfix space-after media" data-bind="template:ko.utils.unwrapObservable(role) === 'embeddedVideo' ? 'embeddedVideoEditTmpl' : (ko.utils.unwrapObservable(type) === 'image' ? 'imageDocEditTmpl' : 'objDocEditTmpl')"></div>
</script>
<script id="documentViewTemplate" type="text/html">
    <div class="clearfix space-after media" data-bind="template:ko.utils.unwrapObservable(type) === 'image' ? 'imageDocTmpl' : 'objDocTmpl'"></div>
</script>

