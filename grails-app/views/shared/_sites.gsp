
<div class="tab-pane" id="mapView">
    <div class="map-box">
        <div id="map" style="width: 100%; height: 100%;"></div>
    </div>
    <div style=" float: right;" id="map-info">
        <span id="numberOfProjects">${projectCount ?: 0}</span> projects with <span id="numberOfSites">[calculating]</span>
    </div>

    <div style="display:none;" id="map-legend">
        <span id="colorOptions">
            <select style="font-size:100%; width:150px; opacity:0.8;filter:alpha(opacity=50);" id="mapchange" onchange="generateMap(facetList||[], this.options[this.selectedIndex].value)">
                <option value="-1">Mark points by</option>
                <g:each var="fn" in="${mapFacets}">
                    <g:set var="f" value="${results.facets.get(fn)}"/>
                    <g:if test="${fn != 'class' && f?.terms?.size() > 0}">
                        <g:set var="fName"><g:message code="label.${fn}" default="${fn?.capitalize()}"/></g:set>
                        <option value="${fn.encodeAsURL()}">${fName}</option>
                    </g:if>
                </g:each>
            </select>
            <asset:image style="display:none;" id="map-colorby-status" width="23" height="23" src="loading-1.gif" alt="Loading"/>
            <div id="legend-table">
                <table style="opacity:1.0; filter:alpha(opacity=50); border: none; font-size : 80%; display:inline-block;" id="legend-1" >
                    <tbody>
                    </tbody>
                </table>
                <table style="opacity:1.0; filter:alpha(opacity=50); border: none; font-size : 80%; display:inline-block;" id="legend-2" >
                    <tbody>
                    </tbody>
                </table>
            </div>
        </span>
    </div>

</div>

