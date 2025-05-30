
var DOCUMENT_INFORMATION = 'information';
var DOCUMENT_EMBEDDED_VIDEO = 'embeddedVideo';
var DOCUMENT_PROJECT_LOGIC = 'projectLogic';
var DOCUMENT_CONTRACT_ASSURANCE = 'contractAssurance';
var DOCUMENT_AUDITABLE_OUTPUTS = 'auditableOutputs';
var DOCUMENT_SUPPORT_AND_OVERHEADS = 'projectSupportAndOverheadsEvidence';
var DOCUMENT_PROJECT_SERVICE_EVIDENCE = 'projectServiceEvidence'

var documentRoles =
    [
        {id: DOCUMENT_INFORMATION, name: 'Information', isPublicRole:true},
        {id: DOCUMENT_EMBEDDED_VIDEO, name:'Embedded Video', isPublicRole:true},
        {id: DOCUMENT_PROJECT_LOGIC, name: 'Project Logic', isPublicRole:false},
        {id: DOCUMENT_CONTRACT_ASSURANCE, name:'Contract Assurance', isPublicRole:false},
        {id: DOCUMENT_AUDITABLE_OUTPUTS, name:'Auditable Outputs', isPublicRole:false},
        {id: DOCUMENT_SUPPORT_AND_OVERHEADS, name:'Project Support & Overheads Evidence', isPublicRole:false},
        {id: DOCUMENT_PROJECT_SERVICE_EVIDENCE, name:'Project Service Evidence', isPublicRole:false}
        ];
/**
 * A view model to capture metadata about a document and manage progress / feedback as a file is uploaded.
 *
 * NOTE that we are attempting to use this same model for document records that have an associated file
 * and those that do not (eg deferral reason docs). The mechanisms for handling these two types (esp saving)
 * are not well integrated at this point.
 *
 * @param doc any existing details of the document.
 * @param owner an object containing key and value properties identifying the owning entity for the document. eg. {key:'projectId', value:'the_id_of_the_owning_project'}
 * @constructor
 */
