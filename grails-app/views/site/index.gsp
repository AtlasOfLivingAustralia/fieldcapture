<%@ page import="au.org.ala.merit.SiteService" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${site?.name?.encodeAsHTML()} | Site | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
            siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
            activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
            activityEnterDataUrl: "${createLink(controller: 'activity', action: 'enterData')}",
            activityPrintUrl: "${createLink(controller: 'activity', action: 'print')}",
            activityCreateUrl: "${createLink(controller: 'activity', action: 'createPlan')}",
            activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
            activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
            activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
            spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
            spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
            spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
            sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
            sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
            featureService: "${createLink(controller: 'proxy', action:'feature')}",
            sitesPhotoPointsUrl:"${createLink(controller:'project', action:'projectSitePhotos', id:project.projectId)}",
            useGoogleBaseMap: ${grails.util.Environment.current == grails.util.Environment.PRODUCTION}
            },
            here = window.location.href;
    </script>
    <asset:stylesheet src="site-bs4.css"/>
</head>
<body>
<div class="${containerType}">
    <div aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <g:if test="${project}">
                <li class="breadcrumb-item">
                    <a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}">Project </a>
                </li>
            </g:if>
            <li class="breadcrumb-item active">${site.name?.encodeAsHTML()}</li>
        </ol>
    </div>
    <div class="row space-after">
        <div class="col-sm-6"><!-- left block of header -->
            <g:if test="${flash.errorMessage || flash.message}">
                <div>
                    <div class="alert alert-danger">
                        <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                        ${flash.errorMessage?:flash.message}
                    </div>
                </div>
            </g:if>

            <div class="row ml-1" style="padding-bottom: 10px;">
                <div class="col-sm-12">

                    Site Actions:
                    <div class="btn-group">
                        <g:if test="${site.type != au.org.ala.merit.SiteService.SITE_TYPE_COMPOUND}">
                            <g:link action="edit" id="${site.siteId}"><button type="button" class="btn btn-sm mr-1"><i class="fa fa-edit"></i> Edit Site</button></g:link>
                        </g:if>

                        <a href="${g.createLink(action:'downloadShapefile', id:site.siteId)}">
                            <button type="button" class="btn btn-sm"><i class="fa fa-download"></i> Download ShapeFile</button>
                        </a>
                        <g:if test="${site?.extent?.geometry?.pid}">
                            <a href="${grailsApplication.config.getProperty('spatial.baseUrl')}/?pid=${site.extent.geometry.pid}" class=" ml-1 btn btn-sm"><i class="fa fa-external-link"></i> View in Spatial Portal</a>
                        </g:if>
                    </div>
                </div>
            </div> <!-- end of row -->

            <div>
                <div class="clearfix">
                    <h3 class="siteName">Site: ${site?.name?.encodeAsHTML()}</h3>

                </div>
                <g:if test="${site.description?.encodeAsHTML()}">
                    <div class="clearfix card customCard">
                        <p>${site.description?.encodeAsHTML()}</p>
                    </div>
                </g:if>
            </div>
            <p>
                <span class="label label-info"><g:message code="label.merit.externalID"/>:</span> ${site.externalId?:'Not specified'}
                <span class="label label-info">Type:</span> ${site.type?:'Not specified'}
                <span class="label label-info">Area:</span>
                <g:set var="areaHa" value="${site?.extent?.geometry?.aream2 ? site?.extent?.geometry?.aream2 / 10000 : (site?.extent?.geometry?.area) ? site?.extent?.geometry?.area * 100 : null}"/>
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

        </div>
        <div class="col-sm-6">
            <div id="siteNotDefined" class="d-none pull-right">
                <span class="label label-important">This site does not have a georeference associated with it.</span>
            </div>
            <m:map id="smallMap" class="w-100" style="height:500px;"></m:map>
        </div>
    </div>

    <g:if test="${site.projects}">
        <div class="row ml-1">
            <div class="col-sm-11">
                <g:if test="${project}">
                    <h3>Project: ${project.name.encodeAsHTML()}</h3>
                </g:if>
                <g:else>
                    <g:if test="${site.projects.size() > 1}">
                        <h3>Filter by project</h3>
                        <g:select id="selectedProject" class="input-xxlarge" name="projectId" from="${site.projects}" noSelection="${['null':'All projects...']}" optionKey="projectId" optionValue="name" value="${project?.projectId}"></g:select>
                    </g:if>

                </g:else>
            </div>

        </div>

            <ul class="nav nav-tabs" role="tabList" id="sitesActivityTab">
                <fc:tabList tabs="${tabs}"/>
            </ul>

        <div class="tab-content" id="tabContent">
            <fc:tabContent tabs="${tabs}"/>
        </div>
    </g:if>

    <div class="row ml-1">
        <div class="col-sm-12 metadata">
            <span class="col-sm-6">
                <p><span class="label">Created:</span> ${site.dateCreated}</p>
                <p><span class="label">Last updated:</span> ${site.lastUpdated}</p>
            </span>
        </div>
    </div>
</div>
<asset:script>


        $(function(){

            var site = <fc:modelAsJavascript model="${site}"/>;
            $('#selectedProject').change(function() {
                var projectId = $(this).val();
                var url = fcConfig.siteViewUrl+'/'+site.siteId;
                if (projectId) {
                    url += '?projectId='+projectId;
                }
                document.location.href = url;
            });

            var mapFeatures = $.parseJSON('${mapFeatures?.encodeAsJavaScript()}');
            if (!mapFeatures) {
                bootBox.showAlert("There was a problem obtaining site data");
            }
            else {

                var map = createMap({
                    useAlaMap:true,
                    mapContainerId:'smallMap',
                    useGoogleBaseMap:fcConfig.useGoogleBaseMap,
                    featureServiceUrl: fcConfig.featureService,
                    wmsServerUrl: fcConfig.spatialWmsUrl
                });

                map.replaceAllFeatures([mapFeatures]);
                _.each(site.poi || [], function(poi) {
                    if (poi.geometry) {
                        map.addMarker(poi.geometry.decimalLatitude, poi.geometry.decimalLongitude, poi.name);
                    }
                });

            }


            var poisInitialised = false;
            $('#pois-tab').on('shown', function() {
                if (!poisInitialised) {
                    poisInitialised = true;
                    loadAndConfigureSitePhotoPoints('#pois');
                }
            });


        });


</asset:script>
<asset:javascript src="site-bs4.js"/>
<asset:javascript src="leaflet-manifest.js"/>
<asset:deferredScripts/>

</body>
</html>