<asset:script>

    var heatLayer = null;
    var heatZoomHandler = null;
    var resetControl = null;
    var legendControl = null;

    function generateMap(facetList, markBy, mapOptions) {

        markBy =  (markBy === undefined) || markBy == "-1" ? "" : "&markBy="+markBy;

        var url = "${createLink(controller:'nocas', action:'geoService')}?max=30000&geo=true"+markBy;

        if (facetList && facetList.length > 0) {
            url += "&fq=" + facetList.join("&fq=");
        }
        var facetsUsed = false;
        <g:if test="${params.fq}">
            <g:set var="fqList" value="${[params.fq].flatten()}"/>
            url += "&fq=${raw(fqList.collect{it.encodeAsURL()}.join('&fq='))}";
            facetsUsed = true;
        </g:if>
        <g:if test="${params.fromDate}">
            url += "&fromDate=${params.fromDate}";
        </g:if>
        <g:if test="${params.toDate}">
            url += "&toDate=${params.toDate}";
        </g:if>
        <g:if test="${params.query}">
            url += "&query=${params.query.encodeAsURL()}"
        </g:if>
        <g:if test="${params.isFilterByCompletedProjects}">
            url += "&isFilterByCompletedProjects=${params.isFilterByCompletedProjects.encodeAsURL()}"
        </g:if>
        url += "&clientTimeZone=" + encodeURIComponent(moment.tz.guess() || '');

        $("#legend-table").hide();
        $("#map-colorby-status").show();
        $.getJSON(url, function(data) {

            var features = [];
            var projectIdMap = {};
            var geoPoints = data;
            var legends = [];
            var heatMapPoints = [];

            if (geoPoints.total) {
                var projectLinkPrefix = "${createLink(controller:'project')}/";
                var siteLinkPrefix = "${createLink(controller:'site')}/";

                if (geoPoints.total > 0) {
                    var staticColors =
                            ['#458B00','#FF0000','#FF00FF','#282828','#8B4513','#FF8000','#1E90FF','#a549f6','#20988e','#afaec9',
                                '#dc0430','#aa7f69','#1077f1','#6da1ab','#3598e6','#95294d','#f27ad5','#dfd06e','#c16b54','#34f242'];
                    $.each(geoPoints.selectedFacetTerms, function(i,facet){
                        var legend = {};
                        var hex = i < staticColors.length ? staticColors[facet.index] : getRandomColor();
                        legend.color = hex;
                        legend.legendName = facet.legendName;
                        legend.count = facet.count;
                        legends.push(legend);
                    });
                    var useHeatMap = (!facetsUsed && geoPoints.projects.length > 250 && (!geoPoints.selectedFacetTerms || geoPoints.selectedFacetTerms.length == 0));
                    $.each(geoPoints.projects, function(j, project) {

                        var projectId = project.projectId
                        var projectName = project.name

                        if (project.geo && project.geo.length > 0) {
                            $.each(project.geo, function(k, el) {

                                var lat = parseFloat(el.loc.lat);
                                var lon = parseFloat(el.loc.lon);
                                var latLng = L.latLng(lat, lon);
                                if (!isNaN(lat) && !isNaN(lon)) {
                                    if (lat >= -90 && lat <=90 && lon >= -180 && lon <= 180) {

                                        var point = {
                                            type: "Point",
                                            point_type: "CircleMarker",
                                            projectId: projectId,
                                            projectName: projectName,
                                            siteId: el.siteId,
                                            siteName: el.siteName,
                                            legendName: el.legendName,
                                            popupContent: generatePopup(projectLinkPrefix,projectId,projectName,project.org,siteLinkPrefix,el.siteId, el.siteName),
                                            color: "-1",
                                            coordinates: [lon, lat],
                                            latitude: lat,
                                            longitude: lon
                                        }

                                        if(el.index !== undefined && el.index != null){
                                            point.style = {
                                                color: legends[el.index].color,
                                                weight: 2,
                                                fillOpacity: 0.5
                                            };
                                            // point.color = legends[el.index].color;
                                            point.legendName = el.legendName;
                                        }
                                        features.push(point);

                                        if (projectId) {
                                            projectIdMap[projectId] = true;
                                        }

                                        if (useHeatMap) {
                                            heatMapPoints.push(latLng);
                                        }
                                    }
                                }

                            });
                        }
                    });

                    if (facetList && facetList.length > 0) {
                        // convert projectIdMap to a list and add to global var
                        projectListIds = []; // clear the list
                        for (var id in projectIdMap) {
                            projectListIds.push(id);
                        }
                    } else {
                        projectListIds = []; // clear the list
                    }
                }
            }

            //To reduce memory footprint and leak, make sure to clear feature before loading new feature.
            alaMap.map ? clearMap() : "";
            $("#legend-table").fadeIn();
            $("#map-colorby-status").hide();


            var numSitesHtml = "";
            var siteCount = features.length || heatMapPoints.length;
            if(siteCount > 0){
                numSitesHtml = siteCount + " sites";
            } else {
                numSitesHtml = "0 sites <span class=\"label bg-danger\">No georeferenced points for the selected projects</span>";
            }
            $("#numberOfSites").html(numSitesHtml);

            initialiseMap(features, mapOptions);

            setupHeatMap(heatMapPoints);
            features.length > 0 ? showLegends(legends) : "";

            }).fail(function (request, status, error) {
                console.error("AJAX error", status, error);
            });
    }

    function initialiseMap(features, mapOptions){

        var defaults = {
            includeLegend: true
        };
        var config = $.extend({}, defaults, mapOptions);

        var mapData = {
            "zoomToBounds": false,
            "zoomLimit": 12,
            "highlightOnHover": false,
            "features": features
        };

        var layers = <fc:modelAsJavascript model="${geographicFacets?:[]}"/>;
        $.each(layers, function(i, layer) {
            layer.type = 'pid';
            layer.style = 'polygon';
            layer.excludeBounds = true;
            mapData.features.push(layer);
        });

        init_map_with_features({
                    mapContainer: "map",
                    zoomToBounds:true,
                    scrollwheel: false,
                    assignNameEnabled: false,
                    zoomLimit:16,
                    featureService: "${createLink(controller: 'proxy', action:'feature')}",
                    wmsServer: "${grailsApplication.config.getProperty('spatial.geoserverUrl')}"
                },
                mapData
        );

        initialiseMapControls(config.includeLegend);
    }


    function generatePopup(projectLinkPrefix, projectId, projectName, orgName, siteLinkPrefix, siteId, siteName){

        //console.log('Generating popup for ' + siteId);

        var html = "<div class='projectInfoWindow'>";

        if (projectId && projectName) {
            html += "<div><i class='fa fa-home'></i> <a href='" +
                    projectLinkPrefix + projectId + "'>" +projectName + "</a></div>";
        }

        if(orgName !== undefined && orgName != ''){
            html += "<div><i class='fa fa-user'></i> Org name: " +orgName + "</div>";
        }

        html+= "<div><i class='fa fa-map-marker'></i> Site: <a href='" +siteLinkPrefix + siteId + "'>" + siteName + "</a></div>";
        return html;
    }

    function setupHeatMap(heatMapPoints) {
        var mapImpl = alaMap.map.getMapImpl();
        var ZOOM_THRESHOLD = 8;

        if (heatLayer) {
            mapImpl.removeLayer(heatLayer);
            heatLayer = null;
        }
        if (heatZoomHandler) {
            mapImpl.off('zoomend', heatZoomHandler);
            heatZoomHandler = null;
        }

        var toggleMarkers = function(visible) {
            $.each(alaMap.featureIndex, function(id, featureGroup) {
                $.each(featureGroup, function(i, feature) {
                    if (!feature || !mapImpl.hasLayer) {
                        return;
                    }
                    if (visible) {
                        if (!mapImpl.hasLayer(feature)) {
                            mapImpl.addLayer(feature);
                        }
                    }
                    else if (mapImpl.hasLayer(feature)) {
                        mapImpl.removeLayer(feature);
                    }
                });
            });
        };

        alaMap.hideMarkers = function() {
            toggleMarkers(false);
        };
        alaMap.showMarkers = function() {
            toggleMarkers(true);
        };

        if (heatMapPoints.length === 0) {
            return;
        }

        // Leaflet heat layer is optional; fall back to marker-only rendering if plugin is unavailable.
        if (typeof L.heatLayer === 'function') {
            heatLayer = L.heatLayer(heatMapPoints, {
                maxZoom: 16,
                radius: 20,
                blur: 15
            }).addTo(mapImpl);
        }

        heatZoomHandler = function() {
            var oldZoom = alaMap.zoom;
            var newZoom = mapImpl.getZoom();
            alaMap.zoom = newZoom;

            if ((!oldZoom || oldZoom > ZOOM_THRESHOLD) && newZoom <= ZOOM_THRESHOLD) {
                alaMap.hideMarkers();
            }
            else if ((!oldZoom || oldZoom <= ZOOM_THRESHOLD) && newZoom > ZOOM_THRESHOLD) {
                alaMap.showMarkers();
            }
        };
        mapImpl.on('zoomend', heatZoomHandler);

        if (mapImpl.getZoom() <= ZOOM_THRESHOLD) {
            alaMap.hideMarkers();
        }
    }


    function initialiseMapControls(includeLegend) {
        if (!resetControl) {
            alaMap.map.addButton('<div><i class="fa fa-refresh align-middle" title="Reset map view"></i></div>', function () {
                alaMap.map.fitBounds();
            },'bottomright');
            resetControl = true;
        }


        if (includeLegend && !legendControl) {
            alaMap.map.addButton('<i class="fa fa-bars align-middle" title="Toggle map legend"></i>', function () {
                $("#map-legend").toggle();
            },'topleft');
            legendControl = true;
        }
    }

    function showLegends(legends){
        legends.sort(function(a, b){
            if (a.legendName > b.legendName) {
                return 1;
            }
            if (a.legendName < b.legendName) {
                return -1;
            }
            return 0;
        });
        var table = $("#legend-1 tbody");
        $(table).empty();
        var firstHalf = Math.ceil(legends.length / 2);
        var legends1 = legends.slice(0,firstHalf);
        var legends2 = legends.slice(firstHalf,legends.length);
        $.each(legends1, function(idx, legend){
            table.append('<tr>' +
             '<td><input checked type="checkbox" class="legendSelection" id="a'+idx+'" value="'+legend.legendName+'"></td>' +
               '<td style="background:'+legend.color+'"></td>' +
               '<td width="200"> '+legend.legendName + ' (' + legend.count + ')</td></tr>');
        });

        var table1 = $("#legend-2 tbody");
        $(table1).empty();
        $.each(legends2, function(idx, legend){
            table1.append('<tr>' +
             '<td><input checked type="checkbox" class="legendSelection" id="b'+idx+'" value="'+legend.legendName+'"></td>' +
               '<td style="background:'+legend.color+'"></td>' +
               '<td width="200">'+legend.legendName + ' (' + legend.count + ')</td></tr>');
        });
        $('input[type="checkbox"][class="legendSelection"]').change(function() {
            var visible = $('#'+this.id).prop('checked');
            alaMap.toggleMarkerVisibility(this.value, visible);
        });
    }

    function getRandomColor(h) {
        return (function(h){return '#000000'.substr(0,7-h.length)+h})((~~(Math.random()*(1<<24))).toString(16));
    }

</asset:script>
