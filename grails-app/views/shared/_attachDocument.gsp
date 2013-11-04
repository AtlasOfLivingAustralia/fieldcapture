<r:require module="jQueryFileUpload"/>
<!-- ko stopBinding: true -->
<div id="attachDocument" >
<form class="form-horizontal" id="documentForm" data-url="<g:createLink controller='image' action='upload'/>">

    <div class="control-group">
        <label class="control-label" for="documentName">Title</label>
        <div class="controls">
            <input id="documentName" type="text" data-bind="value:name"/>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="documentAttribution">Attribution</label>
        <div class="controls">
            <input id="documentAttribution" type="text" data-bind="value:attribution"/>

        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="documentLicense">License</label>
        <div class="controls">
            <input id="documentLicense" type="text" data-bind="value:license"/>

        </div>
    </div>

    <div class="control-group">
        <label class="control-label" for="documentFile">File</label>
        <div class="controls">
            <span class="btn fileinput-button" data-bind="visible:!filename()">
                <i class="icon-plus"></i>
                <input id="documentFile" type="file" name="files"/>
                Attach file
            </span>
            <span data-bind="visible:filename()">
                <input type="text" readonly="readonly" data-bind="value:fileLabel"/>
                <button class="btn" data-bind="click:removeFile">
                    <span class="icon-remove"></span>
                </button>
            </span>
        </div>
    </div>
    <div class="control-group" data-bind="visible:hasPreview">
        <label class="control-label">Preview</label>
        <div id="preview" class="controls"></div>
    </div>

    <div class="control-group" data-bind="visible:filename()">
        <label for="progress" class="control-label">Progress</label>

        <div id="progress" class="controls progress progress-info active input-large" data-bind="visible:!error(), css:{'progress-info':progress()<100, 'progress-success':complete()===true}">
            <div class="bar" data-bind="style:{width:progress()+'%'}"></div>
        </div>
        <div id="message" class="controls" data-bind="visible:error()">
            <span class="alert alert-error" data-bind="text:error"></span>
        </div>
    </div>

    <div class="control-group">
        <div class="controls">
            <button type="button" class="btn btn-success" data-bind="enable:filename() && progress() === 0 && !error(), click:save">Save</button>
            <button type="cancel" class="btn">Cancel</button>
        </div>
    </div>

    <g:if env="development">
        <pre class="row-fluid" data-bind="text:toJSONString()"></pre>
    </g:if>
</form>
</div>
<!-- /ko -->

<script type="text/javascript">
    function DocumentViewModel (img, owner, updateUrl) {
        var self = this;
        this.filename = ko.observable(img ? img.filename : '');
        this.filesize = ko.observable(img ? img.filesize : '')
        this.name = ko.observable(img.name);
        this.attribution = ko.observable(img ? img.attribution : '');
        this.license = ko.observable(img ? img.license : '');
        this.type = img.type || 'image';
        this.role = img.role;
        this.documentId = img ? img.documentId : '';
        this.hasPreview = ko.observable(false);
        this.error = ko.observable();
        this.progress = ko.observable(0);
        this.complete = ko.observable(false);

        /**
         * Detaches an attached file and resets associated fields.
         */
        this.removeFile = function() {
            self.filename('');
            self.filesize('');
            self.hasPreview(false);
            self.error('');
            self.progress(0);
            self.complete(false);
            self.file = null;
        }
        // Callbacks from the file upload widget, these are attached manually (as opposed to a knockout binding).
        this.fileAttached = function(file, helper) {
            self.filename(file.name);
            self.filesize(file.size);
            // Determine "type" from the mime type....
            if (file.type) {
                var type = file.type.split('/');
                if (type) {
                    self.type = type[0];
                }
            }
            self.helper = helper;
        };
        this.filePreviewAvailable = function(file) {
            $('#preview').append(file.preview);
            this.hasPreview(true);
        };
        this.uploadProgress = function(uploaded, total) {

            var progress = parseInt(uploaded/total*100, 10);
            self.progress(progress);
        };
        this.fileUploaded = function(file) {
            self.complete(true);
            self.progress(100);
        };
        this.fileUploadFailed = function(error) {
            this.error(error);

        };
        this[owner.key] = owner.value;

        /** Formatting function for the file name and file size */
        this.fileLabel = ko.computed(function() {
            var label = self.filename();
            if (self.filesize()) {
                label += ' ('+formatBytes(self.filesize())+')';
            }
            return label;
        });

        this.toJSONString = function() {
            // These are not properties of the document object, just used by the view model.
            return JSON.stringify(ko.mapping.toJS(self, {'ignore':['helper', 'progress', 'hasPreview', 'error', 'filesize', 'fileLabel', 'file', 'complete']}));
        }

        this.save = function () {
            self.helper.submit();
        }
    }

    $(function(){
        var documentViewModel = new DocumentViewModel('', '', '');
        ko.applyBindings(documentViewModel, document.getElementById('attachDocument'));

        $('#attachDocument').fileupload({
            url:"${g.createLink(controller: 'proxy', action:'documentUpdate')}",
            formData:function(form) {return [{name:'document', value:documentViewModel.toJSONString()}]},
            autoUpload:false
        }).on('fileuploadadd', function(e, data) {
            documentViewModel.fileAttached(data.files[0], data);
        }).on('fileuploadprocessalways', function(e, data) {
            if (data.files[0].preview) {
                documentViewModel.filePreviewAvailable(data.files[0]);
            }
        }).on('fileuploadprogressall', function(e, data) {
            documentViewModel.uploadProgress(data.loaded, data.total);
        }).on('fileuploaddone', function(e, data) {
            var result = data.result;
            if (!result) {
                result = {};
                result.error = 'No response from server';
            }

            if (result.documentId) {
                documentViewModel.fileUploaded(result);
            }
            else {
                documentViewModel.fileUploadFailed(result.error);
            }

        }).on('fileuploadfail', function(e, data) {
            documentViewModel.fileUploadFailed(data.errorThrown);
        });
    });


</script>