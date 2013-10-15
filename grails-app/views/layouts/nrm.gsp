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
<%@ page import="org.codehaus.groovy.grails.commons.ConfigurationHolder" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title><g:layoutTitle /></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <r:require modules="nrmSkin"/>
    <r:layoutResources/>
    <g:layoutHead />
</head>
<body class="${pageProperty(name:'body.class')}" id="${pageProperty(name:'body.id')}" onload="${pageProperty(name:'body.onload')}">
<div id="body-wrapper">
    <div id="header">
        <div class="container-fluid">
            <div class="row-fluid">
                <div class="logo span6">
                    <a href="${createLink(uri:"/")}">
                        <r:img dir="css/nrm/images" file="gr_logo_wide.png" alt="Caring for our Country" />
                    </a>
                </div>
                <div class="span6 hidden-phone">
                    <g:form controller="search" method="GET" class="search pull-right">
                        <p>
                            <input type="text" name="query" id="keywords" value="${params.query}">
                            <input type="hidden" name="collection" value="agencies">
                            <input type="hidden" name="profile" value="nrm_env">
                            <input type="hidden" name="form" value="simple">
                            <input type="submit" value="search" class="search button">
                        </p>
                    </g:form>
                </div>
            </div>
        </div>
    </div><!-- /#header -->
    <div id="dcNav" class="clearfix">
        <div class="navbar container-fluid">
            <a class="brand hidden-tablet hidden-phone">MERI data capture prototype</a>
            <div class="nav-collapse collapse">
                <div class="navbar-text pull-right">
                    <span id="buttonBar">
                        <g:if test="${fc.userIsLoggedIn()}">
                            <div class="btn-group">
                                <button class="btn btn-small btn-primary" id="btnProfile" title="profile page">
                                    <i class="icon-user icon-white"></i><span class="hidden-tablet hidden-phone">&nbsp;<fc:currentUserDisplayName /></span>
                                </button>
                                <button class="btn btn-small btn-primary dropdown-toggle" data-toggle="dropdown">
                                    <!--<i class="icon-star icon-white"></i>--> My projects&nbsp;&nbsp;<span class="caret"></span>
                                </button>
                                <div class="dropdown-menu pull-right">
                                    <fc:userProjectList />
                                </div>
                            </div>
                            <g:if test="${fc.userInRole(role: "ROLE_ADMIN")}">
                                <div class="btn-group">
                                    <button class="btn btn-warning btn-small" id="btnAdministration"><i class="icon-cog icon-white"></i><span class="hidden-tablet hidden-phone">&nbsp;Administration</span></button>
                                </div>
                            </g:if>
                        </g:if>
                        <div class="btn-group"><fc:loginLogoutButton logoutUrl="${createLink(controller:'logout', action:'logout')}"/></div>
                        <g:pageProperty name="page.buttonBar"/>
                    </span>
                </div>
                <fc:navbar active="${pageProperty(name: 'page.topLevelNav')}"/>
            </div>
        </div><!-- /.nav -->
    </div>

    <div id="content" class="clearfix">
        <g:layoutBody />
    </div><!-- /#content -->

    <div id="footer">
        <div id="footer-wrapper">
            <div class="container-fluid">
                <p>Caring for our Country is an Australian Government initiative jointly administered by the Australian Government<br>
                    <a href="http://www.daff.gov.au/">Department of Agriculture, Fisheries and Forestry</a> and the <a href="http://www.environment.gov.au/index.html">Department of Sustainability, Environment, Water, Population and Communities</a><br/>
                    This site is a prototype  developed by the Atlas of Living Australia in 2013.
                    Report issues to <a href="mailto:support@ala.org.au">support@ala.org.au</a>
                    %{--Last updated: Tuesday, 29-Nov-2011 19:58:28 EST--}%
                </p>
            </div>
            <div class="container-fluid">
                <div class="large-space-before">
                    <button class="btn btn-mini" id="toggleFluid">toggle fixed/fluid width</button>
                    <div class="large-space-before">&copy; 2013 <a href="/about/copyright.html">Commonwealth of Australia</a></div>
                    <div class="stay-connected pull-right">
                        <h2 style="display:none;">Stay connected</h2>
                        <ul class="horizontal">
                            <li class="email"> <a href="http://www.nrm.gov.au/news/subscribe.html">Subscribe to receive<br>
                                email alerts</a> </li>
                            <li class="facebook"> <a href="http://www.facebook.com/CaringforourCountry">Join us on Facebook</a> </li>
                            <li class="twitter"> <a href="http://twitter.com/#!/C4oC">Follow us on Twitter</a> </li>
                            <li class="rss"> <a href="http://www.nrm.gov.au/news/news.xml">Subscribe to RSS</a><br>
                                <a class="what" href="http://www.nrm.gov.au/news/rss.html">(what is RSS?)</a></li>
                        </ul>
                    </div>
            </div>
        </div>

    </div>
</div><!-- /#body-wrapper -->
<r:script>
    // Prevent console.log() killing IE
    if (typeof console == "undefined") {
        this.console = {log: function() {}};
    }

    $(document).ready(function (e) {

        $.ajaxSetup({ cache: false });

        $("#btnLogout").click(function (e) {
            window.location = "${createLink(controller: 'logout', action:'index')}";
        });

        $("#btnAdministration").click(function (e) {
            window.location = "${createLink(controller: 'admin')}";
        });
        $('#btnDashboard').click(function(e) {
            window.location = "${createLink(controller: 'report')}"
        });

        $("#btnProfile").click(function (e) {
            window.location = "${createLink(controller: 'myProfile')}";
        });

        $("#toggleFluid").click(function(el){
            var fluidNo = $('div.container-fluid').length;
            var fixNo = $('div.container').length;
            console.log("counts", fluidNo, fixNo);
            if (fluidNo > fixNo) {
                $('div.container-fluid').addClass('container').removeClass('container-fluid');
            } else {
                $('div.container').addClass('container-fluid').removeClass('container');
            }
        });
    });


</r:script>

<r:layoutResources/>
</body>
</html>