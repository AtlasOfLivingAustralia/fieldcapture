<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>${site?.name?.encodeAsHTML()} | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <r:script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
            siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
            activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
            spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
            sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
            sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
            },
            here = "${createLink(controller:'site', action:'index', id:site.siteId)}";
    </r:script>
    <style type="text/css">

    .photo-slider li{ margin: 0 4px; }
    .photo-slider li a{
    display: block;
    border: 7px solid rgba(255,255,255,.1);
    }
    /*.photo-slider ul{*/
    /*opacity: 0;*/
    /*-webkit-transition: opacity 1s ease-out;*/
    /*-moz-transition: opacity 1s ease-out;*/
    /*-ms-transition: opacity 1s ease-out;*/
    /*-o-transition: opacity 1s ease-out;*/
    /*transition: opacity 1s ease-out;*/
    /*}*/

    .photo-slider{
        overflow: hidden;
        height: 240px;
        position: relative;
        padding: 10px;
        background: #444d58;
        margin: 10px auto;
        width: 100%;
        box-sizing: border-box;
    }
    .photo-slider img {
        height: 180px;
        width:auto;
        width:auto;
    }
    .photo-slider a {
        height:200px;
    }
    .photo-slider p {
        padding-left:10px;
        height: 20px;
        background-color:lightgrey;
        color:black;
    }
    </style>
    <r:require modules="knockout,mapWithFeatures,amplify,imageViewer"/>
</head>
<body>
<div class="${containerType}">
    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <li class="active">Sites <span class="divider">/</span></li>
        <li class="active">${site.name?.encodeAsHTML()}</li>
    </ul>
    <div class="row-fluid space-after">
        <div class="span6"><!-- left block of header -->
            <g:if test="${flash.errorMessage || flash.message}">
                <div>
                    <div class="alert alert-error">
                        <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                        ${flash.errorMessage?:flash.message}
                    </div>
                </div>
            </g:if>

            <div>
                <div class="clearfix">
                    <h1 class="pull-left">${site?.name?.encodeAsHTML()}</h1>
                    <g:link style="margin-bottom:10px;" action="edit" id="${site.siteId}" class="btn pull-right title-edit">Edit site</g:link>
                </div>
                <g:if test="${site.description?.encodeAsHTML()}">
                    <div class="clearfix well well-small">
                        <p>${site.description?.encodeAsHTML()}</p>
                    </div>
                </g:if>
            </div>

            <p>
                <span class="label label-info">External Id:</span> ${site.externalId?:'Not specified'}
                <span class="label label-info">Type:</span> ${site.type?:'Not specified'}
                <span class="label label-info">Area:</span>
                <g:set var="areaHa" value="${site?.extent?.geometry?.area ? site?.extent?.geometry?.area * 100 : (site?.extent?.geometry?.aream2) ? site?.extent?.geometry?.aream2 / 10000 : null}"/>
                <g:if test="${areaHa}">
                    <g:formatNumber number="${areaHa}" format="#.0"/> Ha
                </g:if>
                <g:else>
                    Not specified
                </g:else>
            </span>
            </p>

            <g:if test="${site.extent?.geometry}">
                <p>
                    <fc:siteFacet site="${site}" facet="state" label="State/territory:"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="lga" label="Local government area:"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="nrm" label="NRM:"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="elect" label="Electorate:" titleCase="true"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="locality" label="Locality:"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="cmz" label="Conservation management zone:"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="mvg" label="NVIS major vegetation group:"/>
                </p>
                <p>
                    <fc:siteFacet site="${site}" facet="mvs" label="NVIS major vegetation subgroup:"/>
                </p>
            </g:if>

            <div>
                <span class="label label-info">Notes:</span>
                ${site.notes?.encodeAsHTML()}
            </div>

            <g:if test="${site.projects}">
                <div>
                    <h2>Projects associated with this site</h2>
                    <ul style="list-style: none;margin:13px 0;">
                        <g:each in="${site.projects}" var="p" status="count">
                            <li>
                                <g:link controller="project" action="index" id="${p.projectId}">${p.name?.encodeAsHTML()}</g:link>
                                <g:if test="${count < site.projects.size() - 1}">, </g:if>
                            </li>
                        </g:each>
                    </ul>
                </div>
            </g:if>

        </div>
        <div class="span6">
            <div id="siteNotDefined" class="hide pull-right">
                <span class="label label-important">This site does not have a georeference associated with it.</span>
            </div>
            <div id="smallMap" style="width:100%;height:500px;"></div>

            <div style="margin-top:20px;" class="pull-right">
                <a href="${g.createLink(action:'downloadShapefile', id:site.siteId)}" class="btn">
                    <i class="icon-download"></i>
                    Download ShapeFile
                </a>
                <g:if test="${site?.extent?.geometry?.pid}">
                    <a href="${grailsApplication.config.spatial.baseUrl}/?pid=${site.extent.geometry.pid}" class="btn">View in Spatial Portal</a>
                </g:if>
            </div>
        </div>
    </div>
    <g:if test="${site.poi}">
        <h2>Points of interest at this site</h2>
        <g:each in="${site.poi}" var="poi">
        <div class="row-fluid">
            <h4>${poi.name?.encodeAsHTML()}</h4>
            <g:if test="${poi.photos}"><g:render template="sitePhotos" model="${[photos:poi.photos]}"></g:render></g:if> </h4>

        </div>
        </g:each>
    </g:if>

    <g:if test="${site.activities}">
        <h2>Activities at this site</h2>
        <div class="row-fluid">
            <!-- ACTIVITIES -->
            <div class="tab-pane active" id="activity">
                <g:render template="/shared/activitiesListReadOnly" plugin="fieldcapture-plugin"
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
    <g:if env="development">
        <div class="expandable-debug">
            <hr />
            <h3>Debug</h3>
            <div>
                <h4>KO model</h4>
                <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                <h4>Activities</h4>
                <pre>${site.activities?.encodeAsHTML()}</pre>
                <h4>Site</h4>
                <pre>${site}</pre>
                <h4>Projects</h4>
                <pre>${projects?.encodeAsHTML()}</pre>
                <h4>Features</h4>
                <pre>${mapFeatures}</pre>
            </div>
        </div>
    </g:if>
</div>
<r:script>


        $(function(){


            var viewModel  = new SiteViewModelWithMapIntegration(${site});
            ko.applyBindings(viewModel);


            var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');

            init_map_with_features({
                    mapContainer: "smallMap",
                    zoomToBounds:true,
                    zoomLimit:16,
                    featureService: "${createLink(controller:'proxy', action:'feature')}",
                    wmsServer: "${grailsApplication.config.spatial.geoserverUrl}"
                },
                mapFeatures
            );

            if(mapFeatures.features === undefined || mapFeatures.features.length == 0){
                $('#siteNotDefined').show();
            }
            viewModel.renderPOIs();

             $( '.photo-slider' ).mThumbnailScroller({theme:'hover-classic'});
                $('.photo-slider .fancybox').fancybox();
        });

</r:script>
</body>
</html>