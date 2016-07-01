<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<!--[if IE 7]><html lang="en" class="ie ie7"><![endif]-->
<!--[if IE 8]><html lang="en" class="ie ie8"><![endif]-->
<!--[if IE 9]><html lang="en" class="ie ie9"><![endif]-->
<!--[if !IE]><!--><html lang="en"><!--<![endif]-->
<head>
    <title><g:layoutTitle /></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <r:require modules="newSkin, nrmSkin, jquery_cookie"/>
    <r:layoutResources/>
    <g:layoutHead />
    <g:set var="containerType" scope="request" value="${containerType?:'container'}"/>
</head>
<body>

<div id="content" class="clearfix">
    <g:layoutBody />
</div><!-- /#content -->

<r:script>
    // Prevent console.log() killing IE
    if (typeof console == "undefined") {
        this.console = {log: function() {}};
    }
</r:script>

<g:if test="${grailsApplication.config.bugherd.integration}">
    <r:script>
        (function (d, t) {
            var bh = d.createElement(t), s = d.getElementsByTagName(t)[0];
            bh.type = 'text/javascript';
            bh.src = '//www.bugherd.com/sidebarv2.js?apikey=cqoc7xdguryihxalktg0mg';
            s.parentNode.insertBefore(bh, s);
        })(document, 'script');
    </r:script>
</g:if>
<!-- current env = ${grails.util.Environment.getCurrent().name} -->
<g:if test="${ grails.util.Environment.getCurrent().name =~ /test|prod/ }">
    <r:script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-4355440-1']);
        _gaq.push(['_setDomainName', 'ala.org.au']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

    </r:script>
</g:if>

<r:layoutResources/>
</body>
</html>