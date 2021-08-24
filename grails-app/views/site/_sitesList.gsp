<g:set var="wordForSite" value="${wordForSite?:'site'}"/>
<div id="sitesList">
    <div data-bind="visible: sites.length == 0">
        <p>No ${wordForSite}s are currently associated with this project.</p>
        <g:if test="${editable}">
            <div class="btn-group btn-group-horizontal ">
                <button data-bind="click: $root.addSite" type="button" class="btn btn-sm addSite"><i class="fa fa-plus"></i> Add new ${wordForSite}</button>
                <button data-bind="click: $root.uploadSites" type="button" class="btn btn-sm uploadSite"> <i class="fa fa-upload"></i> Upload ${wordForSite}s from shapefile</button>
            </div>
        </g:if>
    </div>


    <div class="row"  data-bind="visible: sites.length > 0">
        <div class="col-sm-12 site-actions">
                <div class="btn-group" role="group">
                    <span>Actions:</span>
                    <a data-bind="click: $root.addSite" id="addSite" class="btn btn-sm" type="button" title="Create a new site for your project"><i class="fa fa-plus"></i> New</a>
                    <a data-bind="click: $root.uploadSites" id="siteUpload" type="button" class="btn btn-sm" title="Create sites for your project by uploading a file"><i class="fa fa-upload"></i> Upload</a>
                    <a data-bind="click: $root.downloadShapefile" id="siteDownload" type="button" class="btn btn-sm" title="Download your project sites in shapefile format"><i class="fa fa-download"></i> Download</a>
                    <button data-bind="click: $root.removeSelectedSites, enable:$root.selectedSiteIds().length > 0"  id="siteDeleted" type="button" class="btn btn-sm" title="Delete selected sites"><i class="fa fa-trash"></i> Delete</button>
                </div>
        </div>
    </div>
    <div class="row" data-bind="visible: sites.length > 0">
        <div class="col-sm-5">
            <table id="sites-table" class="sites-table table w-100">
                <thead>
                <tr>
                    <th><input type="checkbox" id="select-all-sites"></th>
                    <th></th>
                    <th>Type <fc:iconHelp html="true">Planning site (P) or Reporting site (R)</fc:iconHelp><br/>
                        <select data-bind="value:typeFilter, options:typeOptions">

                        </select>
                    </th>
                    <th>Name</th>
                    <th>Updated</th>
                    <th></th>
                </tr>

                </thead>
                <tbody data-bind="foreach: sites">
                <tr>
                    <th><input type="checkbox" name="select-site" data-bind="checked:selected, enable:type != 'compound'"></th>
                    <td>
                        <g:if test="${editable}">
                            <span>
                                <button type="button" data-bind="click:$root.editSite, visible:type != 'compound'" class="btn btn-sm btn-container"><i class="fa fa-edit" title="Edit ${wordForSite.capitalize()}"></i></button>
                                <button type="button" data-bind="click:$root.viewSite" class="btn btn-sm btn-container"><i class="fa fa-eye" title="View ${wordForSite.capitalize()}"></i></button>
                                <button type="button" data-bind="click:$root.deleteSite, visible:type != 'compound'" class="btn btn-sm btn-container"><i class="fa fa-remove" title="Delete ${wordForSite.capitalize()}"></i></button>
                            </span>
                        </g:if>
                    </td>
                    <td data-bind="text:type == 'compound' ? 'R' : 'P', title:type == 'compound' ? 'Reporting site' :  'Planning site'">
                    </td>

                    <td>
                        <a id="siteName" data-bind="text:name, attr: {href:'${createLink(controller: "site", action: "index")}' + '/' + siteId}"></a>
                    </td>
                    <td>
                        <span id="lastUpdated" data-bind="text:convertToSimpleDate(lastUpdated)"></span>
                    </td>
                    <td>
                        <span data-bind="text:lastUpdated"></span>
                    </td>

                </tr>

                </tbody>
            </table>
        </div>
        <div class="col-sm-7">
            <m:map id="map" width="100%"/>
        </div>
    </div>
</div> <!-- end of siteList -->
