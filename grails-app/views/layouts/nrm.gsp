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
<g:if test="${fc.announcementContent()}">
    <div id="announcement">
        ${fc.announcementContent()}
    </div>
</g:if>
<div id="body-wrapper">
    <div class="navbar navbar-inverse navbar-static-top" id="header">
        <div class="navbar-inner">
            <div class="container-fluid">
                <div class="nav logo">
                    <a href="${createLink(uri:"/")}">
                        <r:img dir="css/nrm/images" file="AustGovt_inline_white_on_transparent.png" alt="Australian Government Emblem" />
                    </a>
                </div>
                <div class="nav-collapse collapse">
                    <g:form controller="search" method="GET" class="search pull-right">
                        <p>
                            <label for="keywords"><span class="hide">Full text search</span><input type="text" name="query" id="keywords" value="${params.query}"></label>
                            <input type="hidden" name="collection" value="agencies">
                            <input type="hidden" name="profile" value="nrm_env">
                            <input type="hidden" name="form" value="simple">
                            <input type="submit" value="search" class="search button">
                        </p>
                    </g:form>
                </div>
            </div><!--/.container-fluid -->
            <g:if test="${ grails.util.Environment.getCurrent().name =~ /dev|test/ }">
                <!-- Markup to include ONLY when in test or dev -->
                <div class="row-fluid">
                    <div class="span12" id="testWatermark">
                        This is a test system and any data added in this system will be removed and lost.
                        To add your proper data go to <a href="http://fieldcapture.ala.org.au">http://fieldcapture.ala.org.au</a>
                    </div>
                </div>
            </g:if>
        </div><!--/.navbar-inner -->
    </div><!--/.navbar -->

    <div id="dcNav" class="clearfix ">

        <div class="navbar navbar-inverse container-fluid ">
            %{--<a href="${g.createLink(uri:"/")}" class="brand">MERI data capture prototype</a>--}%
            <ul class="nav">
                <li><a href="/fieldcapture/" class="active hidden-desktop"><i class="icon-home">&nbsp;</i>&nbsp;Home</a></li>
            </ul>
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <div class="nav-collapse collapse">
                <ul class="nav">
                    <fc:navbar active="${pageProperty(name: 'page.topLevelNav')}"/>
                </ul>
                <div class="navbar-form pull-right nav-collapse collapse">
                    <span id="buttonBar">
                        <g:render template="/layouts/nrmUserButtons"/>
                        <g:pageProperty name="page.buttonBar"/>
                    </span>
                </div>
            </div>
        </div><!-- /.navbar-inner -->
    </div>

    <div id="content" class="clearfix">
        <g:layoutBody />
    </div><!-- /#content -->

    <div id="footer">
        <div id="footer-wrapper">
            <div class="container-fluid">
                <fc:footerContent />
            </div>
            <div class="container-fluid">
                <div class="large-space-before">
                    <button class="btn btn-mini" id="toggleFluid">toggle fixed/fluid width</button>
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

        $(".btnAdministration").click(function (e) {
            window.location = "${createLink(controller: 'admin')}";
        });
        $('#btnDashboard').click(function(e) {
            window.location = "${createLink(controller: 'report')}"
        });

        $(".btnProfile").click(function (e) {
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

        // Set up a timer that will periodically poll the server to keep the session alive
        var intervalSeconds = 5 * 60;

        setInterval(function() {
            $.ajax("${createLink(controller: 'ajax', action:'keepSessionAlive')}").done(function(data) {});
        }, intervalSeconds * 1000);

    });


</r:script>

<r:layoutResources/>
</body>
</html>