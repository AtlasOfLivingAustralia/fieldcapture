<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<!--[if !IE]><!--><html lang="en"><!--<![endif]-->
<head>
    <link href="${grailsApplication.config.getProperty('ala.baseURL', String, 'http://www.ala.org.au')}/wp-content/themes/ala2011/images/favicon.ico" rel="shortcut icon" />
    <title><g:layoutTitle /></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: white !important;
        }
    </style>
    <g:layoutHead />
    <g:set var="containerType" scope="request" value="${containerType?:'container'}"/>
    <g:if test="${grailsApplication.config.getProperty('analytics.fathom.trackingId')}">
        <script src="https://cdn.usefathom.com/script.js" data-site="${grailsApplication.config.getProperty('analytics.fathom.trackingId')}" defer></script>
    </g:if>
</head>
<body>

<div id="content" class="clearfix">
    <g:layoutBody />
</div><!-- /#content -->

<g:if test="${grailsApplication.config.getProperty('analytics.google.enable')}">
<!-- current env = ${grails.util.Environment.getCurrent().name} -->
<g:if test="${ grails.util.Environment.getCurrent().name =~ /test|prod/ }">
    <asset:script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-4355440-1']);
        _gaq.push(['_setDomainName', 'ala.org.au']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

    </asset:script>
</g:if>
</g:if>
</body>
</html>