function DocumentViewModel (doc, owner, settings) {
    var self = this;

    var defaults = {
        //Information is the default option.
        roles: documentRoles,
        stages:[],
        reports: [],
        showSettings: true,
        thirdPartyDeclarationTextSelector:'#thirdPartyDeclarationText',
        imageLocation: fcConfig.imageLocation
    };
    this.settings = $.extend({}, defaults, settings);

    this.stage = ko.observable(doc ? doc.stage : 0);
    this.stages = this.settings.stages;

    this.attachToReport = ko.observable(doc? doc.attachDocument : '');
    this.reports = this.settings.reports;

    // NOTE that attaching a file is optional, ie you can have a document record without a physical file
    this.filename = ko.observable(doc ? doc.filename : '');
    this.filesize = ko.observable(doc ? doc.filesize : '');
    this.name = ko.observable(doc.name);
    // the notes field can be used as a pseudo-document (eg a deferral reason) or just for additional metadata
    this.notes = ko.observable(doc.notes);
    this.filetypeImg = function () {
        var prefix = self.settings.imageLocation;

        if (prefix.charAt(prefix.length - 1) != '/') {
            prefix += '/';
        }
        return prefix + 'filetypes/' + iconnameFromFilename(self.filename());
    };
    this.iconImgUrl = function() {
        if (self.type == 'image' || (self.contentType() && self.contentType().indexOf('image') == 0)) {
            return self.thumbnailUrl;
        }
        return self.filetypeImg();
    };
    this.uploadDate = ko.observable(doc.lastUpdated).extend({simpleDate:false});
    this.status = ko.observable(doc.status || 'active');
    this.attribution = ko.observable(doc ? doc.attribution : '');
    this.license = ko.observable(doc ? doc.license : '');
    this.type = ko.observable(doc.type);
    this.role = ko.observable(doc.role);
    this.roles = this.settings.roles;
    this.public = ko.observable(doc.public);
    this.url = doc.url;
    this.thumbnailUrl = doc.thumbnailUrl ? doc.thumbnailUrl : doc.url;
    this.documentId = doc.documentId;

    this.reportId = ko.observable(doc.reportId);
    this.reportName = ko.computed(function(){
        var name = ''
        if(doc.reportId){
           var assignToReprot = _.find(self.reports, function(report){
                return report.reportId == doc.reportId;
            })
           if (assignToReprot)
               name = assignToReprot.name;
        }
        return name;
    })

    this.hasPreview = ko.observable(false);
    this.error = ko.observable();
    this.progress = ko.observable(0);
    this.complete = ko.observable(false);
    this.readOnly = doc && doc.readOnly ? doc.readOnly : false;
    this.contentType = ko.observable(doc ? doc.contentType : 'application/octet-stream');
    this.fileButtonText = ko.computed(function() {
        return (self.filename() ? "Change file" : "Attach file");
    });
    this.hasPublicRole = ko.pureComputed(function() {
        var role = self.role();
        var roleConfig = _.find(documentRoles, function(docRole) {
            return docRole.id == role;
        });
        return roleConfig && roleConfig.isPublicRole;
    });

    this.onRoleChange = function(val) {
        if (!self.hasPublicRole()){
            this.public(false);
            this.isPrimaryProjectImage(false);
        }
    };

    this.isPrimaryProjectImage = ko.observable(doc.isPrimaryProjectImage);
    this.thirdPartyConsentDeclarationMade = ko.observable(doc.thirdPartyConsentDeclarationMade);
    this.thirdPartyConsentDeclarationText = null;
    this.embeddedVideo = ko.observable(doc.embeddedVideo);
    this.embeddedVideoVisible = ko.computed(function() {
        return (self.role() == 'embeddedVideo');
    });
    this.externalUrl = ko.observable(doc.externalUrl);
    this.labels = ko.observableArray(doc.labels || []);
    this.thirdPartyConsentDeclarationMade.subscribe(function(declarationMade) {
        // Record the text that the user agreed to (as it is an editable setting).
        if (declarationMade) {
            self.thirdPartyConsentDeclarationText = $(self.settings.thirdPartyDeclarationTextSelector).text();
        }
        else {
            self.thirdPartyConsentDeclarationText = null;
        }
        $("#thirdPartyConsentCheckbox").closest('form').validationEngine("updatePromptsPosition")
    });

    this.thirdPartyConsentDeclarationRequired = ko.computed(function() {
        return (self.type() == 'image' ||  self.role() == 'embeddedVideo')  && self.public();
    });
    this.thirdPartyConsentDeclarationRequired.subscribe(function(newValue) {
        if (newValue) {
            setTimeout(function() {$("#thirdPartyConsentCheckbox").validationEngine('validate');}, 100);
        }
    });
    this.fileReady = ko.computed(function() {
        return self.filename() && self.progress() === 0 && !self.error();
    });
    this.saveEnabled = ko.computed(function() {
        if (self.thirdPartyConsentDeclarationRequired() && !self.thirdPartyConsentDeclarationMade()) {
            return false;
        }
        else if(self.role() == 'embeddedVideo'){
            return buildiFrame(self.embeddedVideo()) != "" ;
        }

        return self.fileReady();
    });
    this.saveHelp = ko.computed(function() {
        if(self.role() == 'embeddedVideo' && !buildiFrame(self.embeddedVideo())){
            return 'Invalid embed video code';
        }
        else if(self.role() == 'embeddedVideo' && !self.saveEnabled()){
            return 'You must accept the Privacy Declaration before an embed video can be made viewable by everyone';
        }
        else if (!self.fileReady()) {
            return 'Attach a file using the "+ Attach file" button';
        }
        else if (!self.saveEnabled()) {
            return 'You must accept the Privacy Declaration before an image can be made viewable by everyone';
        }
        return '';
    });
    // make this support both the old key/value syntax and any set of props so we can define more than
    // one owner attribute
    if (owner !== undefined) {
        if (owner.key !== undefined) {
            self[owner.key] = owner.value;
        }
        for (var propName in owner) {
            if (owner.hasOwnProperty(propName) && propName !== 'key' && propName !== 'value') {
                self[propName] = owner[propName];
            }
        }
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
    };
    // Callbacks from the file upload widget, these are attached manually (as opposed to a knockout binding).
    this.fileAttached = function(file) {
        self.filename(file.name);
        self.filesize(file.size);
        // Should be use just the mime type or include the mime type as well?
        if (file.type) {
            var type = file.type.split('/');
            if (type) {
                self.type(type[0]);
            }
        }
        else if (file.name) {

            var type = file.name.split('.').pop();

            var imageTypes = ['gif','jpeg', 'jpg', 'png', 'tif', 'tiff'];
            if ($.inArray(type.toLowerCase(), imageTypes) > -1) {
                self.type('image');
            }
            else {
                self.type('document');
            }
        }
    };
    this.filePreviewAvailable = function(file) {
        this.hasPreview(true);
    };
    this.uploadProgress = function(uploaded, total) {
        var progress = Math.round(uploaded/total*100);
        self.progress(progress);
    };
    this.fileUploaded = function(file) {
        self.complete(true);
        self.url = file.url;
        self.documentId = file.documentId;
        self.progress(100);
        setTimeout(self.close, 1000);
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

    // This save method does not handle file uploads - it just deals with saving the doc record
    // - see below for the file upload save
    this.recordOnlySave = function (uploadUrl) {
        $.post(
            uploadUrl,
            {document:self.toJSONString()},
            function(result) {
                self.complete(true); // ??
                self.documentId = result.documentId;
            })
            .fail(function() {
                self.error('Error saving document record');
            });
    };

    this.toJSONString = function() {
        // These are not properties of the document object, just used by the view model.
        return JSON.stringify(self.modelForSaving());
    };

    this.modelForSaving = function() {
        var result =  ko.mapping.toJS(self, {'ignore':['embeddedVideoVisible','iframe','helper', 'progress', 'hasPreview', 'error', 'fileLabel', 'file', 'complete', 'fileButtonText', 'roles', 'stages','reports','reportName','maxStages', 'settings', 'thirdPartyConsentDeclarationRequired', 'saveEnabled', 'saveHelp', 'fileReady', 'hasPublicRole']});
        if (result.stage === undefined) {
            result.stage = null;
        }
        return result;
    };

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
        autoUpload:false,
        getFilesFromResponse: function(data) { // This is to support file upload on pages that include the fileupload-ui which expects a return value containing an array of files.
            return data;
        }
    }).on('fileuploadadd', function(e, data) {

        fileUploadHelper = data;
        documentViewModel.fileAttached(data.files[0]);
    }).on('fileuploadprocessalways', function(e, data) {
        if (data.files[0].preview) {
            documentViewModel.filePreviewAvailable(data.files[0]);
            if (previewElementSelector !== undefined) {
                $(uiSelector).find(previewElementSelector).append(data.files[0].preview);
            }

        }
    }).on('fileuploadprogressall', function(e, data) {
        documentViewModel.uploadProgress(data.loaded, data.total);
    }).on('fileuploaddone', function(e, data) {

        var result;

        // Because of the iframe upload, the result will be returned as a query object wrapping a document containing
        // the text in a <pre></pre> block.  If the fileupload-ui script is included, the data will be extracted
        // before this callback is invoked, thus the check.*
        if (data.result instanceof jQuery) {
            var resultText = $('pre', data.result).text();
            result = JSON.parse(resultText);
        }
        else {
            result = data.result;
        }

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
        var result = $(uiSelector).find('form').validationEngine("validate");
        if (result) {


            if (documentViewModel.filename() && fileUploadHelper !== undefined) {
                fileUploadHelper.submit();
                fileUploadHelper = null;
            }
            else {
                // There is no file attachment but we can save the document anyway.
                $.post(
                    uploadUrl,
                    {document: documentViewModel.toJSONString()},
                    function (result) {
                        documentViewModel.fileUploaded(result.resp);
                    }, 'json')
                    .fail(function () {
                        documentViewModel.fileUploadFailed('Error uploading document');
                    });
            }
        }
    }
}


