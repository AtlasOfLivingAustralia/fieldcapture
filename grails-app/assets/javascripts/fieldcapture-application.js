if (typeof jQuery !== 'undefined') {
	(function($) {
		$(document).ajaxStart(function() {
			$('#spinner').fadeIn();
		}).ajaxStop(function() {
			$('#spinner').fadeOut();
		});
	})(jQuery);
}
// deprecated
$('#debug').click(function () {
    $(this).next().toggle();
});
// handles debug sections
$('.expandable-debug').each(function() {
    $(this).find('div,pre,ul').hide();
    $(this).find('h1,h2,h3,h4,h5')
        .css('cursor','pointer')
        .css('color','grey')
        .click(function () {
            $(this).next().toggle();
        })
        .hover(
            function () { $(this).css('text-decoration','underline') },
            function () { $(this).css('text-decoration','none') }
        );
    // pretty print sections with class pretty
    if (vkbeautify && typeof vkbeautify.json === 'function') {
        $(this).find('pre').each(function() {
            var value = $(this).html();
            if (value !== '') {
                try {
                    $(this).html(vkbeautify.json(value));
                } catch (e) {
                    $(this).html(value);
                }
            }
        });
    }
});

// returns blank string if the property is undefined, else the value
function orBlank(v) {
    return v === undefined ? '' : v;
}
function orFalse(v) {
    return v === undefined ? false : v;
}
function orZero(v) {
    return v === undefined ? 0 : v;
}
function orEmptyArray(v) {
    return v === undefined ? [] : v;
}

function fixUrl(url) {
    return typeof url == 'string' && url.indexOf("://") < 0? ("http://" + url): url;
}

function exists(parent, prop) {
    if(parent === undefined)
        return '';
    if(parent == null)
        return '';
    if(parent[prop] === undefined)
        return '';
    if(parent[prop] == null)
        return '';
    if(ko.isObservable(parent[prop])){
        return parent[prop]();
    }
    return parent[prop];
}

/* From:
 * jQuery File Upload User Interface Plugin 6.8.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
function formatBytes(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
}

/**
 Bootstrap Alerts -
 Function Name - showAlert()
 Inputs - message,alerttype,target
 Example - showalert("Invalid Login","alert-error","alert-placeholder")
 Types of alerts -- "alert-error","alert-success","alert-info"
 Required - You only need to add a alert_placeholder div in your html page wherever you want to display these alerts "<div id="alert_placeholder"></div>"
 Written On - 14-Jun-2013
 **/
function showAlert(message, alerttype, target) {

    showAlertWithSelector(message, alerttype, '#'+target);
}

function showAlertWithSelector(message, alerttype, targetSelector) {

    $(targetSelector).append('<div class="alert ' +  alerttype + ' auto-close-alert"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')

    setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
        $(".auto-close-alert").remove();
    }, 5000);
}

function blockUIWithMessage(message) {
    $.blockUI({ message: message, fadeIn:0,
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        } });
}

var unloadHandler = function() {

    var callbacks = [];
    var runCallbacks = function(e) {
        // If we haven't been passed the event get the window.event
        e = e || window.event;

        return _.find(callbacks, function(callback) {
            return callback.callback(e);
        });
    };


    function addCallback(callback, order) {
        var item = {
            order:order,
            callback:callback
        };
        callbacks.push(item);
        callbacks = _.sortBy(callbacks, 'order');
        if (callbacks.length == 1) {
            window.onbeforeunload = runCallbacks;
        }
    }

    function removeCallback(callback) {
        callbacks = _.filter(callbacks, function(item) { return item.callback !== callback});
        if (callbacks.length == 0) {
            window.beforeunload = null;
        }
    }

    return {
        addCallback:addCallback,
        removeCallback:removeCallback
    };

}();

/**
 * Attaches a simple dirty flag (one shot change detection) to the supplied model, then once the model changes,
 * auto-saves the model using the supplied key every autoSaveIntervalInSeconds seconds.
 * @param viewModel the model to autosave.
 * @param key the (localStorage) key to use when saving the model.
 * @param autoSaveIntervalInSeconds [optional, default=60] how often to autosave the edited model.
 */
