<%@ page import="au.org.ala.fieldcapture.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>Home | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <r:script disposition="head">
    var fcConfig = {
        baseUrl: "${grailsApplication.config.grails.serverURL}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
        dashboardUrl: "${g.createLink(controller: 'report', action: 'dashboardReport', params: params)}"
    }
    </r:script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <r:require modules="knockout,mapWithFeatures,jquery_bootstrap_datatable,js_iso8601,amplify"/>
</head>
<body>
<div id="wrapper" class="container-fluid">

<div class="row-fluid">
    <g:if test="${flash.errorMessage}">
        <div class="container-fluid">
            <div class="alert alert-error">
                ${flash.errorMessage}
            </div>
        </div>
    </g:if>

    <g:if test="${flash.message}">
        <div class="row-fluid">
            <div class="span6 alert alert-info" style="margin-bottom:0;">
                <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                ${flash.message}
            </div>
        </div>
    </g:if>
</div>

<div class="row-fluid">
    <div class="span12" id="heading">
        <h1 class="pull-left">Monitoring, Evaluation, Reporting and Improvement Tool (MERIT)</h1>
    </div>
</div>
<div class="row-fluid large-space-after">
    <div class="span12">
        <markdown:renderHtml>${description}</markdown:renderHtml>
    </div>
</div>

<g:if test="${flash.error || results.error}">
    <g:set var="error" value="${flash.error?:results.error}"/>
    <div class="row-fluid">
        <div class="alert alert-error large-space-before">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span>Error: ${error}</span>
        </div>
    </div>