/**
 * Creates a bootstrap modal from the supplied UI element to collect and upload a document and returns a
 * jquery Deferred promise to provide access to the uploaded Document.
 * @param uploadUrl the URL to upload the document to.
 * @param documentViewModel default model for the document.  can be used to populate role, etc.
 * @param modalSelector a selector identifying the ui element that contains the markup for the bootstrap modal dialog.
 * @param fileUploadSelector a selector identifying the ui element to attach the file upload functionality to.
 * @param previewSelector a selector identifying an element to attach a preview of the file to (optional)
 * @returns an instance of jQuery.Deferred - the uploaded document will be supplied to a chained 'done' function.
 */
function showDocumentAttachInModal(uploadUrl, documentViewModel, modalSelector, fileUploadSelector, previewSelector) {

    if (fileUploadSelector === undefined) {
        fileUploadSelector = '#attachDocument';
    }
    if (previewSelector === undefined) {
        previewSelector = '#preview';
    }
    var $fileUpload = $(fileUploadSelector);
    var $modal = $(modalSelector);

    function validateReportAssociation(field, rules, i, options) {
        var role = ko.utils.unwrapObservable(documentViewModel.role);
        var documentPublic = ko.utils.unwrapObservable(documentViewModel.public);
        var type = ko.utils.unwrapObservable(documentViewModel.type);

        // Blank values won't be validated unless the "required" rule is
        // present so we have to fake it using this custom validation.
        if (!field.val() && role == 'information' && (type != 'image' || !documentPublic)) {
            if (rules[rules.length-1] != 'required') {
                rules.push('required')
            }
        }
        else {
            if (rules[rules.length-1] == 'required') {
                rules.pop();
            }
        }
    };

    attachViewModelToFileUpload(uploadUrl, documentViewModel, fileUploadSelector, previewSelector);

    // Used to communicate the result back to the calling process.
    var result = $.Deferred();

    // Decorate the model so it can handle the button presses and close the modal window.
    documentViewModel.cancel = function() {
        result.resolve(ko.toJS(documentViewModel));
        closeModal();
    };
    documentViewModel.close = function() {
        result.resolve(ko.toJS(documentViewModel));
        closeModal();
    };

    // Close the modal and tidy up the bindings.
    var closeModal = function() {
        $modal.modal('hide').on('hidden hidden.bs.modal', function() {
            ko.cleanNode($fileUpload[0]);
        });
        $fileUpload.find(previewSelector).empty();
    };

    ko.applyBindings(documentViewModel, $fileUpload[0]);

    // Do the binding from the model to the view?  Or assume done already?
    $modal.modal({backdrop:'static'});
    $modal.on('shown shown.bs.modal', function() {
        $modal.find('form').validationEngine({'custom_error_messages': {
            '#thirdPartyConsentCheckbox': {
                'required': {'message':'The privacy declaration is required for images viewable by everyone'}
            },

        }, scroll:false, autoPositionUpdate:true, promptPosition:'inline', customFunctions:{validateReportAssociation:validateReportAssociation}});
        // Select2 doesn't like being initialised while invisible and leaves some components
        // at 0 size.  This is a workaround.
        $modal.find('.select2-container input[type="search"]').width('100%');

    });

    return result;
}