function autoSaveModel(viewModel, saveUrl, options) {

    var serializeModel = function() {
        return (typeof viewModel.modelAsJSON === 'function') ? viewModel.modelAsJSON() : ko.toJSON(viewModel);
    };

    var defaults = {
        storageKey:window.location.href+'.autosaveData',
        autoSaveIntervalInSeconds:60,
        restoredDataWarningSelector:"#restoredData",
        resultsMessageSelector:"#save-result-placeholder",
        timeoutMessageSelector:"#timeoutMessage",
        errorMessage:"Failed to save your data: ",
        successMessage:"Save successful!",
        errorCallback:undefined,
        successCallback:undefined,
        blockUIOnSave:false,
        blockUISaveMessage:"Saving...",
        blockUISaveSuccessMessage:"Save successful",
        serializeModel:serializeModel,
        pageExitMessage: 'You have unsaved data.  If you leave the page this data will be lost.',
        preventNavigationIfDirty: false,
        defaultDirtyFlag:ko.simpleDirtyFlag,
        dirtyFlagRateLimitMs: 0, // If ko.dirtyFlag is used (rather than ko.simpleDirtyFlag), this is the rate limit in ms for detecting changes.
        healthCheckUrl: fcConfig  && fcConfig.healthCheckUrl
    };
    var config = $.extend(defaults, options);

    if (!config.healthCheckUrl) {
        throw "Missing mandatory option: healthCheckUrl"
    }

    var lockService = new LockService({});
    var flagForUnlockCallback = function() {
        lockService.exitingWithLock(config.lockedEntity);
    }
    if (config.lockedEntity) {
        lockService.lock(config.lockedEntity);
        window.addEventListener("unload", flagForUnlockCallback);
    }

    var autosaving = false;

    var deleteAutoSaveData = function() {
        amplify.store(config.storageKey, null);
    };

    function confirmOnPageExit(e) {

        // For IE6-8 and Firefox prior to version 4
        if (e) {
            e.returnValue = config.pageExitMessage;
        }

        // For Chrome, Safari, IE8+ and Opera 12+
        return config.pageExitMessage;
    };

    var onunloadHandler = function(e) {
        autosaving = false;
        deleteAutoSaveData();

        return confirmOnPageExit(e);
    };

    var autoSaveModel = function() {
        if (!autosaving) {
            return;
        }

        if (viewModel.dirtyFlag.isDirty()) {
            amplify.store(config.storageKey, serializeModel());
            amplify.store(config.storageKey+'-updated', new Date().toISOStringNoMillis());
            window.setTimeout(autoSaveModel, config.autoSaveIntervalInSeconds*1000);
        }
    };

    viewModel.cancelAutosave = function() {
        autosaving = false;
        deleteAutoSaveData();
        if (config.preventNavigationIfDirty) {
            unloadHandler.removeCallback(onunloadHandler);
        }
        if (config.lockedEntity) {
            lockService.clearLock(config.lockedEntity);
            window.removeEventListener("unload", flagForUnlockCallback);
        }
    };

    if (typeof viewModel.dirtyFlag === 'undefined') {
        viewModel.dirtyFlag = config.defaultDirtyFlag(viewModel, false, options.dirtyFlagRateLimitMs);
    }
    viewModel.dirtyFlag.isDirty.subscribe(
        function() {
            if (viewModel.dirtyFlag.isDirty()) {
                autosaving = true;

                if (config.preventNavigationIfDirty) {
                    unloadHandler.addCallback(onunloadHandler, 0);
                }
                window.setTimeout(autoSaveModel, config.autoSaveIntervalInSeconds*1000);
            }
            else {
                viewModel.cancelAutosave();
            }
        }
    );

    var saveFailureHandler = function (data) {
        if (config.preventNavigationIfDirty) {
            unloadHandler.removeCallback(onunloadHandler);
        }
        if (config.blockUIOnSave) {
            $.unblockUI();
        }
        var message = $(config.timeoutMessageSelector).html();
        if (message) {
            bootbox.alert(message, function() {
                if (config.preventNavigationIfDirty) {
                    unloadHandler.addCallback(onunloadHandler, 0);
                }
            });
        }
    };

    /**
     * This method:
     * 1. Saves the model to local storage
     * 2. Checks to see if the server is available and the user logged in
     * 3. Saves the model.
     * 4. Cleans up the local storage.
     *
     * If 2. fails, the local storage is not deleted and a message is displayed to the user.
     *
     * @param successCallback a callback to be invoked if the save is successful.
     * @param errorCallback a callback to be invoked if the save fails.
     *
     * @return a jquery Deferred object that will be resolved with the combined result of the health check and save result.
     */
    viewModel.saveWithErrorDetection = function(successCallback, errorCallback) {
        if (config.blockUIOnSave) {
            blockUIWithMessage(config.blockUISaveMessage);
        }
        $(config.restoredDataWarningSelector).hide();

        var json = config.serializeModel();

        // Store data locally in case the save fails.
        amplify.store(config.storageKey, json);
        amplify.store(config.storageKey+'-updated', new Date().toISOStringNoMillis());

        var result = $.Deferred();
        var invokeCallbacksAndRejectResult = function(data) {
            if (typeof errorCallback === 'function') {
                errorCallback(data);
            }
            if (typeof config.errorCallback === 'function') {
                config.errorCallback(data);
            }
            result.reject();
        };

        healthCheck(config.healthCheckUrl).done(function() {
            $.ajax({
                url: saveUrl,
                type: 'POST',
                data: json,
                contentType: 'application/json'
            }).done(function (data, textStatus, jqXHR) {
                if (data.error) {
                    if (config.blockUIOnSave) {
                        $.unblockUI();
                    }
                    showAlertWithSelector(config.errorMessage + data.detail + ' \n' + data.error,
                        "alert-error",config.resultsMessageSelector);
                    if (typeof errorCallback === 'function') {
                        errorCallback(data);
                    }
                    if (typeof config.errorCallback === 'function') {
                        config.errorCallback(data);
                    }

                } else {
                    if (config.blockUIOnSave) {
                        blockUIWithMessage(config.blockUISaveSuccessMessage);
                    }
                    else {
                        showAlertWithSelector(config.successMessage, "alert-success", config.resultsMessageSelector);
                    }
                    viewModel.cancelAutosave();
                    viewModel.dirtyFlag.reset();
                    if (typeof successCallback === 'function') {
                        successCallback(data);
                    }
                    if (typeof config.successCallback === 'function') {
                        config.successCallback(data);
                    }
                }
                result.resolve();
            }).fail(saveFailureHandler).fail(invokeCallbacksAndRejectResult);
        }).fail(saveFailureHandler).fail(invokeCallbacksAndRejectResult);

        return result;
    }

}

