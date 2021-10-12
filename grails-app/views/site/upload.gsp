<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title> Upload | Sites | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.getProperty('google.maps.url')}"></script>
    <script>
            var fcConfig = {
                serverUrl: "${grailsApplication.config.getProperty('grails.serverURL')}",
                spatialBaseUrl: "${grailsApplication.config.getProperty('spatial.baseUrl')}",
                spatialWmsCacheUrl: "${grailsApplication.config.getProperty('spatial.wms.cache.url')}",
                spatialWmsUrl: "${grailsApplication.config.getProperty('spatial.wms.url')}",
                sldPolgonDefaultUrl: "${grailsApplication.config.getProperty('sld.polgon.default.url')}",
                sldPolgonHighlightUrl: "${grailsApplication.config.getProperty('sld.polgon.highlight.url')}",
                saveSitesUrl: "${createLink(action: 'createSitesFromShapefile')}",
                siteUploadProgressUrl: "${createLink(action: 'siteUploadProgress')}",
                cancelSiteUploadUrl: "${createLink(action:'cancelSiteUpload')}"

            },
            returnTo = "${params.returnTo}";
    </script>
    <asset:stylesheet src="site-bs4.css"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <div aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><g:link controller="home">Home</g:link></li>
            <li class="breadcrumb-item">Sites</li>
            <li class="breadcrumb-item active">Upload Sites</li>
        </ol>
    </div>
</div>

<div class="${containerType}">

    <g:if test="${!shapeFileId}">

        <h2>Upload project sites from file</h2>

        <g:if test="${flash.errorMessage || flash.message}">
            <div class="row ml-1">
                <div class="col-sm-5">
                    <div class="alert alert-danger">
                        <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                        ${flash.errorMessage?:flash.message}
                    </div>
                </div>
            </div>
        </g:if>

        <g:uploadForm class="upload-sites" controller="site" action="siteUpload">
            <input type="hidden" name="returnTo" value="${returnTo}">
            <input type="hidden" name="projectId" value="${projectId}">
            <label for="shapefile">Attach shape file (zip format)</label>
            <input id="shapefile" type="file" accept="application/zip, .kml, .kmz" name="shapefile"/>
            <button id="uploadShapeFile" type="button" class="btn btn-sm btn-success" >Upload Shapefile</button>
        </g:uploadForm>
    </g:if>
    <g:else>


    <h3>Create project sites from the shape file</h3>

    <div class="row">
        <div class="well p-3">
            You can select attributes from the uploaded shape file to be used for the name, description and ID for the sites to upload.
            De-select any sites you do not want to upload.
        </div>
    </div>
    <form id="sites">
        <div class="row">

        </div>
        <div class="row mb-3">
            <div class="col-sm-4">
                <label for="nameAttribute">Shapefile attribute to use as the site name:</label>
                <div>
                <select id="nameAttribute" name="nameAttribute" class="form-control form-control-sm input-medium" data-bind="value:nameAttribute,options:attributeNames,optionsCaption:'Select an attribute'"></select>
                </div>
            </div>
            <div class="col-sm-4">
                <label for="descriptionAttribute">Shapefile attribute to use as the site description:</label>
                <div>
                    <select id="descriptionAttribute" class="form-control form-control-sm input-medium" name="descriptionAttribute" data-bind="value:descriptionAttribute,options:attributeNames,optionsCaption:'Select an attribute'"></select>
                </div>
            </div>
            <div class="col-sm-4">
                <label for="externalIdAttribute">Shapefile attribute to use as the site ID:</label>
                <div>
                    <select id="externalIdAttribute" class="form-control form-control-sm input-medium" name="externalIdAttribute" data-bind="value:externalIdAttribute,options:attributeNames,optionsCaption:'Select an attribute'"></select>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top:10px; margin-bottom: 20px;">
           <span class="col-sm-3"> <button class="btn btn-success" data-bind="click:save,disable:selectedCount()<=0">Create sites</button> <button class="btn" data-bind="click:cancel">Cancel</button></span>
        </div>
    </form>

    <div class="row p-3">
    <form id="sites-container" class="overflow-x-scroll">
    <table>
      <thead>
      <tr>
          <th colspan="1"></th>
          <th colspan="3">Properties to include in uploaded sites</th>
          <th data-bind="attr:{colspan:attributeNames().length}">Attributes in uploaded shapefile</th>
      </tr>
      <tr>

          <th><input type="checkbox" name="selectAll" data-bind="checked:selectAll"></th>
          <th>Site name</th>
          <th>Site description</th>
          <th>Site ID</th>

          <!-- ko foreach: attributeNames -->
          <th data-bind="text:$data"></th>
          <!-- /ko -->

      </tr>
      </thead>
      <tbody>
      <!-- ko foreach: { data: sites, as: 'site'} -->
          <tr>
              <td><input type="checkbox" data-bind="checked:selected"></td>
              <td><input type="text" data-bind="value:site.name, enable:selected" data-validation-engine="validate[required]"></td>
              <td><input type="text" data-bind="value:site.description, enable:selected"></td>
              <td><input type="text" data-bind="value:site.externalId, enable:selected"></td>

          <!-- ko foreach: { data: $root.attributeNames, as: 'attributeNames' } -->
              <td data-bind="text:site.attributes[attributeNames]"></td>
          <!-- /ko -->

          </tr>
      <!-- /ko -->
      </tbody>
    </table>
    </form>
    </div>
    </g:else>
