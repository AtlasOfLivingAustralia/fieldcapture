<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="au.org.ala.fieldcapture.SettingPageType; org.codehaus.groovy.grails.commons.ConfigurationHolder" %>
<!DOCTYPE html>
<head>
    <title><g:layoutTitle /></title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <style type="text/css">
        input[type=checkbox] {  -webkit-transform: scale(1.5); }
        .checkbox-list label { min-height: 40px; }
    </style>
    <r:require modules="nrmSkin, jquery_cookie"/>
    <r:layoutResources/>
    <g:layoutHead />
</head>

<body>

<div id="content" class="clearfix">
    <g:layoutBody />
</div>

<r:layoutResources/>
</body>
</html>