function findDocumentByRole(documents, role) {
    for (var i=0; i<documents.length; i++) {
        var docRole = ko.utils.unwrapObservable(documents[i].role);
        var status = ko.utils.unwrapObservable(documents[i].status);

        if (docRole === role && status !== 'deleted') {
            return documents[i];
        }
    }
    return null;
};

function findDocumentById(documents, id) {
    if (documents) {
        for (var i=0; i<documents.length; i++) {
            var docId = ko.utils.unwrapObservable(documents[i].documentId);
            var status = ko.utils.unwrapObservable(documents[i].status);
            if (docId === id && status !== 'deleted') {
                return documents[i];
            }
        }
    }
    return null;
}

var DocModel = function (doc) {
    var self = this;
    this.name = doc.name;
    this.attribution = doc.attribution;
    this.filename = doc.filename;
    this.type = doc.type;
    this.url = doc.url;
    this.thumbnailUrl = doc.thumbnailUrl ? doc.thumbnailUrl : doc.url;
    this.filetypeImg = function () {
        return imageLocation + "/filetypes/" + iconnameFromFilename(self.filename);
    };
};
function DocListViewModel(documents, owner, options) {
    var self = this;

    _.extend(self, new Documents());
    self.loadDocuments = function(documents) {
        _.each(documents || [], function(document) {
            self.documents.push(new DocumentViewModel(document, options.owner, options));
        });
    };
    self.loadDocuments(documents);

}
function iconnameFromFilename(filename) {
    if (filename === undefined) { return "blank.png"; }
    var ext = filename.split('.').pop(),
        types = ['aac','ai','aiff','avi','bmp','c','cpp','css','dat','dmg','doc','dotx','dwg','dxf',
            'eps','exe','flv','gif','h','hpp','html','ics','iso','java','jpg','key','mid','mp3','mp4',
            'mpg','odf','ods','odt','otp','ots','ott','pdf','php','png','ppt','psd','py','qt','rar','rb',
            'rtf','sql','tga','tgz','tiff','tif','txt','wav','xls','xlsx'];
    ext = ext.toLowerCase();
    if (ext === 'docx') { ext = 'doc' }
    if ($.inArray(ext, types) >= 0) {
        return ext + '.png';
    } else {
        return "blank.png";
    }
}

