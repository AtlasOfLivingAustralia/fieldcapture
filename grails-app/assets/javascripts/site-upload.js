var SiteViewModel = function(shape) {
    var self = this;

    self.id = shape.id;
    self.name = ko.observable();
    self.description = ko.observable();
    self.externalId = ko.observable();
    self.selected = ko.observable(true);

    self.attributes = shape.values;

    self.toJS = function() {
        return {
            id: self.id,
            name: self.name(),
            description: self.description(),
            externalId: self.externalId()
        };
    };
};

var SiteUploadViewModel = function(attributeNames, shapes, projectId, shapeFileId, config) {
    var self = this;

    self.nameAttribute = ko.observable('');
    self.descriptionAttribute = ko.observable('');
    self.externalIdAttribute = ko.observable('');

    self.attributeNames = ko.observableArray(attributeNames);
    self.sites = ko.observableArray([]);
    self.selectAll = ko.observable(true);
    self.progress = ko.observable('0%');
    self.progressText = ko.observable('');
    self.progressErrors = ko.observableArray();
    self.finished = ko.observable(false);
    self.selectedCount = ko.observable(0);
    self.selectAll.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {site.selected(newValue);});
    });

    self.nameAttribute.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {
            if (newValue) {
                site.name(site.attributes[newValue]);
            }
            else {
                site.name('Site '+(i+1));
            }
        });
    });
    self.descriptionAttribute.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {site.description(site.attributes[newValue]);});
    });
    self.externalIdAttribute.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {site.externalId(site.attributes[newValue]);});
    });

    self.finish = function() {
        document.location.href = config.returnToUrl;
    };

    self.save = function() {
        if (!$(config.validationContainerSelector).validationEngine('validate')) {
            return;
        }
        var payload = {};
        payload.shapeFileId = shapeFileId;
        payload.projectId = projectId;
        payload.sites = [];
        $.each(self.sites(), function(i, site) {
            if (site.selected()) {
                payload.sites.push(site.toJS());
            }
        });

        $.ajax({
            url: config.saveSitesUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload)
        }).done(function (data) {
            if (data && data.progress && !data.progress.cancelling) {
                var word = 'Uploaded ';
                if (data.progress.errors) {
                    self.progressErrors(data.progress.errors);
                    word = 'Processed ';
                }
                self.progressText(word + payload.sites.length + ' of ' + payload.sites.length + ' sites');
                self.progress('100%');

            }

        }).fail(function () {
            $(config.progressSelector).modal('hide');

            alert('There was a problem uploading sites.');
        }).always(function() {
            self.finished(true);
        });


        self.progressText('Uploaded 0 of '+payload.sites.length+' sites');
        $(config.progressSelector).modal({backdrop:'static'});
        setTimeout(self.showProgress, 2000);


    };

    self.showProgress = function() {
        $.get(config.siteUploadProgressUrl, function(progress) {
            var finished = false;
            if (progress && progress.uploaded !== undefined) {
                var word = 'Uploaded ';
                if (progress.errors) {
                    self.progressErrors(progress.errors);
                    word = 'Processed ';
                }
                var progressPercent = Math.round(progress.uploaded/progress.total * 100)+'%';
                self.progress(progressPercent);
                if (progress.cancelling) {
                    self.progressText("Cancelling upload...");
                }
                else {
                    self.progressText(word+progress.uploaded+' of '+progress.total+' sites '+progressPercent);
                }

                finished = progress.finished;
            }
            if (!finished) {
                setTimeout(self.showProgress, 2000);
            }
        });
    };

    self.cancelUpload = function() {
        $.post(config.cancelSiteUploadUrl).always(function() {
            self.progressText("Cancelling upload...");
        });
    };

    self.countSelectedSites = function() {
        var count = 0;
        $.each(self.sites(), function(i, site) {
            if (site.selected()) {
                count++;
            }
        });
        self.selectedCount(count);
    };

    self.cancel = function() {
        document.location.href = config.returnToUrl;
    };

    $.each(shapes, function(i, obj) {
        var site = new SiteViewModel(obj);
        site.selected.subscribe(self.countSelectedSites);
        self.sites.push(site);
    });
    $.each(attributeNames, function(i, name) {
        if (name.toUpperCase() === 'NAME') {
            self.nameAttribute(name);
        }
    });

    $.each(attributeNames, function(i, name) {
        if (name.toUpperCase() === 'DESCRIPTION') {
            self.descriptionAttribute(name);
        }
    });
    self.countSelectedSites();

};