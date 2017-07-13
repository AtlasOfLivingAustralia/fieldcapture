//= require expr-eval/1.0/parser
//= require fancybox/jquery.fancybox
//= require select2/4.0.3/js/select2.full
//= require typeahead/0.11.1/bloodhound
//= require jquery-ui/jquery-ui-1.9.2.custom.min.js
//= require attach-document.js
//= require jquery.fileDownload/jQuery.fileDownload
//= require forms.js
//= require wms
//= require mapWithFeatures.js
//= require document.js
//= require_self

function ActivityViewModel (act, site, project, metaModel, themes) {
    var self = this;
    self.activityId = act.activityId;
    self.description = ko.observable(act.description);
    self.notes = ko.observable(act.notes);
    self.startDate = ko.observable(act.startDate || act.plannedStartDate).extend({simpleDate: false});
    self.endDate = ko.observable(act.endDate || act.plannedEndDate).extend({simpleDate: false});
    self.eventPurpose = ko.observable(act.eventPurpose);
    self.fieldNotes = ko.observable(act.fieldNotes);
    self.associatedProgram = ko.observable(act.associatedProgram);
    self.associatedSubProgram = ko.observable(act.associatedSubProgram);
    self.projectStage = ko.observable(act.projectStage || "");
    self.progress = ko.observable(act.progress || 'started');
    self.mainTheme = ko.observable(act.mainTheme);
    self.type = ko.observable(act.type);
    self.siteId = ko.observable(act.siteId);
    self.projectId = act.projectId;
    self.transients = {};
    self.transients.site = site;
    self.transients.project = project;
    self.transients.metaModel = metaModel || {};
    self.transients.activityProgressValues = ['planned','started','finished'];
    self.transients.themes = $.map(themes || [], function (obj, i) { return obj.name });
    self.goToProject = function () {
        if (self.projectId) {
            document.location.href = fcConfig.projectViewUrl + self.projectId;
        }
    };
    self.goToSite = function () {
        if (self.siteId()) {
            var url = fcConfig.siteViewUrl + self.siteId();
            if (self.projectId) {
                url += '?projectId='+self.projectId;
            }
            document.location.href = url;
        }
    };
    if (metaModel.supportsPhotoPoints) {
        self.transients.photoPointModel = ko.observable(new PhotoPointViewModel(site, act));
    }
}

