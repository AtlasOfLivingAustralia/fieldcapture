<%@ page import="au.org.ala.merit.SettingPageType" %>

<div id="projectExplorer">
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

    <div class="row-fluid ">
        <div id="facetsCol" class="well well-small" style="display:none;">
            <g:set var="reqParams" value="query,sort,order,max,fq,fromDate,toDate"/>
            <div class="visible-phone pull-right" style="margin-top: 5px;">
                <a href="#" id="toggleFacetDisplay" rel="facetsContent" role="button" class="btn btn-small btn-inverse" style="color:white;">
                    <span>show</span> options&nbsp;
                    <b class="caret"></b>
                </a>
            </div>
            <h3 style="margin-bottom:0;">Filter results</h3>
            <button class="btn btn-small facetSearch"><i class="icon-filter"></i>Refine</button>
            <button class="btn btn-small clearFacet"><i class="icon-remove-sign"></i>Clear all</button>
            <g:if test="${params.fq}">
                <div class="currentFilters">
                    <h4>Current filters</h4>
                    <ul>
                    <%-- convert either Object and Object[] to a list, in case there are multiple params with same name --%>
                        <g:set var="fqList" value="${[params.fq].flatten().findAll { it != null }}"/>
                        <g:each var="f" in="${fqList}">
                            <g:set var="fqBits" value="${f?.tokenize(':')}"/>
                            <g:set var="newUrl"><fc:formatParams params="${params}" requiredParams="${reqParams}" excludeParam="${f}"/></g:set>
                            <li><g:message code="label.${fqBits[0]}" default="${fqBits[0]}"/>: <g:message code="label.${fqBits[1]}" default="${fqBits[1]?.capitalize()}"/>
                                <a href="${newUrl?:"?"}" class="btn btn-inverse btn-mini tooltips" title="remove filter" aria-label="remove filter">
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
                <div><h4 id="facet-dates-header" style="display:inline-block">Project Dates <fc:iconHelp helpTextCode="project.dates.help"/> </h4><a class="accordian-toggle pointer" data-toggle="collapse" data-target="#facet-dates"><i style="float:right; margin-top:10px;" class="fa fa-plus"></i></a></div>
                <div id="facet-dates" data-name="projectDates" class="collapse validationEngineContainer">
                    <div><select style="width:100%;" data-bind="options:ranges, optionsText:'display', value:selectedRange"></select></div>
                    <div><div style="width:4em; display:inline-block;">From:</div> <div class="input-append"><fc:datePicker targetField="fromDate.date" class="input-small" name="fromDate" data-validation-engine="validate[date]"/></div></div>
                    <div><div style="width:4em; display:inline-block;">To:</div> <div class="input-append"><fc:datePicker targetField="toDate.date" class="input-append input-small" name="toDate" data-validation-engine="validate[date,future[fromDate]]"/></div></div>
                    <div><button data-bind="click:clearDates, enable:fromDate() || toDate()" class="btn" style="margin-left:4em;"><i class="fa fa-remove"></i> Clear dates</button></div>

                </div>
                <g:each var="fn" in="${facetsList}" status="j">
                    <g:set var="f" value="${results.facets.get(fn)}"/>
                    <g:set var="max" value="${5}"/>
                    <g:if test="${fn != 'class' && f?.terms?.size() > 0}">
                        <g:set var="fName"><g:message code="label.${fn}" default="${fn?.capitalize()}"/></g:set>
                        <div><h4 id="facet-list-${j}-header" style="display:inline-block">${fName}</h4><a class="accordian-toggle pointer" data-toggle="collapse" data-target="#facet-list-${j}"><i style="float:right; margin-top:10px;" class="fa fa-plus"></i></a></div>
                        <div id="facet-list-${j}" data-name="${fn}" class="collapse">
                            <ul role="group" aria-labelledby="facet-list-${j}-header" style="list-style-type: none;" class="facetValues">
                                <g:each var="t" in="${f.terms}" status="i">
                                    <g:if test="${i < max && t.term}">
                                        <g:set var="termLabel" value="${g.message(code:"label."+t.term.capitalize(), default:t.term.capitalize())}"/>
                                        <li>
                                            <input type="checkbox" class="facetSelection" name="facetSelection" value="fq=${fn.encodeAsURL()}:${t.term.encodeAsURL()}" aria-label="${termLabel}">
                                            <a href="${fqLink}&fq=${fn.encodeAsURL()}:${t.term.encodeAsURL()}">${termLabel}</a> (${t.count})
                                        </li>
                                    </g:if>
                                </g:each>
                            </ul>

                            <g:if test="${f?.terms?.size() > max}">
                                <a href="#${fn}Modal" role="button" class="moreFacets tooltips" data-toggle="modal" title="View full list of values"><i class="fa fa-hand-o-right"></i> choose more...</a>
                                <div id="${fn}Modal" class="modal hide fade">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                        <h3>Filter by ${fName}</h3>
                                    </div>
                                    <div class="modal-body">
                                        <ul style="list-style-type: none;" class="facetValues">
                                            <g:each var="t" in="${f.terms}">

                                                <li data-sortalpha="${t.term.toLowerCase().trim()}" data-sortcount="${t.count}">
                                                    <input type="checkbox" class="facetSelection" name="facetSelection" value="fq=${fn.encodeAsURL()}:${t.term.encodeAsURL()}">
                                                    <a href="${fqLink}&fq=${fn.encodeAsURL()}:${t.term.encodeAsURL()}"><g:message
                                                            code="label.${t.term}" default="${t.term?:'[empty]'}"/></a> (<span class="fcount">${t.count}</span>)
                                                </li>
                                            </g:each>
                                        </ul>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="pull-left">
                                            <button class="btn btn-small facetSearch"><i class="icon-filter"></i>Refine</button>
                                            <button class="btn btn-small sortAlpha"><i class="icon-filter"></i> Sort by name</button>
                                            <button class="btn btn-small sortCount"><i class="icon-filter"></i> Sort by count</button>
                                        </div>
                                        <a href="#" class="btn" data-dismiss="modal">Close</a>
                                    </div>

                                </div>
                            </g:if>
                        </div>
                    </g:if>
                </g:each>
            </div>
        </div>
        <div class="span12">

            <div class="accordian" id="project-display-options">
                <div class="accordion-group">
                    <div class="accordian-heading">
                        <a class="accordian-toggle" id="accordionMapView-heading" href="#accordionMapView" data-toggle="collapse" data-parent="#project-display-options">Map <i style="padding-left:50px; padding-top:5px;" class="fa fa-plus pull-right"></i></a>
                    </div>
                    <div id="accordionMapView" class="accordian-body collapse">
                        <span class="span4 facet-holder"></span>

                        <span class="span8">
                            <div class="row-fluid">
                                <g:render template="searchResultsSummary"/>
                            </div>
                            <g:render template="/shared/sites" model="${[projectCount:results?.hits?.total?:0]}"/>
                        </span>
                    </div>
                </div>
                <div class="accordion-group">
                    <div class="accordian-heading">
                        <a class="accordian-toggle" id="projectsView-heading" href="#projectsView" data-toggle="collapse" data-parent="#project-display-options">Projects <i style="padding-left:50px; padding-top:5px;" class="fa fa-plus pull-right"></i></a>
                    </div>
                    <div class="accordian-body collapse" id="projectsView">
                        <span class="span4 facet-holder"></span>

                        <span class="span8">
                            <div class="row-fluid">
                                <g:render template="searchResultsSummary"/>
                            </div>

                            <div class="scroll-list clearfix" id="projectList">
                                <table class="table table-bordered table-hover" id="projectTable" data-offset="0" data-max="25">
                                    <thead>
                                    <tr>
                                        <th width="85%" data-sort="nameSort" scope="col" data-order="ASC" class="header">Project name</th>
                                        <th width="15%" data-sort="lastUpdated" scope="col"  data-order="DESC" class="header">Last&nbsp;updated&nbsp;</th>
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
                                                <i class="fa fa-home"></i>
                                                <a href="">View project page</a>
                                            </div>
                                            <div class="sitesLine">
                                                <i class="fa fa-map-marker"></i>
                                                Sites: <a href="#" data-id="$id" class="zoom-in btnX btn-miniX"><i
                                                    class="fa fa-plus"></i> show on map</a>

                                            </div>
                                            <div class="orgLine">
                                                <i class="fa fa-user"></i>
                                            </div>
                                            <div class="descLine">
                                                <i class="fa fa-info"></i>
                                            </div>
                                            <g:if test="${fc.userIsSiteAdmin()}">
                                                <div class="downloadLine">
                                                    <i class="fa fa-download"></i>
                                                    <a href="" target="_blank">Download (.xlsx)</a>
                                                </div>
                                                <div class="downloadJSONLine">
                                                    <i class="fa fa-download"></i>
                                                    <a href="" target="_blank">Download (.json)</a>
                                                </div>
                                            </g:if>

                                        </div>
                                    </td>
                                    <td class="td2">$date</td>
                                </tr>
                            </table>
                        </span>
                    </div>
                </div>

                <div class="accordion-group">
                    <div class="accordian-heading">
                        <a class="accordian-toggle" id="reportView-heading" href="#reportView" data-toggle="collapse" data-parent="#project-display-options">Dashboard<i style="padding-left:50px; padding-top:5px;" class="fa fa-plus pull-right"></i></a>
                    </div>
                    <div class="accordian-body collapse" id="reportView">
                        <div class="span4 facet-holder" style="display:none;" data-hidden="true"></div>

                        <div style="overflow-x:scroll">
                            <div class="row-fluid" style="margin-top:5px;">
                                <button class="btn facets-toggle"><i class="fa fa-bars"></i></button> <span>
                                <g:render template="searchResultsSummary"/>
                            </div>
                            <div class="row-fluid" >
                                <g:if test="${fc.userIsAlaOrFcAdmin()}">
                                    <span class="span12">
                                        <h4>Report: </h4>
                                        <select id="dashboardType" name="dashboardType">
                                            <option value="dashboard">Activity Outputs</option>
                                            <option value="announcements">Announcements</option>
                                            <option value="outputTargets">Output Targets By Programme</option>
                                            <option value="reef2050PlanAction">Reef 2050 Plan Dashboard</option>
                                        </select>
                                    </span>
                                </g:if>
                                <g:else>
                                    <select id="dashboardType" name="dashboardType" style="display:none">
                                        <option value="dashboard">Activity Outputs</option>
                                    </select>
                                </g:else>
                            </div>
                            <div class="loading-message">
                                <asset:image dir="images" src="loading.gif" alt="saving icon"/> Loading...
                            </div>
                            <div id="dashboard-content">

                            </div>
                        </div>
                    </div>
                </div>
                <g:if test="${fc.userIsAlaOrFcAdmin()}">
                    <div class="accordion-group">
                        <div class="accordian-heading">
                            <a class="accordian-toggle" id="downloadView-heading" href="#downloadView" data-toggle="collapse" data-parent="#project-display-options"><span>Download</span><i style="padding-left:50px; padding-top:5px;" class="fa fa-plus pull-right"></i></a>
                        </div>
                        <div class="accordian-body collapse" id="downloadView">
                            <span class="span4 facet-holder"></span>

                            <span class="span8">

                                <div class="row-fluid">
                                    <g:render template="searchResultsSummary"/>
                                </div>


                                <div class="alert">Please do not run more than one download at a time as they can place a lot of load on the system</div>
                                <h3>Download data for a filtered selection of projects</h3>

                                <table style="width: 100%;">
                                    <thead>
                                    <tr>
                                        <th colspan="2"><b>Summary data (Actvity Output scores)</b></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td width="50%">
                                            <a target="_blank" href="${grailsApplication.config.grails.serverURL}/search/downloadSummaryData<fc:formatParams params="${params}"/>&view=xlsx">XLSX</a>
                                        </td>
                                        <td width="50%">
                                            <a target="_blank" href="${grailsApplication.config.grails.serverURL}/search/downloadAllData<fc:formatParams params="${params}"/>&view=json">JSON</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table style="width: 100%;">
                                    <thead>
                                    <tr>
                                        <th colspan="2"><b>All data (Project, Site, Activity & Output)</b></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td width="50%">

                                            <g:render template="downloadAllAsXlsx"/>

                                        </td>
                                        <td width="50%">
                                            <a target="_blank" href="${grailsApplication.config.grails.serverURL}/search/downloadAllData<fc:formatParams params="${params}"/>view=json">JSON</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <table style="width: 100%;">
                                    <thead>
                                    <tr>
                                        <th><b>Site data (Project Sites)</b></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td width="100%">
                                            <a id="shapefile-download" target="_blank" href='<g:createLink controller="search" action="downloadShapefile" params="${params}"/>'>Shapefile</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </span>
                        </div>
                    </div>
                </g:if>
            </div>
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
</div>