</div>

<div class="modal" id="uploadProgress" role="dialog" tabindex="-1">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title"><strong>Uploading sites...</strong></div>
            </div>
            <div class="modal-body">

                <div class="alert alert-danger" data-bind="visible:progressErrors().length">
                    <b>Errors</b>
                    <ul data-bind="foreach:progressErrors">
                        <li>
                           <span data-bind="text:$data.error"></span><span data-bind="if:$data.detail"> <i class="fa fa-question-circle" data-bind="popover:{container:'body', content:$data.detail}"> </i> </span>
                        </li>
                    </ul>
                </div>
                <div data-bind="text:progressText"></div>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped" role="progressbar" data-bind="visible: !finished(), style:{width:progress}"></div>
                    <div class="progress-bar bg-success" role="progressbar" data-bind="visible: finished(), style:{width:progress}"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-warning" type="button" data-bind="click:cancelUpload, visible:!finished()">Cancel</button>
                <button class="btn btn-sm btn-info" type="button" data-bind="visible:finished, click:finish">OK</button>
            </div>
        </div>
    </div>
</div>

<asset:script>
<g:if test="${shapeFileId}">
$(function() {

    var attributeNames = $.parseJSON('${(attributeNames as JSON).encodeAsJavaScript()}');
    var shapes = $.parseJSON('${(shapes as JSON).encodeAsJavaScript()}');
    var shapeFileId = '${shapeFileId.encodeAsJavaScript()}';
    var projectId = '${projectId}';
    var options = {
        siteUploadUrl: fcConfig.siteUploadUrl,
        saveSitesUrl: fcConfig.saveSitesUrl,
        siteUploadProgressUrl: fcConfig.siteUploadProgressUrl,
        cancelSiteUploadUrl: fcConfig.cancelSiteUploadUrl,
        validationContainerSelector: '#sites-container',
        progressSelector: '#uploadProgress',
        returnToUrl: '${params.returnTo}'
        };

    $('#uploadProgress').modal({backdrop:'static', show:false});
    $('#sites-container').validationEngine();
    ko.applyBindings(new SiteUploadViewModel(attributeNames, shapes, projectId, shapeFileId, options));
});
</g:if>
<g:else>
    $(function() {
        $('#uploadShapeFile').click(function() {
            $(this).attr('disabled','disabled');
            $('.upload-sites').submit();
        });
        $("#shapefile").change(function() {
            if ($("#shapefile").val()) {
                $("#uploadShapeFile").removeAttr("disabled");
            }
            else {
                $("#uploadShapeFile").attr("disabled", "disabled");
            }

        }).trigger('change');
    });
</g:else>
</asset:script>
<asset:javascript src="site-bs4.js"/>
<asset:javascript src="site-upload.js"/>
<asset:deferredScripts/>
</body>
</html>