/**
 * Roles have camelCase names and this is a work-around for printing them from AJAX
 * responses.
 * TODO implement i18n encoding with JS
 *
 * @param text
 * @returns {string}
 */
function decodeCamelCase(text) {
    var result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1); // capitalize the first letter - as an example.
}

//
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/**
 * Document preview modes to content type 'map'
 * @type {{convert: string[], pdf: string[], image: string[], audio: string[], video: string[]}}
 */
var contentTypes = {
    convert: [
        'application/msword',
        'application/ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'application/vnd.ms-word.document.macroEnabled.12',
        'application/vnd.ms-word.template.macroEnabled.12',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.template',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.ms-powerpoint.addin.macroEnabled.12',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.ms-powerpoint.template.macroEnabled.12',
        'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
        'application/vnd.oasis.opendocument.chart',
        'application/vnd.oasis.opendocument.chart-template',
        //'application/vnd.oasis.opendocument.database',
        'application/vnd.oasis.opendocument.formula',
        'application/vnd.oasis.opendocument.formula-template',
        'application/vnd.oasis.opendocument.graphics',
        'application/vnd.oasis.opendocument.graphics-template',
        'application/vnd.oasis.opendocument.image',
        'application/vnd.oasis.opendocument.image-template',
        'application/vnd.oasis.opendocument.presentation',
        'application/vnd.oasis.opendocument.presentation-template',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.oasis.opendocument.spreadsheet-template',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.oasis.opendocument.text-master',
        'application/vnd.oasis.opendocument.text-template',
        'application/vnd.oasis.opendocument.text-web',
        'text/html',
        'text/plain'
    ],
    pdf: [
        'application/pdf',
        'text/pdf'
    ],
    image: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp'
    ],
    audio: [
        'audio/webm',
        'audio/ogg',
        'audio/wave',
        'audio/wav',
        'audio/x-wav',
        'audio/x-pn-wav',
        'audio/mpeg',
        'audio/mp3',
        'audio/mp4'
    ],
    video: [
        'video/webm',
        'video/ogg',
        'application/ogg',
        'video/mp4'
    ]
};

