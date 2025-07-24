<%@ page import="au.org.ala.merit.SettingPageType" expressionCodec="none"%>

<div id="projectExplorer">
<g:if test="${flash.error || results.error}">
    <g:set var="error" value="${flash.error?:results.error}"/>
    <div class="row">
        <div class="col-sm-12 p-3 alert alert-danger large-space-before searchError">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span>Error: ${error?.encodeAsHTML()}</span>
        </div>
    </div>
</g:if>
<g:elseif test="${results?.hits?.total?:0 > 0}">
    <div class="row">
        <div id="facetsCol" class="bg-white" style="display:none;">
            <g:set var="reqParams" value="query,sort,order,max,fq,fromDate,toDate,isFilterByCompletedProjects"/>
            <div class="visible-phone pull-right" style="margin-top: 5px;">
                <a href="#" id="toggleFacetDisplay" rel="facetsContent" role="button" class="btn btn-sm btn-inverse" style="color:white;">
                    <span>show</span> options&nbsp;
                    <b class="caret"></b>
                </a>
            </div>
            <h3 style="margin-bottom:0;">Filter results</h3>
            <div class="row">
                <div id="facetFilter">
                    <div class="col-sm-4" >
                        <button class="btn btn-sm facetSearch"><i class="fa fa-filter"></i> Refine</button>
                    </div>
                </div>
                <div id="facetClear">
                    <div class="col-sm-4">
                        <button class="btn btn-sm clearFacet"><i class="fa fa-remove"></i> Clear all</button>

                    </div>
                </div>

            </div>

            <g:if test="${params.fq}">
                <div class="currentFilters">
                    <h4>Current filters</h4>
                    <ul>
                    <%-- convert either Object and Object[] to a list, in case there are multiple params with same name --%>
                        <g:set var="fqList" value="${[params.fq].flatten().findAll { it != null }}"/>
                        <g:each var="f" in="${fqList}">
                            <g:set var="fqBits" value="${f?.tokenize(':')}"/>
                            <g:set var="newUrl"><fc:formatParams params="${params}" requiredParams="${reqParams}" excludeParam="${f}"/></g:set>
                            <li><g:message code="label.${fqBits[0]}" default="${fqBits[0]?.encodeAsHTML()}"/>: <g:message code="label.${fqBits[1]}" default="${fqBits[1]?.encodeAsHTML()?.capitalize()}"/>
                                <a href="${newUrl?:"?"}" class="btn btn-inverse btn-mini tooltips" title="remove filter" aria-label="remove filter">
                                    <i class="text-white fa fa-remove"></i></a>
                            </li>
                        </g:each>
                    </ul>
                </div>
            </g:if>
            <div id="facetsContent" class="hidden-phone">
                <g:set var="baseUrl"><fc:formatParams params="${params}" requiredParams="${reqParams}"/></g:set>
                <g:set var="fqLink" value="${g.createLink(controller: 'home', action: 'projectExplorer') + (baseUrl?:"?")}"/>
            <!-- fqLink = ${fqLink} -->
            <div class="accordion">
                <div class="card customCard">
                    <div class="card-header collapsed" data-toggle="collapse" href="#facet-dates" id="projectDates">
                        <a><h4>Project Dates <fc:iconHelp helpTextCode="project.dates.help" container="body"/></h4></a>
                    </div>

                        <div id="facet-dates" data-name="projectDates" class="collapse facetItems validationEngineContainer">
                            <div class="card-body cardBody">
                                <select style="margin-bottom: 10px" data-bind="options:ranges, optionsText:'display', value:selectedRange"></select>
                                <div class="input-group" style="margin-bottom: 10px"><label for="fromDate" class="dataClass">From:</label><fc:datePicker targetField="fromDate.date" bs4="bs4" class="dateControl form-control form-control-sm" name="fromDate" data-validation-engine="validate[date]" autocomplete="off"/></div>
                                <div class="input-group" style="margin-bottom: 10px"><label for="fromDate" class="dataClass">To:</label><fc:datePicker targetField="toDate.date" bs4="bs4" class="dateControl form-control form-control-sm" name="toDate" data-validation-engine="validate[date,future[fromDate]]" autocomplete="off"/></div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isFilterByCompletedProjectsOption" data-bind="checked: isFilterByCompletedProjects" value="true">
                                    <label class="form-check-label" for="isFilterByCompletedProjectsOption">
                                        Project start and end dates are within the selected range.
                                    </label>
                                </div>
                                <div><button data-bind="click:clearDates, enable:fromDate() || toDate()" class="btn btn-sm clearDates"><i class="fa fa-remove"></i> Clear dates</button>
                                    <button data-bind="click:applyDates, enable:fromDate() || toDate()" class="btn btn-sm applyDates"><i class="fa fa-check"></i> Apply dates</button>
                                </div>

            </div>
                        </div>
                </div>
            </div>
                <div id="facet-list">
                    <facet-filter params="'facetsList' : facetsList, results:  results, fqLink: fqLink, baseUrl: baseUrl, projectExplorerUrl: projectExplorerUrl"></facet-filter>
                </div>
            </div>
        </div>
        <div class="col-sm-11">
            <div class="accordion" id="project-display-options">
                <div class="card cardSection">
                    <div class="card-header collapsed" id="mapHeading" href="#accordionMapView" data-toggle="collapse">
                        <a class="text-left text-uppercase">Map</a>
                    </div>

                    <div id="accordionMapView" class="collapseItems collapse" aria-labelledby="mapHeading" data-parent="#project-display-options">
                        <div class="card-body pt-0">
                            <div class="row">
                                <div class="col-sm-4">
                                    <span class="facet-holder"></span>
                                </div>

                                <div class="col-sm-8">
                                <g:render template="searchResultsSummary"/>
                                <g:render template="/shared/sites" model="${[projectCount:results?.hits?.total?:0]}"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> <!-- Map Section -->
                <div class="card cardSection">
                        <div class="card-header collapsed" id="projectHeading" href="#projectsView" data-toggle="collapse">
                            <a class="text-left text-uppercase">Projects</a>
                        </div>
                    <div id="projectsView" class="collapse collapseItems" aria-labelledby="projectHeading" data-parent="#project-display-options">
                        <div class="card-body pt-0">
                            <div class="row">
                                <div class="col-sm-4">
                                    <span class="facet-holder"></span>
                                </div>
                                <div class="col-sm-8">
                                    <p><g:render template="searchResultsSummary"/></p>
                                    <div class="scroll-list clearfix" id="projectList">
                                        <table class="table w-100" id="projectTable" data-offset="0" data-max="25">
                                            <thead>
                                                <tr>
                                                    <th id="projectName" data-sort="nameSort" scope="col" data-order="ASC" class="header"> Project name</th>
                                                    <th id="lastUpdated" data-sort="lastUpdated" scope="col" data-order="DESC" class="header"> Last updated</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                        <div id="paginateTable" class="d-none" style="text-align: center">
                                            <span id="paginationInfo"></span>
                                            <div class="btn-group">
                                                <button class="btn btn-sm prev"><i class="fa fa-chevron-left" style="margin-top: 2px"></i>&nbsp;previous</button>
                                                <button class="btn btn-sm next">next&nbsp;<i class="fa fa-chevron-right"></i></button>

                                            </div>
                                        </div>
                                    </div> <!-- table -->
