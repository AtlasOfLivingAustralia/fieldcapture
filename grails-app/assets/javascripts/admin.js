//= require pagination.js
//= require_self

var ApprovableImage = function(doc) {
    var self = this;
    var APPROVED = 'hp-y';
    var REJECTED = 'hp-n';
    var labelIndex = function(label) {
        return self.labels().indexOf(label);
    };
    var removeLabels = function() {
        var index = labelIndex(REJECTED);
        if (index >= 0) {
            self.labels().splice(index, 1);
        }
        index = labelIndex(APPROVED);
        if (index >= 0) {
            self.labels().splice(index, 1);
        }
    };
    $.extend(self, doc);
    self.labels = ko.observableArray(doc.labels);
    self.approved = ko.computed(function() {
        return self.labels().indexOf(APPROVED) >= 0;
    });
    self.rejected = ko.computed(function() {
        return self.labels().indexOf(REJECTED) >= 0;
    });
    self.approve = function() {
        removeLabels();
        self.labels.push(APPROVED);
    };
    self.reject = function() {
        removeLabels();
        self.labels.push(REJECTED);
    };

};


var ImageGallery = function() {
    var self = this;
    self.pagination = new PaginationViewModel({}, self);
    self.sort = ko.observable('labels');
    self.images = ko.observableArray([]);

    self.refreshPage = function(offset) {
        var url = fcConfig.homePageImagesUrl;
        $.get(url, {offset:offset, max:self.pagination.resultsPerPage(), sort:self.sort()}, function(data) {
            self.images($.map(data.documents, function(doc) {
                return new ApprovableImage(doc);
            }));

            if (offset == 0) {
                self.pagination.loadPagination(0, data.count);
            }
        });
    };
    self.approve = function(doc) {
        doc.approve();
        self.save(doc);
    };
    self.reject = function(doc) {
        doc.reject();
        self.save(doc);
    };
    self.save = function(doc) {
        var url = fcConfig.documentUpdateUrl+'/'+doc.documentId;
        $.post( url, {document:JSON.stringify({documentId:doc.documentId, labels:doc.labels()})}).fail(function() {
            alert("There was an error saving your change.");
        });
    };
    self.refreshPage(0);
    self.sort.subscribe(function() {
        self.refreshPage(0);
    });

};

/**
 * Knockout view model for Remove USer Permission pages.
 * @param options an object specifying the following options:
 * validationContainerSelector, searchUserDetailsUrl, removeUserDetailsUrl
 * @constructor
 */
var RemoveUserPermissionViewModel = function (options){
    var defaults = {
        validationContainerSelector: '.validationEngineContainer'
    };
    var self =this;
    var config = $.extend({}, defaults, options);

    self.userId = ko.observable();
    self.emailAddress = ko.observable()
    self.firstName = ko.observable();
    self.lastName = ko.observable();
    self.email = ko.observable();



    self.searchUserDetails = function (){
        var emailAddress = self.emailAddress();
        if (emailAddress){
            $.get(config.searchUserDetailsUrl, {emailAddress: emailAddress}, undefined, "json").done(function (data){
                if (data.error === "error"){
                    bootbox.alert('<span class="label label-important">This Email Address is invalid: </span><p>' + data.emailAddress + '</p>');
                }else{
                    self.userId(data.userId);
                    self.firstName(data.firstName);
                    self.lastName(data.lastName);
                    self.email(data.emailAddress);

                }
            }).fail( function (){
                bootbox.alert('<span class="label label-important">This Email Address is invalid: </span><p>' + data.emailAddress + '</p>')
        });
        }else{
            bootbox.alert('<span class="label label-important">Please Enter the Email Address</span>');
        }

    };

    self.removeUserDetails = function (){
        var userId = self.userId();

        blockUIWithMessage("Removing User Permission...");
        $.post(config.removeUserDetailsUrl,{userId: userId},undefined, "json" ).done(function (data){
           if (data.error){
               bootbox.alert('<span class="label label-important">Failed to remove users from MERIT </span>'+'<p> Reason: '+data.error+'</p>');
               $.unblockUI();
           }else{
               blockUIWithMessage("Successfully Remove User Permission...")
               blockUIWithMessage("Refreshing page...");
               window.location.reload();
           }
        }).fail(function(data) {
            alert('An unhandled error occurred: ' + data.status + " Please refresh the page and try again");
            $.unblockUI();
        });
    };

};

