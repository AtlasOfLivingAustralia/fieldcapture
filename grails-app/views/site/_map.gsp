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
                    %{--<input data-bind="value: type" id="siteType" type="text" class="span12"/>--}%
                    <div>
                        <g:select id="siteType"
                              data-bind="value: type"
                              class="form-control"
                              name='type'
                              from="['Works Area','Project Extent']"
                              keys="['worksArea','projectArea']"/>
                    </div>
                </div>
                <div class="col-sm-3">
                    <label for="siteContext">Context</label>
                    %{--<input data-bind="value: context" id="siteContext" type="text" class="span12"/>--}%
                    <div>
                        <g:select id="siteContext"
                              data-bind="value: context"
                              class="form-control"
                              name='context'
                              from="['choose site context','Pastoral','Industrial','Urban','Coastal', 'Reserve', 'Private land']"
                              keys="['none','Pastoral','Industrial','Urban','Coastal','Reserve', 'Private land']"/>
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
                <div class="col-sm-6">
                    <div id="mapForExtent" class="smallMap w-100" style="height:600px;"></div>
                </div>

                <div class="col-sm-6">
                    <div class="well well-small">
                        <div class="form-group row">
                            <label for="extentSource" class="col-sm-3 pr-0"><h4>Define extent using:</h4></label>
                            <div class="col-sm-9 pl-0 extentSelect">
                                <g:select class="input-small form-control" data-bind="value: extentSource" data-validation-engine="validate[funcCall[validateSiteExtent]]"
                                          name='extentSource'
                                          from="['choose type','point','known shape','draw a shape']"
                                          keys="['none','point','pid','drawn']"/>
                            </div>
                        </div>

                        <div id="map-controls" data-bind="visible: extent().source() == 'drawn' ">
                            <ul id="control-buttons">
                                <li class="active" id="pointer" title="Drag to move. Double click or use the zoom control to zoom.">
                                    <a href="javascript:void(0);" class="btn active draw-tool-btn">
                                    <img src="${assetPath(src:'glyphicons_347_hand_up.png')}" alt="center and radius"/>
                                    <span class="drawButtonLabel">Move & zoom</span>
                                    </a>
                                </li>
                                <li id="circle" title="Click at centre and drag the desired radius. Values can be adjusted in the boxes.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    <img src="${assetPath(src:'glyphicons_095_vector_path_circle.png')}" alt="center and radius"/>
                                    <span class="drawButtonLabel">Draw circle</span>
                                    </a>
                                </li>
                                <li id="rectangle" title="Click and drag a rectangle.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    <img src="${assetPath(src:'glyphicons_094_vector_path_square.png')}" alt="rectangle"/>
                                    <span class="drawButtonLabel">Draw rect</span>
                                    </a>
                                </li>
                                <li id="polygon" title="Click any number of times to draw a polygon. Double click to close the polygon.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    <img src="${assetPath(src:'glyphicons_096_vector_path_polygon.png')}" alt="polygon"/>
                                    <span class="drawButtonLabel">Draw polygon</span>
                                    </a>
                                </li>
                                <li id="clear" title="Clear the region from the map.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    <img src="${assetPath(src:'glyphicons_016_bin.png')}" alt="clear"/>
                                    <span class="drawButtonLabel">Clear</span>
                                    </a>
                                </li>
                                <li id="reset" title="Zoom and centre on Australia.">
                                    <a href="javascript:void(0);" class="btn draw-tool-btn">
                                    <img src="${assetPath(src:'reset.png')}" alt="reset map"/>
                                    <span class="drawButtonLabel">Reset</span>
                                    </a>
                                </li>
                                <li id="zoomToExtent" title="Zoom to extent of drawn shape.">
                                    <a href="javascript:zoomToShapeBounds();" class="btn draw-tool-btn">
                                    <img src="${assetPath(src:'glyphicons_186_move.png')}" alt="zoom to extent of drawn shape"/>
                                    <span class="drawButtonLabel">Zoom</span>
                                    </a>
                                </li>
                            </ul>
                         </div>

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
                                    <button type="button" class="mt-2 ml-4 btn btn-sm btn-danger" style="margin-bottom:20px;" data-bind="click: $parent.removePOI, visible:!hasPhotoPointDocuments">Remove</button>
                                </div>
                                <hr/>
                            </div>
                        </div>
                        <div class="row ml-1">
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

<script type="text/html" id="point">
    <div class="drawLocationDiv row">
        <div class="col-sm-10">
            <div class="row controls-row mb-2">
                <fc:textField data-bind="value:geometry().decimalLatitude" data-validation-engine="validate[required,custom[number],min[-90],max[0]]" outerClass="col-sm-6" class="form-control form-control-sm" label="Latitude"/>
                <fc:textField data-bind="value:geometry().decimalLongitude" data-validation-engine="validate[required,custom[number],min[-180],max[180]]" data-prompt-position="topRight:-150" outerClass="col-sm-6" class="form-control form-control-sm" label="Longitude"/>
            </div>
            <div class="row controls-row">
                <fc:textField data-bind="value:geometry().uncertainty, enable: hasCoordinate()" outerClass="col-sm-4" class="form-control form-control-sm" label="Uncertainty (metres)" data-validation-engine="validate[min[0],custom[integer]]"/>
                <fc:textField data-bind="value:geometry().precision, enable: hasCoordinate()" outerClass="col-sm-4" class="form-control form-control-sm" label="Precision" data-validation-engine="validate[min[0],custom[number]]"/>
                %{-- CG - only supporting WGS84 at the moment --}%
                <fc:textField data-bind="value:geometry().datum, enable: hasCoordinate()" outerClass="col-sm-4" class="form-control form-control-sm" label="Datum" placeholder="WGS84" readonly="readonly"/>
            </div>
        </div>
        <div class="mt-3 col-sm-10">
            <div class=" row controls-row gazProperties">
                <div class="col-sm-8 mb-2">
                    <span class="label label-success">State/territory</span> <span data-bind="expandable:geometry().state"></span>
                </div>
                <div class="col-sm-8 mb-2">
                    <span class="label label-success">Local Gov. Area</span> <span data-bind="expandable:geometry().lga"></span>
                </div>
                <div class="col-sm-8 mb-2">
                    <span class="label label-success">NRM</span> <span data-bind="expandable:geometry().nrm"></span>
                </div>
                <div class="col-sm-8 mb-2">
                    <span class="label label-success">Locality</span> <span data-bind="text:geometry().locality"></span>
                </div>
                <div class="col-sm-8 mb-2">
                    <span class="label label-success">NVIS major vegetation group:</span> <span data-bind="text:geometry().mvg"></span>
                </div>
                <div class="col-sm-8 mb-2">
                    <span class="label label-success">NVIS major vegetation subgroup:</span> <span data-bind="text:geometry().mvs"></span>
                </div>
            </div>
        </div>

    </div>
