<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${site?.name} | Field Capture</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <r:script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
            siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
            activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
            activityCreateUrl: "${createLink(controller: 'activity', action: 'create')}",
            spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
            sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
            sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
            },
            returnTo = "${createLink(controller:'site', action:'index', id:site.siteId)}";
    </r:script>
  <r:require modules="knockout,mapWithFeatures,amplify"/>
</head>
<body>
    <div class="container-fluid">
    <legend>
        <table style="width: 100%">
            <tr>
                <td><g:link class="discreet" controller="home" action="index">Home</g:link><fc:navSeparator/>Site<fc:navSeparator/>${site.name}</td>
            </tr>
        </table>
    </legend>
    <div class="row-fluid space-after">
        <div class="span9"><!-- left block of header -->
            <div >
                <div class="clearfix">
                    <h1 class="pull-left">${site?.name}</h1>
                    <g:link style="margin-bottom:10px;" action="edit" id="${site.siteId}" class="btn pull-right title-edit">Edit site</g:link>
                </div>
                <g:if test="${site.description}">
                    <div class="clearfix well well-small">
                        <p>${site.description}</p>
                    </div>
                </g:if>
            </div>
            <div style="margin-top: 20px;">
                <span class="span4">
                    <span class="label label-info">External Id:</span> ${site.externalId?:'Not specified'}
                </span>
                <span class="span4">
                    <span class="label label-info">Type:</span> ${site.type?:'Not specified'}
                </span>
                <span class="span4">
                    <span class="label label-info">Area:</span>
                    <g:if test="${site?.extent?.geometry?.area}">
                        ${site.extent.geometry.area} square km
                    </g:if>
                    <g:else>
                        Not specified
                    </g:else>
                </span>
            </div>

            <g:if test="${site.extent.geometry}">
            <div style="margin-top: 20px;">
                <span class="span4">
                    <span class="label label-success">State/territory:</span> ${site.extent.geometry.state?:'Not specified'}
                </span>
                <span class="span4">
                    <span class="label label-success">Local government area:</span> ${site.extent.geometry.lga?:'Not specified'}
                </span>
                <span class="span4">
                    <span class="label label-success">Locality:</span> ${site.extent.geometry.locality?:'Not specified'}
                </span>
            </div>
            </g:if>

            <div>
                <span class="span12">
                    <span class="label label-info">Notes:</span>
                    ${site.notes}</span>
            </div>

            <g:if test="${site.projects}">
            <div>
                <span class="span2"><span class="label  label-info">Projects:</span></span>
                <ul style="list-style: none;margin:13px 0;">
                    <g:each in="${site.projects}" var="p" status="count">
                        <li>
                            <g:link controller="project" action="index" id="${p.projectId}">${p.name}</g:link>
                            <g:if test="${count < site.projects.size() - 1}">, </g:if>
                        </li>
                    </g:each>
                </ul>
            </div>
            </g:if>

        </div>
        <div class="span3">
            <div id="smallMap"></div>
            <g:if test="${site?.extent?.geometry?.pid}">
                <div style="margin-top:20px;">
                    <a href="http://spatial-dev.ala.org.au/ws/shape/shp/${site.extent.geometry.pid}" class="btn btn-info">Download ShapeFile</a>
                </div>
            </g:if>
        </div>
    </div>
    <g:if test="${site.poi}">
        <h2>Points of interest at this site</h2>
        <div class="row-fluid">
              <ul>
              <g:each in="${site.poi}" var="poi">
                <li>${poi.name}</li>
              </g:each>
              </ul>
        </div>
    </g:if>

    <g:if test="${site.activities}">
        <h2>Activities at this site</h2>
        <div class="row-fluid">
            <!-- ACTIVITIES -->
            <div class="tab-pane active" id="activity">
                <g:render template="/shared/activitiesTable"
                          model="[activities:site.activities ?: [], sites:[], showSites:false]"/>
            </div>
        </div>
    </g:if>

    <div class="row-fluid">
        <div class="span12 metadata">
            <span class="span6">
                <p><span class="label">Created:</span> ${site.dateCreated}</p>
                <p><span class="label">Last updated:</span> ${site.lastUpdated}</p>
            </span>
        </div>
    </div>

    <div class="expandable-debug">
        <hr />
        <h3>Debug</h3>
        <div>
            <h4>KO model</h4>
            <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
            <h4>Activities</h4>
            <pre>${site.activities}</pre>
            <h4>Site</h4>
            <pre>${site}</pre>
            <h4>Projects</h4>
            <pre>${projects}</pre>
            <h4>Features</h4>
            <pre>${mapFeatures}</pre>
        </div>
    </div>
    </div>
    <r:script>

        var isodatePattern = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
            activitiesObject = ${site.activities + site.assessments};

        $(function(){

            // change toggle icon when expanding and collapsing and track open state
            $('#activities').
            on('show', 'div.collapse', function() {
                $(this).parents('tr').prev().find('td:first-child i').
                    removeClass('icon-plus').addClass('icon-minus');
            }).
            on('hide', 'div.collapse', function() {
                $(this).parents('tr').prev().find('td:first-child i').
                    removeClass('icon-minus').addClass('icon-plus');
            }).
            on('shown', 'div.collapse', function() {
                trackState();
            }).
            on('hidden', 'div.collapse', function() {
                trackState();
            });

            // determines which project an activity belongs to
            ko.bindingHandlers.projectName =  {
                init: function(element, valueAccessor, allBindingsAccessor, model, bindingContext) {
                    var activity = ko.utils.unwrapObservable(valueAccessor()),
                        projects = [];
                    if (activity.projectId) {
                        $(element).html(activity.projectId);
                    }
                    // no directly linked project so use the site's project(s)
                    ko.utils.arrayForEach(viewModel.projects, function (p) {
                        projects.push(p.name);
                    });
                    $(element).html(projects.join(','));
                }
            };

            function ViewModel(projects, site, activities) {
                var self = this;
                this.loadActivities = function (activities) {
                    var acts = ko.observableArray([]);
                    $.each(activities, function (i, act) {
                        var activity = {
                            activityId: act.activityId,
                            siteId: act.siteId,
                            type: act.type,
                            startDate: ko.observable(act.startDate).extend({simpleDate:false}),
                            endDate: ko.observable(act.endDate).extend({simpleDate:false}),
                            outputs: ko.observableArray([]),
                            collector: act.collector,
                            metaModel: act.model || {},
                            edit: function () {
                                document.location.href = fcConfig.activityEditUrl + '/' + this.activityId +
                                    "?returnTo=" + returnTo;
                            }
                        };
                        $.each(act.outputs, function (j, out) {
                            activity.outputs.push({
                                outputId: out.outputId,
                                name: out.name,
                                collector: out.collector,
                                assessmentDate: out.assessmentDate,
                                scores: out.scores
                            });
                        });
                        acts.push(activity);
                    });
                    return acts;
                };
                self.name = ko.observable(site.name);
                self.description = ko.observable(site.description);
                self.externalId = ko.observable(site.externalId);
                self.startDate = ko.observable(site.startDate).extend({simpleDate: false});
                self.endDate = ko.observable(site.endDate).extend({simpleDate: false});
                self.projects = ko.toJS(site.projects);
                self.activities = self.loadActivities(activities);
                // Animation callbacks for the lists
                self.showElement = function(elem) { if (elem.nodeType === 1) $(elem).hide().slideDown() };
                self.hideElement = function(elem) { if (elem.nodeType === 1) $(elem).slideUp(function() { $(elem).remove(); }) };
                self.newActivity = function () {
                    document.location.href = fcConfig.activityCreateUrl +
                    "?siteId=${site.siteId}&returnTo=" + returnTo;
                };
                self.notImplemented = function () {
                    alert("Not implemented yet.")
                };
                self.expandActivities = function () {
                    $('#activityList div.collapse').collapse('show');
                };
                self.collapseActivities = function () {
                    $('#activityList div.collapse').collapse('hide');
                }
            }

            var viewModel = new ViewModel(${projects || []},${site},${site.activities ?: []});

            ko. applyBindings(viewModel);

            readState();

            // retain tab state for future re-visits
            $('a[data-toggle="tab"]').on('shown', function (e) {
                var tab = e.currentTarget.hash;
                amplify.store('project-tab-state', tab);
                // only init map when the tab is first shown
                if (tab === '#site' && map === undefined) {
                    init_map_with_features({
                            mapContainer: "map",
                            scrollwheel: false
                        },
                        $.parseJSON('${mapFeatures}')
                    );
                }
            });

            // re-establish the previous tab state
            if (amplify.store('project-tab-state') === '#site') {
                $('#site-tab').tab('show');
            }

            var mapFeatures = $.parseJSON('${mapFeatures}');
            if(mapFeatures !=null && mapFeatures.features !== undefined && mapFeatures.features.length >0){
                init_map_with_features({
                        mapContainer: "smallMap",
                        zoomToBounds:true,
                        zoomLimit:16
                    },
                    mapFeatures
                );
            }
        });

    </r:script>
</body>
</html>