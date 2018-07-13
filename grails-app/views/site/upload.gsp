<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="${hubConfig.skin}"/>
    <title> Upload | Sites | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <script>
            var fcConfig = {
                serverUrl: "${grailsApplication.config.grails.serverURL}",
                spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
                spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
                spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
                sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
                sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
                saveSitesUrl: "${createLink(action: 'createSitesFromShapefile')}",
                siteUploadProgressUrl: "${createLink(action: 'siteUploadProgress')}",
                cancelSiteUploadUrl: "${createLink(action:'cancelSiteUpload')}"

            },
            returnTo = "${params.returnTo}";
    </script>
    <asset:stylesheet src="common.css"/>
</head>
<body>
<div class="${containerType} validationEngineContainer" id="validation-container">
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li>Sites<span class="divider">/</span></li>
        <li class="active">Upload Sites</li>
    </ul>
</div>

<div class="${containerType}">

    <g:if test="${!shapeFileId}">

        <h2>Upload project sites from file</h2>

        <g:if test="${flash.errorMessage || flash.message}">
            <div class="row-fluid">
                <div class="span5">
                    <div class="alert alert-error">
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
            <button id="uploadShapeFile" type="button" class="btn btn-success" >Upload Shapefile</button>
        </g:uploadForm>
    </g:if>
    <g:else>


    <h3>Create project sites from the shape file</h3>

    <div class="row-fluid">
        <div class="well">
            You can select attributes from the uploaded shape file to be used for the name, description and ID for the sites to upload.
            De-select any sites you do not want to upload.
        </div>
    </div>
    <form id="sites">
        <div class="row-fluid">

        </div>
        <div class="row-fluid">

            <fieldset>
                <div class="span4">
                    <label for="nameAttribute">Shapefile attribute to use as the site name:</label>
                    <select id="nameAttribute" name="nameAttribute" data-bind="value:nameAttribute,options:attributeNames,optionsCaption:'Select an attribute'"></select>
                </div>
                <div class="span4">
                    <label for="nameAttribute">Shapefile attribute to use as the site description:</label>
                    <select id="descriptionAttribute" name="descriptionAttribute" data-bind="value:descriptionAttribute,options:attributeNames,optionsCaption:'Select an attribute'"></select>
                </div>
                <div class="span4">
                    <label for="nameAttribute">Shapefile attribute to use as the site ID:</label>
                    <select id="externalIdAttribute" name="externalIdAttribute" data-bind="value:externalIdAttribute,options:attributeNames,optionsCaption:'Select an attribute'"></select>
                </div>
            </fieldset>

        </div>
        <div class="row-fluid" style="margin-top:10px; margin-bottom: 20px;">
           <span class="span3"> <button class="btn btn-success" data-bind="click:save,disable:selectedCount()<=0">Create sites</button> <button class="btn" data-bind="click:cancel">Cancel</button></span>
        </div>
    </form>

    <div class="row-fluid">
    <form id="sites-container">
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

<div class="modal hide" id="uploadProgress">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title"><strong>Uploading sites...</strong></div>
            </div>
            <div class="modal-body">

                <div class="alert alert-danger" data-bind="visible:progressErrors().length">
                    <b>Errors</b>
                    <ul data-bind="foreach:progressErrors">
                        <li data-bind="text:$data"></li>
                    </ul>
                </div>
                <div data-bind="text:progressText"></div>
                <div class="progress progress-popup">
                    <div class="bar" data-bind="style:{width:progress}"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-warning" data-bind="click:cancelUpload, visible:!finished()">Cancel</button>
                <button class="btn btn-info" data-bind="visible:finished, click:finish">OK</button>
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
<asset:javascript src="common.js"/>
<asset:javascript src="site-upload.js"/>
<asset:deferredScripts/>
</body>
</html>