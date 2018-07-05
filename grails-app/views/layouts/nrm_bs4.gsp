%{--
  - Copyright (C) 2013 Atlas of Living Australia
  - All Rights Reserved.
  -
  - The contents of this file are subject to the Mozilla Public
  - License Version 1.1 (the "License"); you may not use this file
  - except in compliance with the License. You may obtain a copy of
  - the License at http://www.mozilla.org/MPL/
  -
  - Software distributed under the License is distributed on an "AS
  - IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
  - implied. See the License for the specific language governing
  - rights and limitations under the License.
  --}%

<%--
  Grails Layout for NRM skin/template, based on http://www.nrm.gov.au/
  User: dos009@csiro.au
  Date: 08/07/13
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="au.org.ala.merit.SettingPageType" %>
<!DOCTYPE html>
<!--[if IE 7]><html lang="en" class="ie ie7"><![endif]-->
<!--[if IE 8]><html lang="en" class="ie ie8"><![endif]-->
<!--[if IE 9]><html lang="en" class="ie ie9"><![endif]-->
<!--[if !IE]><!--><html lang="en"><!--<![endif]-->
<head>
    <link href="${grailsApplication.config.ala.baseURL ?: 'http://www.ala.org.au'}/wp-content/themes/ala2011/images/favicon.ico"
          rel="shortcut icon"/>
    <title><g:layoutTitle/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Oswald:300" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400italic,600,700" rel="stylesheet"
          type="text/css">
    <g:layoutHead/>
    <g:set var="containerType" scope="request" value="${containerType ?: 'container'}"/>
    <script type="text/javascript">
        if (fcConfig) {
            fcConfig.healthCheckUrl = "${createLink(controller: 'ajax', action:'keepSessionAlive')}";
        }
    </script>
</head>

<body class="${pageProperty(name: 'body.class')}" id="${pageProperty(name: 'body.id')}"
      onload="${pageProperty(name: 'body.onload')}">
<g:set var="introText"><fc:getSettingContent settingType="${SettingPageType.INTRO}"/></g:set>
<g:set var="userLoggedIn"><fc:userIsLoggedIn/></g:set>
<g:if test="${fc.announcementContent()}">
    <div id="announcement">
        ${fc.announcementContent()}
    </div>
</g:if>

<div class="page-header page-header-bs4">
    <g:if test="${fc.currentUserDisplayName()}">
        <div id="logout-warning" class="d-none">
            <div class="alert alert-error text-center">
                <strong>You have logged out of MERIT from another tab.  Any changes you have made will not be saved to the server until you log back in.</strong>
                <fc:loginInNewWindow>Click here to login again (opens a new window)</fc:loginInNewWindow>
            </div>
        </div>
    </g:if>

    <div class="navbar navbar-static-top navbar-expand-md navbar-light" id="header">

        <g:if test="${hubConfig.logoUrl}">
            <div class="navbar-nav logo">

                <a href="${createLink(controller: "home")}">
                    <asset:image src="ag-Inline_W.png" alt="${hubConfig.title}"/>
                </a>

                <g:if test="${hubConfig.title}"><div class="d-flex align-items-center"><span
                        class="merit">${hubConfig.title}</span></div></g:if>
            </div>
        </g:if>
        <div class="ml-md-auto text-right">
            <g:if test="${fc.currentUserDisplayName()}">
                <div class="greeting text-right">G'day <fc:currentUserDisplayName/></div>
            </g:if>

            <div class="btn-group login-logout">
                <fc:loginLogoutButton
                        loginReturnToUrl="${createLink(controller:'home', action:'login', absolute:true)}"
                        logoutReturnToUrl="${grailsApplication.config.grails.serverURL}"
                        logoutUrl="${createLink(controller: 'logout', action: 'logout')}"
                                      cssClass="${loginBtnCss}"/>
            </div>

        </div>

    </div><!--/.navbar -->

    <div class="page-header-menu">


        <div id="dcNav" class="clearfix ">

            <div class="navbar navbar-expand-md navbar-light">

                %{--<ul class="navbar-nav">--}%
                %{--<li><a href="${g.createLink(controller: 'home')}" class="active hidden-lg"><i class="icon-home">&nbsp;</i>&nbsp;Home</a></li>--}%
                %{--</ul>--}%
                %{--<a class="btn navbar-btn" data-toggle="collapse" data-target=".navbar-collapse">--}%
                %{--<span class="icon-bar"></span>--}%
                %{--<span class="icon-bar"></span>--}%
                %{--<span class="icon-bar"></span>--}%
                %{--</a>--}%

                    <ul class="nav navbar-nav mr-auto">
                        <fc:navbar active="${pageProperty(name: 'page.topLevelNav')}"
                                   items="${['home', 'projectExplorer', 'about', 'help', 'contacts']}"/>



                    </ul>
                <form class="form-inline ml-auto">
                    <span id="buttonBar">
                        <g:render template="/layouts/nrmUserButtons"/>
                        <g:pageProperty name="page.buttonBar"/>
                    </span>
                </form>
                <g:form controller="search" method="GET" class="search merit">

                        <input aria-label="Search MERIT" type="text" name="query" id="keywords" placeholder="Search MERIT"
                               value="${params.query ? params.query.encodeAsHTML() : ''}">
                        <input type="submit" value="search" class="search button">

                </g:form>
            </div><!-- /.navbar-inner -->
        </div>
    </div>