%{--                             template for jQuery DOM injection --}%
                                    <table id="projectRowTempl" class="d-none">
                                        <tr>
                                            <td class="td1">
                                                <div class="accordion mb-0">
                                                    <div class="card mb-0 border-0 p-0">
                                                        <div>
                                                            <a class="projectTitle collapsed" id="proj_" href="#a_" data-toggle="collapse" title="click to show/hide details">
                                                                <span class="showHideCaret">&#9658; </span><span class="projectTitleName">$name</span> (<b class="meritProjectID"></b>)
                                                            </a>
                                                            <a href="#" class="managementUnitLine pull-right">
                                                                <small><i class="managementUnitName"></i></small>
                                                            </a>
                                                        </div>
                                                        <div class="projectInfo collapse pl-2 pt-1" id="a_" aria-labelledby="proj_">
                                                            <div class="card-body pt-0 pl-0 pb-0">
                                                                <div class="homeLine">
                                                                    <i class="fa fa-home"></i>
                                                                    <a href="">View project page</a>
                                                                </div>
                                                                <div class="orgLine">
                                                                    <i class="fa fa-user" data-toggle="tooltip" title="Organisation"></i>
                                                                </div>
                                                                <div class="associatedProgramLine">
                                                                    <i class="fa fa-bookmark" data-toggle="tooltip" title="Associated program / sub program"></i>
                                                                    <span></span>
                                                                    <i class="associatedSubProgram"></i>
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
                                                        </div>
                                                    </div> <!-- end of card -->
                                                </div>
                                            </td>
                                            <td class="td2">$date</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> <!-- Project View -->
                <div class="card cardSection">
                <div class="card-header collapsed" id="dashboardHeading" href="#reportView" data-toggle="collapse">
                    <a class="text-left text-uppercase">Dashboard</a>
                </div>
                    <div id="reportView" class="collapse collapseItems" aria-labelledby="dashboardHeading" data-parent="#project-display-options">
                        <div class="card-body pt-0">
                            <div class="row">
                                <div class="col-sm-4 d-none" data-hidden="true">
                                    <span class="facet-holder" data-hidden="true"></span>
                                </div>
                                <div class="col-sm-12">
                                    <div>
                                        <div class="row" style="margin-top:5px;">
                                            <button class="btn facets-toggle" type="button" style="margin-right: 0.7rem;"><i class="fa fa-bars"></i></button>
                                            <span style="margin-top: 0.6em;">
                                            <g:render template="searchResultsSummary"/>
                                        </span>
                                        </div>
                                    </div>
                                    <div class="reportDropdown">
                                        <g:if test="${fc.userIsAlaOrFcAdmin()}">
                                                <h4>Report: </h4>
                                                <select id="dashboardType"  class="dashboardSelect" name="dashboardType">
                                                    <option value="dashboard">Activity Outputs</option>
                                                    <option value="announcements">Announcements</option>
                                                    <option value="outputTargets">Output Targets By Programme</option>
                                                    <option value="reef2050PlanActionSelection">Reef 2050 Plan Dashboard</option>
                                                </select>
                                        </g:if>
                                        <g:else>
                                            <select id="dashboardType" class="dashboardSelect" name="dashboardType">
                                                <option value="dashboard">Activity Outputs</option>
                                                <option value="reef2050PlanActionSelection">Reef 2050 Plan Dashboard</option>
                                            </select>
                                        </g:else>
                                    </div>
                                    <div class="loading-message">
                                        <asset:image dir="images" src="loading.gif" alt="saving icon"/> Loading...
                                    </div>
                                    <div id="dashboard-content"></div>
                                </div> <!-- col-sm-8 -->
                            </div>
                            </div>
                        </div>
                    </div> <!-- Dashboard -->
                <g:if test="${includeDownloads}">
                    <div class="card cardSection">
                        <div class="card-header collapsed" id="downloadHeading" href="#downloadView" data-toggle="collapse">
                            <a class="text-left text-uppercase">Download</a>
                        </div>
                        <div id="downloadView" class="collapse collapseItems" aria-labelledby="downloadHeading" data-parent="#project-display-options">
                            <div class="card-body pt-0">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <span class="facet-holder"></span>
                                    </div>
                                    <div class="col-sm-8">
                                        <g:render template="searchResultsSummary"/>
                                        <div class="alert alert-warning" role="alert">Please do not run more than one download at a time as they can place a lot of load on the system</div>
                                        <h3>Download data for a filtered selection of projects</h3>
                                        <table class="table">
                                            <thead>
                                            <tr>
                                                <th colspan="2"><b>Project, Site, Activity & Output</b></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="50%"><g:render template="downloadAllAsXlsx"/></td>
                                                    <td width="50%"><a target="_blank" href="${grailsApplication.config.getProperty('grails.serverURL')}/search/downloadAllData<fc:formatParams params="${params}"/>&view=json">JSON</a></td>
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

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div> <!-- Download -->
                </g:if>

            </div> <!-- accordion -->
        </div> <!-- col-sm-11 -->
    </div> <!-- End of Row -->