var HelpLinksViewModel = function(helpLinks, options) {
    var HELP_LINK_ROLE = 'helpResource';
    var self = this;

    self.helpLinks = ko.observableArray([]);
    self.types = ko.observableArray([{type:'text', description:'Document'}, {type:'video', description:'Video'}]);
    self.addLink = function(link) {
        if (link) {
            link.role = HELP_LINK_ROLE;
        }
        var doc = new DocumentViewModel(link || {role:HELP_LINK_ROLE});

        self.helpLinks.push(doc);
    };
    self.modelAsJSON = function() {
        var documents = [];
        for (var i=0; i<self.helpLinks().length; i++) {
            documents.push(self.helpLinks()[i].modelForSaving());

        }
        return JSON.stringify(documents);
    }
    self.save = function() {
        if ($(options.validationElementSelector).validationEngine('validate')) {
            self.saveWithErrorDetection(function() {
                self.clearHelpLinkCache();
                $.unblockUI();
            });
        }
    };
    self.clearHelpLinkCache = function() {
        $.post(options.clearCacheUrl, {cache:'homePageDocuments'});
    }
    self.cancel = function() {
        window.location.reload();
    }

    for (var i=0; i<helpLinks.length; i++) {
        if (!helpLinks[i].labels) {
            helpLinks[i].labels = ['sort-'+i];
        }
        self.addLink(helpLinks[i]);
    }
    self.helpLinks.sort( function(left, right) {
        var leftSort = left.labels[0];
        var rightSort = right.labels[0];
        return leftSort == rightSort ? 0 : (leftSort < rightSort ? -1 : 1)
    });
    $(options.validationElementSelector).validationEngine();
    autoSaveModel(self, options.documentBulkUpdateUrl, {blockUIOnSave:true, healthCheckUrl:options.healthCheckUrl});
};

