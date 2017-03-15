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
            featureService: "${createLink(controller: 'proxy', action:'feature')}"
            },
            here = window.location.href;
    </r:script>
    <r:require modules="knockout,mapWithFeatures,amplify,imageViewer,jqueryGantt,merit_projects"/>
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

                    Actions:
                    <span class="btn-group">
                        <g:link action="edit" id="${site.siteId}" class="btn"><i class="fa fa-edit"></i> Edit Site</g:link>

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
                    <h1 class="pull-left">${site?.name?.encodeAsHTML()}</h1>

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
            <g:if test="${site.projects.size() > 1}">
                <h3>Filter by project</h3>
                <g:select id="selectedProject" class="input-xxlarge" name="projectId" from="${site.projects}" noSelection="${['null':'All projects...']}" optionKey="projectId" optionValue="name" value="${project?.projectId}"></g:select>
            </g:if>
            <g:else>
                <h3>Filter by project</h3>
                <g:select id="selectedProject" class="input-xxlarge" name="projectId" from="${site.projects}" optionKey="projectId" optionValue="name" value="${project?.projectId}"></g:select>
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

             $( '.photo-slider' ).mThumbnailScroller({theme:'hover-classic'});
             $('.photo-slider .fancybox').fancybox({
                 helpers : {
                    title: {
                        type: 'inside'
                    }
                 },
                 beforeLoad: function() {
                    var el, id = $(this.element).data('caption');

                    if (id) {
                        el = $('#' + id);

                        if (el.length) {
                            this.title = el.html();
                        }
                    }
                 },
                 nextEffect:'fade',
                 previousEffect:'fade'
             });

        });
        $(window).load(function() {
             $('.photo-slider .thumb').each(function() {
                var $caption = $(this).find('.caption');
                $caption.outerWidth($(this).find('img').width());
             });
         });

</r:script>
</body>
</html>