</div>

<div id="content" class="clearfix">
    <g:layoutBody/>
</div><!-- /#content -->

<div id="footer">
    <div id="footer-wrapper">
        <div class="${containerType}">
            <fc:footerContent/>
        </div>

        <div class="${containerType}">
            <div class="large-space-before">
                <button class="btn btn-mini" id="toggleFluid">toggle fixed/fluid width</button>
                <g:if test="${userLoggedIn && introText}">
                    <button class="btn btn-mini" type="button" data-toggle="modal"
                            data-target="#introPopup">display user intro</button>
                </g:if>
            </div>
        </div>

    </div>

    <script>
        // Prevent console.log() killing IE
        if (typeof console == "undefined") {
            this.console = {
                log: function () {
                }
            };
        }

        $(document).ready(function (e) {

            $.ajaxSetup({cache: false});

            $("#btnLogout").click(function (e) {
                window.location.href = "${createLink(controller: 'logout', action:'index')}";
                return false;
            });

            $(".btnAdministration").click(function (e) {
                window.location.href = "${createLink(controller: 'admin')}";
                return false;
            });

            $(".btnProfile").click(function (e) {
                window.location.href = "${createLink(controller: 'project', action:'mine')}";
                return false;
            });

            $("#toggleFluid").click(function (el) {
                var fluidNo = $('div.container-fluid').length;
                var fixNo = $('div.container').length;
                //console.log("counts", fluidNo, fixNo);
                if (fluidNo > fixNo) {
                    $('div.container-fluid').addClass('container').removeClass('container-fluid');
                } else {
                    $('div.container').addClass('container-fluid').removeClass('container');
                }
            });

            // Set up a timer that will periodically poll the server to keep the session alive
            var intervalSeconds = 5 * 60;

            setInterval(function () {
                $.ajax("${createLink(controller: 'ajax', action:'keepSessionAlive')}").done(function (data) {
                });
            }, intervalSeconds * 1000);

        }); // end document ready

    </script>

    <g:if test="${grailsApplication.config.bugherd.integration}">
        <script>
            (function (d, t) {
                var bh = d.createElement(t), s = d.getElementsByTagName(t)[0];
                bh.type = 'text/javascript';
                bh.src = '//www.bugherd.com/sidebarv2.js?apikey=cqoc7xdguryihxalktg0mg';
                s.parentNode.insertBefore(bh, s);
            })(document, 'script');
        </script>
    </g:if>
<!-- current env = ${grails.util.Environment.getCurrent().name} -->
    <g:if test="${grails.util.Environment.getCurrent().name =~ /test|prod/}">
        <script type="text/javascript">

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-4355440-1']);
            _gaq.push(['_setDomainName', 'ala.org.au']);
            _gaq.push(['_trackPageview']);

            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();

        </script>
    </g:if>

</body>
</html>