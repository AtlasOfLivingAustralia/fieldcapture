<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <g:set var="containerType" scope="request" value="container"/>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}&libraries=visualization"></script>
    <meta name="layout" content="nrm_bs4"/>
    <title>Home | MERIT</title>
    <script>
        var fcConfig = {
            projectExplorerAjaxUrl:'${g.createLink(action:'ajaxProjectExplorer')}',
            spinnerIcon:'${asset.image(src:"spinner.gif")}',
            spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
            spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
            spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
            sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
            sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
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
    <h1 class="visually-hidden">Monitoring, Evaluation, Reporting and Information Tool (MERIT)</h1>
    <div class="content container">
        <div id="stats-holder">
            <h2 class="visually-hidden">Infographics</h2>
            <div id="statistics-carousel" class="carousel slide" >
                <div class="carousel-inner">
                    <div class="carousel-item stats-page-1 active">
                        <g:render template="/report/statistics"/>
                    </div>
                    <div class="carousel-item stats-page-2">
                        <g:render template="/report/statistics"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <h2 class="visually-hidden">MERIT news and featured project images</h2>
            <div class="col-sm-6">
                <div id="latest-news">
                    <h3>Latest news</h3>
                    <g:render template="/shared/blog" />
                </div>
            </div>
            <div class="col-sm-6">
                <div id="poi">
                    <h3 class="visually-hidden">Featured project images</h3>
                    <g:render template="/shared/poi"/>
                </div>
            </div>

        </div>
        <div id="help-links-container">
            <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.HELP_LINKS_TITLE}"/>
            <g:render template="helpLinks"/>
        </div>
        <a id="project-explorer-holder" href="${g.createLink(controller: 'home', action:'projectExplorer')}">
            <button id="project-explorer-icon">
                <i class="text-center fa fa-search"></i>
                <h2 class="col-sm-12 text-center project-explorer-text">PROJECT EXPLORER</h2>
            </button>
        </a>
    </div>
    <asset:javascript src="common-bs4.js"/>
    <asset:javascript src="homepage.js"/>
    <asset:deferredScripts/>
    <script>
                $(function() {
                    let working = false;
                    const url = '${g.createLink(controller:'report', action:'statisticsReport')}';

                    let page1Visible = true;

                    function showMoreStats() {
                        if (!working) {
                            working = true;
                            $.get(url).done(function(data) {

                                var offscreenPage = $('.stats-page-'+(page1Visible ? '2' : '1'));
                                offscreenPage.find('.statistics').remove();
                                offscreenPage.append($(data));
                                setTimeout(function() {
                                    $('#statistics-carousel').carousel('next');
                                }, 100);

                                page1Visible = !page1Visible;

                            }).always(function() {
                                working = false;
                            });

                        }
                    }

                    $('#stats-holder').on('click', '.show-more-stats', function () {
                        showMoreStats();
                    });

                    const hasStatistics = ${statistics ? 'true' : 'false'};
                    if (!hasStatistics) {
                        showMoreStats();
                    }

                });

    </script>
</body>

</html>
