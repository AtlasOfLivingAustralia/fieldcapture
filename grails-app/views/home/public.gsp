<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin ?: 'main'}"/>
    <title>Home | MERIT</title>
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
        <div class="row-fluid">
            <span class="span4">
                QUICK REFERENCE GUIDE
            </span>
            <span class="span4">
                USER GUIDE
            </span>
            <span class="span4">
                MERIT TUTORIAL
            </span>
        </div>
        <div class="row-fluid">
            <span class="span4">
                ACTIVITY REFERENCE
            </span>
            <span class="span4">
                DEMONSTRATOR PROJECT
            </span>
            <span class="span4">
                MORE RESOURCES
            </span>
        </div>
    </div>
    <div id="project-explorer">
        <div class="row-fluid">
            <span class="span12 text-center"><i class="icon-search"></i></span>
        </div>
        <div class="row-fluid">
            <span class="span12 text-center">PROJECT EXPLORER</span>
        </div>
    </div>
</div>
</body>

</html>