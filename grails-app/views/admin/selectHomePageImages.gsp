<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Home Page Images | Admin | MERIT</title>
    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
            homePageImagesUrl: "${g.createLink(controller: 'search', action: 'findPotentialHomePageImages')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            returnTo: "${params.returnTo}"
            };
    </script>
    <asset:stylesheet src="common-bs4.css"/>

</head>

<body>
<div class="row">
    <h3>Nominate Images for Display on the Home Page</h3>
    <content tag="pageTitle">Home Page Images</content>
    <div class="col-sm-12">
        Sort by: <select data-bind="value:sort" class="form-control form-control-sm input-medium"><option value="labels">Thumbs</option><option value="lastUpdated">Date</option></select>
    </div>
    <div class="col-sm-12">
        <g:render template="gallery"/>
    </div>

</div>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="admin.js"/>
<asset:deferredScripts/>
</body>
</html>