var PhotoPointViewModel = function(site, activity, config) {

    var self = this;

    var defaults = {
        savePhotoPointUrl: fcConfig.savePhotoPointUrl,
        deletePhotoPointUrl: fcConfig.deletePhotoPointUrl,
        newPhotoPointModalSelector: '#edit-photopoint',
        newPhotoPointMapHolderSelector: '#photoPointMapHolder',
        activityMapHolderSelector: '#map-holder',
        mapSelector: '#smallMap'
    };
    var options = $.extend(defaults, config);


    self.site = site;
    self.photoPoints = ko.observableArray();

    if (site && site.poi) {

        $.each(site.poi, function(index, obj) {
            var photos = ko.utils.arrayFilter(activity.documents, function(doc) {
                return doc.siteId === site.siteId && doc.poiId === obj.poiId;
            });
            self.photoPoints.push(photoPointPhotos(site, obj, activity.activityId, photos, config));
        });
    }

    self.removePhotoPoint = function(photoPoint) {

        $.ajax({
            url: options.deletePhotoPointUrl+'/'+site.siteId+'?poiId='+photoPoint.photoPoint.poiId,
            method: "POST"
        }).done(function(data) {
            if (!data ||  data.error) {
                bootbox.alert("Failed to delete the Photo Point.");
            }
            else {
                self.photoPoints.remove(photoPoint);
            }
        }).fail(function() {
            bootbox.alert("Failed to delete the Photo Point.");
        });

    };

    self.editPhotoPoint = function(photoPointWithPhotos) {
        self.addOrEditPhotoPoint(photoPointWithPhotos, photoPointWithPhotos.photoPoint.modelForSaving());
    };

    self.addPhotoPoint = function() {
        self.addOrEditPhotoPoint(null);
    };

    self.addOrEditPhotoPoint = function(photoPointWithPhotos, photoPointData, successCallback) {
        var map = alaMap.map;
        var originalBounds = map.getBounds();
        $(options.newPhotoPointModalSelector).modal('show').on('shown', function() {
            // "Borrow" the map display from the top of the page as it is already displaying the site / zoomed etc.
            $(options.newPhotoPointMapHolderSelector).append($(options.mapSelector));
            google.maps.event.trigger(map, "resize");

        }).validationEngine('attach', {scroll:false});

        var model = new EditPhotoPointViewModel(photoPointData, map, !photoPointWithPhotos);

        var cleanup = function() {
            model.cleanup();

            // Return the map to the top of the page.
            $(options.activityMapHolderSelector).append($(options.mapSelector));
            google.maps.event.trigger(map, "resize");
            map.fitBounds(originalBounds);
            $(options.newPhotoPointModalSelector).modal('hide');
            ko.cleanNode($(options.newPhotoPointModalSelector)[0]);

        };
        model.save = function() {
            var valid = $(options.newPhotoPointModalSelector).validationEngine("validate");

            if (valid) {
                var jsData = model.photoPoint.modelForSaving();
                var json = JSON.stringify(jsData);
                var url = options.savePhotoPointUrl+'/'+site.siteId;
                $.ajax({
                    url: url,
                    data: json,
                    method: "POST",
                    contentType: "application/json"
                }).done(function(data) {
                    if (!data || !data.resp || data.resp.error) {
                        bootbox.alert("Failed to save Photo Point!");
                    }
                    else {
                        if (!photoPointWithPhotos) {
                            jsData.poiId = data.resp.poiId;
                            photoPointWithPhotos = photoPointPhotos(site, jsData, activity.activityId, [], config, !photoPointWithPhotos);
                            self.photoPoints.push(photoPointWithPhotos);
                        }
                        else {
                            photoPointWithPhotos.photoPoint.update(jsData);
                        }
                        cleanup();
                        if (successCallback) {
                            successCallback(photoPointWithPhotos);
                        }
                    }

                }).fail(function() {
                    bootbox.alert("Failed to save Photo Point!");
                });
            }
        };
        model.cancel = function() {
            cleanup();
        };
        ko.applyBindings(model, $(options.newPhotoPointModalSelector)[0]);
    };

    self.updatePhotoPointDocumentIds = function(idMap) {
        $.each(self.photoPoints(), function(i, photoPoint) {
            $.each(photoPoint.photos(), function(i, photo) {
                if (!photo.documentId && photo.clientId) {
                    console.log("Updating document ID for client ID "+photo.clientId+" to "+idMap[photo.clientId]);
                    if (idMap[photo.clientId]) {
                        photo.documentId = idMap[photo.clientId].documentId;
                    }
                }
            });
        });
    };

    var newPhotoPointPhotoHolder = ko.observableArray();
    newPhotoPointPhotoHolder.subscribe(function(photos) {
        if (!photos[0]) {
            return;
        }
        var data = photos[0];

        if (data.decimalLatitude && data.decimalLongitude) {
            self.addOrEditPhotoPoint(null, {
                name: '',
                description:'',
                geometry: {
                    decimalLatitude: data.decimalLatitude,
                    decimalLongitude  : data.decimalLongitude,
                    bearing : data.decimalBearing
                }
            }, function(newPhotoPointModel) {
                newPhotoPointModel.files(photos);
            });
        }
        else {
            bootbox.alert("We couldn't find GPS information in the supplied photo.  The photo point coordinates will default to the site centre.", function() {
                self.addOrEditPhotoPoint(null, null, function(newPhotoPointModel) {
                    newPhotoPointModel.files(photos);
                });
            });
        }
        newPhotoPointPhotoHolder([]);
    });
    self.newPhotoPointFromPhotoUploadConfig = {
        url: (config && config.imageUploadUrl) || fcConfig.imageUploadUrl,
        target: newPhotoPointPhotoHolder
    };

    self.modelForSaving = function() {
        var siteId = site?site.siteId:'';
        var toSave = {siteId:siteId, photos:[], photoPoints:[]};

        $.each(self.photoPoints(), function(i, photoPoint) {
            $.each(photoPoint.photos(), function(i, photo) {
                toSave.photos.push(photo.modelForSaving());
            });
        });
        return toSave;
    };

    // Simulate the behaviour of the dirty flag manually.
    self.dirtyFlag = {
        isDirty:ko.computed(function() {
            var dirty = false;
            $.each(self.photoPoints(), function(i, photo) {
                dirty = dirty || photo.dirtyFlag.isDirty();
            });
            return dirty;
        }),
        reset:function() {
            $.each(self.photoPoints(), function(i, photo) {
                photo.dirtyFlag.reset();
            });
        }
    };
};

var photoPointPOI = function(data) {
    if (!data) {
        data = {
            geometry:{}
        };
    }
    var name = ko.observable(data.name);
    var description = ko.observable(data.description);
    var lat = ko.observable(data.geometry.decimalLatitude);
    var lng = ko.observable(data.geometry.decimalLongitude);
    var bearing = ko.observable(data.geometry.bearing);

    var update = function(data) {
        name(data.name);
        description(data.description);
        lat(data.geometry.decimalLatitude);
        lng(data.geometry.decimalLongitude);
        bearing(data.geometry.bearing);

    };
    var modelForSaving = function() {
        return ko.toJS(returnValue);
    };

    var returnValue = {
        poiId:data.poiId,
        name:name,
        description:description,
        geometry:{
            type:'Point',
            decimalLatitude:lat,
            decimalLongitude:lng,
            bearing:bearing,
            coordinates:[lng, lat]
        },
        type:'photopoint',
        modelForSaving:modelForSaving,
        update:update
    };
    return returnValue;
};

