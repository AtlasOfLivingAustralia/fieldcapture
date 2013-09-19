<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title>${project?.name.encodeAsHTML()} | Project | Field Capture</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&language=en"></script>
    <r:script disposition="head">
    var fcConfig = {
        serverUrl: "${grailsApplication.config.grails.serverURL}",
        siteDeleteUrl: "${createLink(controller: 'site', action: 'ajaxDelete')}",
        siteViewUrl: "${createLink(controller: 'site', action: 'index')}",
        activityEditUrl: "${createLink(controller: 'activity', action: 'edit')}",
        activityPrintUrl: "${createLink(controller: 'activity', action: 'print')}",
        activityCreateUrl: "${createLink(controller: 'activity', action: 'create')}",
        activityUpdateUrl: "${createLink(controller: 'activity', action: 'ajaxUpdate')}",
        activityDeleteUrl: "${createLink(controller: 'activity', action: 'ajaxDelete')}",
        siteCreateUrl: "${createLink(controller: 'site', action: 'createForProject', params: [projectId:project.projectId])}",
        siteSelectUrl: "${createLink(controller: 'site', action: 'select', params:[projectId:project.projectId])}&returnTo=${createLink(controller: 'project', action: 'index', id: project.projectId)}",
        starProjectUrl: "${createLink(controller: 'project', action: 'starProject')}",
        addUserRoleUrl: "${createLink(controller: 'user', action: 'addUserAsRoleToProject')}",
        removeUserWithRoleUrl: "${createLink(controller: 'user', action: 'removeUserWithRole')}",
        projectMembersUrl: "${createLink(controller: 'project', action: 'getMembersForProjectId')}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
        },
        here = window.location.href;

    </r:script>
    <r:require modules="gmap3,mapWithFeatures,knockout,datepicker,amplify,jqueryValidationEngine"/>