/** A function that works with documents.  Intended for inheritance by ViewModels */
var mobileAppRoles = [
    { role: "android", name: "Android" },
    { role: "blackberry", name: "Blackberry" },
    { role: "iTunes", name: "ITunes" },
    { role: "windowsPhone", name: "Windows Phone" }
];
var socialMediaRoles = [
    { role: "facebook", name: "Facebook" },
    { role: "flickr", name: "Flickr" },
    { role: "googlePlus", name: "Google+" },
    { role: "instagram", name: "Instagram" },
    { role: "linkedIn", name: "LinkedIn" },
    { role: "pinterest", name: "Pinterest" },
    { role: "rssFeed", name: "Rss Feed" },
    { role: "tumblr", name: "Tumblr" },
    { role: "twitter", name: "Twitter" },
    { role: "vimeo", name: "Vimeo" },
    { role: "youtube", name: "You Tube" }
];
function Documents(options) {
    var self = this;
    var defaults = {};
    var config = _.extend({}, defaults, options);

    self.documents = ko.observableArray();
    self.documentFilter = ko.observable('');
    self.documentFilterFieldOptions = [{ label: 'Role', fun: 'role'}, { label: 'Name', fun: 'name'}, { label: 'Attribution', fun: 'attribution' }, { label: 'Type', fun: 'type' }];
    self.documentFilterField = ko.observable(self.documentFilterFieldOptions[0]);

    self.selectedDocument = ko.observable();

    function listContains(list, value) {
        return list.indexOf(value) > -1;
    }

    self.selectDocument = function(data) {
        self.selectedDocument(data);
        return true;
    };

    self.isSelected = function(data) {
        return data == ko.utils.unwrapObservable(self.selectedDocument);
    };

    self.previewTemplate = ko.pureComputed(function() {
        var selectedDoc = self.selectedDocument();

        var val;
        if (selectedDoc) {
            var contentType = (selectedDoc.contentType() || 'application/octet-stream').toLowerCase().trim();
            var embeddedVideo = selectedDoc.embeddedVideo();
            if (embeddedVideo) {
                val = "xssViewer";
            } else if (listContains(contentTypes.convert.concat(contentTypes.audio, contentTypes.video, contentTypes.image, contentTypes.pdf), contentType)) {
                val = "iframeViewer";
            } else {
                val = "noPreviewViewer";
            }
        } else {
            val = "noViewer";
        }
        return val;
    });

    self.selectedDocumentFrameUrl = ko.computed(function() {
        var selectedDoc = self.selectedDocument();

        var val;
        if (selectedDoc) {
            var contentType = (selectedDoc.contentType() || 'application/octet-stream').toLowerCase().trim();
            //return (selectedDoc && selectedDoc.url) ? "https://docs.google.com/viewer?url="+encodeURIComponent(selectedDoc.url)+"&embedded=true" : '';

            if (listContains(contentTypes.pdf, contentType)) {
                val = fcConfig.pdfViewer + '?file=' + encodeURIComponent(selectedDoc.url);
            } else if (listContains(contentTypes.convert, contentType)) {
                val = fcConfig.pdfgenUrl+'?file='+encodeURIComponent(selectedDoc.url);
            } else if (listContains(contentTypes.image, contentType)) {
                val = fcConfig.imgViewer + '?file=' + encodeURIComponent(selectedDoc.url);
            } else if (listContains(contentTypes.video, contentType)) {
                val = fcConfig.videoViewer + '?file=' + encodeURIComponent(selectedDoc.url);
            } else if (listContains(contentTypes.audio, contentType)) {
                val = fcConfig.audioViewer + '?file=' + encodeURIComponent(selectedDoc.url);
            } else {
                //val = fcConfig.noViewer + '?file='+encodeURIComponent(selectedDoc.url);
                val = '';
            }
        } else {
            val = '';
        }
        return val;
    }).extend({async: ''});

    self.filteredDocuments = ko.pureComputed(function() {
        var lcFilter = (self.documentFilter() || '').trim().toLowerCase();
        var field = self.documentFilterField();
        return ko.utils.arrayFilter(self.documents(), function(doc) {
            var docValue = ko.utils.unwrapObservable(doc[field.fun]);
            return (docValue || '').toLowerCase().indexOf(lcFilter) !== -1;
        });
    });


    self.distinctDocumentProperty = function(prop) {
        var results = [];
        for (var i=0; i<self.documents().length; i++) {
            var value = ko.utils.unwrapObservable(self.documents()[i][prop]);
            value = value && String(value);
            if (value && results.indexOf(value) < 0) {
                results.push(value);
            }
        }
        results.sort();
        return results;
    };

    self.docViewerClass = ko.pureComputed(function() {
        return self.selectedDocument() ? 'span6': 'hidden';
    });

    self.docListClass = ko.pureComputed(function() {
        return self.selectedDocument() ? 'span6': 'span12';
    });

    self.showListItem = function(element, index, data) {
        var $elem = $(element);
        $elem.hide(); // element is visible after render, so hide it to animate it appearing.
        $elem.show(100);
    };

    self.hideListItem = function(element, index, data) {
        $(element).hide(100);
    };

    self.findDocumentByRole = function(documents, roleToFind) {
        for (var i=0; i<documents.length; i++) {
            var role = ko.utils.unwrapObservable(documents[i].role);
            var status = ko.utils.unwrapObservable(documents[i].status);
            if (role === roleToFind && status !== 'deleted') {
                return documents[i];
            }
        }
        return null;
    };

    self.links = ko.observableArray();
    self.findLinkByRole = function(links, roleToFind) {
        for (var i=0; i<links.length; i++) {
            var role = ko.utils.unwrapObservable(links[i].role);
            if (role === roleToFind) return links[i];
        }
        return null;
    };
    self.addLink = function(role, url, documentId) {
        self.links.push(new DocumentViewModel({
            role: role,
            url: url,
            documentId: documentId
        }));
    };
    self.fixLinkDocumentIds = function(existingLinks) {
        // match up the documentId for existing link roles
        var existingLength = existingLinks? existingLinks.length: 0;
        if (!existingLength) return;
        $.each(self.links(), function(i, link) {
            var role = ko.utils.unwrapObservable(link.role);
            for (i = 0; i < existingLength; i++)
                if (existingLinks[i].role === role) {
                    link.documentId = existingLinks[i].documentId;
                    return;
                }
        });
    };
    function pushLinkUrl(urls, links, role) {
        var link = self.findLinkByRole(links, role.role);
        if (link) urls.push({
            link: link,
            name: role.name,
            role: role.role,
            remove: function() {
                self.links.remove(link);
            },
            logo: function(dir) {
                return dir + "/" + role.role.toLowerCase() + ".png";
            }
        });
    }

    self.transients = {};

    self.transients.mobileApps = ko.pureComputed(function() {
        var urls = [], links = self.links();
        for (var i = 0; i < mobileAppRoles.length; i++)
            pushLinkUrl(urls, links, mobileAppRoles[i]);
        return urls;
    });
    self.transients.mobileAppsUnspecified = ko.pureComputed(function() {
        var apps = [], links = self.links();
        for (var i = 0; i < mobileAppRoles.length; i++)
            if (!self.findLinkByRole(links, mobileAppRoles[i].role))
                apps.push(mobileAppRoles[i]);
        return apps;
    });
    self.transients.mobileAppToAdd = ko.observable();
    self.transients.mobileAppToAdd.subscribe(function(role) {
        if (role) self.addLink(role, "");
    });
    self.transients.socialMedia = ko.pureComputed(function() {
        var urls = [], links = self.links();
        for (var i = 0; i < socialMediaRoles.length; i++)
            pushLinkUrl(urls, links, socialMediaRoles[i]);
        return urls;
    });
    self.transients.socialMediaUnspecified = ko.pureComputed(function() {
        var apps = [], links = self.links();
        for (var i = 0; i < socialMediaRoles.length; i++)
            if (!self.findLinkByRole(links, socialMediaRoles[i].role))
                apps.push(socialMediaRoles[i]);
        return apps;
    });
    self.transients.socialMediaToAdd = ko.observable();
    self.transients.socialMediaToAdd.subscribe(function(role) {
        if (role) self.addLink(role, "");
    });

    self.logoUrl = ko.pureComputed(function() {
        var logoDocument = self.findDocumentByRole(self.documents(), 'logo');
        return logoDocument ? logoDocument.url : (config.noImageUrl ? config.noImageUrl : null);
    });
    self.logoUrlProvided = ko.pureComputed(function() {
        var logoDocument = self.findDocumentByRole(self.documents(), 'logo');
        return logoDocument && logoDocument.url;
    });
    self.bannerUrl = ko.pureComputed(function() {
        var bannerDocument = self.findDocumentByRole(self.documents(), 'banner');
        return bannerDocument ? bannerDocument.url : (config.noImageUrl ? config.noImageUrl : null);
    });

    self.asBackgroundImage = function(url) {
        return url ? 'url('+url+')' : null;
    };

    self.mainImageUrl = ko.pureComputed(function() {
        var mainImageDocument = self.findDocumentByRole(self.documents(), 'mainImage');
        return mainImageDocument ? mainImageDocument.url : null;
    });

    self.removeBannerImage = function() {
        self.deleteDocumentByRole('banner');
    };

    self.removeLogoImage = function() {
        self.deleteDocumentByRole('logo');
    };

    self.removeMainImage = function() {
        self.deleteDocumentByRole('mainImage');
    };

    // this supports display of the project's primary images
    self.primaryImages = ko.computed(function () {
        var pi = $.grep(self.documents(), function (doc) {
            return ko.utils.unwrapObservable(doc.isPrimaryProjectImage);
        });
        return pi.length > 0 ? pi : null;
    });


    self.embeddedVideos = ko.computed(function () {
        var ev = $.grep(self.documents(), function (doc) {
            var isPublic = ko.utils.unwrapObservable(doc.public);
            var embeddedVideo = ko.utils.unwrapObservable(doc.embeddedVideo);
            if(isPublic && embeddedVideo) {
                var iframe = buildiFrame(embeddedVideo);
                if(iframe){
                    doc.iframe = iframe;
                    return doc;
                }
            }
        });
        return ev.length > 0 ? ev : null;
    });

    self.deleteDocumentByRole = function(role) {
        var doc = self.findDocumentByRole(self.documents(), role);
        if (doc) {
            if (doc.documentId) {
                doc.status = 'deleted';
                self.documents.valueHasMutated(); // observableArrays don't fire events when contained objects are mutated.
            }
            else {
                self.documents.remove(doc);
            }
        }
    };

    self.ignore = ['documents', 'links', 'logoUrl', 'bannerUrl', 'mainImageUrl', 'primaryImages', 'embeddedVideos',
        'ignore', 'transients', 'documentFilter', 'documentFilterFieldOptions', 'documentFilterField',
        'previewTemplate', 'selectedDocumentFrameUrl', 'filteredDocuments','docViewerClass','docListClass','logoUrlProvided'];

}

