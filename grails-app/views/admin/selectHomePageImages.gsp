<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Edit | Home Page Images  Admin | MERIT</title>
    <r:script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            homePageImagesUrl: "${g.createLink(controller: 'search', action: 'findPotentialHomePageImages')}",
            documentUpdateUrl: "${createLink(controller:"document", action:"documentUpdate")}",
            returnTo: "${params.returnTo}"
            };
    </r:script>
    <r:require modules="knockout,merit_admin"/>

</head>

<body>
<div class="row-fluid">
    <h3>Nominate Images for Display on the Home Page</h3>

    <g:render template="gallery"/>
</div>
</body>
</html>