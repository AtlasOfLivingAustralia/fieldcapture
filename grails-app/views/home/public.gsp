<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <link rel="stylesheet" href="http://merit.giraffedesign.com.au/css/homepage.css">
    <meta name="layout" content="${grailsApplication.config.layout.skin ?: 'main'}"/>
    <title>Home | MERIT</title>
    <r:script disposition="head">
        var fcConfig = {
            projectExplorerAjaxUrl:'${g.createLink(action:'ajaxProjectFinder')}',
            spinnerIcon:'${r.img(dir: "images", file:"spinner.gif")}'
        };
    </r:script>
    <r:require modules="application, sliderpro"/>

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
    <div id="project-explorer-holder">
        <div class="row-fluid">
            <span id="project-explorer-icon" class="span12 text-center"><i class="icon-search"></i></span>
        </div>
        <div class="row-fluid" id="projectExplorerHolder">
            <span class="span12 text-center">PROJECT EXPLORER</span>
        </div>
    </div>
</div>

<r:script>
    $(function() {
        var $projectExplorerHolder = $('#project-explorer-holder');
        $projectExplorerHolder.on('click', function() {

            console.log('clicked!');
            $('#project-explorer-icon').html(fcConfig.spinnerIcon);
            var url = fcConfig.projectExplorerAjaxUrl;

            $.ajax(url).done(function(data) {
                $projectExplorerHolder.off('click');
                $projectExplorerHolder.html(data);
            });
       });
    });
</r:script>
</body>

</html>