/**
 * Wraps a list in a fuse search and exposes results and selection as knockout variables.
 * Make sure to require Fuse on any page using this.
 */
SearchableList = function(list, keys, options) {

    var self = this;
    var options = $.extend({keys:keys, maxPatternLength:64}, options || {});

    var searchable = new Fuse(list, options);

    self.term = ko.observable();
    self.selection = ko.observable();

    self.results = ko.computed(function() {
        if (self.term()) {
            var searchTerm = self.term();
            if (searchTerm > options.maxPatternLength) {
                searchTerm = searchTerm.substring(0, options.maxPatternLength);
            }
            return searchable.search(searchTerm);
        }
        return list;
    });

    self.select = function(value) {
        self.selection(value);
    };
    self.clearSelection = function() {
        self.selection(null);
        self.term(null);
    };
    self.isSelected = function(value) {
        if (!self.selection() || !value) {
            return false;
        }
        for (var i=0; i<keys.length; i++) {
            var selection = self.selection();
            if (selection[keys[i]] != value[keys[i]]) {
                return false;
            }
        }
        return true;
    }
};

function isUrlAndHostValid(url) {
    var allowedHost = ['fast.wistia.com','embed-ssl.ted.com', 'www.youtube.com', 'player.vimeo.com', 'www.facebook.com'];
    return (url && isUrlValid(url) && $.inArray(getHostName(url), allowedHost) > -1)
};

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
};

