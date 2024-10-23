<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>My Projects | MERIT</title>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
        projectViewUrl: "${createLink(controller:'project', action:'index')}",
        projectUpdateUrl: "${createLink(controller:'project', action:'ajaxUpdate')}",
        projectReportsUrl:"${createLink(controller: 'project', action:'reportingHistory')}",
        userProjectsUrl:"${createLink(action:'userProjects')}",
        organisationViewUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${assetPath(src:'/')}"
        },
        here = window.location.href;

    </script>
    <asset:stylesheet src="my-projects.css"/>
</head>
<body>
<div id="wrapper" class="${containerType}">
    <g:if test="${flash.error || error}">
        <g:set var="error" value="${flash.error?:user?.error}"/>
        <div class="row">
            <div class="alert alert-danger large-space-before">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <span>Error: ${error}</span>
            </div>
        </div>
    </g:if>
    <g:else>


        <h2>My Projects</h2>
        <g:render template="/shared/reports"/>
        <div class="row ">
            <div class="col-sm-6">
                <g:if test="${memberManagementUnits}">
                    <h4>My Management Units</h4>
                    <ul class="management-unit-list">
                        <g:each in="${memberManagementUnits}" var="managementUnit">
                            <li><a href="${createLink(controller:'managementUnit', action:'index', id:managementUnit.managementUnitId)}">${managementUnit.name?.encodeAsHTML()}</a></li>
                        </g:each>

                    </ul>
                </g:if>
            </div>
            <div class="col-sm-6">
                <g:if test="${memberPrograms}">
                    <h4>My Programs</h4>
                    <ul class="program-list">
                        <g:each in="${memberPrograms}" var="program">
                            <li><a href="${createLink(controller:'program', action:'index', id:program.programId)}">${program.name?.encodeAsHTML()}</a></li>
                        </g:each>

                    </ul>
                </g:if>
            </div>
            <div class="col-sm-6 organisations">
                <g:if test="${memberOrganisations}">
                    <h4>My Organisations</h4>
                    <ul class="organisation-list">
                        <g:each var="p" in="${memberOrganisations}">
                            <li><g:link controller="organisation" id="${p.organisation?.organisationId}">${p.organisation?.name?.encodeAsHTML()}</g:link></li>
                        </g:each>
                    </ul>
                </g:if>

                <h4>My Favourite Projects</h4>
                <g:if test="${starredProjects}">
                    <ul class="favourite-projects-list">
                        <g:each var="p" in="${starredProjects}">
                            <li><g:link controller="project" id="${p.projectId}">${p.name?.encodeAsHTML()}</g:link></li>
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
<asset:javascript src="my-projects-manifest.js"/>
<asset:deferredScripts/>
<script>
    $(function () {
        $('.tooltips').tooltip({placement: "right"});
    });
</script>
</body>
</html>