</g:if>
<g:elseif test="${results?.hits?.total?:0 > 0}">
    <div id="" class="row-fluid ">
        <div id="facetsCol" class="span4 well well-small">
            <g:set var="reqParams" value="sort,order,max,fq"/>
            <div class="visible-phone pull-right" style="margin-top: 5px;">
                <a href="#" id="toggleFacetDisplay" rel="facetsContent" role="button" class="btn btn-small btn-inverse" style="color:white;">
                    <span>show</span> options&nbsp;
                    <b class="caret"></b>
                </a>
            </div>
            <h3 style="margin-bottom:0;">Filter results</h3>

            <g:if test="${params.fq}">
                <div class="currentFilters">
                    <h4>Current filters</h4>
                    <ul>
                    <%-- convert either Object and Object[] to a list, in case there are multiple params with same name --%>
                        <g:set var="fqList" value="${[params.fq].flatten().findAll { it != null }}"/>
                        <g:each var="f" in="${fqList}">
                            <g:set var="fqBits" value="${f?.tokenize(':')}"/>
                            <g:set var="newUrl"><fc:formatParams params="${params}" requiredParams="${reqParams}" excludeParam="${f}"/></g:set>
                            <li><g:message code="label.${fqBits[0]}" default="${fqBits[0]}"/>: <g:message code="label.${fqBits[1]}" default="${fqBits[1]}"/>
                                <a href="${newUrl?:"?"}" class="btn btn-inverse btn-mini tooltips" title="remove filter">
                                    <i class="icon-white icon-remove"></i></a>
                            </li>
                        </g:each>
                    </ul>
                </div>
            </g:if>
            <div id="facetsContent" class="hidden-phone">
                <g:set var="baseUrl"><fc:formatParams params="${params}" requiredParams="${reqParams}"/></g:set>
                <g:set var="fqLink" value="${baseUrl?:"?"}"/>
            <!-- fqLink = ${fqLink} -->
                <g:each var="fn" in="${facetsList}">
                    <g:set var="f" value="${results.facets.get(fn)}"/>
                    <g:set var="max" value="${5}"/>
                    <g:if test="${fn != 'class' && f?.terms?.size() > 0}">
                        <g:set var="fName"><g:message code="label.${fn}" default="${fn?.capitalize()}"/></g:set>
                        <h4>${fName}</h4>
                        <ul class="facetValues">
                            <g:each var="t" in="${f.terms}" status="i">
                                <g:if test="${i < max}">
                                    <li><a href="${fqLink}&fq=${fn.encodeAsURL()}:${t.term.encodeAsURL()}"><g:message
                                            code="label.${t.term}" default="${t.term}"/></a> (${t.count})
                                    </li>
                                </g:if>
                            </g:each>
                        </ul>
                        <g:if test="${f?.terms?.size() > max}">
                            <a href="#${fn}Modal" role="button" class="moreFacets tooltips" data-toggle="modal" title="View full list of values"><i class="icon-hand-right"></i> choose more...</a>
                            <div id="${fn}Modal" class="modal hide fade">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h3>Filter by ${fName}</h3>
                                </div>
                                <div class="modal-body">
                                    <ul class="facetValues">
                                        <g:each var="t" in="${f.terms}">
                                            <li data-sortalpha="${t.term.toLowerCase().trim()}" data-sortcount="${t.count}"><a href="${fqLink}&fq=${fn.encodeAsURL()}:${t.term.encodeAsURL()}"><g:message
                                                    code="label.${t.term}" default="${t.term?:'[empty]'}"/></a> (<span class="fcount">${t.count}</span>)
                                            </li>
                                        </g:each>
                                    </ul>
                                </div>
                                <div class="modal-footer">
                                    <div class="pull-left">
                                        <button class="btn btn-small sortAlpha"><i class="icon-filter"></i> Sort by name</button>
                                        <button class="btn btn-small sortCount"><i class="icon-filter"></i> Sort by count</button>
                                    </div>
                                    <a href="#" class="btn" data-dismiss="modal">Close</a>
                                </div>
                            </div>
                        </g:if>
                    </g:if>
                </g:each>
            </div>
        </div>
        <div class="span8">

            <div class="tabbable">
                <ul class="nav nav-tabs" data-tabs="tabs">
                    <li class="active"><a id="mapView-tab" href="#mapView" data-toggle="tab">Map</a></li>
                    <li class=""><a id="projectsView-tab" href="#projectsView" data-toggle="tab">Projects</a></li>
                %{--Temporarily hiding the reports from non-admin until they are ready for public consumption. --}%
                <g:if test="${fc.userIsSiteAdmin()}">
                    <li class=""><a id="reportView-tab" href="#reportView" data-toggle="tab">Dashboard</a></li>
                </g:if>
                </ul>
            </div>

            <div class="tab-content clearfix">
                <div class="tab-pane active" id="mapView">
                    <div class="map-box">
                        <div id="map" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div id="map-info">
                        <span id="numberOfProjects">${results?.hits?.total?:0 > 0}</span> projects with <span id="numberOfSites">[calculating]</span>
                    </div>
                </div>

                <div class="tab-pane " id="projectsView">
                    <div class="scroll-list clearfix" id="projectList">
                        <table class="table table-bordered table-hover" id="projectTable" data-sort="lastUpdated" data-order="DESC" data-offset="0" data-max="10">
                            <thead>
                            <tr>
                                <th width="85%" data-sort="nameSort" data-order="ASC" class="header">Project name</th>
                                <th width="15%" data-sort="lastUpdated"  data-order="DESC" class="header headerSortUp">Last&nbsp;updated&nbsp;</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <div id="paginateTable" class="hide" style="text-align:center;">
                            <span id="paginationInfo" style="display:inline-block;float:left;margin-top:4px;"></span>
                            <div class="btn-group">
                                <button class="btn btn-small prev"><i class="icon-chevron-left"></i>&nbsp;previous</button>
                                <button class="btn btn-small next">next&nbsp;<i class="icon-chevron-right"></i></button>
                            </div>
                            <span id="project-filter-warning" class="label filter-label label-warning hide pull-left">Filtered</span>
                            <div class="control-group pull-right dataTables_filter">
                                <div class="input-append">
                                    <g:textField class="filterinput input-medium" data-target="project"
                                                 title="Type a few characters to restrict the list." name="projects"
                                                 placeholder="filter"/>
                                    <button type="button" class="btn clearFilterBtn"
                                            title="clear"><i class="icon-remove"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    %{-- template for jQuery DOM injection --}%
                    <table id="projectRowTempl" class="hide">
                        <tr>
                            <td class="td1">
                                <a href="#" class="projectTitle" id="a_" data-id="" title="click to show/hide details">
                                    <span class="showHideCaret">&#9658;</span> <span class="projectTitleName">$name</span></a>
                                <div class="hide projectInfo" id="proj_$id">
                                    <div class="homeLine">
                                        <i class="icon-home"></i>
                                        <a href="">View project page</a>
                                    </div>
                                    <div class="sitesLine">
                                        <i class="icon-map-marker"></i>
                                        Sites: <a href="#" data-id="$id" class="zoom-in btnX btn-miniX"><i
                                            class="icon-plus-sign"></i> show on map</a>
                                        %{--<a href="#" data-id="$id" class="zoom-out btnX btn-miniX"><i--}%
                                                %{--class="icon-minus-sign"></i> zoom out</a>--}%
                                    </div>
                                    <div class="orgLine">
                                        <i class="icon-user"></i>
                                    </div>
                                    <div class="descLine">
                                        <i class="icon-info-sign"></i>
                                    </div>
                                </div>
                            </td>
                            <td class="td2">$date</td>
                        </tr>
                    </table>
                </div>
                %{--Temporarily hiding the reports from non-admin until they are ready for public consumption. --}%
                <g:if test="${fc.userIsSiteAdmin()}">
                <div class="tab-pane" id="reportView">
                    <div class="loading-message">
                        <r:img dir="images" file="loading.gif" alt="saving icon"/> Loading report...
                    </div>
                </div>
                </g:if>
            </div>
            <p>&nbsp;</p>
            <fc:getSettingContent settingType="${SettingPageType.ABOUT}"/>
        </div>
    </div>
