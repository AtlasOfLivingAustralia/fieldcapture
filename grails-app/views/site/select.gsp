<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title>${site?.name} | Field Capture</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <r:script disposition="head">
        var fcConfig = {
            serverUrl: "${grailsApplication.config.grails.serverURL}",
            siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
            siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
            activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
            activityCreateUrl: "${createLink(controller: 'activity', action: 'create')}",
            spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
            spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
            spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
            sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
            sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
            },
            returnTo = "${params.returnTo}";
    </r:script>
  <r:require modules="knockout,mapWithFeatures,amplify"/>
</head>
<body>
    <div class="container-fluid">
        <h1>Select a existing site</h1>
        <div class="row-fluid">

            <div class="well span4">
                <input type="text" value="Filter..."/>

                <table class="table">
                    <thead style="display:none;">
                        <th>Site name</th>
                    </thead>
                    <g:each in="${sites}" var="site">
                    <tr>
                        <td>
                           <strong> ${site.name?:'No name supplied'} </strong>
                        <br/>
                        <span class="label label-success">${site.extent?.geometry?.state}</span>
                        <span class="label label-success">${site.extent?.geometry?.lga}</span>
                        </td>
                        <td><input class="siteSelected" id="${site.siteId}" type="checkbox" /></td>
                    </tr>
                    </g:each>
                </table>
            </div>
            <div class="span8">
                <div id="map" style="height:400px;width:100%;"></div>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" data-bind="click: useSelectedSites" class="btn btn-primary">Use selected sites</button>
            <button type="button" data-bind="click: cancel" id="cancel" class="btn">Cancel</button>
        </div>

        <div class="container-fluid">
            <div class="expandable-debug">
                <hr />
                <h3>Debug</h3>
                <div>
                    <h4>KO model</h4>
                    <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
                </div>
            </div>
        </div>
    </div>
</body>
<r:script>
    $(function(){
        function SiteSelectModel () {
            var self = this;
            self.projectId = "${project.projectId?:'1'}";
            self.sites = ko.observableArray([]);
            self.useSelectedSites = function(){
                $.ajax({
                   url: "${createLink(controller: 'site', action: 'ajaxUpdateProjects')}",
                   type: 'POST',
                   data:  ko.toJSON(self),
                   contentType: 'application/json',
                   success: function (data) {
                       document.location.href = "${params.returnTo}";
                   },
                   error: function () {
                       alert('There was a problem saving this site');
                   }
                });
            }
            self.cancel = function(){
                document.location.href = "${params.returnTo}";
            }
            self.addSite = function(siteId){
                console.log('Add ' + siteId);
                self.sites.push(siteId);
            }
            self.removeSite = function(siteId){
                console.log('Remove ' + siteId);
                self.sites.remove(siteId);
            }
        }

        var mapOptions = {
            zoomToBounds:true,
            zoomLimit:16,
            highlightOnHover:true,
            features:[]
        };

        var renderedMap = init_map_with_features({mapContainer:'map'}, mapOptions);

        var siteModel = new SiteSelectModel()
        ko.applyBindings(siteModel);

        $('.siteSelected').bind('click',function() {
           if($(this).is(':checked')) {
             siteModel.addSite($(this).attr('id'))
           } else {
             siteModel.removeSite($(this).attr('id'))
           }
        });

    });
</r:script>
</html>