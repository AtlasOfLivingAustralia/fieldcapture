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

                <dl class="dl-horizontal">
                    <g:each var="it" in="${user.keySet()}">
                        <dt>${it}</dt>
                        <dd>${user[it]}</dd>
                    </g:each>
                </dl>
            </div>
            <g:if test="${recentProjects}">
                <h4>Recently editted projects</h4>
                <table class="table table-striped table-bordered table-condensed">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <g:each var="p" in="${recentProjects}">
                            <tr>
                                <td><g:link controller="project" id="${p.entity.projectId}">${p.entity?.name}</g:link></td>
                                <td><fc:formatDateString date="${p.date}" inputFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"/></td>
                            </tr>
                        </g:each>
                    </tbody>
                </table>
            </g:if>
            <g:if test="${memberProjects}">
                <h4>Membership projects</h4>
                <table class="table table-striped table-bordered table-condensed">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Member level</th>
                        </tr>
                    </thead>
                    <tbody>
                        <g:each var="p" in="${memberProjects}">
                            <tr>
                                <td><g:link controller="project" id="${p.project?.projectId}">${p.project?.name}</g:link></td>
                                <td>${p.accessLevel?.name}</td>
                            </tr>
                        </g:each>
                    </tbody>
                </table>
            </g:if>
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