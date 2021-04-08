<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <g:set var="containerType" scope="request" value="container"/>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}&libraries=visualization"></script>
    <meta name="layout" content="nrm_bs4"/>
    <title>Home | MERIT</title>
    <script>
        var fcConfig = {
            projectExplorerAjaxUrl:'${g.createLink(action:'ajaxProjectExplorer')}',
            spinnerIcon:'${asset.image(src:"spinner.gif")}',
            spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
            sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
            sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
            viewProjectUrl: "${g.createLink(controller: 'project', action:'index')}",
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport', params: params+[showOrganisations:true])}",%{--// Hack for the announcements report to distinguish it from the report on the org page.--}%
            dashboardCategoryUrl: "${g.createLink(controller: 'report', action: 'activityOutputs', params: params+[showOrganisations:true])}"
        };
    </script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <asset:stylesheet src="homepage.css"/>
    <asset:stylesheet src="common-bs4.css"/>
</head>

<body>

<div class="content container">
    <div id="stats-holder">
        <g:render template="/report/statistics"/>
    </div>
    <div class="row-fluid row">
        <div id="latest-news" class="span6 col-sm-6">
            <h4>Latest news</h4>
            <g:render template="/shared/blog" />
        </div>
        <div id="poi" class="span6 col-sm-6">
            <g:render template="/shared/poi"/>
        </div>
    </div>
    <div id="help-links-container">
        <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.HELP_LINKS_TITLE}"/>
        <g:render template="helpLinks"/>
    </div>

    <a id="project-explorer-holder" href="${g.createLink(controller: 'home', action:'projectExplorer')}">
        <button>
            <div id="project-explorer-icon"><i class="text-center fa fa-search"></i></div>
            <h2 class="span12 col-sm-12 text-center project-explorer-text">PROJECT EXPLORER</h2>
        </button>
    </a>
</div>

<asset:javascript src="common.js"/>
<asset:javascript src="homepage.js"/>
<asset:deferredScripts/>
<script>
            $(function() {

                var url = '${g.createLink(controller:'report', action:'statisticsReport')}';

                var working = false;
                $('#stats-holder').on('click', '.show-more-stats', function() {
                    if (!working) {
                        working = true;
                        replaceContentSection('.statistics', url).always(function() { working = false; });
                    }
                });

                if ($('#latest-news').height() > 400) {
                    $('#latest-news').height(400).css('overflow-y', 'scroll');
                }
            });

</script>
</body>

</html>

