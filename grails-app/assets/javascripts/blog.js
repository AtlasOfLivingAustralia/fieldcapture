

var BlogViewModel = function(entries, type) {
    var self = this;
    self.entries = ko.observableArray();

    for (var i=0; i<entries.length; i++) {
        if (!type || entries[i].type == type) {
            self.entries.push(new BlogEntryViewModel(entries[i]));
        }
    }
};

var BlogEntryViewModel = function(blogEntry) {
    var self = this;
    var now = convertToSimpleDate(new Date());
    self.blogEntryId = ko.observable(blogEntry.blogEntryId);
    self.projectId = ko.observable(blogEntry.projectId);
    self.programId = ko.observable(blogEntry.programId);
    self.managementUnitId = ko.observable(blogEntry.managementUnitId);
    self.blogOf = ko.computed(function() {
        if(self.projectId())
            return "PROJECT"
        else if(self.programId())
            return "PROGRAM"
        else if(self.managementUnitId())
            return "MANAGEMENTUNIT"
        else
            return "MERIT"
    });
    self.title = ko.observable(blogEntry.title || '');
    self.date = ko.observable(blogEntry.date || now).extend({simpleDate:false});
    self.keepOnTop = ko.observable(blogEntry.keepOnTop || false);
    self.content = ko.observable(blogEntry.content).extend({markdown:true});
    self.stockIcon = ko.observable(blogEntry.stockIcon);
    self.documents = ko.observableArray(blogEntry.documents || []);
    self.viewMoreUrl = ko.observable(blogEntry.viewMoreUrl);
    self.image = ko.computed(function() {
        return self.documents()[0];
    });
    self.type = ko.observable();
    self.formattedDate = ko.computed(function() {
        return moment(self.date()).format('Do MMM YYYY')
    });
    self.shortContent = ko.computed(function() {
        var content = self.content() || '';
        if (content.length > 60) {
            content = content.substring(0, 100)+'...';
        }
        return content;
    });
    self.imageUrl = ko.computed(function() {
        if (self.image()) {
            return self.image().url;
        }
    });
    self.imageThumbnailUrl =  ko.computed(function() {
        if (self.image()) {
            return self.image().thumbnailUrl || self.image().url;
        }
    });
};

var EditableBlogEntryViewModel = function(blogEntry, options) {

    var storyType ="Site Stories";
    if (blogEntry.programId)
        storyType ="Program Stories"
    else if ( blogEntry.managementUnitId)
        storyType ="Management Unit Stories"
    else if (blogEntry.projectId)
        storyType = 'Site Stories'


    var defaults = {
        validationElementSelector:'.validationEngineContainer',
        types:['News and Events', storyType, 'Photo'],
        returnTo:fcConfig.returnTo,
        blogUpdateUrl:fcConfig.blogUpdateUrl
    };
    var config = $.extend(defaults, options);
    var self = this;
    var now = convertToSimpleDate(new Date());
    self.blogEntryId = ko.observable(blogEntry.blogEntryId);
    self.projectId = ko.observable(blogEntry.projectId || undefined);
    self.programId = ko.observable(blogEntry.programId || undefined);
    self.managementUnitId = ko.observable(blogEntry.managementUnitId || undefined);

    self.blogOf = ko.computed(function() {
        if(self.projectId())
            return "PROJECT"
        else if(self.programId())
            return "PROGRAM"
        else if(self.managementUnitId())
            return "MANAGEMENTUNIT"
        else
            return "SITE"
    });
    self.title = ko.observable(blogEntry.title || '');
    self.date = ko.observable(blogEntry.date || now).extend({simpleDate:false});
    self.keepOnTop = ko.observable(blogEntry.keepOnTop || false);
    self.content = ko.observable(blogEntry.content);
    self.stockIcon = ko.observable(blogEntry.stockImageName);
    self.documents = ko.observableArray();
    self.image = ko.observable();
    self.type = ko.observable(blogEntry.type);
    self.viewMoreUrl = ko.observable(blogEntry.viewMoreUrl).extend({url:true});

    self.imageUrl = ko.computed(function() {
        if (self.image()) {
            return self.image().url;
        }
    });
    self.imageThumbnailUrl =  ko.computed(function() {
        if (self.image()) {
            return self.image().thumbnailUrl || self.image().url;
        }
    });
    self.imageId = ko.computed(function() {
        if (self.image()) {
            return self.image().documentId;
        }
    });
    self.documents.subscribe(function() {
        if (self.documents()[0]) {
            self.image(new DocumentViewModel(self.documents()[0]));
        }
        else {
            self.image(undefined);
        }
    });
    self.removeBlogImage = function() {
        self.documents([]);
    };

    self.modelAsJSON = function() {
        var js = ko.mapping.toJS(self, {ignore:['transients', 'documents', 'image', 'imageUrl']});
        if (self.image()) {
            js.image = self.image().modelForSaving();
        }
        return JSON.stringify(js);
    };

    self.editContent = function() {
        editWithMarkdown('Blog content', self.content);
    };

    self.save = function() {
        if ($(config.validationElementSelector).validationEngine('validate')) {
            self.saveWithErrorDetection(
                function() {document.location.href = config.returnTo},
                function(data) {bootbox.alert("Error: "+data.responseText);}
            );
        }
    };

    self.cancel = function() {
        document.location.href = config.returnTo;
    };

    self.transients = {};
    self.transients.blogEntryTypes = config.types;

    if (blogEntry.documents && blogEntry.documents[0]) {
        self.documents.push(blogEntry.documents[0]);
    }
    $(config.validationElementSelector).validationEngine();
    autoSaveModel(self, config.blogUpdateUrl, {blockUIOnSave:true});
};

var BlogSummary = function(blogEntries) {
    var self = this;
    self.entries = ko.observableArray();

    self.load = function(entries) {
        self.entries($.map(entries, function(blogEntry) {
            return new BlogEntryViewModel(blogEntry);
        }));
    };

    self.newBlogEntry = function() {
        document.location.href = fcConfig.createBlogEntryUrl;
    };
    self.deleteBlogEntry = function(entry) {
        var url = fcConfig.deleteBlogEntryUrl+'&id='+entry.blogEntryId();
        $.post(url).done(function() {
            document.location.reload();
        });
    };
    self.editBlogEntry = function(entry) {
        document.location.href = fcConfig.editBlogEntryUrl+'&id='+entry.blogEntryId();
    };
    self.load(blogEntries);
};
