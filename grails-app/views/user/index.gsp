<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>My Projects | Field Capture</title>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectViewUrl: "${createLink(controller:'project', action:'index')}",
        projectUpdateUrl: "${createLink(controller:'project', action:'ajaxUpdate')}",
        projectReportsUrl:"${createLink(controller: 'project', action:'reportingHistory')}",
        organisationViewUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${resource(dir:'images')}"
        },
        here = window.location.href;

    </r:script>
</head>
<body>
<div id="wrapper" class="${containerType}">
    <g:if test="${flash.error || error}">
        <g:set var="error" value="${flash.error?:user?.error}"/>
        <div class="row-fluid">
            <div class="alert alert-error large-space-before">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <span>Error: ${error}</span>
            </div>
        </div>
    </g:if>
    <g:else>

        <h2>My Projects</h2>
        <g:render template="/shared/reports"/>
        <div class="row-fluid ">
            <div class="span8">

                <h4>Pages recently edited by you</h4>
                <g:if test="${recentEdits}">
                    <table class="table table-striped table-bordered table-condensed">
                        <thead>
                        <tr>
                            <th>Page</th>
                            <th>Name</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        <g:each var="p" in="${recentEdits}">
                            <tr>
                                <td><g:message code="label.${p.entityType}" default="${p.entityType}"/></td>
                                <td><g:link controller="${fc.getControllerNameFromEntityType(entityType: p.entityType)}" id="${p.entityId}">${p.entity?.name?:p.entity?.type?:p.entity?.key}</g:link></td>
                                <td><fc:formatDateString date="${p.date}" inputFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"/></td>
                            </tr>
                        </g:each>
                        </tbody>
                    </table>
                </g:if>
                <g:else>
                    [ No edits found in audit log ]
                </g:else>
            </div>
            <div class="span4">
                <g:if test="${memberOrganisations}">
                    <h4>Your organisations</h4>
                    <ul>
                        <g:each var="p" in="${memberOrganisations}">
                            <li><g:link controller="organisation" id="${p.organisation?.organisationId}">${p.organisation?.name}</g:link></li>
                        </g:each>
                    </ul>
                </g:if>

                <h4>Favourite Projects</h4>
                <g:if test="${starredProjects}">
                    <ul>
                        <g:each var="p" in="${starredProjects}">
                            <li><g:link controller="project" id="${p.projectId}">${p.name}</g:link></li>
                        </g:each>
                    </ul>
                </g:if>
                <g:else>
                    [ No favourites set ]
                </g:else>
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