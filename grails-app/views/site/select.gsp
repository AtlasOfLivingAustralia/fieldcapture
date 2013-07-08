<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
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
        <h1>Select a site</h1>
        <div class="row-fluid">
            <div class="well span4">
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
                        <td><input type="checkbox" /></td>
                    </tr>
                    </g:each>
                </table>
            </div>
            <div class="span8">
                <div id="map"></div>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" data-bind="click: useSelectedSites" class="btn btn-primary">Use selected sites</button>
            <button type="button" data-bind="click: cancel" id="cancel" class="btn">Cancel</button>
        </div>
    </div>
</body>
<r:script>
    $(function(){
        function SiteSelectModel () {
            self.useSelectedSites = function(){
                alert('not implemented yet');
            }
            self.cancel = function(){
                document.location.href = "${params.returnTo}";
            }
        }

        ko.applyBindings(new SiteSelectModel());
    });
</r:script>
</html>