</head>
<body>
<div class="container-fluid">

    <ul class="breadcrumb">
        <li>
            <g:link controller="home">Home</g:link> <span class="divider">/</span>
        </li>
        <li class="active">Projects <span class="divider">/</span></li>
        <li class="active">${project.name?.encodeAsHTML()}</li>
    </ul>

    <div class="row-fluid">
        <div class="row-fluid">
            <div class="clearfix">
                <h1 class="pull-left">${project?.name?.encodeAsHTML()}</h1>
                <g:if test="${flash.errorMessage || flash.message}">
                    <div class="span5">
                        <div class="alert alert-error">
                            <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                            ${flash.errorMessage?:flash.message}
                        </div>
                    </div>
                </g:if>
                <div class="pull-right">
                    <g:set var="disabled">${(!user) ? "disabled='disabled' title='login required'" : ''}</g:set>
                    <g:if test="${isProjectStarredByUser}">
                        <button class="btn" id="starBtn"><i class="icon-star"></i> <span>Remove from favourites</span></button>
                    </g:if>
                    <g:else>
                        <button class="btn" id="starBtn" ${disabled}><i class="icon-star-empty"></i> <span>Add to favourites</span></button>
                    </g:else>
                    <g:link action="edit" id="${project.projectId}" class="btn">Change project details</g:link>
                </div>
            </div>
        </div>
    </div>

    <!-- content tabs -->
    <ul class="nav nav-tabs big-tabs">
        <li class="active"><a href="#overview" id="overview-tab" data-toggle="tab">Overview</a></li>
        <li><a href="#activity" id="activity-tab" data-toggle="tab">Activities</a></li>
        <li><a href="#site" id="site-tab" data-toggle="tab">Sites</a></li>
        <li><a href="#dashboard" id="dashboard-tab" data-toggle="tab">Dashboard</a></li>
        <g:if test="${user?.isAdmin}"><li><a href="#admin" id="admin-tab" data-toggle="tab">Admin</a></li></g:if>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="overview">
            <!-- OVERVIEW -->
            <div class="row-fluid">
                <g:if test="${organisationName}">
                    <div class="clearfix" >
                        <h4>
                            Supported by:
                            <a href="${grailsApplication.config.collectory.baseURL +
                                    'public/show/' + project.organisation}">${organisationName?.encodeAsHTML()}</a>
                        </h4>
                    </div>
                </g:if>
                <g:if test="${project.associatedProgram}">
                    <div class="clearfix" >
                        <h4>
                            Funded by:
                            <span>${project.associatedProgram?.encodeAsHTML()}</span>
                            <g:if test="${project.associatedSubProgram}">
                                <span>${project.associatedSubProgram?.encodeAsHTML()}</span>
                            </g:if>
                        </h4>
                    </div>
                </g:if>
                <g:if test="${project.plannedStartDate}">
                    <div>
                        <h5>
                            Project activities will be undertaken from <span data-bind="text:plannedStartDate.formattedDate"></span>
                            <g:if test="${project.plannedEndDate}">to <span data-bind="text:plannedStartDate.formattedDate"></span> </g:if>
                        </h5>
                    </div>
                </g:if>

                <g:if test="${project.description?.encodeAsHTML()}">
                    <div>
                        <p class="well well-small more">${project.description?.encodeAsHTML()}</p>
                    </div>
                </g:if>
                <g:if test="${project.documents}">
                    <g:set var="image" value="${project.documents[0]}"/>
                    <div class="thumbnail with-caption">
                        <img class="img-rounded" src="${image?.url}"/>
                        <p class="caption">${image?.name?.encodeAsHTML()}</p>
                        <p class="attribution"><small>${image?.attribution?.encodeAsHTML()}</small></p>
                    </div>
                </g:if>
            </div>
        </div>

        <div class="tab-pane" id="activity">
            <!-- ACTIVITIES -->
            <g:render template="/shared/activitiesList"
                      model="[activities:activities ?: [], sites:project.sites ?: [], showSites:true]"/>
        </div>

        <div class="tab-pane" id="site">
            <!-- SITES -->
            <div data-bind="visible: sites.length == 0">
               <p>No sites are currently associated with this project.</p>
                <div class="btn-group btn-group-horizontal pull-right">
                    <button data-bind="click: $root.addSite" type="button" class="btn">Add new site</button>
                    <button data-bind="click: $root.addExistingSite" type="button" class="btn">Add existing site</button>
                </div>
             </div>

            <div class="row-fluid"  data-bind="visible: sites.length > 0">
                <div class="span4 well list-box">
                    <div class="control-group">
                        <div class="input-append">
                            <g:textField class="filterinput input-medium" data-target="site"
                                         data-bind="event: {keyup:filterChanged}"
                                         title="Type a few characters to restrict the list." name="sites"
                                         placeholder="filter"/>
                            <button type="button" class="btn" data-bind="click:clearFilter"
                                    title="clear"><i class="icon-remove"></i></button>
                        </div>
                        <span id="site-filter-warning" class="label filter-label label-warning"
                              style="display:none;margin-left:4px;"
                              data-bind="visible:isSitesFiltered,valueUpdate:'afterkeyup'">Filtered</span>
                    </div>
                    <div class="scroll-list">
                        <ul id="siteList"
                            data-bind="template: {foreach:sites},
                                              beforeRemove: hideElement,
                                              afterAdd: showElement">
                            <li data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                                <a data-bind="text:name, attr: {href:'${createLink(controller: "site", action: "index")}' + '/' + siteId}"></a>
                                <span data-bind="text:state"></span><br>
                                <span data-bind="text:address" style="font-size:11px;color:#666;"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                 %{--<div class="span5" id="sites-scroller">
                    <ul class="unstyled inline" data-bind="foreach: sites">
                        <li class="siteInstance" data-bind="event: {mouseover: $root.highlight, mouseout: $root.unhighlight}">
                            <a data-bind="text: name, click: $root.openSite"></a>
                            <button data-bind="click: $root.removeSite" type="button" class="close" title="delete">&times;</button>
                        </li>
                    </ul>
                </div>--}%
                <div class="span6">
                    <div id="map" style="width:100%"></div>
                </div>
                <div class="span2">
                    <div class="btn-group btn-group-vertical pull-right">
                        <button data-bind="click: $root.addSite" type="button" class="btn ">Add new site</button>
                        <button data-bind="click: $root.addExistingSite" type="button" class="btn">Add existing site</button>
                        <button data-bind="click: $root.removeAllSites" type="button" class="btn">Delete all sites</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-pane" id="dashboard">
            <!-- DASHBOARD -->
            <h2 style="font-weight:normal;margin-top:0;">Totals across all activities under this project.</h2>
            <div class="row-fluid">
                <div class="span4 well">
                    <h3>Weed management</h3>
                    <strong>Hectares treated</strong><span class="pull-right progress-label">6.3</span>
                    <div class="progress progress-danger active">
                        <div class="bar" style="width: 50%;"></div>
                    </div>
                    <strong>Length of roadside cleared</strong><span class="pull-right progress-label">14km</span>
                    <div class="progress progress-info active">
                        <div class="bar" style="width: 28%;"></div>
                    </div>
                    <strong>Length of riparian area cleared</strong><span class="pull-right progress-label">4km</span>
                    <div class="progress progress-info active">
                        <div class="bar" style="width: 8%;"></div>
                    </div>
                    <strong>Invasive flora</strong>
                    <ul>
                        <li>Ornamental Rubbervine (<i>Cryptostegia madagascariensis</i>)</li>
                        <li>Rubber Bush (<i>Calotropis procera</i>)</li>
                        <li>Snakeweed (<i>Stachytarpheta</i> spp)</li>
                        <li>Caltrop (<i>Tribulus</i> spp)</li>
                    </ul>
                </div>
                <div class="span4 well">
                    <h3>Participation</h3>
                    <strong>Indigenous engagement</strong><span class="pull-right progress-label">2</span>
                    <div class="progress progress-danger active">
                        <div class="bar" style="width: 17%;"></div>
                    </div>
                    <strong>Indigenous participation</strong><span class="pull-right progress-label">12</span>
                    <div class="progress progress-info active">
                        <div class="bar" style="width: 100%;"></div>
                    </div>
                    <strong>Volunteers</strong><span class="pull-right progress-label">10</span>
                    <div class="progress progress-success active">
                        <div class="bar" style="width: 83.3%;"></div>
                    </div>
                </div>
                <div class="span4 well">
                    <h3>Theme 3 - managing threats to biodiversity</h3>
                    <strong>Hectares (proposed = 9680)</strong><span class="pull-right progress-label">1232</span>
                    <div class="progress progress-danger active">
                        <div class="bar" style="width: 13%;"></div>
                    </div>
                </div>
                <div class="span4 well">
                    <h3>Fencing</h3>
                    <strong>Total length</strong><span class="pull-right progress-label">4.5km</span>
                    <div class="progress progress-danger active">
                        <div class="bar" style="width: 50%;"></div>
                    </div>
                    <strong>Total cost</strong><span class="pull-right progress-label">$40,000</span>
                    <div class="progress progress-info active">
                        <div class="bar" style="width: 18%;"></div>
                    </div>
                </div>

                <%-- <g:each in="${metrics}" var="grouping">
                    <g:each var="score" in="${grouping.scores}">
                    <div class="span4 well">
                        <h3>${score.score} ${grouping.groupName}</h3>
                        <g:each var="group" in="${score.values}">
                            <strong>${group.groupValue}</strong>:${group.aggregatedResult}
                        </g:each>
                    </div>
                    </g:each>
                </g:each> --%>
            </div>
        </div>
        <g:if test="${user?.isAdmin}">
            <div class="tab-pane" id="admin">
            <!-- ADMIN -->
                <div class="admin-section">
                    <h3>Project Access</h3>
                    <form class="form-inline" id="userAccessForm">
                        Add user (email address)&nbsp;
                        %{--<g:select name="userId" data-bind="value: userId" class="input-xlarge combobox" from="${user?.userNamesList}" optionValue="${{it.displayName + " <" + it.userName +">"}}" optionKey="userId" noSelection="['':'start typing a user name']"/>--}%
                        <input class="input-xlarge validate[required,custom[email]]" id="emailAddress" placeholder="enter a user's email address" type="text"/>
                        with role <g:select name="role" id="addUserRole" class="validate[required]" data-errormessage-value-missing="Role is required!"
                                            from="${roles}" noSelection="['':'-- select a role --']"/>
                        <button id="addUserRoleBtn" class="btn btn-primary">Add</button>
                        <g:img dir="images" file="spinner.gif" id="spinner1" class="hide spinner"/>
                    </form>
                    <h4>Project Members</h4>
                    <div class="row-fluid">
                        <div class="span6">
                            <table class="table table-condensed" id="projectMembersTable" style="">
                                <thead><tr><th width="10%">User&nbsp;Id</th><th>User&nbsp;Name</th><th width="15%">Role</th><th width="5%">&nbsp;</th><th width="5%">&nbsp;</th></tr></thead>
                                <tbody class="membersTbody">
                                <tr class="hide">
                                    <td class="memUserId"></td>
                                    <td class="memUserName"></td>
                                    <td class="memUserRole"><span>&nbsp;</span><g:select class="hide" name="memberRole" from="${roles}"/></td>
                                    <td class="clickable memEditRole"><i class="icon-edit tooltips" title="edit this user and role combination"></i></td>
                                    <td class="clickable memRemoveRole"><i class="icon-remove tooltips" title="remove this user and role combination"></i></td>
                                </tr>
                                <tr id="spinnerRow"><td colspan="4">loading data... <g:img dir="images" file="spinner.gif" id="spinner2" class="spinner"/></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="span3">
                            <div id="formStatus" class="hide alert alert-success">
                                <button class="close" onclick="$('.alert').fadeOut();" href="#">×</button>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- SPECIES -->
                <div class="admin-section">
                    <g:render template="/species/species" model="[project:project]"/>
                </div>
            </div>
        </g:if>
    </div>

    <hr />
    <div class="expandable-debug">
        <h3>Debug</h3>
        <div>
            <h4>KO model</h4>
            <pre data-bind="text:ko.toJSON($root,null,2)"></pre>
            <h4>Activities</h4>
            <pre>${activities?.encodeAsHTML()}</pre>
            <h4>Sites</h4>
            <pre>${project.sites?.encodeAsHTML()}</pre>
            <h4>Project</h4>
            <pre>${project?.encodeAsHTML()}</pre>
            <h4>Features</h4>
            <pre>${mapFeatures}</pre>
        </div>
    </div>