function initialiseDocumentTable(containerSelector, excludeReportColumn) {
    var tableSelector = containerSelector + ' .docs-table';
    var options =  {
        "columnDefs": [
            {"type": "alt-string", "targets": 0},
            {"width":"6em", orderData:[4], "targets": [3]},
            {"width":"3em", "targets": [2]},
            {"visible":false, "targets": [4]},
            {"visible":false, "targets": [5]},

        ],
        "order":[[2, 'desc'], [3, 'desc']],
        "dom":
            "<'row'<'col-sm-5'l><'col-sm-7'f>r>" +
            "<'row'<'col-sm-12't>>" +
            "<'row'<'col-sm-6'i><'col-sm-6'p>>"

    };
    if (excludeReportColumn) {
        options.columnDefs.push({visible:false, "targets": [2]});
    }
    var table = $(tableSelector).DataTable(options);

    $(tableSelector +" tr").on('click', function(e) {
        $(tableSelector + " tr.info").removeClass('info');
        $(e.currentTarget).addClass("info");
    });

    function searchStage(column, searchString) {
        table.columns(column).search(searchString, true).draw();
    }

    $(containerSelector + " input[name='doc-filter']").click(function(e) {
        var searchString = '';
        var input = $(this);
        var column = parseInt(input.data('column'));

        input.parents('.document-filter-group').find("input[name='doc-filter']").each(function(val) {
            var $el = $(this);

            if ($el.is(":checked")) {
                if (searchString) {
                    searchString += '|';
                }

                searchString += $el.val();
            }
        });
        searchStage(column, searchString);

    });
}


/**
 * Responsible for a list of documents and the ability to add, edit and delete them.
 * @param {Object} options
 * @Param {Object} options.owner an object to attach to new documents to define the document owner association.  E.g. {projectId:'1234'}
 * @param {Object} options.documentUpdateUrl the URL to POST document create/edit requests to
 * @param {Object} options.documentDeleteUrl the URL to POST document delete requests to
 * @param {Object} options.documentDefaults [{}] properties in this object will be applied to a new document created by the attachDocument method
 * @param {Array}  options.reports an array of objects with properties {name: , reportId}.  If supplied, the attach and edit document dialogs will allow selection from this array
 * @param {string} options.modalSelector [#attachDocument] a css selector that will select the element containing the HTML for the modal dialog
 * @constructor
 */
var EditableDocumentsViewModel = function(options) {
    var self = this;

    var defaults = {
        documentDefaults: {},
        reports: [],
        modalSelector: '#attachDocument'
    };

    var settings = _.defaults(options, defaults);

    if (!settings.documentUpdateUrl) {
        console.log("Warning - missing setting: documentUpdateUrl");
    }
    if (!settings.documentDeleteUrl) {
        console.log("Warning - missing setting: documentDeleteUrl");
    }
    if (!settings.owner) {
        console.log("Warning - missing setting: owner")
    }

    var documentViewModelSettings  = {
        reports: settings.reports,
        stages: settings.stages,
        labels:settings.labels,
        labelsLabel: settings.labelsLabel
    };

    _.extend(self, new Documents(settings));

    self.loadDocuments = function(documents) {
        _.each(documents || [], function(document) {
            self.documents.push(new DocumentViewModel(document, settings.owner, documentViewModelSettings));
        })
    };

    self.attachDocument = function() {
        var newDocument = new DocumentViewModel(settings.documentDefaults, settings.owner, documentViewModelSettings);

        showDocumentAttachInModal(settings.documentUpdateUrl, newDocument, settings.modalSelector).done(function(document) {
            // Pressing cancel will resolve the promise with an undefined document.
            if (document) {
                window.location.reload();
            }
        }).fail(function() {
            bootbox.alert("An error occurred while attaching the document.  Please try again, or contact support", function() {
                window.location.reload();
            })
        });
    };

    self.deleteDocument = function(document) {
        var url = settings.documentDeleteUrl+'/'+document.documentId;
        $.post(url).done(function() {
            window.location.reload();
        }).fail(function() {
            bootbox.alert("An error occurred while deleting the document.  Please try again, or contact support", function() {
                window.location.reload();
            })
        });

    };

    self.editDocumentMetadata = function(document) {

        var url = options.documentUpdateUrl + "/" + document.documentId;
        showDocumentAttachInModal( url, document, settings.modalSelector).done(function() {
            window.location.reload();
        }).fail(function() {
            bootbox.alert("An error occurred while editing the document.  Please try again, or contact support", function() {
                window.location.reload();
            })
        });
    };
};
