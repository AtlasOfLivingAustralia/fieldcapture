<div class="row-fluid" id="documentList">
    <div data-bind="foreach:documents">
        <g:if test="${editable}">
            <div class="clearfix space-after media" data-bind="template:ko.utils.unwrapObservable(type) === 'image' ? 'imageDocEditTmpl' : 'objDocEditTmpl'"></div>
        </g:if>
        <g:else>
            <div class="clearfix space-after media" data-bind="template:ko.utils.unwrapObservable(type) === 'image' ? 'imageDocTmpl' : 'objDocTmpl'"></div>
        </g:else>
    </div>
</div>

<script id="imageDocTmpl" type="text/html">
    <a class="pull-left" data-bind="attr:{href:url}" target="_blank">
        <img class="media-object img-rounded span1" data-bind="attr:{src:url}" style="width:32px;height:32px;">
    </a>
    <div data-bind="template:'imgMediaBody'"></div>
</script>

<script id="objDocTmpl" type="text/html">
    <a class="pull-left" data-bind="attr:{href:url}">
        <img class="media-object" data-bind="attr:{src:filetypeImg()}">
    </a>
    <div data-bind="template:'docMediaBody'"></div>
</script>

<script id="imageDocEditTmpl" type="text/html">
    <button class="btn btn-mini pull-left" type="button" data-bind="click:$root.deleteDocument" style="margin:4px 10px 0 0;"><i class="icon-remove"></i></button>
    <a class="pull-left" data-bind="attr:{href:url}" target="_blank">
        <img class="media-object img-rounded span1" data-bind="attr:{src:url}" style="width:32px;height:32px;">
    </a>
    <div data-bind="template:'imgMediaBody'"></div>
</script>

<script id="objDocEditTmpl" type="text/html">
    <button class="btn btn-mini pull-left" type="button" data-bind="click:$root.deleteDocument" style="margin:5px 10px 0 0;"><i class="icon-remove"></i></button>
    <a class="pull-left" data-bind="attr:{href:url}">
        <img class="media-object" data-bind="attr:{src:filetypeImg()}">
    </a>
    <div data-bind="template:'docMediaBody'"></div>
</script>

<script id="docMediaBody" type="text/html">
    <div class="media-body">
        <a data-bind="attr:{href:url}">
            <h5 class="media-heading" data-bind="text:name"></h5>
        </a>
        <span data-bind="text:attribution"></span>
    </div>
</script>

<script id="imgMediaBody" type="text/html">
    <div class="media-body">
        <a data-bind="attr:{href:url}" target="_blank">
            <h5 class="media-heading" data-bind="text:name"></h5>
        </a>
        <span data-bind="text:attribution"></span>
    </div>
</script>

<r:script>
    var imageLocation = "${imageUrl}",
        useExistingModel = ${useExistingModel};

    $(window).load(function () {

        if (!useExistingModel) {
            var DocModel = function (doc) {
                var self = this;
                this.name = doc.name;
                this.attribution = doc.attribution;
                this.filename = doc.filename;
                this.type = doc.type;
                this.url = doc.url;
                this.filetypeImg = function () {
                    return imageLocation + "/" + iconnameFromFilename(self.filename);
                };
            };
            function DocListViewModel(documents) {
                var self = this;
                this.documents = ko.observableArray($.map(documents, function(doc) { return new DocModel(doc)} ));
            }

            var docListViewModel = new DocListViewModel(${documents ?: []});
            ko.applyBindings(docListViewModel, document.getElementById('documentList'));
        }
    });

    function iconnameFromFilename(filename) {
        var ext = filename.split('.').pop(),
            types = ['aac','ai','aiff','avi','bmp','c','cpp','css','dat','dmg','doc','dotx','dwg','dxf',
            'eps','exe','flv','gif','h','hpp','html','ics','iso','java','jpg','key','mid','mp3','mp4',
            'mpg','odf','ods','odt','otp','ots','ott','pdf','php','png','ppt','psd','py','qt','rar','rb',
            'rtf','sql','tga','tgz','tiff','txt','wav','xls','xlsx'];
        if (ext === 'docx') { ext = 'doc' }
        if ($.inArray(ext, types) >= 0) {
            return ext + '.png';
        } else {
            return "_blank.png";
        }
    }
</r:script>