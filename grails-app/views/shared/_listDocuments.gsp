<!-- ko stopBinding: true -->
<div class="row-fluid" id="documentList">
    <h4>Project documents</h4>
    <div data-bind="foreach:documents">
        <div class="media" data-bind="template:type === 'image' ? 'imageDocTmpl' : 'objDocTmpl'"></div>
    </div>
</div>

<script id="imageDocTmpl" type="text/html">
    <a class="pull-left span2" data-bind="attr:{href:url}">
        <img class="media-object img-rounded" data-bind="attr:{src:url}">
    </a>
    <div class="media-body">
        <h5 class="media-heading" data-bind="text:name"></h5>
        <span data-bind="text:attribution"></span>
    </div>
</script>

<script id="objDocTmpl" type="text/html">
    <a class="pull-left" data-bind="attr:{href:url}">
        <img class="media-object" data-bind="attr:{src:filetypeImg()}">
    </a>
    <div class="media-body">
        <a data-bind="attr:{href:url}">
            <h5 class="media-heading" data-bind="text:name"></h5>
        </a>
        <span data-bind="text:attribution"></span>
    </div>
</script>

<!-- /ko -->
<r:script>
    var imageLocation = "${imageUrl}";

    $(window).load(function () {

        var DocModel = function (doc) {
            var self = this;
            this.name = doc.name;
            this.attribution = doc.attribution;
            this.filename = doc.filename;
            this.type = doc.type;
            this.url = doc.url;
            this.filetypeImg = function () {
                return imageLocation + "/" + iconnameFromFilename(self.filename);
            }
        };
        function DocListViewModel(documents) {
            var self = this;
            this.documents = ko.observableArray($.map(documents, function(doc) { return new DocModel(doc)} ));
        }

        var docListViewModel = new DocListViewModel(${documents ?: []});
        ko.applyBindings(docListViewModel, document.getElementById('documentList'));

    });

    function iconnameFromFilename(filename) {
        var ext = filename.split('.').pop(),
            types = ['aac','ai','aiff','avi','bmp','c','cpp','css','dat','dmg','doc','dotx','dwg','dxf',
            'eps','exe','flv','gif','h','hpp','html','ics','iso','java','jpg','key','mid','mp3','mp4',
            'mpg','odf','ods','odt','otp','ots','ott','pdf','php','png','ppt','psd','py','qt','rar','rb',
            'rtf','sql','tga','tgz','tiff','txt','wav','xls','xlsx'];
        if (ext === 'docx') { ext = 'doc' }
        if ($.inArray(ext, types)) {
            return ext + '.png';
        } else {
            return "_blank.png";
        }
    }
</r:script>