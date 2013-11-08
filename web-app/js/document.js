/**
 * A view model to capture metadata about a document and manage progress / feedback as a file is uploaded.
 * @param doc any existing details of the document.
 * @param owner an object containing key and value properties identifying the owning entity for the document. eg. {key:'projectId', value:'the_id_of_the_owning_project'}
 * @constructor
 */
function DocumentViewModel (doc, owner) {
    var self = this;
    this.filename = ko.observable(doc ? doc.filename : '');
    this.filesize = ko.observable(doc ? doc.filesize : '')
    this.name = ko.observable(doc.name);
    this.attribution = ko.observable(doc ? doc.attribution : '');
    this.license = ko.observable(doc ? doc.license : '');
    this.type = doc.type;
    this.role = doc.role;
    this.url = doc.url;
    this.documentId = doc ? doc.documentId : '';
    this.hasPreview = ko.observable(false);
    this.error = ko.observable();
    this.progress = ko.observable(0);
    this.complete = ko.observable(false);

    if (owner !== undefined) {
        this[owner.key] = owner.value;
    }

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
    this.fileAttached = function(file) {
        self.filename(file.name);
        self.filesize(file.size);
        // Should be use just the mime type or include the mime type as well?
        if (file.type) {
            var type = file.type.split('/');
            if (type) {
                self.type = type[0];
            }
        }
    };
    this.filePreviewAvailable = function(file) {
        this.hasPreview(true);
    };
    this.uploadProgress = function(uploaded, total) {

        var progress = parseInt(uploaded/total*100, 10);
        self.progress(progress);
    };
    this.fileUploaded = function(file) {
        self.complete(true);
        self.url = file.url;
        self.progress(100);
    };
    this.fileUploadFailed = function(error) {
        this.error(error);

    };

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
}


/**
 * Attaches the jquery.fileupload plugin to the element identified by the uiSelector parameter and
 * configures the callbacks to the appropriate methods of the supplied documentViewModel.
 * @param uploadUrl the URL to upload the document to.
 * @param documentViewModel The view model to attach to the file upload.
 * @param uiSelector the ui element to bind the file upload functionality to.
 * @param previewElementSelector selector for a ui element to attach an image preview when it is generated.
 */
function attachViewModelToFileUpload(uploadUrl, documentViewModel, uiSelector, previewElementSelector) {

    var fileUploadHelper;
    $(uiSelector).fileupload({
        url:uploadUrl,
        formData:function(form) {return [{name:'document', value:documentViewModel.toJSONString()}]},
        autoUpload:false
    }).on('fileuploadadd', function(e, data) {

        fileUploadHelper = data;
        documentViewModel.fileAttached(data.files[0]);
    }).on('fileuploadprocessalways', function(e, data) {
        if (data.files[0].preview) {
            if (previewElementSelector !== undefined) {
                $(previewElementSelector).append(data.files[0].preview);
            }
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

    // We are keeping the reference to the helper here rather than the view model as it doesn't serialize correctly
    // (i.e. calls to toJSON fail).
    documentViewModel.save = function() {
        fileUploadHelper.submit();
        fileUploadHelper = null;
    }
}


/**
 * Creates a bootstrap modal from the supplied UI element to collect and upload a document and returns a
 * jquery Deferred promise to provide access to the uploaded Document.
 * @param modalSelector a selector identifying the ui element that contains the markup for the bootstrap modal dialog.
 * @param fileUploadSelector a selector identifying the ui element to attach the file upload functionality to.
 * @param previewSelector a selector identifying an element to attach a preview of the file to (optional)
 * @param uploadUrl the URL to upload the document to.
 * @param owner an object containing key and value properties identifying the owning entity for the document. eg. {key:'projectId', value:'the_id_of_the_owning_project'}
 * @returns an instance of jQuery.Deferred - the uploaded document will be supplied to a chained 'done' function.
 */
function showDocumentAttachInModal(uploadUrl, owner, modalSelector, fileUploadSelector, previewSelector) {

    if (fileUploadSelector === undefined) {
        fileUploadSelector = '#attachDocument';
    }
    if (previewSelector === undefined) {
        previewSelector = '#preview';
    }
    // TODO This style change seems to be necessary as the modal block has to be hidden to prevent it interfering with
    // other components on the page despite being invisible.   Likely I am doing something wrong or the css is wrong somewhere.
    var $fileUpload = $(fileUploadSelector).style('display', 'block');
    var $modal = $(modalSelector);
    var documentViewModel = new DocumentViewModel({}, owner);

    attachViewModelToFileUpload(uploadUrl, documentViewModel, fileUploadSelector, previewSelector);

    // Used to communicate the result back to the calling process.
    var result = $.Deferred();

    // Decorate the model so it can handle the button presses and close the modal window.
    documentViewModel.cancel = function() {
        result.reject()
        closeModal();
    };
    documentViewModel.close = function() {
        result.resolve(ko.toJS(documentViewModel));
        closeModal();
    };

    // Close the modal and tidy up the bindings.
    var closeModal = function() {
        $modal.modal('hide');
        ko.cleanNode($fileUpload[0]);
        //$fileUpload.fileupload('destroy');
    }

    ko.applyBindings(documentViewModel, $fileUpload[0]);

    // Do the binding from the model to the view?  Or assume done already?
    $modal.modal({backdrop:'static'});

    return result;
}