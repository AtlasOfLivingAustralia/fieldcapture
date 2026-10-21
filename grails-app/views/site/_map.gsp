<%@ page import="au.org.ala.merit.SiteService" %>
<!-- ko stopBinding: true -->
<div id="sitemap">
            <script type="text/javascript" src="${grailsApplication.config.getProperty('google.drawmaps.url')}"></script>
            <div class="row">
                <g:hiddenField name="id" value="${site?.siteId}"/>
                <div class="col-sm-8">
                    <label for="name">Site name</label>
                    <h1>
                        <input data-bind="value: name" data-validation-engine="validate[required]"
                               class="form-control form-control-sm" id="name" type="text" value="${site?.name?.encodeAsHTML()}"
                               placeholder="Enter a name for the new site"/>
                    </h1>
                </div>
            </div>
            <g:if test="${project && controllerName.equals('site')}">
                <div class="row" style="padding-bottom:15px;">
                    <div class="col-sm-8">
                        <span>Project name: <g:link controller="project" action="index" id="${project?.projectId}">${project?.name?.encodeAsHTML()}</g:link></span>
                    </div>
                </div>
            </g:if>
            <div class="row">
                <div class="col-sm-3">
                    <label for="externalId">External Id
                        <fc:iconHelp title="External id">Identifier code for the site - used in external documents.</fc:iconHelp>
                    </label>
                    <div>
                        <input data-bind="value:externalId" id="externalId" class="form-control" type="text"/>
                    </div>
                </div>
                <div class="col-sm-3">
                    <label for="siteType">Type</label>
                    <div>
                        <g:select id="siteType"
                                  from="${siteTypes}"
                                  optionKey="value"
                                  optionValue="label"
                              data-bind="value: type"
                              class="form-control"
                              name='type'

                              />
                    </div>
                </div>
                <div class="col-sm-3">
                    <label for="siteContext">Context</label>

                    <div>
                        <g:select id="siteContext"
                              data-bind="value: context"
                              class="form-control"
                              name='context'
                              from="['choose site context','Pastoral','Industrial','Urban','Coastal', 'Reserve', 'Private land', 'Marine']"
                              keys="['none','Pastoral','Industrial','Urban','Coastal','Reserve', 'Private land', 'Marine']"/>
                    </div>
                </div>

            </div>

            <div class="row mt-3">
                <div class="col-sm-6">
                    <fc:textArea data-bind="value: description" id="description" label="Description" class="form-control form-control-sm" rows="3" cols="50"/>
                </div>
                <div class="col-sm-6">
                    <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="form-control form-control-sm" rows="3" cols="50"/>
                </div>
            </div>

            <h2>Extent of site</h2>
            <fc:iconHelp title="Extent of the site">The extent of the site can be represented by
                a polygon, radius or point. KML, WKT and shape files are supported for uploading polygons.
                As are PID's of existing features in the Atlas Spatial Portal.</fc:iconHelp>

            <div class="row">
                <div class="col-sm-8">
                    <m:map id="mapForExtent" class="smallMap" width="100%" height="800px"></m:map>
                </div>

                <div class="col-sm-4">
                    <div class="well well-small">
                         <div style="padding-top:10px;" data-bind="template: { name: extent().source, data: extent }"></div>
                    </div>

                    <div class="well well-small">
                        <h4>Points of interest
                            <fc:iconHelp title="Points of interest">You can specify any number of points
                            of interest with a site. Points of interest may include photo points
                            or the locations of previous survey work.</fc:iconHelp>
                        </h4>
                        <div class="mt-2 row" id="pointsOfInterest" >
                            <div class="col-sm-11" data-bind="foreach: poi">
                                <div>
                                    <div data-bind="template: { name: 'poi'}" ></div>
                                    <button type="button" class="mt-2 ms-4 btn btn-sm btn-danger" style="margin-bottom:20px;" data-bind="click: $parent.removePOI, visible:!hasPhotoPointDocuments">Remove</button>
                                </div>
                                <hr/>
                            </div>
                        </div>
                        <div class="row ms-1">
                            <button type="button" data-bind="click: newPOI, visible: poi.length == 0" class="btn btn-sm">Add a POI</button>
                            <button type="button" data-bind="click: newPOI, visible: poi.length > 0" class="btn btn-sm">Add another POI</button>
                        </div>
                    </div>
                </div>
            </div>