function getHostName(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
};

function buildiFrame(embeddedVideo){
    var html = $.parseHTML(embeddedVideo?embeddedVideo.trim():"");
    var iframe = "";
    if(html){
        for(var i = 0; i < html.length; i++){
            var element = html[i];
            var attr = $(element).attr('src');
            if(typeof attr !== typeof undefined && attr !== false){
                var height =  element.getAttribute("height") ?  element.getAttribute("height") : "315";
                iframe = isUrlAndHostValid(attr)  ? '<iframe width="560" src ="' +  attr + '" height = "' + height + '"/></iframe>' : "";
            }
            return iframe;
        }
    }
    return iframe;
};

function showFloatingMessage(message, alertType) {
    if (!alertType) {
        alertType = 'alert-success';
    }

    var messageContainer = $('<div id="alertdiv" style="display:none; margin:0;" class="alert ' +  alertType + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');

    setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
        messageContainer.slideUp(400, function() {messageContainer.remove();});
    }, 5000);

    if ($('.navbar').is(':appeared')) {
        // attach below navbar
        $('#content').prepend(messageContainer);

    }
    else {
        // attach to top
        messageContainer.css("position", "fixed");
        messageContainer.width('100%');
        messageContainer.css("top", 0);
        messageContainer.css("left", 0);

        $('body').append(messageContainer);

    }
    messageContainer.slideDown(400);
};

