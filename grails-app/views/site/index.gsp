<%@ page import="au.org.ala.merit.SiteService" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>${site?.name?.encodeAsHTML()} | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
            siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
            activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
            activityEnterDataUrl: "${createLink(controller: 'activity', action: 'enterData')}",
            activityPrintUrl: "${createLink(controller: 'activity', action: 'print')}",
            activityCreateUrl: "${createLink(controller: 'activity', action: 'createPlan')}",
            activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
            activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
            activityViewUrl: "${createLink(controller: 'activity', action: 'index')}",
            spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
            sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
            sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
            featureService: "${createLink(controller: 'proxy', action:'feature')}",
            sitesPhotoPointsUrl:"${createLink(controller:'project', action:'projectSitePhotos', id:project.projectId)}",
            },
            here = window.location.href;
    </script>
    <asset:stylesheet src="common.css"/>
    <asset:stylesheet src="project.css"/>
</head>
<body>
<div class="${containerType}">
    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <g:if test="${project}">
            <li>
                <a href="${g.createLink(controller:'project', action:'index', id:project.projectId)}">Project </a> <span class="divider">/</span>
            </li>
        </g:if>
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

            <div class="row-fluid" style="padding-bottom: 10px;">
                <div class="span12">

                    Site Actions:
                    <span class="btn-group">
                        <g:if test="${site.type != au.org.ala.merit.SiteService.SITE_TYPE_COMPOUND}">
                        <g:link action="edit" id="${site.siteId}" class="btn"><i class="fa fa-edit"></i> Edit Site</g:link>
                        </g:if>

                        <a href="${g.createLink(action:'downloadShapefile', id:site.siteId)}" class="btn">
                            <i class="fa fa-download"></i>
                            Download ShapeFile
                        </a>
                        <g:if test="${site?.extent?.geometry?.pid}">
                            <a href="${grailsApplication.config.spatial.baseUrl}/?pid=${site.extent.geometry.pid}" class="btn"><i class="fa fa-external-link"></i> View in Spatial Portal</a>
                        </g:if>
                    </span>
                </div>
            </div>

            <div>
                <div class="clearfix">
                    <h3>Site: ${site?.name?.encodeAsHTML()}</h3>

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
        <div class="span6">
            <div id="siteNotDefined" class="hide pull-right">
                <span class="label label-important">This site does not have a georeference associated with it.</span>
            </div>
            <div id="smallMap" style="width:100%;height:500px;"></div>
        </div>
    </div>

    <g:if test="${site.projects}">
        <div class="row-fluid">
            <hr/>
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
        <div class="row-fluid">
            <ul class="nav nav-tabs big-tabs">
                <fc:tabList tabs="${tabs}"/>
            </ul>
        </div>
        <div class="tab-content">
            <fc:tabContent tabs="${tabs}"/>
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

            var viewModel  = new SiteViewModelWithMapIntegration(site, '${project?project.projectId:'undefined'}');
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

            var poisInitialised = false;
            $('#pois-tab').on('shown', function() {
                if (!poisInitialised) {
                    poisInitialised = true;
                    loadAndConfigureSitePhotoPoints('#pois');
                }
            });


        });


</asset:script>
<asset:javascript src="common.js"/>
<asset:javascript src="projects.js"/>
<asset:deferredScripts/>

</body>
</html>