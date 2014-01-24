<%@ page import="grails.converters.JSON" %>
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
    <title> Upload | Sites | Field Capture</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}"></script>
    <r:script disposition="head">
            var fcConfig = {
                serverUrl: "${grailsApplication.config.grails.serverURL}",
                spatialBaseUrl: "${grailsApplication.config.spatial.baseUrl}",
                spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
                spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
                sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
                sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}",
                saveSitesUrl: "${createLink(action: 'createSitesFromShapefile')}"

            },
            returnTo = "${params.returnTo}";
    </r:script>
    <r:require modules="knockout,mapWithFeatures,amplify"/>
</head>
<body>
<div class="container-fluid validationEngineContainer" id="validation-container">
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li>Sites<span class="divider">/</span></li>
        <li class="active">Upload Sites</li>
    </ul>
</div>

<div class="container-fluid">

    <g:if test="${!shapeFileId}">
        <h2>Upload a shape file</h2>
        <g:uploadForm id="shapeFileUpload" class="loadPlanData" controller="site" action="uploadShapeFile">
            <input type="hidden" name="returnTo" value="${params.returnTo}">
            <input type="hidden" name="projectId" value="${projectId}">
            <label for="shapefile">Attach shape file (zip format)</label>
            <input id="shapefile" type="file" accept="application/zip" name="shapefile"/>
            <button id="uploadShapeFile" type="button" class="btn btn-success" onclick="$(this).parent().submit();">Upload Shapefile</button>
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
           <span class="span3"> <button class="btn btn-success" data-bind="click:save">Create sites</button> <button class="btn" data-bind="click:cancel">Cancel</button></span>
        </div>
    </form>

    <div class="row-fluid">
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
              <td><input type="text" data-bind="value:site.name"></td>
              <td><input type="text" data-bind="value:site.description"></td>
              <td><input type="text" data-bind="value:site.externalId"></td>

          <!-- ko foreach: { data: $root.attributeNames, as: 'attributeNames' } -->
              <td data-bind="text:site.attributes[attributeNames]"></td>
          <!-- /ko -->

          </tr>
      <!-- /ko -->
      </tbody>
    </table>
    </div>
    </g:else>
</div>
</body>

<r:script>
<g:if test="${shapeFileId}">
var SiteViewModel = function(shape) {
    var self = this;

    self.id = shape.id;
    self.name = ko.observable();
    self.description = ko.observable();
    self.externalId = ko.observable();
    self.selected = ko.observable(true);

    self.attributes = shape.values;

    self.toJS = function() {
        return {
            id: self.id,
            name: self.name(),
            description: self.description(),
            externalId: self.externalId()
        };
    };
};

var SiteUploadViewModel = function() {
    var self = this;
    var attributeNames = $.parseJSON('${(attributeNames as JSON).encodeAsJavaScript()}');
    var shapes = $.parseJSON('${(shapes as JSON).encodeAsJavaScript()}');

    self.nameAttribute = ko.observable('');
    self.descriptionAttribute = ko.observable('');
    self.externalIdAttribute = ko.observable('');

    self.attributeNames = ko.observableArray(attributeNames);
    self.sites = ko.observableArray([]);
    self.selectAll = ko.observable(true);

    self.selectAll.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {site.selected(newValue);});
    });

    self.nameAttribute.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {
            if (newValue) {
                site.name(site.attributes[newValue]);
            }
            else {
                site.name('Site '+i);
            }
        });
    });
    self.descriptionAttribute.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {site.description(site.attributes[newValue]);});
    });
    self.externalIdAttribute.subscribe(function(newValue) {
        $.each(self.sites(), function(i, site) {site.externalId(site.attributes[newValue]);});
    });

    self.save = function() {
        var payload = {};
        payload.shapeFileId = '${shapeFileId.encodeAsJavaScript()}';
        payload.projectId = '${projectId}';
        payload.sites = [];
        $.each(self.sites(), function(i, site) {
            if (site.selected()) {
                payload.sites.push(site.toJS());
            }
        });

        $.ajax({
               url: fcConfig.saveSitesUrl,
               type: 'POST',
               contentType: 'application/json',
               data: JSON.stringify(payload),
               success: function (data) {
                   alert('boo ya');

               },
               error: function () {
                   alert('There was a problem searching for sites.');
               }
          });

    };

    self.cancel = function() {
        document.location.href = "${params.returnTo}";
    }

    $.each(shapes, function(i, obj) {
        self.sites.push(new SiteViewModel(obj));
        console.log(obj);
    });
     $.each(attributeNames, function(i, name) {
        if (name.toUpperCase() === 'NAME') {
            self.nameAttribute(name);
        }
    });

    $.each(attributeNames, function(i, name) {
        if (name.toUpperCase() === 'DESCRIPTION') {
            self.descriptionAttribute(name);
        }
    });



}

ko.applyBindings(new SiteUploadViewModel());
</g:if>
<g:else>

    $('#uploadShapeFile').click(function() {
        $('#shapeFileUpload').submit();
    });
    $("#shapefile").change(function() {
        if ($("#shapefile").val()) {
            $("#uploadShapeFile").removeAttr("disabled");
        }
        else {
            $("#uploadShapeFile").attr("disabled", "disabled");
        }

    }).trigger('change');
</g:else>
</r:script>

</html>