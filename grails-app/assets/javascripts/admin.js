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

var RemoveUserPermissionViewModel = function (props, options){
    var defaults = {
        validationContainerSelector: '.validationEngineContainer'
    };
    var config = $.extend({}, defaults, options);
    var self =$.extend(this, new Documents(options));
    self.userId = ko.observable();
    self.emailAddress = ko.observable()
    self.firstName = ko.observable();
    self.lastName = ko.observable();
    self.users = ko.observableArray();



    self.searchUser = function (){
        var emailAddress = self.emailAddress()
        if (emailAddress){
            $.get(config.searchUser, {emailAddress: emailAddress, contentType: "application/json"}).done(function (data){
                if (data.error === "error"){
                    bootbox.alert('<span class="label label-important">This Email Address is invalid: </span><p>' + emailAddress + '</p>');
                }else{
                    self.users(data)
                }
            });
        }else{
            bootbox.alert('<span class="label label-important">Please Enter the Email Address</span>');
        }

    };

    self.removeUser = function (data){
        var userId = data.userId

        $.get(config.removeUser, {userId: userId, contentType: "application/json"}).done(function (data){
           if (data.error){
                   bootbox.alert('<span class="label label-important">Failed to remove users from MERIT </span>'+'<p> Reason: '+data.error+'</p>');
           }else{
               blockUIWithMessage("Successfully Remove User Permission...")
               blockUIWithMessage("Refreshing page...");
               window.location.reload();
           }
        }).fail(function(data) {
            $.unblockUI();
            alert('An unhandled error occurred: ' + data.status + " Please refresh the page and try again");
        });
    };

};