var EditPhotoPointViewModel = function(photopoint, map, isNew) {
    var self = this;
    self.photoPoint = photoPointPOI(photopoint);
    self.title = isNew ? "New Photo Point" : "Edit Photo Point";
    self.newOrEditText = isNew ? "created" : "edited";
    self.newOrEditText2 = isNew ? "" : "the edits";

    var lat = map.center.lat();
    var lng = map.center.lng();


    if (self.photoPoint.geometry.decimalLatitude()) {
        lat = self.photoPoint.geometry.decimalLatitude();
    }
    else {
        self.photoPoint.geometry.decimalLatitude(lat);
    }
    if (self.photoPoint.geometry.decimalLongitude()) {
        lng = self.photoPoint.geometry.decimalLongitude();
    }
    else {
        self.photoPoint.geometry.decimalLongitude(lng);
    }

    var bounds = new google.maps.LatLngBounds();
    bounds.union(map.getBounds());

    var markerPos = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
        position: markerPos,
        draggable:true,
        map:map
    });
    bounds = bounds.extend(markerPos);

    map.fitBounds(bounds);

    self.cleanup = function() {
        marker.setMap(null);
    };

    marker.setIcon('https://maps.google.com/mapfiles/marker_yellow.png');

    google.maps.event.addListener(
        marker,
        'dragend',
        function(event) {
            self.photoPoint.geometry.decimalLatitude(event.latLng.lat());
            self.photoPoint.geometry.decimalLongitude(event.latLng.lng());
        }
    );

};

var photoPointPhotos = function(site, photoPoint, activityId, existingPhotos, config, isNew) {

    var files = ko.observableArray();
    var photos = ko.observableArray();
    var photoPoint = photoPointPOI(photoPoint);

    $.each(existingPhotos, function(i, photo) {
        photos.push(photoPointPhoto(photo));
    });

    files.subscribe(function(newValue) {
        var f = newValue.splice(0, newValue.length);
        for (var i=0; i<f.length; i++) {

            var data = {
                thumbnailUrl:f[i].thumbnail_url,
                url:f[i].url,
                contentType:f[i].contentType,
                filename:f[i].name,
                filesize:f[i].size,
                dateTaken:f[i].isoDate,
                lat:f[i].decimalLatitude,
                lng:f[i].decimalLongitude,
                poiId:photoPoint.poiId,
                siteId:site.siteId,
                activityId:activityId,
                name:site.name+' - '+photoPoint.name(),
                type:'image'


            };

            if (isNew && data.lat && data.lng && !photoPoint.geometry.decimalLatitude() && !photoPoint.geometry.decimalLongitude()) {
                photoPoint.geometry.decimalLatitude(data.lat);
                photoPoint.geometry.decimalLongitude(data.lng);
            }

            photos.push(photoPointPhoto(data));
        }
    });


    return {
        photoPoint:photoPoint,
        photos:photos,
        files:files,

        uploadConfig : {
            url: (config && config.imageUploadUrl) || fcConfig.imageUploadUrl,
            target: files
        },
        removePhoto : function (photo) {
            if (photo.documentId) {
                photo.status('deleted');
            }
            else {
                photos.remove(photo);
            }
        },
        template : function(photoPoint) {
            return isNew ? 'editablePhotoPoint' : 'readOnlyPhotoPoint'
        },
        isNew : function() { return isNew },
        dirtyFlag: {
            isDirty: ko.computed(function() {
                var tmpPhotos = photos();
                for (var i=0; i<tmpPhotos.length; i++) {
                    if (tmpPhotos[i].dirtyFlag.isDirty()) {
                        return true;
                    }
                }
                return false;
            }),
            reset: function() {
                var tmpPhotos = photos();
                for (var i=0; i<tmpPhotos.length; i++) {
                    tmpPhotos[i].dirtyFlag.reset();
                }
            }
        }

    }
};

