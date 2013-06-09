<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="main"/>
  <title>${site?.name} | Field Capture</title>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
  <r:require modules="knockout,mapWithFeatures"/>
</head>
<body>
    <ul class="breadcrumb">
        <li><g:link controller="home">Home</g:link> <span class="divider">/</span></li>
        <li class="active">${site.name}</li>
    </ul>
    <div class="container-fluid">
    <div class="row-fluid">
        <div class="span9"><!-- left block of header -->
            <div class="under-rule">
                <div class="clearfix">
                    <h1 class="pull-left">${site?.name}</h1>
                    <g:link action="edit" id="${site.siteId}" class="btn pull-right title-edit">Edit site</g:link>
                </div>
                <div class="clearfix">
                    <p class="well well-small">${site.description}</p>
                </div>
            </div>
            <div>
                <span class="span2">Projects:</span>
                <ul style="list-style: none;margin:13px 0;">
                    <g:each in="${site.projects}" var="p" status="count">
                        <li>
                            <g:link controller="project" action="index" id="${p.projectId}">${p.name}</g:link>
                            <g:if test="${count < site.projects.size() - 1}">, </g:if>
                        </li>
                    </g:each>
                </ul>
            </div>
            <div>
                <span class="span4">External Id: ${site.externalId}</span>
                <span class="span4">Type: ${site.type}</span>
                <span class="span4">Area: ${site.area}</span>
            </div>
            <div>
                <span class="span12">Notes: ${site.notes}</span>
                %{--<span class="span3">${site.location?.size()} locations.</span>--}%
            </div>
        </div>
        <div class="span3"><!-- right block of header -->
            <div id="smallMap"></div>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12">
            <h3 style="border-bottom: #eeeeee solid 1px;">Activities</h3>
            <table class="table">
                <thead>
                    <tr><td></td><td>Activity id</td><td>Start date</td><td>End date</td><td>Type</td></tr>
                </thead>
                <tbody data-bind="foreach: activities">
                    <tr>
                        <td><a data-bind="attr: {href: '${createLink(controller: "activity", action: "index")}' + '/' + activityId}"><i class="icon-eye-open" title="View"></i></a>
                            <a data-bind="attr: {href: '${createLink(controller: "activity", action: "edit")}' + '/' + activityId}"><i class="icon-edit" title="Edit"></i></a>
                            <i data-bind="click: $root.deleteActivity" class="icon-trash" title="Delete"></i>
                        </td>
                        <td><a data-bind="text: activityId, attr: {href: '${createLink(controller: "activity", action: "index")}' + '/' + activityId}"> </a></td>
                        <td data-bind="text: startDate"></td>
                        <td data-bind="text: endDate"></td>
                        <td data-bind="text: type"></td>
                    </tr>
                </tbody>
            </table>
            <button data-bind="click: newActivity" type="button" class="btn">Add an activity</button>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span12 metadata">
            <span class="span6">Created: ${site.dateCreated}</span>
            <span class="span6">Last updated: ${site.lastUpdated}</span>
        </div>
    </div>

    <hr />
    <div class="debug">
        <h3 id="debug">Debug</h3>
        <div style="display: none">
            <div>Site : ${site}</div>
            <div>Activities : ${site.activities}</div>
            <div>Map features : ${mapFeatures}</div>
        </div>
    </div>
    </div>
    <r:script>

        var isodatePattern = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
            activitiesObject = ${site.activities + site.assessments};

        function toSimpleDate(isoDate) {
            if (isoDate && isodatePattern.test(isoDate)) {
                return isoDate.substr(8,2) + '-' +  isoDate.substr(5,2) +  '-' + isoDate.substr(0,4);
            }
            return isoDate
        }

        $(function(){
            function SiteModel() {
                var self = this;
                self.activities = ko.observableArray([]);
                self.loadActivity = function (act) {
                    if (!act) { return }
                    act.startDate = toSimpleDate(act.startDate);
                    act.endDate = toSimpleDate(act.endDate);
                    self.activities.push(act);
                };
                self.deleteActivity = function (act) {
                    $.get("${createLink(controller: 'activity', action: 'ajaxDelete')}/" + act.activityId,
                        function (data) {
                            if (data.code >= 400) {
                                alert('unable to delete');
                            } else {
                                self.activities.remove(act);
                            }
                        },
                        'json');
                };
                self.newActivity = function () {
                    document.location.href = "${createLink(controller: 'activity', action: 'create', id: site.siteId)}";
                };
            }

            var viewModel = new SiteModel();

            $.each(activitiesObject, function (i, obj) {
                viewModel.loadActivity(obj);
            });

            ko.applyBindings(viewModel);

            init_map_with_features({
                    mapContainer: "smallMap"
                },
                $.parseJSON('${mapFeatures}')
            );
        });

    </r:script>
</body>
</html>