</g:elseif>
<g:else>
    <div class="row">
        <div class="col-sm-12">
            <div class="alert alert-danger large-space-before">
                Error: search index returned 0 results
            </div>
        </div>
    </div>
</g:else>
</div>

<asset:script>

    var sectionMapping = {
        projects:'#projectsView',
        map:'#accordionMapView',
        dashboard:'#reportView',
        download:'#downloadView'
    };

    var reportMapping = {
        activities:'dashboard',
        reef2050:'reef2050PlanActionSelection'
    };
    <g:if test="${fc.userIsAlaOrFcAdmin()}">
        reportMapping['announcements']='announcements';
        reportMapping['targets']='outputTargets';
    </g:if>
    var selectedSection = sectionMapping['${params.section?:''}'];
    var selectedReport = reportMapping['${params.subsection?:''}'];

    var projectListIds = [], facetList = [], mapDataHasChanged = false, mapBounds, projectSites; // globals
    var facetModelViewArgs = {
        facetsList : ${raw((facetsList as grails.converters.JSON).toString())},
        results: ${raw((results as grails.converters.JSON).toString())},
        fqLink: "${fqLink}",
        baseUrl: "${baseUrl}",
        projectExplorerUrl: "${g.createLink(controller:'home', action:'projectExplorer')}"
    };

    $(function(){

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


        function toggleFacets() {
            var $holder = $('#facetsCol').parent().parent();
            var hidden = $holder.data('hidden');
            $holder.data('hidden', !hidden);
            var $content = $holder.next();
            if (!hidden) {
                $holder.animate({width:"toggle" }, function() {
                    $holder.addClass('d-none');
                    $content.removeClass('col-sm-8').addClass('col-sm-12')
                });
            }
            else {
                $holder.animate({width:"toggle" }, function() {
                    $holder.removeClass('d-none');
                   $content.removeClass('col-sm-12').addClass('col-sm-8');
                });
            }
        }

        $(".facets-toggle").on('click', function(){
            toggleFacets();
        });
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
            $tr.find(".projectTitle").attr("href", "#a_"+id)
            $tr.find(".projectTitle").attr("id", "proj_"+id)
            $tr.find(".projectInfo").attr("aria-labelledby", "proj_"+id)
            $tr.find('.projectInfo').attr("id", "a_" + id)
            $tr.find('.td1 .projectTitleName').text(src.name); // projectTitleName
            $tr.find(".td1 .meritProjectID").text(src.grantId)
            if(src.managementUnitName){
                $tr.find('.td1 .managementUnitName').text(src.managementUnitName);
                $tr.find('.td1 a.managementUnitLine').attr("href", "${createLink(controller: 'managementUnit')}/" + src.managementUnitId);
            }
            if(src.associatedProgram){
                if (src.programId){
                    $tr.find('.td1 .associatedProgramLine span').text(src.associatedProgram);
                    //$tr.find('.td1 .associatedProgramLine a').attr("href", "${createLink(controller: 'program')}/" + src.programId);
                    }
                else{
                    //$tr.find('.td1 .associatedProgramLine a').attr("href", "#");
                    $tr.find('.td1 .associatedProgramLine a').replaceWith('<span>'+ src.associatedProgram +'</span>')
                }

                if (src.associatedSubProgram)
                    $tr.find('.td1 .associatedProgramLine i.associatedSubProgram').text( " - "+src.associatedSubProgram )
            }

          //  $tr.find('.projectInfo').attr("id", "proj_" + id);
            $tr.find('.homeLine a').attr("href", "${createLink(controller: 'project')}/" + id);
            $tr.find('a.zoom-in').data("id", id);
            $tr.find('a.zoom-out').data("id", id);
            var organisations = '';
            if (src.associatedOrgs) {
                for (var i=0; i<src.associatedOrgs.length; i++) {
                    if (organisations.length > 0) {
                        organisations = organisations + ', ';
                    }
                    organisations = organisations + src.associatedOrgs[i].name;
                }
            }
            $tr.find('.orgLine').text(organisations);
            $tr.find('.descLine').text(src.description);
        <g:if test="${fc.userIsSiteAdmin()}">
            $tr.find('.downloadLine a').attr("href", "${createLink(controller: 'project',action: 'downloadProjectData')}" + "?id="+id+"&view=xlsx");
                    $tr.find('.downloadJSONLine a').attr("href", "${createLink(controller: 'project',action: 'downloadProjectData')}" + "?id="+id+"&view=json");
        </g:if>
            $tr.find('.td2').text(formatDate(Date.parse(src.lastUpdated))); // relies on the js_iso8601 resource
            //console.log("appending row", $tr);
            $('#projectTable tbody').append($tr);
        });
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

        var query = '${params.query?.encodeAsJavaScript() ?: ""}';
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
            params += '&fromDate='+'${params.fromDate.encodeAsURL()}';
        </g:if>
        <g:if test="${params.toDate}">
            params += '&toDate='+'${params.toDate.encodeAsURL()}';
        </g:if>
        <g:if test="${params.isFilterByCompletedProjects}">
            params += '&isFilterByCompletedProjects=' + ${params.isFilterByCompletedProjects.encodeAsJavaScript()};
        </g:if>

        params += "&clientTimeZone=" + encodeURIComponent(moment.tz.guess() || '');

        $.post(url, params).done(function(data1) {
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
                    $("#paginateTable").removeClass("d-none");
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
        }).fail(function (request, status, error) {
            //console.error("AJAX error", status, error);
            $('#paginationInfo').html("AJAX error:" + status + " - " + error);
        });
    }

        var VIEW_STATE_KEY = 'homepage-tab-state';
        var initialisedReport = false, initialisedMap = false, initialisedProjects = false;
        var initialiseContentSection = function(section){
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
                var reportType = selectedReport || amplify.store('report-type-state');
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

        var urlWithoutDates = '<fc:formatParams params="${params}" requiredParams="query,sort,order,max,fq"/>';
        var fromDate = '${params.fromDate?.encodeAsJavaScript()?:''}';
        var toDate = '${params.toDate?.encodeAsJavaScript()?:''}';
        var isFilterByCompletedProjects = ${params.isFilterByCompletedProjects?.encodeAsJavaScript() ?: false };

        var error = "${error?.encodeAsJavaScript()}";

        if(!error){
            ko.applyBindings(new DatePickerModel(fromDate, toDate, isFilterByCompletedProjects, urlWithoutDates, window.location), document.getElementById('facet-dates'));
        }

        function FacetFilterViewModel (params) {
            this.facetsList = params.facetsList;
            this.results = params.results;
            this.fqLink = params.fqLink;
            this.baseUrl = params.baseUrl;
            this.projectExplorerUrl = params.projectExplorerUrl;
        }
        if(!error){
            ko.applyBindings(new FacetFilterViewModel(facetModelViewArgs), document.getElementById('facet-list'));
        }

        $('#facet-dates').validationEngine('attach', {scroll:false});

        $('.helphover').popover({animation: true, trigger:'hover', container:'body'});


        $("#facetsContent").on("shown.bs.collapse", function(e){
            var $target = $(e.target);
            var targetId = "#"+e.target.id;
            var facetValue = amplify.store('facetToggleState') || [];
            if(!facetValue.includes(targetId)){
                facetValue.push(targetId)
            }
            var section = facetValue;
            amplify.store('facetToggleState', section);

        });
        $("#facetsContent").on("hidden.bs.collapse", function(e){
            var targetId = "#"+e.target.id;
            var facetStoredTab = amplify.store('facetToggleState') || [];
            var updatedFacetList = [];
            facetStoredTab.forEach(function(tab){
                if(tab !== targetId){
                    updatedFacetList.push(tab)
                }
            })
            if(updatedFacetList.length > 1){
                amplify.store('facetToggleState', updatedFacetList)
            }else{
                amplify.store('facetToggleState', null);
            }
        });

    // retain accordion state for future re-visits
        function restoreFacetSelections() {
            if ($('#facetsContent').is(':visible')) {
            var expandedToggles = amplify.store('facetToggleState') || [];
                if (expandedToggles) {
                expandedToggles.forEach(function(section){
                    $(section).collapse('show');
                });
                }
            }

        }
// re-establish the previous view state
        var storedTab = selectedSection || amplify.store(VIEW_STATE_KEY) || '#accordionMapView';
        if (!$('#project-display-options '+storedTab)[0]) {
            storedTab = '#accordionMapView';
        }
        $('#project-display-options '+storedTab).collapse({parent:'#project-display-options'});
        $('#project-display-options').on("shown.bs.collapse", function(e){
            var $target = $(e.target)
            var targetId;
            if($target.hasClass('collapseItems')){
                targetId = e.target.id
               var  section = '#'+targetId
                amplify.store(VIEW_STATE_KEY, section);
                initialiseContentSection(section);
            }
            // Because the facets use accordion and are inside the main accordion view we need to filter them out.
            $('#facetsCol').appendTo($(section).find('.facet-holder'));
            $('#facetsCol').show();
            restoreFacetSelections();
        });

        $(".clearFacet").click(function(e){
            amplify.store('facetToggleState', null);
       	    window.location.href = facetModelViewArgs.projectExplorerUrl;
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
</asset:script>
