<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title>My Projects | Field Capture</title>
    <script>
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        projectViewUrl: "${createLink(controller:'project', action:'index')}",
        projectUpdateUrl: "${createLink(controller:'project', action:'ajaxUpdate')}",
        projectReportsUrl:"${createLink(controller: 'project', action:'reportingHistory')}",
        organisationViewUrl: "${createLink(controller:'organisation', action:'index')}",
        imageLocation:"${assetPath(src:'/')}"
        },
        here = window.location.href;

    </script>
    <asset:stylesheet src="common.js"/>
    <asset:stylesheet src="project.css"/>
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
            <div class="span6">
                <g:if test="${memberPrograms}">
                    <h4>My Management Units</h4>
                    <ul>
                        <g:each in="${memberPrograms}" var="program">
                            <li><a href="${createLink(controller:'rlp', action:'index', id:program.programId)}">${program.name}</a></li>
                        </g:each>

                    </ul>
                </g:if>

            </div>
            <div class="span6">
                <g:if test="${memberOrganisations}">
                    <h4>My Organisations</h4>
                    <ul>
                        <g:each var="p" in="${memberOrganisations}">
                            <li><g:link controller="organisation" id="${p.organisation?.organisationId}">${p.organisation?.name}</g:link></li>
                        </g:each>
                    </ul>
                </g:if>

                <h4>My Favourite Projects</h4>
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
<asset:javascript src="common.js"/>
<asset:javascript src="my-projects.js"/>
<asset:deferredScripts/>
<script>
    $(function () {
        $('.tooltips').tooltip({placement: "right"});
    });
</script>
</body>
</html>