</g:elseif>
<g:else>
    <div class="row-fluid ">
        <div class="span12">
            <div class="alert alert-error large-space-before">
                Error: search index returned 0 results
            </div>
        </div>
    </div>
</g:else>

<g:if env="development">
<div class="expandable-debug">
    <h3>Debug</h3>
    <div>
        <h4>Results</h4>
        <pre>${results}</pre>
        <h4>Geo Points</h4>
        <pre>${geoPoints}</pre>
        <h4>Projects</h4>
        <pre>${projects}</pre>
    </div>
</div>
</g:if>

</div>

<r:script>
    var projectListIds = [], facetList = [], mapDataHasChanged = false, mapBounds, projectSites; // globals

    $(window).load(function () {
        var delay = (function(){
            var timer = 0;
            return function(callback, ms){
                clearTimeout (timer);
                timer = setTimeout(callback, ms);
            };
        })();

        var initialisedReport = false;
        // retain tab state for future re-visits
        $('a[data-toggle="tab"]').on('shown', function (e) {
            var tab = e.currentTarget.hash;
            amplify.store('project-tab-state', tab);
            if (tab === '#mapView' && mapDataHasChanged) {
                mapDataHasChanged = false;
                generateMap();
            }
            else if (tab === '#reportView') {
                if (!initialisedReport) {
                    initialisedReport = true;

                    $.get(fcConfig.dashboardUrl, function(data) {
                        $('#reportView').html(data);
                        $('#reportView .helphover').popover({animation: true, trigger:'hover'});
                    });

                }
            }
        });
        // re-establish the previous tab state
        var storedTab = amplify.store('project-tab-state');

        if (storedTab === '') {
            $('#mapView-tab').tab('show');
        } else {
            $(storedTab + '-tab').tab('show');
            if (storedTab != '#mapView') {
                mapDataHasChanged = true;
            }
        }

        // project list filter
        $('.filterinput').keyup(function() {
            //console.log("filter keyup");
            var a = $(this).val(),
                target = $(this).attr('data-target');

            var qList;

            if (a.length > 1) {
                $('#' + target + '-filter-warning').show();
                var qList = [ "_all:" +  a.toLowerCase() ]
            } else {
                $('#' + target + '-filter-warning').hide();
                qList = null;
            }

            delay(function(){
                //console.log('Time elapsed!');
                $("#projectTable").data("offset", 0);
                updateProjectTable( qList );
            }, 1000 );

            return false;
        });

        $('.clearFilterBtn').click(function () {
            var $filterInput = $(this).prev(),
                target = $filterInput.attr('data-target');
            //console.log("clear button");
            $('#' + target + '-filter-warning').hide();
            $filterInput.val('');
            $("#projectTable").data("offset", 0);
            updateProjectTable();
        });

        // highlight icon on map when project name is clicked
        var prevFeatureId;
        $('#projectTable').on("click", ".projectTitle", function(el) {
            //console.log("projectHighlight", $(this).data("id"), alaMap.featureIndex);
            el.preventDefault();
            var thisEl = this;
            var fId = $(this).data("id");
            //if (prevFeatureId) alaMap.unAnimateFeatureById(prevFeatureId);
            projectSites = alaMap.animateFeatureById(fId);
            $(thisEl).tooltip('hide');
            //console.log("toggle", prevFeatureId, fId);
            if (!prevFeatureId) {
                $("#proj_" + fId).slideToggle();
                $(thisEl).find(".showHideCaret").html("&#9660;");
            } else if (prevFeatureId != fId) {
                if ($("#proj_" + prevFeatureId).is(":visible")) {
                    // hide prev selected, show this
                    $("#proj_" + prevFeatureId).slideUp();
                    $("#a_" + prevFeatureId).find(".showHideCaret").html("&#9658;");
                    $("#proj_" + fId).slideDown();
                    $("#a_" + fId).find(".showHideCaret").html("&#9660;");
                } else {
                    //show this, hide others
                    $("#proj_" + fId).slideToggle();
                    $(thisEl).find(".showHideCaret").html("&#9660;");
                    $("#proj_" + prevFeatureId).slideUp();
                    $("#a_" + prevFeatureId).find(".showHideCaret").html("&#9658;");
                }
                alaMap.unAnimateFeatureById(prevFeatureId);
            } else {
                $("#proj_" + fId).slideToggle();
                if ($("#proj_" + fId).is(':visible')) {
                    $(thisEl).find(".showHideCaret").html("&#9658;");
                } else {
                    $(thisEl).find(".showHideCaret").html("&#9660;");
                }
                alaMap.unAnimateFeatureById(fId);
            }
            prevFeatureId = fId;
        });

        // zoom in/out to project points via +/- buttons
        var initCentre, initZoom;
        $('#projectTable').on("click", "a.zoom-in",function(el) {
            el.preventDefault();

            if (!projectSites) {
                alert("No sites found for project");
                return false;
            }

            if (!initCentre && !initZoom) {
                initCentre = alaMap.map.getCenter();
                initZoom = alaMap.map.getZoom();
            }

            var projectId = $(this).data("id");
            var delay = 0;
            if (!alaMap.map || alaMap.map.zoom == 0) {
                // maps not loaded yet (lazy loading and maps tab not yet clicked) - add delay
                // so that map data can be loaded #HACK
                delay = 2000;
            }
            $('#mapView-tab').tab('show');
            setTimeout(
                function() {
                    //var fId = $(this).data("id");
                    alaMap.animateFeatureById(projectId);
                    var bounds = alaMap.getExtentByFeatureId(projectId);
                    alaMap.map.fitBounds(bounds);
                }, delay
            );

        });
        $('#projectTable').on("click", "a.zoom-out",function(el) {
            el.preventDefault();
            $('#mapView-tab').tab('show');
            alaMap.map.setCenter(initCentre);
            alaMap.map.setZoom(initZoom);
        });

        // initial loading of map
        generateMap();

        // Tooltips
        $('.projectTitle').tooltip({
            placement: "right",
            container: "#projectTable",
            delay: 400
        });
        $('.tooltips').tooltip({placement: "right"});


        // sorting project table
        $("#projectTable .header").click(function(el) {
            var sort = $(this).data("sort");
            var order = $(this).data("order");
            var prevSort =  $("#projectTable").data("sort");
            var newOrder = (prevSort != sort) ? order : ((order == "ASC") ? "DESC" :"ASC");
            // update new data attrs in table
            $("#projectTable").data("sort", sort);
            $("#projectTable").data("order", newOrder); // toggle
            $("#projectTable").data("offset", 0); // always start at page 1
            $(this).data("order", newOrder);
            // update CSS classes
            $("#projectTable .header").removeClass("headerSortDown").removeClass("headerSortUp"); // remove all sort classes first
            $(this).addClass((newOrder == "ASC") ? "headerSortDown" : "headerSortUp");
            // $(this).removeClass((newOrder == "ASC") ? "headerSortUp" : "headerSortDown");
            updateProjectTable();
        });

        // facet buttons
        $(".facetBtn").click(function(el) {
            facetList = []; // reset global var
            var facet = $(this).data("facet");
            var facetVal = $(this).data("value");
            var prevFacet =  $("#projectTable").data("facetName");
            // store values in table
            $("#projectTable").data("facetName",facet);
            $("#projectTable").data("facetValue",facetVal);
            if (facetVal.length > 1) {
                facetList.push(facet + ":" + facetVal);
            }
            $("#projectTable").data("offset", 0);
            mapDataHasChanged = true;
            generateMap();
            // change button class to indicate this facet is active
            if (facet != prevFacet) {
                // different facet group selected - reset prev
                $(".facetBtn[data-facet='" + prevFacet + "']").removeClass("btn-info");
                $(".facetBtn[data-value='']").addClass("btn-info");
            }
            $(".facetBtn[data-facet='" + facet + "']").removeClass("btn-info");
            $(this).addClass("btn-info");
        });

        // next/prev buttons in project list table
        $("#paginateTable .btn").not(".clearFilterBtn").click(function(el) {
            // Don't trigger if button is disabled
            if (!$(this).hasClass("disabled")) {
                 //var prevOrNext = (this).hasClass("next") ? "next" : "prev";
                var offset = $("#projectTable").data("offset");
                var max = $("#projectTable").data("max");
                var newOffset = $(this).hasClass("next") ? (offset + max) : (offset - max);
                $("#projectTable").data("offset", newOffset);
                //console.log("offset", offset, newOffset, $("#projectTable").data("offset"));
                updateProjectTable();
            }
        });

        // in mobile view toggle display of facets
        $("#toggleFacetDisplay").click(function(e) {
            e.preventDefault();
            $(this).find("i").toggleClass("icon-chevron-down icon-chevron-right");
            if ($("#" + $(this).attr('rel')).is(":visible")) {
                $("#" + $(this).attr('rel')).addClass("hidden-phone");
                $(this).find("span").text("show");
            } else {
                $("#" + $(this).attr('rel')).removeClass("hidden-phone");
                $(this).find("span").text("hide");
            }
        });

        // trigger Google maps tofire when maps tab is loaded
//        $('.nav-tabs a[href="#mapView"]').on('shown', function(){
//            if (mapDataHasChanged) {
//                mapDataHasChanged = false;
//                generateMap();
//            }
//        });

        // sort facets in popups by term
        $(".sortAlpha").toggle(function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortalpha", ">");
            $(this).find("i").removeClass("icon-flipped180");
        }, function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortalpha", "<");
            $(this).find("i").addClass("icon-flipped180");
        });
        // sort facets in popups by count
        $(".sortCount").toggle(function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortcount", "<");
            $(this).find("i").removeClass("icon-flipped180");
        }, function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortcount", ">");
            $(this).find("i").addClass("icon-flipped180");
        });
    });

    /**
    * Sort a list by its li elements using the data-foo (dataEl) attribute of the li element
    *
    * @param $list
    * @param dataEl
    * @param op
    */
    function sortList($list, dataEl, op) {
        //console.log("args",$list, dataEl, op);
        $list.find("li").sort(function(a, b) {
            var comp;
            if (op == ">") {
                comp =  ($(a).data(dataEl)) > ($(b).data(dataEl)) ? 1 : -1;
            } else {
                comp =  ($(a).data(dataEl)) < ($(b).data(dataEl)) ? 1 : -1;
            }
            return comp;
        }).appendTo($list);
    }


    function generateMap() {

        var url = "${createLink(controller:'nocas', action:'geoService')}?max=10000&geo=true";

        if (facetList && facetList.length > 0) {
            url += "&fq=" + facetList.join("&fq=");
        }

        <g:if test="${params.fq}">
            <g:set var="fqList" value="${[params.fq].flatten()}"/>
            url += "&fq=${fqList.collect{it.encodeAsURL()}.join('&fq=')}";
        </g:if>

        $.getJSON(url, function(data) {
            //console.log("getJSON data", data);
            var features = [];
            var projectIdMap = {};
            var bounds = new google.maps.LatLngBounds();
            var geoPoints = data;

            if (geoPoints.total) {
                //console.log("geoPoints: ", geoPoints);
                var projectLinkPrefix = "${createLink(controller:'project')}/";
                var siteLinkPrefix = "${createLink(controller:'site')}/";
                //console.log("total", geoPoints.total);
                $("#numberOfSites").html(geoPoints.total + " sites");
                if (geoPoints.total > 0) {
                    $.each(geoPoints.projects, function(j, project) {
                        var projectId = project.projectId
                        var projectName = project.name
                        //console.log("s", s, j);
                        if (project.geo && project.geo.length > 0) {
                            $.each(project.geo, function(k, el) {
                                var point = {
                                    type: "dot",
                                    id: projectId,
                                    name: projectName,
                                    popup: generatePopup(projectLinkPrefix,projectId,projectName,project.org,siteLinkPrefix,el.siteId, el.siteName),
                                    latitude: el.loc.lat,
                                    longitude: el.loc.lon
                                }
                                var lat = parseFloat(point.latitude);
                                var lon = parseFloat(point.longitude);
                                if (!isNaN(lat) && !isNaN(lon)) {
                                    if (lat >= -90 && lat <=90 && lon >= -180 && lon <= 180) {
                                        features.push(point);
                                        bounds.extend(new google.maps.LatLng(el.loc.lat,el.loc.lon));
                                        if (projectId) {
                                            projectIdMap[projectId] = true;
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

            initialiseMap(features, bounds);
            mapBounds = bounds;
            updateProjectTable();

        }).error(function (request, status, error) {
            console.error("AJAX error", status, error);
        });
    }

    function initialiseMap(features, bounds){
        var mapData = {
            "zoomToBounds": true,
            "zoomLimit": 12,
            "highlightOnHover": false,
            "features": features
        }

        init_map_with_features({
                mapContainer: "map",
                zoomToBounds:true,
                scrollwheel: false,
                zoomLimit:16,
                featureService: "${createLink(controller: 'proxy', action:'feature')}",
                wmsServer: "${grailsApplication.config.spatial.geoserverUrl}"
            },
            mapData
        );

        if (!bounds.isEmpty()) {
            alaMap.map.fitBounds(bounds);
        } else {
            alaMap.map.setZoom(4);
        }

        // Create the DIV to hold the control and
        // call the HomeControl() constructor passing
        // in this DIV.
        var homeControlDiv = document.createElement('div');
        var homeControl = new HomeControl(homeControlDiv, alaMap.map);
        homeControlDiv.index = 1;
        alaMap.map.controls[google.maps.ControlPosition.LEFT_TOP].push(homeControlDiv);

        var numSitesHtml = "";
        if(features.length > 0){
            numSitesHtml = features.length + " sites";
        } else {
            numSitesHtml = "0 sites <span class=\"label label-important\">No georeferenced points for the selected projects</span>";
        }

        $("#numberOfSites").html(numSitesHtml);
    }


    function generatePopup(projectLinkPrefix, projectId, projectName, orgName, siteLinkPrefix, siteId, siteName){

        //console.log('Generating popup for ' + siteId);

        var html = "<div class='projectInfoWindow'>";

        if (projectId && projectName) {
            html += "<div><i class='icon-home'></i> <a href='" +
                        projectLinkPrefix + projectId + "'>" +projectName + "</a></div>";
        }

        if(orgName !== undefined && orgName != ''){
            html += "<div><i class='icon-user'></i> Org name: " +orgName + "</div>";
        }

        html+= "<div><i class='icon-map-marker'></i> Site: <a href='" +siteLinkPrefix + siteId + "'>" + siteName + "</a></div>";
        return html;
    }

    function HomeControl(controlDiv, map) {

        // Set CSS styles for the DIV containing the control
        // Setting padding to 5 px will offset the control
        // from the edge of the map
        controlDiv.style.padding = '5px';

        // Set CSS for the control border
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '1px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to set the map to show all sites';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '6px';
        controlText.style.paddingRight = '6px';
        controlText.innerHTML = '<b>Reset</b>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners
        google.maps.event.addDomListener(controlUI, 'click', function() {
            alaMap.map.fitBounds(mapBounds);
        });

    }


    function initialiseState(state) {
        switch (state) {
            case 'Queensland': return 'QLD'; break;
            case 'Victoria': return 'VIC'; break;
            case 'Tasmania': return 'TAS'; break;
            default:
                var words = state.split(' '), initials = '';
                for(var i=0; i < words.length; i++) {
                    initials += words[i][0]
                }
                return initials;
        }
    }

    /**
    * Dynamically update the project list table via AJAX
    *
    * @param facetFilters (an array)
    */
    function updateProjectTable(facetFilters) {
        var url = "${createLink(controller:'nocas', action:'geoService')}"; //?sort=lastUpdated&order=DESC";
        var sort = $('#projectTable').data("sort");
        var order = $('#projectTable').data("order");
        var offset = $('#projectTable').data("offset");
        var params = "max=10&sort="+sort+"&order="+order+"&offset="+offset;

        if (projectListIds.length > 0) {
            params += "&ids=" + projectListIds.join(",");
        } else {
            params += "&query=class:au.org.ala.ecodata.Project";
        }
        if (facetFilters) {
            params += "&fq=" + facetFilters.join("&fq=");
        }

        <g:if test="${params.fq}">
        <g:set var="fqList" value="${[params.fq].flatten()}"/>
        params += "&fq=${fqList.collect{it.encodeAsURL()}.join('&fq=')}";
        </g:if>

        $.post(url, params, function(data1) {
            //console.log("getJSON data", data);
            var data
            if (data1.resp) {
                data = data1.resp;
            } else if (data1.hits) {
                data = data1;
            }
            if (data.error) {
                console.error("Error: " + data.error);
            } else {
                var total = data.hits.total;
                $("numberOfProjects").html(total);
                $('#projectTable').data("total", total);
                $('#paginateTable').show();
                if (total == 0) {
                    $('#paginationInfo').html("Nothing found");

                } else {
                    var max = data.hits.hits.length
                    $('#paginationInfo').html((offset+1)+" to "+(offset+max) + " of "+total);
                    if (offset == 0) {
                        $('#paginateTable .prev').addClass("disabled");
                    } else {
                        $('#paginateTable .prev').removeClass("disabled");
                    }
                    if (offset >= (total - 10) ) {
                        $('#paginateTable .next').addClass("disabled");
                    } else {
                        $('#paginateTable .next').removeClass("disabled");
                    }
                }

                $('#projectTable tbody').empty();
                populateTable(data);
            }
        }).error(function (request, status, error) {
            //console.error("AJAX error", status, error);
            $('#paginationInfo').html("AJAX error:" + status + " - " + error);
        });
    }

    /**
    * Update the project table DOM using a plain HTML template (cloned)
    *
    * @param data
    */
    function populateTable(data) {
        //console.log("populateTable", data);
        $.each(data.hits.hits, function(i, el) {
            //console.log(i, "el", el);
            var id = el._id;
            var src = el._source
            var $tr = $('#projectRowTempl tr').clone(); // template
            $tr.find('.td1 > a').attr("id", "a_" + id).data("id", id);
            $tr.find('.td1 .projectTitleName').text(src.name); // projectTitleName
            $tr.find('.projectInfo').attr("id", "proj_" + id);
            $tr.find('.homeLine a').attr("href", "${createLink(controller: 'project')}/" + id);
            $tr.find('a.zoom-in').data("id", id);
            $tr.find('a.zoom-out').data("id", id);
            $tr.find('.orgLine').append(src.organisationName);
            $tr.find('.descLine').append(src.description);
            $tr.find('.td2').text(formatDate(Date.parse(src.lastUpdated))); // relies on the js_iso8601 resource
            //console.log("appending row", $tr);
            $('#projectTable tbody').append($tr);
        });
    }

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
    }

</r:script>
</body>
</html>