<!-- templates -->
<script type="text/html" id="none">
    %{--<span>Choose a type</span>--}%
</script>
    <script type="text/html" id="poi">
    <div class="drawLocationDiv row">
        <div class="col-sm-12 ps-4 ms-2">
            <div class="row alert" style="box-sizing:border-box;" data-bind="visible:hasPhotoPointDocuments">
                This point of interest has documents attached and cannot be removed.
            </div>
            <div class="row controls-row">
                <fc:textField data-bind="value:name" outerClass="col-sm-8" class="form-control form-control-sm " label="Name" data-validation-engine="validate[required]"/>
            </div>
            <div class="mt-2 row controls-row">
                <fc:textArea rows="2" data-bind="value:description" outerClass="col-sm-12 ml-3" class="form-control form-control-sm" label="Description"/>
            </div>
            <div class=" mt-2 row controls-row">
                <div class="col-sm-10 ms-1">
                    <label for="type">Point type</label>
                    <div>
                        <g:select class="from-control form-control-sm custom-input" data-bind="value: type"
                                  name='type'
                                  from="['choose type','photopoint', 'location of previous surveys', 'other']"
                                  keys="['none','photopoint', 'survey', 'other']"/>
                    </div>
                </div>

            </div>
            <div class="mt-2 ps-1 row controls-row">

                <fc:textField data-bind="value:geometry().decimalLatitude" outerClass="col-sm-4"  class="form-control form-control-sm" label="Latitude" data-validation-engine="validate[required,custom[number],min[-90],max[0]]" data-prompt-position="topRight:-150"/>
                <fc:textField data-bind="value:geometry().decimalLongitude" outerClass="col-sm-4" class="form-control form-control-sm" label="Longitude" data-validation-engine="validate[required,custom[number],min[-180],max[180]]"/>
                <fc:textField data-bind="value:geometry().bearing" outerClass="col-sm-4" class="form-control form-control-sm" label="Bearing (degrees)" data-validation-engine="validate[custom[number],min[0],max[360]]" data-prompt-position="topRight:-150"/>
            </div>
            <div class="row controls-row" style="display:none;">
                <div class="col-sm-10">
                    <fc:textField data-bind="value:geometry().uncertainty, enable: hasCoordinate()" outerClass="col-sm-4" class="form-control form-control-sm" label="Uncertainty"/>
                    <fc:textField data-bind="value:geometry().precision, enable: hasCoordinate()" outerClass="col-sm-4" class="form-control form-control-sm" label="Precision"/>
                    <fc:textField data-bind="value:geometry().datum, enable: hasCoordinate()" outerClass="col-sm-3" class="form-control form-control-sm" label="Datum" placeholder="e.g. WGS84"/>
                </div>

            </div>
        </div>
    </div>
    </script>

    <script type="text/html" id="drawn">
    <div id="drawnLocationDiv" class="drawLocationDiv row">
        <div class="col-sm-10 ms-3">

            <div class="mt-2 row controls-row" style="display:none;">
                <span class="label label-success">Type</span> <span data-bind="text:geometry().type"></span>
            </div>
            <div class="mt-2 row controls-row" data-bind="visible: geometry!=null && geometry().areaKmSq!=null && geometry().areaKmSq != '' ">
                <span class="label label-success">Area (Ha)</span> <span data-bind="text:geometry().areaKmSq() ? geometry().areaKmSq()*100: '' "></span>
            </div>

            <div class="mt-2 row controls-row gazProperties" data-bind="visible: geometry!=null && geometry().state!=null && geometry().state!=''">
                <span class="label label-success">State/territory</span> <span data-bind="expandable:geometry().state"></span>
            </div>

            <div class="mt-2 row controls-row gazProperties" data-bind="visible: geometry!=null && geometry().lga!=null && geometry().lga!=''">
                <span class="label label-success">Local Gov. Area</span> <span data-bind="expandable:geometry().lga"></span>
            </div>

            <div class="mt-2 row controls-row gazProperties">
                <span class="label label-success">NRM</span> <span data-bind="expandable:geometry().nrm"></span>
            </div>

            <div class="mt-2 row controls-row gazProperties">
                <span class="label label-success">Locality</span> <span data-bind="text:geometry().locality"></span>
            </div>

            <div class="mt-2 row controls-row gazProperties">
                <span class="label label-success">NVIS major vegetation group:</span> <span data-bind="text:geometry().mvg"></span>
            </div>

            <div class="mt-2 row controls-row gazProperties">
                <span class="label label-success">NVIS major vegetation subgroup:</span> <span data-bind="text:geometry().mvs"></span>
            </div>

            <div style="display:none;" class="mt-2 row controls-row">
                <span class="label label-success">Center</span> <span data-bind="text:geometry().centre"></span>
            </div>
            <!-- ko if: $root.transients.radiiOfCircles().length > 0 -->
            <div class="mt-2 row controls-row circleProperties propertyGroup">
                <span class="label label-success">Radius (m)</span>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Radius (m)</th>
                        </tr>
                    </thead>
                    <tbody data-bind="foreach: $root.transients.radiiOfCircles">
                        <tr data-bind="event: { mouseover: $root.highlightFeature, mouseout: $root.unHighlightFeature }">
                            <td data-bind="text: name"></td>
                            <td data-bind="text: radius"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- /ko -->

            <div style="display:none;" class="mt-2 row controls-row  propertyGroup">
                <span class="label">GeoJSON</span> <span data-bind="text:ko.toJSON(geometry())"></span>
            </div>
        </div>
        %{--<div class="smallMap span8" style="width:500px;height:300px;"></div>--}%
    </div>
    </script>
