<%@ page import="net.sf.json.JSON; org.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="nrm_bs4"/>
  <title> ${create ? 'New' : ('Edit | ' + site?.name?.encodeAsHTML())} | Sites | MERIT</title>
  <style type="text/css">
    legend {
        border: none;
        margin-bottom: 5px;
    }
    h1 input[type="text"] {
        color: #333a3f;
        font-size: 28px;
        /*line-height: 40px;*/
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        height: 42px;
    }
    .no-border { border-top: none !important; }
  </style>
    <script>
    var fcConfig = {
        spatialService: '${createLink(controller:'proxy',action:'feature')}',
        intersectService: "${createLink(controller: 'proxy', action: 'intersect')}",
        featuresService: "${createLink(controller: 'proxy', action: 'features')}",
        featureService: "${createLink(controller: 'proxy', action: 'feature')}",
        spatialWms: "${grailsApplication.config.spatial.geoserverUrl}",
        geocodeUrl: "${grailsApplication.config.google.geocode.url}",
        siteMetaDataUrl: "${createLink(controller:'site', action:'lookupLocationMetadataForSite')}",
        <g:if test="${project}">
            pageUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'site', action:'createForProject', params:[projectId:project.projectId,checkForState:true])}",
            projectUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'project', action:'index', id:project.projectId)}",
        </g:if>
        <g:elseif test="${site}">
            pageUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'site', action:'edit', id: site?.siteId, params:[checkForState:true])}",
        </g:elseif>
        <g:else>
            pageUrl : "${grailsApplication.config.grails.serverName}${createLink(controller:'site', action:'create', params:[checkForState:true])}",
        </g:else>
        sitePageUrl : "${createLink(action: 'index', id: site?.siteId)}",
        homePageUrl : "${createLink(controller: 'home', action: 'index')}",
        ajaxUpdateUrl: "${createLink(action: 'ajaxUpdate', id: site?.siteId)}",
        returnTo: "${createLink(controller: 'project', action: 'index', id: project?.projectId)}"
        },
        here = window.location.href;

    </script>
    <asset:stylesheet src="site-bs4.css"/>
</head>
<body>
    <div class="${containerType} validationEngineContainer" id="validation-container">
        <div aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
                <li class="breadcrumb-item">Sites</li>
                <g:if test="${project}">
                    <li class="breadcrumb-item active">Create new site for ${project?.name?.encodeAsHTML()}</li>
                </g:if>
                <g:elseif test="${create}">
                    <li class="breadcrumb-item active">Create</li>
                </g:elseif>
                <g:else>
                    <li class="breadcrumb-item">
                        <g:link controller="site" action="index" id="${site?.siteId}">
                            <span data-bind="text: name">${site?.name?.encodeAsHTML()}</span>
                        </g:link>
                    </li>
                    <li class="breadcrumb-item active">Edit</li>
                </g:else>
            </ol>
        </div>

        <g:render template="map" />
        <div class="row p-2">
            <div class="form-actions col-sm-12">
                <button type="button" id="save" class="ml-2 btn btn-sm btn-primary">Save changes</button>
                <button type="button" id="cancel" class="btn btn-sm btn-danger">Cancel</button>
            </div>
        </div>

    </div>
    <g:if env="development">
    <div class="${containerType}">
        <div class="expandable-debug">
            <hr />
            <h3>Debug</h3>
            <div>
                <h4>KO model</h4>
                <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                <h4>Activities</h4>
                <pre>${site?.activities?.encodeAsHTML()}</pre>
                <h4>Site</h4>
                <pre>${site?.encodeAsHTML()}</pre>
                <h4>Projects</h4>
                <pre>${projects?.encodeAsHTML()}</pre>
                <h4>Features</h4>
                <pre>${mapFeatures}</pre>
            </div>
        </div>
    </div>
    </g:if>

<asset:script>
    $(function(){

        $('#validation-container').validationEngine('attach', {scroll: false});

        $('.helphover').popover({animation: true, trigger:'hover'});

        var siteViewModel = initSiteViewModel();
        var options = {
            storageKey : 'SITE'+siteViewModel.siteId,
            blockUIOnSave: true,
            blockUISaveMessage: "Saving site...",
            preventNavigationIfDirty: true
        };

        autoSaveModel(siteViewModel, fcConfig.ajaxUpdateUrl, options);

        $('#cancel').click(function () {
            if(siteViewModel.saved()){
                document.location.href = fcConfig.sitePageUrl;
            } else {
                document.location.href = fcConfig.homePageUrl;
            }
        });

        $('#save').click(function () {
            if ($('#validation-container').validationEngine('validate')) {
                siteViewModel.saveWithErrorDetection(
                    function (data) {
                        if(data.status == 'created'){
                        <g:if test="${project}">
                            document.location.href = fcConfig.projectUrl;
                        </g:if>
                        <g:else>
                            document.location.href = fcConfig.sitePageUrl + '/' + json.siteId;
                        </g:else>
                        } else {
                            document.location.href = fcConfig.sitePageUrl;
                        }
                    },
                    function (data) {
                        alert('There was a problem saving this site');
                    }
                );
            }
        });
    });
</asset:script>
<asset:javascript src="site-bs4.js"/>
<asset:javascript src="edit-site-manifest.js"/>
<asset:deferredScripts/>

</body>
</html>
