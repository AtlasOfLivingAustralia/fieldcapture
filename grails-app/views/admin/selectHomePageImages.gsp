<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit | Home Page Images  Admin | MERIT</title>
    <script>
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            homePageImagesUrl: "${g.createLink(controller: 'search', action: 'findPotentialHomePageImages')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            returnTo: "${params.returnTo}"
            };
    </script>
    <asset:stylesheet src="common.css"/>

</head>

<body>
<div class="row-fluid">
    <h3>Nominate Images for Display on the Home Page</h3>

    <g:render template="gallery"/>
</div>
<asset:javascript src="common.js"/>
<asset:javascript src="admin.js"/>
<asset:deferredScripts/>
</body>
</html>