/**
 * Format a date given an Unix time number (output of Date.parse)
 *
 * @param t
 * @returns {string}
 */
function formatDate(t) {
    var d = new Date(t);
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = d.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]);
};

/**
 * Animates the replacement of an element with a new element obtained via an ajax (GET) call.
 * @param contentSelector identifies the element to replace.
 * @param url the URL to call to get the replacement content.
 * @returns a promise that will complete when the content is replaced.
 */
function replaceContentSection(contentSelector, url) {

    var $existingContent = $(contentSelector);
    var $parent = $existingContent.parent();

    var newStats;

    var animation = $.Deferred();
    $existingContent.slideUp(400, function() {
        $existingContent.remove();
        animation.resolve();
    });

    var ajax = $.get(url).done(function(data) {
        newStats = $(data);
    });

    return $.when(animation, ajax).done(function() {
        newStats.hide().appendTo($parent).slideDown();
    });
}

function stageNumberFromStage(stage) {
    var stageRegexp = /.+ (\d+)/;
    var match = stageRegexp.exec(stage);
    if (match) {
        stage = match[1];
    }
    else {
        stage = '';
    }
    return stage
}

function getNestedValue(obj, path) {
    var paths = path.split('.')
        , current = obj
        , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

/**
 * Used when reopening an incomplete form, this method will scroll the form to the first invalid field so the
 * user can continue editing.
 * @param $validator a jquery object wrapping the element that contains the jquery validation engine configuration
 * for the page.
 */
function scrollToFirstInvalidField($validator) {
    var currentOptions = $validator.data('jqv');

    var scrollOptions = _.extend({}, currentOptions, {
        showPrompts:false,
        showOneMessage: true,
        focusFirstField: true,
        scroll: true
    });

    $validator.data('jqv', scrollOptions);
    try {
        $validator.validationEngine('validate');
    }
    finally {
        $validator.data('jqv', currentOptions);
    }
};
