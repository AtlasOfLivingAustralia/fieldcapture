<%@ page import="org.codehaus.groovy.grails.web.json.JSONArray" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${site?.name} | Sites | Field Capture</title>
  <style type="text/css">
    legend {
        border: none;
        margin-bottom: 5px;
    }
    .popover {
        border-width: 2px;
    }
    .popover-content {
        font-size: 14px;
        line-height: 20px;
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
  <r:require module="knockout"/>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li><g:link controller="site" action="index" id="${site.siteId}">
            <span data-bind="text: name">${site.name}</span>
        </g:link><span class="divider">/</span></li>
        <li class="active">Edit</li>
    </ul>
    <div class="container-fluid">
        <bs:form action="update" inline="true">
        <div class="row-fluid span12">
            <g:hiddenField name="id" value="${site.siteId}"/>
            <div class="">
                <label for="name">Site name</label>
                <h1>
                    <input data-bind="value: name" class="span12" id="name" type="text" value="${site?.name}" placeholder="Enter a name for the new site"/>
                </h1>
            </div>
        </div>

        <div class="row-fluid span12">
            <div class="span4">
                <label for="externalId">External Id
                    <fc:iconHelp title="External id">Identifier code for the site - used in external documents.</fc:iconHelp>
                </label>
                <input data-bind="value:externalId" id="externalId" type="text" class="span12"/>
            </div>
            <div class="span4">
                <label for="type">Type</label>
                <input data-bind="value: type" id="type" type="text" class="span12"/>
            </div>
            <div class="span4">
                <label for="area">Area (decimal hectares)
                    <fc:iconHelp title="Area of site">The area in decimal hectares (4dp) enclosed within the boundary of the shape file.</fc:iconHelp></label>
                <input data-bind="value: area" id="area" type="text" class="span12"/>
            </div>
        </div>

        <div class="row-fluid span12">
            <div class="span6">
                <fc:textArea data-bind="value: description" id="description" label="Description" class="span12" rows="3" cols="50"/>
            </div>
            <div class="span6">
                <fc:textArea data-bind="value: notes" id="notes" label="Notes" class="span12" rows="3" cols="50"/>
            </div>
        </div>

        <div class="row-fluid span12">
            <h2 class="inline">Projects</h2>
            <ul style="list-style: none;margin:13px 0;">
                <g:each in="${site.projects}" var="p" status="count">
                    <li>
                        <g:link controller="project" action="index" id="${p}">${p}</g:link>
                        <g:if test="${count < site.projects.size() - 1}">, </g:if>
                    </li>
                </g:each>
            </ul>
            <select class="span5" data-bind="options:projectList, optionsText:'name', value:projects,
                optionsCaption:'Associate this site with a project..',optionsValue:'projectId'"></select>

        </div>

        <div class="span12">
            <h2>Activities</h2>
            <p>Activities can be edited on the site page - <g:link controller="site" action="index" id="${site.siteId}">
                <span data-bind="text: name">${site.name}</span>
            </g:link></p>
        </div>

        <div class="span12">
            <h2>Locations <fc:iconHelp title="Location of the site">The location of the site can be represented one or more points or polygons.
                 KML, WKT and shape files are supported for uploading polygons. As are PID's of existing features in the Atlas Spatial Portal.</fc:iconHelp>
            </h2>
            <table class="table">
                <caption>You can have any number of points and areas to describe the locations of this site.</caption>
                <thead><tr><td>name</td><td>type</td><td>values</td></tr></thead>
                <tbody data-bind="foreach: location">
                    <tr>
                        <td><input type="text" data-bind="value:name" class="input-small"/><br>
                        <td><g:select data-bind="value: type"  from="['choose a location type','point','known shape','upload a shape']" name='shit'
                                      keys="['locationTypeNone','locationTypePoint','locationTypePid','locationTypeUpload']"/></td>
                        <td rowspan="2"><div class="span12">
                            <div data-bind="template: {name: updateModel(), data: data}"></div>
                        </div></td>
                    </tr>
                    <tr><td colspan="2" class="no-border">
                        <button data-bind="click: $root.removeLocation" type="button" class="btn btn-link">Remove</button>
                        <button data-bind="click: $root.notImplemented, visible: type() != 'locationTypeNone'" type="button" class="btn btn-link">Show this on a map</button>
                    </td></tr>
                </tbody>
            </table>
            <button type="button" class="btn" data-bind="click:addEmptyLocation">Add another location</button>
        </div>

        <div class="form-actions span12">
            <button type="button" data-bind="click: save" class="btn btn-primary">Save changes</button>
            <button type="button" id="cancel" class="btn">Cancel</button>
        </div>
        </bs:form>

        <hr />
        <div class="debug">
            <h3 id="debug">Debug</h3>
            <div style="display: none">
                Model: <pre data-bind="text: ko.toJSON($root)"></pre>
                Site : <pre>Site : ${site}</pre>
            </div>
        </div>

    </div>

<!-- templates -->
<script type="text/html" id="locationTypeNone">
    <span>Choose a type</span>
</script>

<script type="text/html" id="locationTypePoint">
    <div class="row-fluid controls-row">
        <fc:textField data-bind="value:decimalLatitude" outerClass="span3" label="Latitude"/>
        <fc:textField data-bind="value:decimalLongitude" outerClass="span3" label="Longitude"/>
    </div>

    <div class="row-fluid controls-row">
        <fc:textField data-bind="value:uncertainty, enable: hasCoordinate()" outerClass="span2" label="Uncertainty"/>
        <fc:textField data-bind="value:precision, enable: hasCoordinate()" outerClass="span2" label="Precision"/>
        <fc:textField data-bind="value:datum, enable: hasCoordinate()" outerClass="span2" label="Datum" placeholder="e.g. WGS84"/>
    </div>
</script>

<script type="text/html" id="locationTypePid">
    <fc:textField data-bind="value:pid" class="input-small" label="Pid:"/>
</script>

<script type="text/html" id="locationTypeUpload">
    <fc:textField  class="input-small" label="File:"/>
    <span>Not implemented yet</span>
</script>

<r:script>

    // returns blank string if the property is undefined, else the value
    function orBlank(v) {
        return v === undefined ? '' : v;
    }

    // returns blank string if the object or the specified property is undefined, else the value
    function exists(parent, prop) {
        return parent === undefined ? '' : (parent[prop] === undefined ? '' : parent[prop]);
    }

    var siteData = $.parseJSON('${json}'),
        projectList = ${projectList};

    $(function(){
        //$('.dropdown-toggle').dropdown();
        $('.helphover').popover({animation: true, trigger:'hover'});

        $('#cancel').click(function () {
            document.location.href = "${createLink(action: 'index', id: site.siteId)}";
        });

        ko.bindingHandlers.switchModel = {
            update: function (element, valueAccessor) {
                alert(ko.toJSON(valueAccessor()));
                ko.bindingHandlers.value.update(element, valueAccessor);
            }
        };

        var PidLocation = function (l) {
            this.pid = ko.observable(exists(l,'pid'));
            this.type = 'locationTypePid';
        };

        var UploadLocation = function (l) {
            this.type = 'locationTypeUpload';
        };

        var PointLocation = function (l) {
            var self = this;
            this.type = 'locationTypePoint';
            this.decimalLatitude = ko.observable(exists(l,'decimalLatitude'));
            this.decimalLongitude = ko.observable(exists(l,'decimalLongitude'));
            this.uncertainty = ko.observable(exists(l,'uncertainty'));
            this.precision = ko.observable(exists(l,'precision'));
            this.datum = ko.observable(exists(l,'datum'));
            this.hasCoordinate = function () {
                return self.decimalLatitude() !== '' && self.decimalLongitude() !== ''
            }
        };

        var Location = function (id, name, type, data) {
            var self = this;
            this.name = ko.observable(name);
            this.id = id;
            this.type = ko.observable(type);
            this.data = data;
            this.updateModel = function (event) {
                var trev = event;
                var lType = self.type();
                var modelType = self.data ? self.data.type : 'locationTypeNone';
                if (modelType !== self.type()) {
                    switch (self.type()) {
                        case 'locationTypePoint': self.data = new PointLocation(); break;
                        case 'locationTypePid': self.data = new PidLocation(); break;
                        case 'locationTypeUpload': self.data = new UploadLocation(); break;
                        default: self.data = {type: 'locationTypeNone'}
                    }
                }
                return self.type();
            }
        };

        function SiteViewModel () {
            var self = this;
            self.name = ko.observable("${site?.name}");
            self.externalId = ko.observable("${site.externalId}");
            self.type = ko.observable("${site.type}");
            self.area = ko.observable("${site.area}");
            self.description = ko.observable("${site.description}");
            self.notes = ko.observable("${site.notes}");
            self.projects = ko.observableArray(${site.projects});
            self.projectList = projectList;
            self.location = ko.observableArray([]);
            self.loadLocations = function () {
                var data;
                $.each(siteData.location, function (i, loc) {
                    switch (loc.type) {
                        case 'locationTypePoint': data = new PointLocation(loc.data); break;
                        case 'locationTypePid': data = new PidLocation(loc.data); break;
                        default: data = {id: 1};
                    }
                    var temp = new Location(loc.id, loc.name, loc.type, data);
                    self.location.push(temp);
                    var temp2 = self.location();
                    var x = 1;
                });
            };
            self.addLocation = function (id, name, type, loc) {
                var data;
                switch (type) {
                    case 'locationTypePoint': data = new PointLocation(loc); break;
                    case 'locationTypePid': data = new PidLocation(loc); break;
                    default: data = {id: 1};
                }
                var temp = new Location(id, name, type, data);
                self.location.push(temp);
                var temp2 = ko.mapping.toJS(self.location);
            };
            self.addEmptyLocation = function () {
                this.location.push(new Location('', '', 'locationTypeNone', null));
            };
            self.removeLocation = function (location) {
                self.location.remove(location);
            };
            self.save = function () {
                var jsData = ko.toJS(self);
                var json = ko.toJSON(self);
                $.ajax({
                    url: "${createLink(action: 'ajaxUpdate', id: site.siteId)}",
                    type: 'POST',
                    data: json,
                    contentType: 'application/json',
                    success: function (data) {
                        document.location.href = "${createLink(action: 'index', id: site.siteId)}";
                    },
                    error: function (data) {
                        alert(data);
                    }
                });
            };
            self.notImplemented = function () {
                alert("Not implemented yet.")
            };
            /*self.location.subscribe(function (newValue) {
                alert(newValue);
            });*/
        }

        var viewModel = new SiteViewModel();

        ko.applyBindings(viewModel);

        viewModel.loadLocations();

        var dump = ko.toJS(viewModel);
        var dumpJson = ko.toJSON(viewModel);

    });

</r:script>
</body>
</html>