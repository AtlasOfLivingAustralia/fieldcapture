<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Cache Management |  Admin | MERIT</title>
    <asset:stylesheet src="base.css"/>
</head>

<body>
<div class="row-fluid">
    <h3>Caches</h3>
    <ul class="unstyled">
        <g:each in="${cacheRegions}" var="cache">
            <li><form action="clearCache"><button type="submit" class="btn">Clear</button> ${cache} <input type="hidden" name="cache" value="${cache}"></form></li>
        </g:each>

    </ul>

</div>
<asset:javascript src="base.js"/>
</body>
</html>