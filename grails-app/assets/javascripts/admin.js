//= require pagination.js
//= require datatables.net-plugins/features/fuzzySearch/dist/dataTables.fuzzySearch.js
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

ManageInvestmentPrioritiesViewModel = function(investmentPriorities, options) {
    investmentPriorities = investmentPriorities || [];
    function editForm() {
        return $(options.modalSelector).find('form');
    }
    function InvestmentPriority(investmentPriority) {
        const self = this;
        self.investmentPriorityId = investmentPriority.investmentPriorityId;
        self.type = ko.observable(investmentPriority.type);
        self.name = ko.observable(investmentPriority.name);
        self.description = ko.observable(investmentPriority.description);
        self.categories = ko.observableArray(investmentPriority.categories);
        self.managementUnits = ko.observableArray(investmentPriority.managementUnits);
        self.originalName = investmentPriority.name;
        self.projectCount = ko.observable();
        self.managementUnitLabels = ko.pureComputed(function() {
            return _.reduce(self.managementUnits(), function (memo, managementUnitId) {
                var muObj = _.find(options.availableManagementUnits, function (managementUnit) {
                    return managementUnitId === managementUnit.managementUnitId;
                });
                let result = memo;
                if (result) {
                    result += ",\n";
                }
                result += muObj ? muObj.name : managementUnitId;
                return result;

            }, "");
        });

        self.toJSON = function() {
            return {
                investmentPriorityId: investmentPriority.investmentPriorityId,
                type: self.type(),
                name: self.name(),
                description: self.description(),
                categories: self.categories(),
                managementUnits: self.managementUnits()
            };
        }
    }

    function EditableInvestmentPriority(investmentPriority, isNew) {
        InvestmentPriority.apply(this, [investmentPriority, isNew]);
        let self = this;
        self.isNew = isNew;
        self.investmentPriorityTypes = options.availableTypes;
        self.availableCategories = ko.pureComputed(function() {
            return (options.categoriesByType || {})[self.type()];
        });
        self.duplicate = ko.observable();
        self.saveable = ko.pureComputed(function() {
            let changed = isNew ||
                self.name() !== investmentPriority.name ||
                self.type() !== investmentPriority.type ||
                !_.isEqual(self.categories(), investmentPriority.categories) ||
                !_.isEqual(self.managementUnits(), investmentPriority.managementUnits);

            return changed && !self.duplicate();
        });
    }

    let self = this;
    self.investmentPriorities = _.map(investmentPriorities, function(investmentPriority) {
        return new InvestmentPriority(investmentPriority);
    });

    self.filter = ko.observable();
    self.matchedInvestmentPriorities = ko.observable(investmentPriorities.length);
    self.table = null;
    self.availableCategories = options.availableCategories || [];
    self.availableManagementUnits = options.availableManagementUnits || [];

    self.canAddNewInvestmentPriority = ko.pureComputed(function() {
        return self.matchedInvestmentPriorities() === 0;
    });
    self.editableInvestmentPriority = ko.observable();

    self.doCreateOrEdit = function(investmentPriority, isNew) {
        let editable = new EditableInvestmentPriority(investmentPriority.toJSON(), isNew);
        let subscription = editable.name.subscribe(function(newName) {
            let existing = self.findByName(newName, investmentPriority.investmentPriorityId);
            editable.duplicate(existing);
        });
        self.editableInvestmentPriority(editable);
        $(options.modalSelector).on('hidden.bs.modal', function () {
            subscription.dispose();
            self.editableInvestmentPriority(undefined);
        }).on('shown.bs.modal', function() {
            editForm().validationEngine('attach');
        }).modal('show');

    }

    self.edit = function(investmentPriority) {
        self.doCreateOrEdit(investmentPriority, false);
    }

    self.showFuzzySearchMessage = ko.observable(false);

    self.showUpdateCategory = function() {
        $(options.categoryUpdateModalSelector).modal('show');
    }
    self.newInvestmentPriority = function() {
        let searchTerm = self.table.search.fuzzy();
        self.doCreateOrEdit(new InvestmentPriority({name:searchTerm}), true);
    }

    self.validateName = function(name) {
        if (self.findByName(name)) {
            return "An investment priority with this name already exists.";
        }
    }

    /**
     * Finds an investment priority by name, optionally excluding a specific investment priority id from the search.
     * Used to detect a duplicate name when editing an existing investment priority.
     */
    self.findByName = function(name, excludeId) {
        let lowerName = name.toLowerCase();
        return _.find(self.investmentPriorities, function(investmentPriority) {
            return ko.utils.unwrapObservable(investmentPriority.name).toLowerCase() === lowerName && ko.utils.unwrapObservable(investmentPriority.investmentPriorityId) !== excludeId;
        });
    }

    self.updateInvestmentPriority = function(investmentPriority) {
        self.saveInvestmentPriority(investmentPriority, "Updating investment priority...");
    };

    self.addInvestmentPriority = function(newInvestmentPriority) {
        self.saveInvestmentPriority(newInvestmentPriority, "Adding investment priority...");
    }

    self.saveInvestmentPriority = function(investmentPriorityToSave, message) {
        let valid = editForm().validationEngine('validate');
        if (!valid) {
            return;
        }
        let investmentPriority = investmentPriorityToSave.toJSON();

        if (investmentPriority.name) {
            blockUIWithMessage(message);
            $.post({
                url: fcConfig.saveInvestmentPriorityUrl,
                data: JSON.stringify(investmentPriority),
                contentType: 'application/json'
            }).done(function (response) {
                if (!response.error) {
                    blockUIWithMessage("Reloading page...");
                    window.location.reload();
                } else {
                    $.unblockUI();
                    alert('Error adding tag: ' + response.error);
                }
            }).fail(function (xhr) {
                let message = "An error was encountered saving the investment priority. Please try again.";
                if (xhr && xhr.status == 422) {
                    let response = xhr.responseJSON;
                    let messages = _.map(response.errors, function (error) {
                        return error.message;
                    });
                    message = _.reduce(messages, function (memo, message) {
                        return memo + '\n' + message
                    }, "");
                }
                $.unblockUI();
                alert(message);
            });
        }
    }

    self.mergeInvestmentPriority = function(investmentPriorityToDelete, message) {

        let investmentPriorityIdToDelete = investmentPriorityToDelete.investmentPriorityId;
        let investmentPriorityToReplaceWith = self.editableInvestmentPriority().duplicate().investmentPriorityId;

        if (!investmentPriorityIdToDelete || !investmentPriorityToReplaceWith) {
            alert("An error was encountered merging the investment priorities. Please try again.");
            return;
        }

        bootbox.confirm("Are you sure you want to delete this investment priority and replace it with the existing one?  This cannot be undone.", function(result) {
            if (result) {
                blockUIWithMessage(message);
                let data = {
                    investmentPriorityIdToDelete: investmentPriorityIdToDelete,
                    investmentPriorityIdToReplaceWith: investmentPriorityToReplaceWith
                };
                $.post({
                    url: fcConfig.mergeInvestmentPriorityUrl,
                    data: JSON.stringify(data),
                    contentType: 'application/json'
                }).done(function (response) {
                    if (!response.error) {
                        console.log(response);
                        bootbox.alert("The investment priority has been merged successfully.  The page will now reload.", function() {
                            blockUIWithMessage("Reloading page...");
                            window.location.reload();
                        });
                    } else {
                        $.unblockUI();
                        alert('Error merging investment priority: ' + response.error);
                    }
                }).fail(function (xhr) {
                    let message = "An error was encountered saving the investment priority. Please try again.";
                    if (xhr && xhr.status == 422) {
                        let response = xhr.responseJSON;
                        let messages = _.map(response.errors, function (error) {
                            return error.message;
                        });
                        message = _.reduce(messages, function (memo, message) {
                            return memo + '\n' + message
                        }, "");
                    }
                    $.unblockUI();
                    alert(message);
                });
            }
        });

    }

    // We are doing page reloads as an alternative to manually syncing this model with the
    // data tables API.
    self.deleteInvestmentPriority = function(investmentPriority) {
        if (confirm("Are you sure you want to delete this investment priority?  This cannot be undone.")) {
            blockUIWithMessage("Deleting investment priority...");
            let investmentPriorityId = investmentPriority.investmentPriorityId;
            $.post({
                url: fcConfig.deleteInvestmentPriorityUrl + '/' + investmentPriorityId,
                contentType: 'application/json'
            }).done(function(response) {
                if (!response.success) {
                    $.unblockUI();
                    bootbox.alert('The investment priority was unable to be deleted.   This is possibly because it is being used by a hidden project.');
                } else {
                    blockUIWithMessage("Reloading page...");
                    window.location.reload();
                }
            }).fail(function() {
                $.unblockUI();
                bootbox.alert("An error was encountered deleting the investment priority. Please try again.");
            });
        }
    };

    function fuzzySearchEnabled() {
        var toggle = $('div.dt-search button.toggleSearch').get(0);
        return toggle.hasAttribute('blurred');
    }

    self.projectCountFailed = ko.observable(false);
    function initialiseProjectCounts() {
        return $.get(fcConfig.investmentPriorityProjectCountUrl, function (data) {
            if (data && data.terms) {
                for (let i = 0; i < data.terms.length; i++) {
                    let term = data.terms[i];
                    let investmentPriority = self.findByName(term.term);
                    if (investmentPriority) {
                        investmentPriority.projectCount(term.count);
                    }
                }
            } else {
                self.projectCountFailed(true);
            }
        });
    }
    self.initialiseDataTable = function(tableSelector) {
        // We want the project counts to be initialised before the table is created so
        // that the sort functions correctly.
        initialiseProjectCounts().always(function() {
            var table = $(tableSelector).DataTable({
                columnDefs: [
                    {
                        targets: 0,
                        visible: false,
                        orderable: false,
                        searchable: false
                    },
                    {
                        targets: 1,
                        orderable: true
                    },
                    {
                        targets: 2,
                        orderable: true
                    },
                    {
                        targets: 3,
                        orderable: true
                    },
                    {
                        targets: 4,
                        orderable: false
                    },
                    {
                        targets: 5,
                        orderable: true,
                        searchable: false
                    },
                    {
                        targets: 6,
                        orderable: false,
                        searchable: false
                    }
                ],
                buttons: [{extend: 'copy', title: null}],
                layout: {
                    topStart: 'pageLength',
                    topEnd: ['search', 'buttons'],
                    bottomStart: 'info',
                    bottomEnd: 'paging'
                },
                fuzzySearch: {
                    toggleSmart: true
                },
                stateSave: true,
                initComplete: function (settings) {
                    // The fuzzySearch plugin calls input.off() to remove the default DataTables search handlers, but
                    // with jQuery present that is a no-op, so the default (exact) search handlers keep firing and
                    // conflict with the plugin.  Remove them explicitly.
                    var $container = $(new $.fn.dataTable.Api(settings).table().container());
                    $container.find('div.dt-search input')
                        .off('keyup.DT search.DT input.DT paste.DT cut.DT mouseup.DT');

                    // The fuzzySearch plugin defaults to exact matching and has no option to change that.  Its toggle
                    // button is created in an init.dt handler that runs after initComplete, so defer clicking it until
                    // then to switch the default mode to fuzzy.  A native click is used as the plugin binds listeners
                    // with addEventListener.
                    setTimeout(function () {
                        var toggle = $container.find('div.dt-search button.toggleSearch').get(0);
                        if (toggle && !toggle.hasAttribute('blurred')) {
                            toggle.click();
                        }
                    }, 0);
                }
            });

            self.table = table;
            let tooltipShown = false;
            table.on('search.dt', function (e) {

                let addInvestmentPriorityButton = $(options.addInvestmentPrioritySelector);
                let pageInfo = table.page.info();
                self.matchedInvestmentPriorities(pageInfo.recordsDisplay);
                if (pageInfo.recordsDisplay > 0 && table.search.fuzzy() && fuzzySearchEnabled()) {
                    if (!tooltipShown) {
                        addInvestmentPriorityButton.tooltip('show');
                        tooltipShown = true;
                    } else {
                        addInvestmentPriorityButton.tooltip('update');
                    }
                } else {
                    if (tooltipShown) {
                        addInvestmentPriorityButton.tooltip('hide');
                        tooltipShown = false;
                    }
                }
            });
        });
    };

};
