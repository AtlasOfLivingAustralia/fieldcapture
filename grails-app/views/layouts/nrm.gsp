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
                            <input type="text" name="query" id="keywords">
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
            <a class="brand hidden-tablet hidden-phone">MERI Data capture prototype</a>
            <div class="nav-collapse collapse">
                <div class="navbar-text pull-right">
                    <span id="buttonBar">
                        mark.woolston@csiro.au&nbsp;<button class="btn btn-small" id="btnLogout"><i class="icon-off"></i><span class="hidden-tablet hidden-phone">&nbsp;Logout</span></button>
                        <button class="btn btn-small btn-info" id="btnProfile"><i class="icon-user icon-white"></i><span class="hidden-tablet hidden-phone">&nbsp;My Profile</span></button>
                        <button class="btn btn-warning btn-small" id="btnAdministration"><i class="icon-cog icon-white"></i><span class="hidden-tablet  hidden-phone">&nbsp;Administration</span></button>
                        <g:pageProperty name="page.buttonBar"/>
                    </span>
                </div>
                <fc:navbar active="${pageProperty(name: 'page.topLevelNav')}"/>
                %{--<ul class="horizontal">--}%
                %{--<li class="home first"><a id="pn-1" href="/index.html" class="">Home</a></li>--}%
                %{--<li class="major" id="pn-funding"><a id="pn-2" href="/funding/index.html" class="">Funding</a></li>--}%
                %{--<li class="major no-mega current" id="pn-projects"><a id="pn-3" href="/projects/index.html" class="">Projects</a></li>--}%
                %{--<li class="major" id="pn-about"><a id="pn-4" href="/about/index.html" class="">About</a></li>--}%
                %{--<li class="major" id="pn-resources"><a id="pn-5" href="/resources/index.html" class="">Resources</a></li>--}%
                %{--<li class="major no-mega" id="pn-news"><a id="pn-6" href="/news/index.html" class="">News &amp; media</a></li>--}%
                %{--<li class="major last hover" id="pn-contact"><a id="pn-7" href="/contact/index.html" class="">Contact</a></li>--}%
                %{--</ul>--}%
            </div>
        </div><!-- /.nav -->
    </div>

    <div id="content" class="clearfix">
        <g:layoutBody />
    </div><!-- /#content -->

    <div id="footer">
        <div id="footer-wrapper">
            %{--<div class="stay-connected">--}%
                %{--<h2>Stay connected</h2>--}%
                %{--<ul class="horizontal">--}%

                    %{--<li class="email"> <a href="/news/subscribe.html">Subscribe to receive<br>--}%
                        %{--email alerts</a> </li>--}%
                    %{--<li class="facebook"> <a href="http://www.facebook.com/CaringforourCountry">Join us on Facebook</a> </li>--}%
                    %{--<li class="twitter"> <a href="http://twitter.com/#!/C4oC">Follow us on Twitter</a> </li>--}%
                    %{--<li class="rss"> <a href="/news/news.xml">Subscribe to RSS</a><br>--}%
                        %{--<a class="what" href="/news/rss.html">(what is RSS?)</a></li>--}%
                %{--</ul>--}%
            %{--</div>--}%

            %{--<div class="footer-nav">--}%
                %{--<div>--}%
                    %{--<h3><a href="/funding/index.html">Funding options</a></h3>--}%
                    %{--<ul class="link-list">--}%
                        %{--<li>--}%
                            %{--<a href="/funding/environment/index.html">Sustainable Environment</a>--}%
                        %{--</li>--}%
                        %{--<li>--}%
                            %{--<a href="/funding/agriculture/index.html">Sustainable Agriculture</a></li>--}%
                        %{--<li><a href="/funding/reef-rescue/index.html">Reef Rescue</a></li>--}%
                        %{--<li>--}%
                            %{--<a href="/funding/regional/index.html">Regional Delivery</a></li>--}%
                    %{--</ul>--}%
                %{--</div>--}%
                %{--<div>--}%
                    %{--<h3><a href="/funding/meri/index.html">Reporting</a></h3>--}%
                    %{--<ul class="link-list">--}%
                        %{--<li>--}%
                            %{--<a href="/funding/meri/index.html">Monitoring, Evaluation, Reporting and Improvement (MERI) strategy</a></li>--}%
                    %{--</ul>                    %{--<h3><a href="/funding/meri/index.html">Reporting</a></h3>--}%
                    %{--<ul class="link-list">--}%
                        %{--<li>--}%
                            %{--<a href="/funding/meri/index.html">Monitoring, Evaluation, Reporting and Improvement (MERI) strategy</a></li>--}%
                    %{--</ul>--}%
                %{--</div>--}%
                %{--<div>--}%
                    %{--<h3><a href="/funding/approved/index.html">Approved grants</a></h3>--}%
                    %{--<ul class="link-list">--}%
                        %{--<li>--}%
                            %{--<a href="/funding/approved/2012-13/index.html">2012-13 approved grants</a>--}%
                        %{--</li>--}%
                        %{--<li>--}%
                            %{--<a href="/funding/approved/2011-12/index.html">2011-12 approved grants</a>--}%
                        %{--</li>--}%
                        %{--<li>--}%
                            %{--<a href="/funding/approved/2010-11/index.html">2010-11 approved grants</a>--}%
                        %{--</li>--}%
                        %{--<li>--}%
                            %{--<a href="/funding/approved/2009-10/index.html">2009-10 approved grants</a>--}%
                        %{--</li>--}%
                    %{--</ul>--}%
                %{--</div>--}%
                %{--<div>--}%
                    %{--<h3><a href="/resources/index.html">Key documents</a></h3>--}%
                    %{--<ul class="link-list">--}%
                        %{--<li><a href="/about/caring/prospectus.html" target="_blank">One Land - Many Stories: Prospectus of Investment</a></li>--}%
                        %{--<li><a href="/about/caring/agriculture.html">Sustainable Agriculture stream: strategic  directions 2013-2018</a></li>--}%
                        %{--<li>--}%
                            %{--<a href="/resources/index.html#outline">Caring for our Country: An Outline for the Future: 2013-18</a></li>--}%
                    %{--</ul>--}%
                %{--</div>--}%

                %{--<div class="last">--}%
                    %{--<h3><a href="/about/key-investments/index.html">Key investments</a></h3>--}%
                    %{--<ul class="link-list">--}%
                        %{--<li><a href="/about/key-investments/indigenous.html">Indigenous projects</a></li>--}%
                        %{--<li><a href="/about/key-investments/landcare.html">Landcare and Sustainable Farm Practices</a></li>--}%
                        %{--<li><a href="/about/key-investments/reef-rescue.html">Reef rescue</a></li>--}%
                        %{--<li><a href="/about/key-investments/nrs.html">National Reserve System</a></li>--}%
                        %{--<li><a href="/about/key-investments/other.html">Other significant projects</a></li>--}%
                    %{--</ul>--}%
                %{--</div>--}%
            %{--</div>--}%

            %{--<div class="nav-copyright">--}%
                %{--<div class="nav">--}%
                    %{--<ul class="horizontal">--}%
                        %{--<li><strong>Key&nbsp;&nbsp;</strong></li>--}%
                        %{--<li><span class="external" title="External link">&nbsp;</span>&nbsp;Links to another website&nbsp;&nbsp;</li>--}%
                        %{--<li><span class="popup" title="Opens in a new browser window">&nbsp;</span> Opens a pop-up window&nbsp;&nbsp;</li>--}%
                        %{--<li><a href="/contact/index.html">Contact us</a></li>--}%
                        %{--<li><a href="/about/disclaimer.html">Disclaimer</a></li>--}%
                        %{--<li><a href="/about/privacy.html">Privacy</a></li>--}%
                        %{--<li><a href="/about/accessibility.html">Accessibility</a></li>--}%
                        %{--<li><a href="http://www.environment.gov.au/foi/index.html">FOI<span class="external" title="External link">&nbsp;</span></a></li>--}%
                    %{--</ul>--}%
                %{--</div>--}%
                %{--<p class="contentinfo">© 2013 <a href="/about/copyright.html">Commonwealth of Australia</a></p>--}%
            %{--</div>--}%

            <div class="container-fluid">
                <p>Caring for our Country is an Australian Government initiative jointly administered by the Australian Government<br>
                    <a href="http://www.daff.gov.au/">Department of Agriculture, Fisheries and Forestry</a> and the <a href="http://www.environment.gov.au/index.html">Department of Sustainability, Environment, Water, Population and Communities</a><br>
                    %{--Last updated: Tuesday, 29-Nov-2011 19:58:28 EST--}%
                </p>
            </div>
            <div class="container-fluid">
                <div class="large-space-before">
                    <button class="btn btn-mini" id="toggleFluid">toggle fixed/fluid width</button>
                    <div class="large-space-before">&copy; 2013 <a href="/about/copyright.html">Commonwealth of Australia</a></div>
                </div>
            </div>
        </div>

    </div>
</div><!-- /#body-wrapper -->

<r:script>
    $(window).load(function() {
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