</div>
    <r:script>
        $(window).load(function () {
            var map;
            // setup 'read more' for long text
            $('.more').shorten({
                moreText: 'read more',
                showChars: '1000'
            });
            // setup confirm modals for deletions
            $(document).on("click", "a[data-bb]", function(e) {
                e.preventDefault();
                var type = $(this).data("bb"),
                    href = $(this).attr('href');
                if (type === 'confirm') {
                    bootbox.confirm("Delete this entire project? Are you sure?", function(result) {
                        if (result) {
                            document.location.href = href;
                        }
                    });
                }
            });

            var Site = function (site) {
                var self = this;
                this.name = ko.observable(site.name);
                this.siteId = site.siteId;
                this.state = ko.observable('');
                this.nrm = ko.observable('');
                this.address = ko.observable("");
                this.setAddress = function (address) {
                    if (address.indexOf(', Australia') === address.length - 11) {
                        address = address.substr(0, address.length - 11);
                    }
                    self.address(address);
                };
            };

            function ViewModel(project, sites, activities, isUserEditor) {
                var self = this;
                self.name = ko.observable(project.name);
                self.description = ko.observable(project.description);
                self.externalId = ko.observable(project.externalId);
                self.grantId = ko.observable(project.grantId);
                self.manager = ko.observable(project.manager);
                self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
                self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});
                self.organisation = ko.observable(project.organisation);
                self.mapLoaded = ko.observable(false);
                self.sites = $.map(sites, function (obj,i) {return new Site(obj)});
                self.sitesFilter = ko.observable("");
                self.isSitesFiltered = ko.observable(false);
                self.isUserEditor = ko.observable(isUserEditor);
                self.getSiteName = function (siteId) {
                    var site;
                    if (siteId !== undefined && siteId !== '') {
                        site = $.grep(self.sites, function(obj, i) {
                                return (obj.siteId === siteId);
                        });
                        if (site.length > 0) {
                             return site[0].name();
                        }
                    }
                    return '';
                };
                // Animation callbacks for the lists
                self.showElement = function(elem) { if (elem.nodeType === 1) $(elem).hide().slideDown() };
                self.hideElement = function(elem) { if (elem.nodeType === 1) $(elem).slideUp(function() { $(elem).remove(); }) };
                self.clearSiteFilter = function () {
                    self.sitesFilter("");
                };
                self.filterChanged = function (model, event) {
                    var element = event.target,
                        a = $(element).val(),
                        target = $(element).attr('data-target'),
                        $target = $('#' + target + 'List li'),
                        regex = new RegExp('\\b' + a, 'i');
                    if (a.length > 1) {
                        /*ko.utils.arrayForEach(self.sites, function (site) {
                            site.visible = regex.test(site.name());
                        });*/
                        // this finds all links in the list that contain the input,
                        // and hides the ones not containing the input
                        var containing = $target.filter(function () {
                            //var regex = new RegExp('\\b' + a, 'i');
                            return regex.test($('a', this).text());
                        }).slideDown();
                        // make sure filtered-in sites are visible
                        containing.each(function () {
                            map.showFeatureById($(this).find('a').html());
                        });
                        $target.not(containing).slideUp();
                        // make sure filtered-out sites are hidden
                        $target.not(containing).each(function () {
                            map.hideFeatureById($(this).find('a').html());
                        });
                        // show 'filtered' icon
                        $('#' + target + '-filter-warning').show();
                    } else {
                        // hide 'filtered' icon
                        $('#' + target + '-filter-warning').hide();
                        // show all sites
                        $target.slideDown();
                        // show all markers
                        map.showAllfeatures();
                    }
                    return true;
                };
                self.clearFilter = function (model, event) {
                    var element = event.currentTarget,
                        $filterInput = $(element).prev(),
                        target = $filterInput.attr('data-target');
                    $filterInput.val('');
                    $('#' + target + '-filter-warning').hide();
                    $('#' + target + "List li").slideDown();
                    map.showAllfeatures();
                };
                this.removeSite = function () {
                   var that = this,
                       url = fcConfig.siteDeleteUrl + '/' + this.siteId;
                    $.get(url, function (data) {
                        if (data.status === 'deleted') {
                            self.sites.remove(that);
                        }
                    });
                };
                this.highlight = function () {
                    map.highlightFeatureById(this.name());
                };
                this.unhighlight = function () {
                    map.unHighlightFeatureById(this.name());
                };
                this.removeAllSites = function () {
                    self.notImplemented();
                };
                this.addSite = function () {
                     document.location.href = fcConfig.siteCreateUrl;
                };
                this.addExistingSite = function () {
                    document.location.href = fcConfig.siteSelectUrl;
                };
                self.notImplemented = function () {
                    alert("Not implemented yet.")
                };
                self.triggerGeocoding = function () {
                    ko.utils.arrayForEach(self.sites, function (site) {
                        if (map) {
                            map.getAddressById(site.name(), site.setAddress);
                        }
                    });
                };
            }

            var viewModel = new ViewModel(${project},${project.sites},${activities ?: []},${user?.isEditor?:false});
            ko.applyBindings(viewModel);

            // retain tab state for future re-visits
            // and handle tab-specific initialisations
            var activitiesTabInitialised = false;
            $('a[data-toggle="tab"]').on('shown', function (e) {
                var tab = e.currentTarget.hash;
                amplify.store('project-tab-state', tab);
                // only init map when the tab is first shown
                if (tab === '#site' && map === undefined) {
                    map = init_map_with_features({
                            mapContainer: "map",
                            scrollwheel: false
                        },
                        $.parseJSON('${mapFeatures}')
                    );
                    // set trigger for site reverse geocoding
                    viewModel.triggerGeocoding();
                }
            });
            // re-establish the previous tab state
            var storedTab = amplify.store('project-tab-state');
            if (storedTab === '') {
                $('#overview-tab').tab('show');
            } else {
                $(storedTab + '-tab').tab('show');
            }

            // Star button click event
            $("#starBtn").click(function(e) {
                var isStarred = ($("#starBtn i").attr("class") == "icon-star");
                toggleStarred(isStarred);
            });

            // BS tooltip
            $('.tooltips').tooltip();

        });// end window.load

       /**
        * Star/Unstar project for user - send AJAX and update UI
        *
        * @param Boolean isProjectStarredByUser
        */
        function toggleStarred(isProjectStarredByUser) {
            var basUrl = fcConfig.starProjectUrl;
            var query = "?userId=${user?.userId}&projectId=${project?.projectId}"
            if (isProjectStarredByUser) {
                // remove star
                $.getJSON(basUrl + "/remove" + query, function(data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $("#starBtn i").removeClass("icon-star").addClass("icon-star-empty");
                        $("#starBtn span").text("Add to favourites");
                    }
                }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
            } else {
                // add star
                $.getJSON(basUrl + "/add" + query, function(data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $("#starBtn i").removeClass("icon-star-empty").addClass("icon-star");
                        $("#starBtn span").text("Remove from favourites");
                    }
                }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
            }
        }
    </r:script>
    <g:if test="${user?.isAdmin}">
        <r:script>
            // Admin JS code only exposed to admin users
            $(window).load(function () {
                //$('#userAccessForm').validationEngine();
                // Click event on "add" button to add new user to project
                $('#addUserRoleBtn').click(function(e) {
                    e.preventDefault();
                    var email = $('#emailAddress').val();
                    var role = $('#addUserRole').val();

                    if ($('#userAccessForm').validationEngine('validate')) {
                        $("#spinner1").show();
                        var userId;
                        if (email) {
                            $.get("${g.createLink(controller:'user',action:'checkEmailExists')}?email=" + email, function(data) {
                                if (data && /^\d+$/.test(data)) {
                                    userId = data;
                                    addUserWithRole(userId, role, "${project.projectId}");
                                } else {
                                    var registerUrl = "http://auth.ala.org.au/emmet/selfRegister.html";
                                    bootbox.alert("The email address did not match a registered user. This may because: " +
                                             "<ul><li>the email address is incorrect</li>" +
                                             "<li>the user is not registered - see the <a href='" + registerUrl + "' target='_blank'>sign-up page</a>. </li></ul>"
                                    );
                                }
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                            .always(function() { $(".spinner").hide(); });;
                        }

                    }
                });

                // click event on the "remove" button on Project Members table
                $('.membersTbody').on("click", "td.memRemoveRole", function(e) {
                    var $this = this;
                    var userId = $($this).parent().data("userid");
                    var role = $($this).parent().data("role");
                    bootbox.confirm("Are you sure you want to remove this user's access?", function(result) {
                        if (result) {
                            if (userId && role) {
                                removeUserRole(userId, role);
                            } else {
                                alert("Error: required params not provided: userId & role");
                            }
                        }
                    });
                });

                // hide/show the role select for editting role
                $('.membersTbody').on("click", "td.memEditRole", function(e) {
                    if ($(this).parent().find("span").is(':visible')) {
                        $(this).parent().find("span").hide();
                        $(this).parent().find("select").fadeIn();
                    } else {
                        $(this).parent().find("span").fadeIn();
                        $(this).parent().find("select").hide();
                    }
                });

                // detect change on "role" select in table
                $('.membersTbody').on("change", ".memUserRole select", function() {
                    var role = $(this).val();
                    var currentRole = $(this).siblings('span').text();
                    var userId = $(this).attr('id'); // Couldn't get $(el).data('userId') to work for some reason
                    bootbox.confirm("Are you sure you want to change this user's access from " + currentRole + " to " + role + "?", function(result) {
                        if (result) {
                            addUserWithRole(userId, role, "${project.projectId}");
                        } else {
                            loadProjectMembers(); // reload table
                        }
                    });
                });

                // load initial list of project members
                loadProjectMembers();

            }); // end window.load

            /**
            * This populates the "Project Members" table via an AJAX call
            * It uses the jQuery clone pattern to generate HTML using a plain
            * HTML template, found in the table itself.
            * See: http://stackoverflow.com/a/1091493/249327
            */
            function loadProjectMembers() {
                $("#spinnerRow").show();
                $('.membersTbody tr.cloned').remove();
                $.ajax({
                    url: fcConfig.projectMembersUrl + "/${project.projectId}"
                })
                .done(function(data) {
                    //alert("Done data = " + data);
                    $.each(data, function(i, el) {
                        var $clone = $('.membersTbody tr.hide').clone();
                        $clone.removeClass("hide");
                        $clone.addClass("cloned");
                        $clone.data("userid", el.userId);
                        $clone.data("role", el.role);
                        $clone.find('.memUserId').text(el.userId);
                        $clone.find('.memUserName').text(el.displayName);
                        $clone.find('.memUserRole select').val(el.role);
                        $clone.find('.memUserRole select').attr("id", el.userId);
                        $clone.find('.memUserRole span').text(el.role);
                        $('.membersTbody').append($clone);
                    });
                 })
                .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                .always(function() { $("#spinnerRow").hide(); });
            }

           /**
            * Add a user with given role to the current project
            *
            * @param userId
            * @param role
            * @param projectId
            */
            function addUserWithRole(userId, role, projectId) {
                //console.log("addUserWithRole",userId, role, projectId);
                if (userId && role) {
                    $.ajax({
                        url: fcConfig.addUserRoleUrl,
                        data: { userId: userId, role: role, projectId: projectId }
                    })
                    .done(function(result) { updateStatusMessage("user was added with role " + role); loadProjectMembers(); })
                    .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                    .always(function(result) { $(".spinner").hide(); $("#userAccessForm")[0].reset(); });
                } else {
                    alert("Required fields are: userId and role.");
                    $('.spinner').hide();
                }
            }

            function updateStatusMessage(msg) {
                $('#formStatus span').text(''); // clear previous message
                $('#formStatus span').text(msg).parent().fadeIn();
            }


           /**
            * Modify a user's role
            *
            * @param userId
            * @param role
            */
            function removeUserRole(userId, role) {
                $.ajax( {
                    url: fcConfig.removeUserWithRoleUrl,
                    data: {userId: userId, role: role, projectId: "${project.projectId}" }
                })
                .done(function(result) { updateStatusMessage("user was removed."); })
                .fail(function(jqXHR, textStatus, errorThrown) { alert(jqXHR.responseText); })
                .always(function(result) {
                    $("#spinner1").hide();
                    loadProjectMembers(); // reload table
                });
            }

        </r:script>
    </g:if>
</body>
</html>