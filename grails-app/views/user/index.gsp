<%--
  Created by IntelliJ IDEA.
  User: dos009
  Date: 5/07/13
  Time: 12:32 PM
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title>User Dashboard | Field Capture</title>
</head>
<body>
<div id="wrapper" class="container-fluid">
    <div class="row-fluid">
        <div class="span12" id="header">
            <h1 class="pull-left">User Dashboard</h1>
        </div>
    </div>
    <g:if test="${flash.error || user?.error}">
        <g:set var="error" value="${flash.error?:user?.error}"/>
        <div class="row-fluid">
            <div class="alert alert-error large-space-before">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <span>Error: ${error}</span>
            </div>
        </div>
    </g:if>
    <g:else>
        <div class="row-fluid ">
            <div class="span12">
                User Info: ${user}
            </div>
        </div>
    </g:else>

</div>
<r:script>
    $(window).load(function () {
        $('.tooltips').tooltip({placement: "right"});
    });
</r:script>
</body>
</html>