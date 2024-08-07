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
<!--[if !IE]><!--><html lang="en"><!--<![endif]-->
<head>
    <link rel="icon" href="https://www.ala.org.au/app/uploads/2019/01/cropped-favicon-32x32.png" sizes="32x32" />
    <link rel="icon" href="https://www.ala.org.au/app/uploads/2019/01/cropped-favicon-192x192.png" sizes="192x192" />
    <title><g:layoutTitle/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Oswald:300" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400italic,600,700" rel="stylesheet"
          type="text/css">
    <g:layoutHead/>
    <g:set var="containerType" scope="request" value="${containerType ?: 'container'}"/>
    <script type="text/javascript">
        if (window.hasOwnProperty("fcConfig")) {
            fcConfig.healthCheckUrl = "${createLink(controller: 'ajax', action:'keepSessionAlive')}";
        }
    </script>
    <g:if test="${grailsApplication.config.getProperty('analytics.fathom.trackingId')}">
        <script src="https://cdn.usefathom.com/script.js" data-site="${grailsApplication.config.getProperty('analytics.fathom.trackingId')}" defer></script>
    </g:if>
</head>

<body class="${pageProperty(name: 'body.class')}" id="${pageProperty(name: 'body.id')}"
      onload="${pageProperty(name: 'body.onload')}">
<g:set var="introText"><fc:getSettingContent settingType="${SettingPageType.INTRO}"/></g:set>
<g:set var="userLoggedIn"><fc:userIsLoggedIn/></g:set>
<g:if test="${fc.announcementContent()}">
    <div id="announcement">
        <fc:announcementContent/>
    </div>
</g:if>
<auth:ifLoggedIn>
    <div id="logout-warning" style="display:none">
        <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.SESSION_TIMEOUT_WARNING}"/>
        <a href="${fc.loginUrl(loginReturnToUrl:createLink(controller: 'home', action: 'close', absolute: true))}" target="loginWindow">Click here to login again (opens a new window)</a>
    </div>
    <div id="network-warning" style="display:none">
        <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.NETWORK_LOST_WARNING}"/>
    </div>

</auth:ifLoggedIn>

<div class="page-header page-header-bs4">
    <div class="navbar navbar-static-top navbar-expand-md navbar-light" id="header">
        <div class="${containerType}">
            <g:if test="${hubConfig.logoUrl}">
                <div class="navbar-nav logo">

                    <a href="${createLink(controller: "home")}">
                        <asset:image src="ag-Inline_W.png" alt="${hubConfig.title}"/>
                        <g:if test="${hubConfig.title}"><span
                                class="merit">${hubConfig.title}</span></g:if>
                    </a>
                </div>
            </g:if>
            <div class="ml-md-auto text-right">
                <g:if test="${fc.currentUserDisplayName()}">
                    <div class="greeting text-right">G'day <fc:currentUserDisplayName/></div>
                    <g:if test="${expiryDate}">
                        <div class="alert alert-warning">
                            Your access is due to expire on ${expiryDate}. Please contact the department if you require an extension.
                        </div>
                    </g:if>
                </g:if>
                <g:else>
                    <div class="btn-group login-logout">
                        <a class="btn btn-small btn-signup" href="${grailsApplication.config.getProperty('user.registration.url')}"><span>Sign up</span></a>
                    </div>
                </g:else>
                <div class="btn-group login-logout">

                    <auth:loginLogout
                            ignoreCookie="true"
                            loginReturnToUrl="${createLink(controller:'home', action:'login', absolute:true)}"
                            logoutReturnToUrl="${grailsApplication.config.getProperty('grails.serverURL')}/"
                            logoutUrl="${createLink(uri:'/logout')}"
                            cssClass="btn btn-small btn-inverse btn-login"/>
                </div>

            </div>
        </div>


    </div><!--/.navbar -->

    <div class="page-header-menu">
    <div class="${containerType}">
        <div id="dcNav" class="clearfix ">

            <nav class="navbar navbar-expand-lg text-light">
                <a href="#" class="navbar-brand hidden-desktop text-light">Home</a>

                <button class="navbar-toggler btn btn-navbar btn-inverse" type="button" data-toggle="collapse" data-target="#nav-items" aria-controls="nav-items" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="text-light fa fa-navicon"></span>
                </button>
                <div class="collapse navbar-collapse" id="nav-items">
                    <ul class="nav navbar-nav mr-auto">
                        <fc:navbar active="${pageProperty(name: 'page.topLevelNav')}"
                                   items="${['home', 'projectExplorer', 'about', 'help', 'contacts']}"/>

                    </ul>
                    <form class="form-inline">
                        %{--                        <span id="buttonBar">--}%
                        <g:render template="/layouts/nrmUserButtons"/>
                        <g:pageProperty name="page.buttonBar"/>
                        %{--                        </span>--}%
                    </form>
                    <g:form controller="search" method="GET" class="search merit">

                        <input aria-label="Search MERIT" type="text" name="query" id="keywords" placeholder="Search MERIT"
                               value="${params.query ? params.query.encodeAsHTML() : ''}">
                        <input type="submit" value="search" class="search button">

                    </g:form>
                </div>
            </nav><!-- /.navbar-inner -->
        </div>
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

            var options = {
                keepSessionAliveUrl: "${g.createLink(controller: 'ajax', action:'keepSessionAlive')}",
                logoutWarningBannerId: 'logout-warning',
                networkWarningBannerId: 'network-warning',
                logoutButtonSelector: 'a.btn-login', // Not a typo, same class as login button.
                loginButtonSelector: 'a.btn-login'
            };
            var loggedIn = false;
            <auth:ifLoggedIn>
            loggedIn = true;
            </auth:ifLoggedIn>
            setupTimeoutWarning(options);

        }); // end document ready

    </script>

    <g:if test="${grailsApplication.config.getProperty('analytics.google.enable')}">
    <!-- current env = ${grails.util.Environment.getCurrent().name} -->
    <g:if test="${grails.util.Environment.current == grails.util.Environment.PRODUCTION}">
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

        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-STM6SLZYD7"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R2MPF6GZK3');
        </script>

    </g:if>
</g:if>
</body>
</html>
