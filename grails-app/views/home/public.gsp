<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <link rel="stylesheet" href="http://merit.giraffedesign.com.au/css/homepage.css">
    <link rel="stylesheet" href="http://merit.giraffedesign.com.au/css/project-explorer.css">
    <meta name="layout" content="${grailsApplication.config.layout.skin ?: 'main'}"/>
    <title>Home | MERIT</title>
    <r:script disposition="head">
        var fcConfig = {
            projectExplorerAjaxUrl:'${g.createLink(action:'ajaxProjectExplorer')}',
            spinnerIcon:'${r.img(dir: "images", file:"spinner.gif")}',
            spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
            sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
            sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
            viewProjectUrl: "${g.createLink(controller: 'project', action:'index')}",
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport', params: params+[showOrganisations:true])}",%{--// Hack for the announcements report to distinguish it from the report on the org page.--}%
            dashboardCategoryUrl: "${g.createLink(controller: 'report', action: 'activityOutputs', params: params+[showOrganisations:true])}"
        };
    </r:script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <r:require modules="application, sliderpro, knockout,mapWithFeatures,jquery_bootstrap_datatable,js_iso8601,amplify"/>

</head>

<body>

<div class="content container-fluid">
    <div class="row-fluid statistics">
        <g:render template="/report/statistics"/>
    </div>
    <div class="row-fluid">
        <div id="latest-news' class="span6">
            <h4>Latest news</h4>
            <g:render template="/shared/blog"/>
        </div>
        <div id="poi" class="span6">
            <g:render template="/shared/poi"/>
        </div>
    </div>
    <div id="help-links">
        <h4>Helpful links</h4>
        <g:render template="helpLinks"/>
    </div>
    <g:if test="${showProjectExplorer}">
        <g:render template="projectFinder"/>
    </g:if>
    <g:else>
    <div id="project-explorer-holder">
        <div class="row-fluid">
            <span id="project-explorer-icon" class="span12 text-center"><i class="icon-search"></i></span>
        </div>
        <div class="row-fluid" id="projectExplorerHolder">
            <span class="span12 text-center">PROJECT EXPLORER</span>
        </div>
        <r:script>
            $(function() {
                var $projectExplorerHolder = $('#project-explorer-holder');
                $projectExplorerHolder.on('click', function() {

                    $('#project-explorer-icon').html(fcConfig.spinnerIcon);
                    var url = fcConfig.projectExplorerAjaxUrl;

                    $.ajax(url).done(function(data) {
                        $projectExplorerHolder.off('click');
                        $projectExplorerHolder.html(data);
                    });
                });
            });
        </r:script>
    </div>
    </g:else>
</div>


</body>

</html>

