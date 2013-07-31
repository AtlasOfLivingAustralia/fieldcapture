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

<%@ page import="org.codehaus.groovy.grails.commons.ConfigurationHolder" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="app.version" content="${g.meta(name:'app.version')}"/>
    <meta name="app.build" content="${g.meta(name:'app.build')}"/>
    <meta name="description" content="Atlas of Living Australia"/>
    <meta name="author" content="Atlas of Living Australia">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><g:layoutTitle /></title>

    <r:require modules="application, defaultSkin, app_bootstrap, app_bootstrap_responsive"/>
    <r:layoutResources/>
    <g:layoutHead />
</head>
<body class="${pageProperty(name:'body.class')}" id="${pageProperty(name:'body.id')}" onload="${pageProperty(name:'body.onload')}">

%{--<hf:banner logoutUrl="${grailsApplication.config.grails.serverURL}/logout/logout"/>--}%
  <div id="fixed-footer-wrapper">
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">

            <div class="container-fluid">
                <a class="brand hidden-tablet hidden-phone">Data capture prototype</a>

                <div class="nav-collapse collapse">
                    <div class="navbar-text pull-right">
                        <span id="buttonBar">
                            <fc:currentUserDisplayName/>&nbsp;<button class="btn btn-small" id="btnLogout"><i class="icon-off"></i><span class="hidden-tablet hidden-phone">&nbsp;Logout</span></button>
                            <button class="btn btn-small btn-info" id="btnProfile"><i class="icon-user icon-white"></i><span class="hidden-tablet hidden-phone">&nbsp;My Profile</span></button>
                            <button class="btn btn-warning btn-small" id="btnAdministration"><i class="icon-cog icon-white"></i><span class="hidden-tablet  hidden-phone">&nbsp;Administration</span></button>
                            <g:pageProperty name="page.buttonBar"/>
                        </span>
                    </div>
                    <fc:navbar active="${pageProperty(name: 'page.topLevelNav')}"/>
                </div><!--/.nav-collapse -->
            </div>
        </div>
    </div>

    <g:layoutBody />
    <div class="push"></div>
  </div>
  %{--<hf:footer/>--}%
<script type="text/javascript">
    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<r:script>
    var pageTracker = _gat._getTracker("UA-4355440-1");
    pageTracker._initData();
    pageTracker._trackPageview();

    // show warning if using IE6
    if ($.browser.msie && $.browser.version.slice(0,1) == '6') {
        $('#header').prepend($('<div style="text-align:center;color:red;">WARNING: This page is not compatible with IE6.' +
                ' Many functions will still work but layout and image transparency will be disrupted.</div>'));
    }
</r:script>
<r:script type="text/javascript">

    $(document).ready(function (e) {

        $.ajaxSetup({ cache: false });

        $("#btnLogout").click(function (e) {
            window.location = "${createLink(controller: 'logout', action:'index')}";
        });

        $("#btnAdministration").click(function (e) {
            window.location = "${createLink(controller: 'admin')}";
        });

        $("#btnProfile").click(function (e) {
            window.location = "${createLink(controller: 'userProfile')}";
        });

    });

</r:script>

<!-- JS resources-->
<r:layoutResources/>

</body>
</html>