<asset:script>
    var projectListIds = [], facetList = [], mapDataHasChanged = false, mapBounds, projectSites; // globals

    $(function () {
        $.fn.clicktoggle = function(a, b) {
            return this.each(function() {
                var clicked = false;
                $(this).click(function() {
                    if (clicked) {
                        clicked = false;
                        return b.apply(this, arguments);
                    }
                    clicked = true;
                    return a.apply(this, arguments);
                });
            });
        };
        var delay = (function(){
            var timer = 0;
            return function(callback, ms){
                clearTimeout (timer);
                timer = setTimeout(callback, ms);
            };
        })();

        var loadReportRequest = null;
        var loadReport = function(reportType) {
            var $content = $('#dashboard-content');
            var $loading = $('.loading-message');
            $content.hide();
            $loading.show();
            if (loadReportRequest) {
                loadReportRequest.abort();
            }

            loadReportRequest = $.get(fcConfig.dashboardUrl,{report:reportType}, function(data) {
                loadReportRequest = null;
                $content.show();
                $loading.hide();
                $content.html(data);
                $('#reportView .helphover').popover({animation: true, trigger:'hover', container:'body'});
            });
        };

        var VIEW_STATE_KEY = 'homepage-tab-state';
        var initialisedReport = false, initialisedMap = false, initialisedProjects = false;
        var initialiseContentSection = function(section) {

            if (section === '#accordionMapView' && !initialisedMap) {
                generateMap(facetList);
                initialisedMap = true;
            }
            else if (section === '#projectsView' && !initialisedProjects) {
                updateProjectTable();
                initialisedProjects = true;
            }
            else if (section === '#reportView' && !initialisedReport) {
                initialisedReport = true;
                var reportType = amplify.store('report-type-state');
                var $reportSelector = $('#dashboardType');
                if (reportType) {
                    $reportSelector.val(reportType);
                }
                $reportSelector.change(function() {
                    var reportType = $reportSelector.val();
                    amplify.store('report-type-state', reportType);
                    loadReport(reportType);
                }).trigger('change');
            }
        };

        var expandedToggles = amplify.store('facetToggleState') || [];
        function restoreFacetSelections() {

            if ($('#facetsContent').is(':visible')) {
                if (expandedToggles) {
                    for (var i=0; i<expandedToggles.length; i++) {
                        $('[data-name="'+expandedToggles[i]+'"]').collapse('show');
                    }
                }
            }

        }

        // retain accordian state for future re-visits
        $('#project-display-options').on('shown', function (e) {
            // Because the facets use accordion and are inside the main accordion view we need to filter them out.
            var $target = $(e.target);
            if ($target.hasClass('accordian-body')) {
                var targetId = e.target.id;
                var section = '#'+targetId;
                amplify.store(VIEW_STATE_KEY, section);
                initialiseContentSection(section);
                $('#'+targetId+'-heading').find('i').removeClass('fa-plus').addClass('fa-minus');
            }
        });
        $('#project-display-options').on('show', function (e) {

            // Because the facets use accordion and are inside the main accordion view we need to filter them out.
            var $target = $(e.target);
            if ($target.hasClass('accordian-body')) {

                var section = '#'+e.target.id;
                $('#facetsCol').appendTo($(section).find('.facet-holder'));
                $('#facetsCol').show();
                restoreFacetSelections();
            }

        });
        $('#project-display-options').on('hidden', function (e) {
            var targetId = e.target.id;
            $('#'+targetId+'-heading').find('i').removeClass('fa-minus').addClass('fa-plus');
        });

        // re-establish the previous view state
        var storedTab = amplify.store(VIEW_STATE_KEY) || '#accordionMapView';
        if (!$('#project-display-options '+storedTab)[0]) {
            storedTab = '#accordionMapView';
        }
        $('#project-display-options '+storedTab).collapse({parent:'#project-display-options'});
        $('#project-display-options '+storedTab).collapse('show');

        // Remember facet toggle state.
        $('#facetsContent').on('shown', function (e) {
            var facetName = $(e.target).data('name');
            var index = expandedToggles.indexOf(facetName);
            if (index < 0) {
                expandedToggles.push(facetName);
                amplify.store('facetToggleState', expandedToggles);
            }

            $('[data-target="#'+e.target.id+'"] i').removeClass('fa-plus').addClass('fa-minus');
        });

        $('#facetsContent').on('hidden', function (e) {
            var facetName = $(e.target).data('name');
            var index = expandedToggles.indexOf(facetName);
            if (index >= 0) {
                expandedToggles.splice(index, 1);
                amplify.store('facetToggleState', expandedToggles);
            }

            $('[data-target="#'+e.target.id+'"] i').removeClass('fa-minus').addClass('fa-plus');

        });

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
            //$('#accordionMapView').tab('show');
            setTimeout(
                function() {
                    //var fId = $(this).data("id");
                    alaMap.animateFeatureById(projectId);
                    var bounds = alaMap.getExtentByFeatureId(projectId);
                    alaMap.map.fitBounds(bounds);
                }, delay
            );

        });


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

        // sort facets in popups by term
        $(".sortAlpha").clicktoggle(function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortalpha", ">");
            $(this).find("i").removeClass("icon-flipped180");
        }, function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortalpha", "<");
            $(this).find("i").addClass("icon-flipped180");
        });

        $(".clearFacet").click(function(e){
       	 window.location.href ="${g.createLink(controller:'home', action:'projectExplorer')}";
        });

        $(".facetSearch").click(function(e){
        	var data = [];
        	$('input[type="checkbox"][name="facetSelection"]').each(function(i){
		        if(this.checked){
		            data.push(this.value);
		        }
		    });
			var url = "${baseUrl?:"?"}";
		    window.location.href = url + "&" + data.join('&');
        });

        // sort facets in popups by count
        $(".sortCount").clicktoggle(function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortcount", "<");
            $(this).find("i").removeClass("icon-flipped180");
        }, function(el) {
            var $list = $(this).closest(".modal").find(".facetValues");
            sortList($list, "sortcount", ">");
            $(this).find("i").addClass("icon-flipped180");
        });

        $('#shapefile-download').click(function(e) {
            e.preventDefault();
            var url = $('#shapefile-download').attr('href');
            $.get(url).done(function() {
                bootbox.alert("The download may take several minutes to complete.  Once it is complete, an email will be sent to your registed email address.")
            }).fail(function() {
                bootbox.alert("There was an error requesting the download");
            });

        });


        function toggleFacets() {

            var $holder = $('#facetsCol').parent();
            var hidden = $holder.data('hidden');
            $holder.data('hidden', !hidden);
            var $content = $holder.next();
            if (!hidden) {
                $holder.animate({width:'toggle'}, 200, 'swing', function() {
                    $content.removeClass('span8');
                });
            }
            else {
                $holder.animate({width:'toggle'}, 200, 'swing', function() {
                   $content.addClass('span8');
                   restoreFacetSelections();

                });
            }
        }
        $('.facets-toggle').click(function(e) {
           toggleFacets();
        });

        var urlWithoutDates = '<fc:formatParams params="${params}" requiredParams="sort,order,max,fq"/>';
        var fromDate = '${params.fromDate?:''}';
        var toDate = '${params.toDate?:''}';
        var DatePickerModel = function() {
            var formatString = 'YYYY-MM-DD';
            var self = this;
            var date = moment('2011-07-01T00:00:00+10:00');
            var end = moment('2021-01-01T00:00:00+11:00');

            self.ranges = [{display:'select date range', from:undefined, to:undefined}];
            while (date.isBefore(end)) {
                var rangeEnd = moment(date).add(6, 'months');
                self.ranges.push({from:date.format(formatString), to:rangeEnd.format(formatString), display:date.format("MMM YYYY")+' - '+rangeEnd.format("MMM YYYY")});

                date = rangeEnd;
            }
            self.selectedRange = ko.observable();
            self.fromDate = ko.observable().extend({simpleDate:false});
            if (fromDate) {
                self.fromDate(moment(fromDate).format());
            }
            self.toDate = ko.observable().extend({simpleDate:false});
            if (toDate) {
                self.toDate(moment(toDate).format());
            }

            self.clearDates = function() {
                if (!urlWithoutDates) {
                    urlWithoutDates = '?';
                }
                document.location.href = urlWithoutDates;
            };

            var validateAndReload = function(newFromDate, newToDate) {

                var parsedNewFromDate = moment(newFromDate);
                var parsedNewToDate = moment(newToDate);
                var parsedFromDate = moment(fromDate);
                var parsedToDate = moment(toDate);

                if (parsedFromDate.isSame(parsedNewFromDate) && parsedToDate.isSame(parsedNewToDate)) {
                   return;
                }

                if ($('#facet-dates').validationEngine('validate')) {
                    reloadWithDates(newFromDate, newToDate);
                }
            }

            var reloadWithDates = function(newFromDate, newToDate) {
                var parsedNewFromDate = moment(newFromDate);
                var parsedNewToDate = moment(newToDate);
                if (newFromDate && parsedNewFromDate.isValid()) {
                    urlWithoutDates += urlWithoutDates?'&':'?';
                    urlWithoutDates += 'fromDate='+moment(newFromDate).format(formatString);
                }
                if (newToDate && parsedNewToDate.isValid()) {
                    urlWithoutDates += urlWithoutDates?'&':'?';
                    urlWithoutDates += 'toDate='+moment(newToDate).format(formatString);
                }
                document.location.href = urlWithoutDates;
            }

            self.fromDate.subscribe(function(a, b) {
                validateAndReload(self.fromDate(), self.toDate());
            });
            self.toDate.subscribe(function(toDate) {
                validateAndReload(self.fromDate(), self.toDate());
            });

            self.selectedRange.subscribe(function(value) {

                if (value.from) {
                    reloadWithDates(value.from, value.to);
                }

            });
        };
        ko.applyBindings(new DatePickerModel(), document.getElementById('facet-dates'));
        $('#facet-dates').validationEngine('attach', {scroll:false});

        $('.helphover').popover({animation: true, trigger:'hover', container:'body'});
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


    /**
    * Dynamically update the project list table via AJAX
    *
    * @param facetFilters (an array)
    */
    function updateProjectTable(facetFilters) {
        var url = "${createLink(controller:'nocas', action:'geoService')}";
        var sort = $('#projectTable').data("sort");
        var order = $('#projectTable').data("order");
        var offset = $('#projectTable').data("offset");
        var max = $('#projectTable').data("max");
        var params = "max="+max+"&offset="+offset;

        var query = '${params.query ? params.query.replace("'", "\\'") : ""}';
        if (sort) {
            params += "&sort="+sort+"&order="+order;
        }
        else if (!query) {
            // Sort by date if no query term has been entered.
            var defaultSort = "&sort=lastUpdated&order=DESC";
            params += defaultSort;
        }

        if (projectListIds.length > 0) {
            params += "&ids=" + projectListIds.join(",");
        } else {
            params += "&query="+encodeURIComponent(query || '*:*');
        }
        if (facetFilters) {
            params += "&fq=" + facetFilters.join("&fq=");
        }

        <g:if test="${params.fq}">
            <g:set var="fqList" value="${[params.fq].flatten()}"/>
            params += "&fq=${fqList.collect{it.encodeAsURL()}.join('&fq=')}";
        </g:if>
        <g:if test="${params.fromDate}">
            params += '&fromDate='+'${params.fromDate}';
        </g:if>
        <g:if test="${params.toDate}">
            params += '&toDate='+'${params.toDate}';
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
                    if (offset >= (total - max) ) {
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
        <g:if test="${fc.userIsSiteAdmin()}">
            $tr.find('.downloadLine a').attr("href", "${createLink(controller: 'project',action: 'downloadProjectData')}" + "?id="+id+"&view=xlsx");
                    $tr.find('.downloadJSONLine a').attr("href", "${createLink(controller: 'project',action: 'downloadProjectData')}" + "?id="+id+"&view=json");
        </g:if>
            $tr.find('.td2').text(formatDate(Date.parse(src.lastUpdated))); // relies on the js_iso8601 resource
            //console.log("appending row", $tr);
            $('#projectTable tbody').append($tr);
        });
    }
</asset:script>