</div>
<!-- /ko -->

<asset:script>
function initSiteViewModel() {
    var siteViewModel;

    // server side generated paths & properties
    var SERVER_CONF = {
        siteData: ${raw((site?:[] as grails.converters.JSON).toString())},
        spatialService: '${createLink(controller:'proxy',action:'feature')}',
        intersectService: "${createLink(controller: 'proxy', action: 'intersect')}",
        featuresService: "${createLink(controller: 'proxy', action: 'features')}",
        featureService: "${createLink(controller: 'proxy', action: 'feature')}",
        validateShapesUrl: "${createLink(controller: 'site', action: 'isGeometryWithinAustralia')}",
        spatialWms: '${grailsApplication.config.getProperty('spatial.geoserverUrl')}',
        knownShapeConfig: <fc:modelAsJavascript model="${knownShapeConfig}" default="[]"/>
    };

    var savedSiteData = {
        siteId: "${raw(site?.siteId)}",
        name : "${site?.name?.encodeAsJavaScript()}",
        externalId : "${site?.externalId?.encodeAsJavaScript()}",
        context : "${site?.context?.encodeAsJavaScript()}",
        type : "${site?.type?.encodeAsJavaScript()}",
        extent: <fc:modelAsJavascript model="${site?.extent}"/>,
        poi: <fc:modelAsJavascript model="${site?.poi}" default="[]"/>,
        description : '${site?.description?.encodeAsJavaScript() ?: ""}',
        notes : '${site?.notes?.encodeAsJavaScript() ?: ""}',
        documents : <fc:modelAsJavascript model="${siteDocuments?:documents}"/>,
        features: <fc:modelAsJavascript model="${site?.features}" default="[]"/>,
    <g:if test="${project}">
        projects : ['${raw(project.projectId)}'],
    </g:if>
    <g:else>
        projects : <fc:modelAsJavascript model="${site?.projects}" default="[]"/>
    </g:else>
    };


    (function(){

        //retrieve serialised model
        siteViewModel = new SiteViewModelWithMapIntegration(savedSiteData, null, SERVER_CONF);

        ko.applyBindings(siteViewModel, document.getElementById("sitemap"));

        var alaMap = init_map({
            spatialService: SERVER_CONF.spatialService,
            spatialWms: SERVER_CONF.spatialWms,
            mapContainer: 'mapForExtent',
            featureService: SERVER_CONF.featureService,
            validateShapesUrl: SERVER_CONF.validateShapesUrl
        });

        siteViewModel.mapInitialised(alaMap);

        // enable edit mode if the site already exists
        if (savedSiteData.siteId) {
            enableEditMode(alaMap);
        }

    }());

    return siteViewModel;
}

function enableEditMode(alaMap) {
    if (alaMap) {
        var options = alaMap.getMapImpl().pm.getGlobalOptions();
        alaMap.getMapImpl().pm.enableGlobalEditMode(options);
    }
}
</asset:script>