var photoPointPhoto = function(data) {
    // The purpose of the clientId is to correlate server generated documentIds with new documents created on
    // the client.  This can prevent duplicate documents from being created if the same model is saved multiple
    // times without a reload of the page/photo point documents.
    this.clientId = this.clientId || 0;
    if (!data) {
        data = {};
    }
    data.clientId = data.documentId || 'new-photo-'+this.clientId++;
    data.role = 'photoPoint';
    var result = new DocumentViewModel(data);
    result.dateTaken = ko.observable(data.dateTaken).extend({simpleDate:false});
    result.formattedSize = formatBytes(data.filesize);

    for (var prop in data) {
        if (!result.hasOwnProperty(prop)) {
            result[prop]= data[prop];
        }
    }
    var docModelForSaving = result.modelForSaving;
    result.modelForSaving = function() {
        var js = docModelForSaving();
        delete js.lat;
        delete js.lng;
        delete js.thumbnailUrl;
        delete js.formattedSize;

        return js;
    };
    result.dirtyFlag = ko.dirtyFlag(result, false);

    return result;
};
function sortActivities(activities) {
    activities.sort(function (a,b) {

        if (a.stageOrder !== undefined && b.stageOrder !== undefined && a.stageOrder != b.stageOrder) {
            return a.stageOrder - b.stageOrder;
        }
        if (a.sequence !== undefined && b.sequence !== undefined) {
            return a.sequence - b.sequence;
        }

        if (a.plannedStartDate != b.plannedStartDate) {
            return a.plannedStartDate < b.plannedStartDate ? -1 : (a.plannedStartDate > b.plannedStartDate ? 1 : 0);
        }
        var numericActivity = /[Aa]ctivity (\d+)(\w)?.*/;
        var first = numericActivity.exec(a.description);
        var second = numericActivity.exec(b.description);
        if (first && second) {
            var firstNum = Number(first[1]);
            var secondNum = Number(second[1]);
            if (firstNum == secondNum) {
                // This is to catch activities of the form Activity 1a, Activity 1b etc.
                if (first.length == 3 && second.length == 3) {
                    return first[2] > second[2] ? 1 : (first[2] < second[2] ? -1 : 0);
                }
            }
            return  firstNum - secondNum;
        }
        else {
            if (a.dateCreated !== undefined && b.dateCreated !== undefined && a.dateCreated != b.dateCreated) {
                return a.dateCreated < b.dateCreated ? 1 : -1;
            }
            return a.description > b.description ? 1 : (a.description < b.description ? -1 : 0);
        }

    });
}

var ActivityNavigationViewModel = function(projectId, activityId, siteId, config) {
    var self = this;
    self.activities = ko.observableArray();

    self.stages = ko.observableArray();
    self.selectedStage = ko.observable();
    self.selectedActivity = ko.observable();
    self.stageActivities = ko.observableArray();

    self.selectedStage.subscribe(function (newStage) {
        self.stageActivities( _.filter(self.activities(), function (activity) { return activity.stage == newStage  }));
        self.selectedActivity(self.nextActivity());
    });
    self.hasNext = function() {
        return self.nextActivity().activityId !== undefined;
    };
    self.hasPrevious = function() {
        return self.previousActivity().activityId !== undefined;
    };
    self.nextActivityUrl = function() {
        if (self.hasNext()) {
            return config.activityUrl + '/' + self.nextActivity().activityId + (config.returnTo ? '?returnTo=' + encodeURIComponent(config.returnTo) : '');
        }
        return '#';

    };
    self.previousActivityUrl = function() {
        if (self.hasPrevious()) {
            return config.activityUrl + '/' + self.previousActivity().activityId + (config.returnTo ? '?returnTo=' + encodeURIComponent(config.returnTo) : '');
        }
        return '#';

    };
    self.nextActivity = function() {
        return self.activities()[currentActivityIndex()+1] || {};
    };
    self.previousActivity = function() {
        return self.activities()[currentActivityIndex()-1] || {};
    };
    self.returnText = ko.pureComputed(function() {
        if (config.navContext == 'project') {
            return 'Return to project';
        }
        else if (config.navContext == 'site') {
            return 'Return to site';
        }
        else {
            return 'Return';
        }
    });

    self.navigateUrl = ko.computed(function() {
        if (self.selectedActivity()) {
            return config.activityUrl + '/' +self.selectedActivity().activityId + (config.returnTo ? '?returnTo=' + encodeURIComponent(config.returnTo) : '');
        }
        return '#';

    });

    self.returnUrl = config.returnTo;

    function currentActivityIndex() {
        return _.findIndex(self.activities(), function (activity) {
           return activity.activityId == activityId;
        });
    }

    self.activities.subscribe(function(activities) {

        self.stages(_.uniq(_.pluck(activities, 'stage')));

        if (self.hasNext()) {
            var next = self.nextActivity();
            self.selectedStage(next.stage);
        }

    });

    var navActivitiesUrl = config.navigationUrl;
    if (config.navContext == 'site' && siteId) {
        navActivitiesUrl += '?siteId='+siteId;
    }
    $.get(navActivitiesUrl).done(function (activities) {
        sortActivities(activities);
        self.activities(activities);
    });
};