var ProjectImportViewModel = function (config) {
    var self = this;

    self.filename = ko.observable();
    self.progressSummary = ko.observable();
    self.progressDetail = ko.observableArray([]);
    self.finishedPreview = ko.observable(false);
    self.finished = ko.observable(false);
    self.preview = ko.observable(true);
    self.importing = ko.observable(false);
    self.update = ko.observable(false);

    self.success = ko.computed(function() {
        var success = !self.preview();
        if (success) {
            for (var i = 0; i < self.progressDetail().length; i++) {
                success = success && self.progressDetail()[i].success;
            }
        }

        return success;

    });

    self.uploadOptions = {
        url: config.importUrl,
        change: function() {
          self.preview(true);
          self.finishedPreview(false);
          self.finished(false);
          self.progressDetail([]);
          self.progressSummary('');
        },
        done: function (e, data) {

            if (data.result) {
                var result = data.result;
                var resultsCount = result.projects.length;
                if (resultsCount > 0) {
                    resultsCount = result.projects.length - 1;
                }
                self.progressDetail(result.projects);
                self.progressSummary('Processed ' + resultsCount + ' projects');

                if (self.preview()) {
                    self.preview(false);
                    self.finishedPreview(true);
                    self.finished(false);

                }
                else {
                    self.finished(true);
                }

            }
            else {
                var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
                alert(message);
            }

        },
        fail: function (e, data) {
            var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
            alert(message);

        },

        uploadTemplateId: "template-upload",
        downloadTemplateId: "template-download",
        formData: function() {
            return [
                {
                    name: 'preview',
                    value: true
                },
                {
                    name: 'update',
                    value: self.update()
                }
            ];
        },
        paramName: 'projectData'

    }

    self.showProgress = function () {
        var stop = false;
        $.get(config.importProgressUrl).done(function (progress) {

            if (self.finished()) {
                stop = true;
            }
            else {
                self.progressDetail(progress.projects);
                if (!progress.finished) {
                    self.progressSummary(progress.projects.length + ' projects processed...');
                }
            }
        }).always(function() {
            if (!stop) {
                setTimeout(self.showProgress, 2000);
            }
        });

    };

    self.doImport = function () {
        self.importing(true);
        self.progressSummary('Importing....');
        self.progressDetail([]);

        $.ajax(config.importUrl, {

            dataType: 'json',
            success: function (result) {

                self.finished(true);
                self.finishedPreview(false);
                if (result.error) {
                    alert(result.error);
                    self.progressSummary(result.error);
                    self.progressDetail(result.projects?result.projects:[])
                }
                else {
                    var resultsCount = result.projects.length;
                    if (resultsCount > 0) {
                        resultsCount = result.projects.length - 1;
                    }
                    self.progressDetail(result.projects);
                    self.progressSummary('Import complete. ' + resultsCount + ' projects');
                }
            },
            data: {
                preview: false,
                update: self.update()
            },
            error: function () {
                var message = 'Please contact MERIT support and attach your spreadsheet to help us resolve the problem';
                alert(message);
            }
        });
        setTimeout(self.showProgress, 2000);
    }
};

EditHelpDocumentsViewModel = function(hubId, categories, documents) {
    let self = this;
    var options = {
        roles: ['helpDocument'],
        owner: {
            hubId:hubId
        },
        documentDefaults: {
            role: 'helpDocument',
            public: true
        },
        labelsLabel: 'Categories',
        labels: categories,
        modalSelector: '#attachDocument',
        documentUpdateUrl: fcConfig.documentUpdateUrl,
        documentDeleteUrl: fcConfig.documentDeleteUrl,
        imageLocation: fcConfig.imageLocation
    };
    self.selectedCategory = ko.observable();
    self.documentCategories = ko.observableArray(categories);
    self.newCategoryName = ko.observable();

    self.newCategory = function() {
        let category = self.newCategoryName();
        self.documentCategories.push(category);
        self.selectedCategory(category);
        self.newCategoryName(null);
    }
    self.selectedCategory.subscribe(function (category) {
        options.documentDefaults.labels = [category];
    });

    _.extend(self, new EditableDocumentsViewModel(options));

    documentRoles = [{id:'helpDocument', name:'Help Document', isPublicRole:true}];
    self.loadDocuments(documents);

};