</script>

    <script type="text/html" id="poi">
    <div class="drawLocationDiv row">
        <div class="col-sm-12 pl-4 ml-2">
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
                <div class="col-sm-10 ml-1">
                    <label for="type">Point type</label>
                    <div>
                        <g:select class="from-control form-control-sm custom-input" data-bind="value: type"
                                  name='type'
                                  from="['choose type','photopoint', 'location of previous surveys', 'other']"
                                  keys="['none','photopoint', 'survey', 'other']"/>
                    </div>
                </div>

            </div>
            <div class="mt-2 pl-1 row controls-row">

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

    <script type="text/html" id="pid">
    <div id="pidLocationDiv" class="drawLocationDiv">
        <div class="row">
            <div class="col-sm-4">
                <select id="chooseLayer" name="chooseLayer" data-bind="
                options: layers(),
                optionsCaption:'Choose a layer...',
                optionsValue: 'id',
                optionsText:'name',
                value: chosenLayer" class="form-control"></select>
            </div>
            <div class="col-sm-4">
                <select id="chooseShape"   name="chooseShape" data-bind="options: layerObjects, disable: layerObjects().length == 0,
                optionsCaption:'Choose shape ...',
                optionsValue: 'pid',
                optionsText:'name', value: layerObject" class="form-control"></select>
            </div>
        </div>

            <div class="mt-3 row controls-row" style="display:none;">
                <div class="col-sm-10">
                    <span class="label label-success">PID</span> <span data-bind="text:geometry().pid"></span>
                </div>

            </div>
            <div class="mt-3 row controls-row">
                <div class="col-sm-10">
                    <span class="label label-success">Name</span> <span data-bind="text:geometry().name"></span>
                </div>
            </div>
            <div class="mt-3 row controls-row" style="display:none;">
                <div class="col-sm-10">
                    <span class="label label-success">LayerID</span> <span data-bind="text:geometry().fid"></span>
                </div>

            </div>
            <div class="mt-3 row controls-row">
                <div class="col-sm-10">
                    <span class="label label-success">Layer</span> <span data-bind="text:geometry().layerName"></span>
                </div>

            </div>
            <div class="mt-3 row controls-row">
                <div class="col-sm-10">
                    <span class="label label-success">Area (Ha)</span> <span data-bind="text:geometry().area() ? geometry().area() * 100 : ''"></span>

                </div>
            </div>
        </div>
    </div>
    </script>

    <script type="text/html" id="upload">
    <h3> Not implemented - waiting on web services...</h3>
    </script>

    <script type="text/html" id="drawn">
    <div id="drawnLocationDiv" class="drawLocationDiv row">
        <div class="col-sm-10 ml-3">

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
            <div class="mt-2 row controls-row circleProperties propertyGroup">
                <span class="label label-success">Radius (m)</span> <span data-bind="text:geometry().radius"></span>
            </div>

            <div style="display:none;" class="mt-2 row controls-row  propertyGroup">
                <span class="label">GeoJSON</span> <span data-bind="text:ko.toJSON(geometry())"></span>
            </div>

            <div class="mt-2 row controls-row rectangleProperties propertyGroup">
                <span class="label label-success">Latitude (SW)</span> <span data-bind="text:geometry().minLat"></span>
                <span class="label label-success">Longitude (SW)</span> <span data-bind="text:geometry().minLon"></span>
            </div>
            <div class="mt-2 row controls-row rectangleProperties propertyGroup">
                <span class="label label-success">Latitude (NE)</span> <span data-bind="text:geometry().maxLat"></span>
                <span class="label label-success">Longitude (NE)</span> <span data-bind="text:geometry().maxLon"></span>
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
        spatialWms: '${grailsApplication.config.getProperty('spatial.geoserverUrl')}'
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
    <g:if test="${project}">
        projects : ['${raw(project.projectId)}'],
    </g:if>
    <g:else>
        projects : <fc:modelAsJavascript model="${site?.projects}" default="[]"/>
    </g:else>
    };


    (function(){

        //retrieve serialised model
        siteViewModel = new SiteViewModelWithMapIntegration(savedSiteData);
        window.validateSiteExtent = siteViewModel.attachExtentValidation()

        ko.applyBindings(siteViewModel, document.getElementById("sitemap"));

        init_map({
            spatialService: SERVER_CONF.spatialService,
            spatialWms: SERVER_CONF.spatialWms,
            mapContainer: 'mapForExtent'
        });

        siteViewModel.mapInitialised(window);

    }());

    return siteViewModel;
}
</asset:script>
