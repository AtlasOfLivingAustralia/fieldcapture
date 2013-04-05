<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${site?.name} | Field Capture</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <r:require module="knockout"/>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><g:link controller="project" action="index" id="${site.projectId}">${site.projectName}</g:link><span class="divider">/</span></li>
        <li class="active">${site.name}</li>
    </ul>
    <div class="container-fluid">
    <div class="row-fluid">
        <div class="span9"><!-- left block of header -->
            <div class="under-rule">
                <div class="clearfix">
                    <h1 class="pull-left">${site?.name}</h1>
                    <g:link style="margin-top:15px;" action="edit" id="${site.siteId}" class="btn pull-right">Edit site</g:link>
                </div>
                <div class="clearfix">
                    <p class="well well-small">${site.description}</p>
                </div>
            </div>
            <div>
                <span class="span4">External Id: ${site.externalId}</span>
                <span class="span4">Type: ${site.type}</span>
                <span class="span4">Area: ${site.area}</span>
            </div>
            <div>
                <span class="span12">Notes: ${site.notes}</span>
                %{--<span class="span3">${site.location?.size()} locations.</span>--}%
            </div>
        </div>
        <div class="span3"><!-- right block of header -->
            <div id="smallMap"></div>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">
            <h3 style="border-bottom: #eeeeee solid 1px;">Activities</h3>
            <table class="table">
                <thead>
                    <tr><td></td><td>Activity id</td><td>Start date</td><td>End date</td><td>Types</td></tr>
                </thead>
                <tbody data-bind="foreach: activities">
                    <tr>
                        <td><a data-bind="attr: {href: '${grailsApplication.config.baseServer}/activity/index/' + activityId}"><i class="icon-eye-open" title="View"></i></a>
                            <a data-bind="attr: {href: '${grailsApplication.config.baseServer}/activity/edit/' + activityId}"><i class="icon-edit" title="Edit"></i></a>
                            <i data-bind="click: $root.deleteActivity" class="icon-trash" title="Delete"></i>
                        </td>
                        <td><a data-bind="text: activityId, attr: {href: '${grailsApplication.config.baseServer}/activity/index/' + activityId}"> </a></td>
                        <td data-bind="text: startDate"></td>
                        <td data-bind="text: endDate"></td>
                        <td data-bind="text: types.length"></td>
                    </tr>
                </tbody>
            </table>
            <button data-bind="click: newActivity" type="button" class="btn">Add an activity</button>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12 metadata">
            <span class="span6">Created: ${site.dateCreated}</span>
            <span class="span6">Last updated: ${site.lastUpdated}</span>
        </div>
    </div>

    <hr />
    <div class="debug">
        <h3 id="debug">Debug</h3>
        <div style="display: none">
            <div>Site : ${site}</div>
            <div>Activities : ${site.activities}</div>
        </div>
    </div>
    </div>
    <r:script>
        $('#debug').click(function () {
            $(this).next().toggle();
        });

        var isodatePattern = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
            activitiesObject = ${site.activities};

        function toSimpleDate(isoDate) {
            if (isoDate && isodatePattern.test(isoDate)) {
                return isoDate.substr(8,2) + '-' +  isoDate.substr(5,2) +  '-' + isoDate.substr(0,4);
            }
            return isoDate
        }

        $(function(){
            function SiteModel() {
                var self = this;
                self.activities = ko.observableArray([]);
                self.loadActivity = function (act) {
                    act.startDate = toSimpleDate(act.startDate);
                    act.endDate = toSimpleDate(act.endDate);
                    self.activities.push(act);
                };
                self.deleteActivity = function (act) {
                    $.get("${createLink(controller: 'activity', action: 'ajaxDelete')}/" + act.activityId,
                        function (data) {
                            if (data.code >= 400) {
                                alert('unable to delete');
                            } else {
                                self.activities.remove(act);
                            }
                        },
                        'json');
                };
                self.newActivity = function () {
                    document.location.href = "${grailsApplication.config.baseServer}/activity/create/${site.siteId}";
                };
            }

            var viewModel = new SiteModel();

            $.each(activitiesObject, function (i, obj) {
                viewModel.loadActivity(obj);
            });

            ko.applyBindings(viewModel);

            // map
            var locationMap = {
                // locations from the model
                locations: ${site.location},
                // the google map
                map: new google.maps.Map(document.getElementById('smallMap'), {
                    //width: 250,
                    //height: 250,
                    zoom: 3,
                    center: new google.maps.LatLng(-28.5, 133.5),
                    panControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    zoomControlOptions: {
                        style: 'DEFAULT'
                    }
                }),
                // default overlay options
                overlayOptions: {strokeColor:'#BC2B03',fillColor:'#DF4A21',fillOpacity: 0.3,strokeWeight: 1,
                    clickable:false,zIndex: 1,editable: false},
                // keep count of locations as we load them so we know when we've finished
                locationsLoaded: 0,
                // keep a running bounds for loaded locations so we can zoom when all are loaded
                featureBounds: new google.maps.LatLngBounds(),
                // load the site locations
                load: function () {
                    var self = this;
                    $.each(self.locations, function (i,loc) {
                        if (loc.type === 'locationTypePoint') {
                            var ll = new google.maps.LatLng(Number(loc.data.decimalLatitude), Number(loc.data.decimalLongitude));
                            new google.maps.Marker({map: self.map, position: ll});
                            self.featureBounds.extend(ll);
                            self.locationLoaded();
                        } else if (loc.type === 'locationTypePid') {
                            $.ajax("${grailsApplication.config.baseServer}/proxy/geojsonFromPid?pid=" + loc.data.pid, {
                                success: function(data) {
                                    var paths, points;
                                    if (data.type === 'Polygon') {
                                        paths = geojsonToPaths(data.coordinates);
                                        new google.maps.Polygon({
                                            paths: paths,
                                            map: self.map
                                        }).setOptions(self.overlayOptions);
                                        // flatten arrays to array of points
                                        points = [].concat.apply([], paths);
                                        // extend bounds by each point
                                        $.each(points, function (i,obj) {self.featureBounds.extend(obj);});
                                        self.locationLoaded();
                                    }
                                },
                                dataType: 'json'}
                            );
                        } else {
                            // count the location as loaded even if we didn't
                            self.locationLoaded();
                        }
                    });
                },
                // increments the count of loaded locations - zooms map when all are loaded
                locationLoaded: function () {
                    this.locationsLoaded++;
                    if (this.locationsLoaded === this.locations.length) {
                        // all loaded
                        this.allLocationsLoaded()
                    }
                },
                // zoom map to show features - but not higher than zoom = 12
                allLocationsLoaded: function () {
                    this.map.fitBounds(this.featureBounds);  // this happens asynchronously so need to wait for bounds to change
                    // to sanity-check the zoom level
                    boundsListener = google.maps.event.addListener(this.map, 'bounds_changed', function(event) {
                        if (this.getZoom() > 12){
                            this.setZoom(12);
                        }
                        google.maps.event.removeListener(boundsListener);
                    });
                }
            }.load();
        });

        function geojsonToPaths(obj) {
            return gjToLatLngs(obj);
        }

        function gjToLatLngs(arr) {
            var i, len = arr.length;
            for (i = 0; i < len; i++) {
                if (isCoord(arr[i])) {
                    arr[i] = new google.maps.LatLng(arr[i][1],arr[i][0]);
                } else if ($.isArray(arr[[i]])){
                    arr[i] = gjToLatLngs(arr[i]);
                }
            }
            return arr;
        }

        function isCoord(arr) {
            return arr.length === 2 && !isNaN(arr[0]) && !isNaN(arr[1]);
        }

    </r:script>
</body>
</html>