ManageTagsViewModel = function(tags, options) {
    tags = tags || [];

    function Term(term) {
        var self = this;

        self.editable = ko.observable(false);
        self.term = ko.observable(term.term);
        self.description = ko.observable(term.description);
        self.category = ko.observable(term.category);
        self.originalTerm = term;

        self.edit = function() {
            self.editable(true);
        }

        self.cancelEdit = function() {
            self.editable(false);
            self.term(term.term);
            self.description(term.description);
        }

        self.saveable = ko.computed(function() {
            return self.editable() && (self.term() != term.term || self.description() != term.description);
        });

        self.toJSON = function() {
            return {
                termId: term.termId,
                term: self.term(),
                description: self.description(),
                category: self.category()
            };
        }
    }

    let self = this;
    self.tags = _.map(tags, function(tag) {
        return new Term(tag);
    });

    self.filter = ko.observable();
    self.matchedTags = ko.observable(tags.length);
    self.table = null;

    self.canAddNewTag = ko.pureComputed(function() {
        return self.matchedTags() == 0;
    });

    self.newTag = new Term({});

    // We are doing page reloads as an alternative to manually syncing this model with the
    // data tables API.
    self.deleteTag = function(tag) {
        if (confirm("Are you sure you want to delete this tag?")) {
            blockUIWithMessage("Deleting tag...");

            $.post({
                url: fcConfig.deleteTagUrl,
                data: JSON.stringify(tag),
                contentType: 'application/json'
            }).done(function(response) {
                    if (response.error) {
                        $.unblockUI();
                        bootbox.alert('Error deleting tag: ' + response.error);
                    } else {
                        blockUIWithMessage("Reloading page...");
                        window.location.reload();
                    }
            }).fail(function() {
                $.unblockUI();
                bootbox.alert("An error was encountered deleting the tag. Please try again.");
            });
        }
    };
    self.updateTag = function(tag) {
        blockUIWithMessage("Updating tag...");

        $.post({
            url:fcConfig.updateTagUrl,
            data: JSON.stringify(tag.toJSON()),
            contentType: 'application/json'
        }).done(function(response) {
            if (!response.error) {
                tag.editable(false);
                $.unblockUI();
                window.location.reload();
            } else {
                $.unblockUI();
                alert('Error updating tag: ' + response.error);
            }
        }).fail(
            function() {
                $.unblockUI();
                alert("An error was encountered updating the tag. Please try again.");
            }
        );
    };

    self.addTag = function() {
        let tag = self.newTag.toJSON();

        if (tag.term) {
            blockUIWithMessage("Adding tag...");
            $.post({
                url: fcConfig.addTagUrl,
                data: JSON.stringify(tag),
                contentType: 'application/json'
            }).done(function(response) {
                if (!response.error) {
                    blockUIWithMessage("Reloading page...");
                    window.location.reload();
                } else {
                    $.unblockUI();
                    alert('Error adding tag: ' + response.error);
                }
            }).fail(function() {
                $.unblockUI();
                alert("An error was encountered adding the tag. Please try again.");
            });
        }
    }

    self.initialiseDataTable = function(tableSelector) {
        var table = $(tableSelector).DataTable({
            columnDefs: [
                {
                    targets: 0,
                    orderable: true
                },
                {
                    targets: 1,
                    orderable:false
                }
            ]
        });
        self.table = table;
        table.on('search.dt', function(e) {

            let pageInfo = table.page.info();
            self.matchedTags(pageInfo.recordsDisplay);
            self.newTag.term(table.search());
        });
    }
};
