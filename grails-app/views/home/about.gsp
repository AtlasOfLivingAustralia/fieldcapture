<%@ page import="au.org.ala.fieldcapture.SettingPageType" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
  <meta name="layout" content="${grailsApplication.config.layout.skin?:'main'}"/>
  <title>${settingType.title?:'About'} | Field Capture</title>
  <r:script disposition="head">
    var fcConfig = {
        baseUrl: "${grailsApplication.config.grails.serverURL}",
        spatialBaseUrl: "${grailsApplication.config.spatial.baseURL}",
        spatialWmsCacheUrl: "${grailsApplication.config.spatial.wms.cache.url}",
        spatialWmsUrl: "${grailsApplication.config.spatial.wms.url}",
        sldPolgonDefaultUrl: "${grailsApplication.config.sld.polgon.default.url}",
        sldPolgonHighlightUrl: "${grailsApplication.config.sld.polgon.highlight.url}"
    }
  </r:script>
</head>
<body>
    <div id="wrapper" class="container-fluid">
        <div class="row-fluid">
            <div class="span8" id="">
                <h1>${settingType.title?:'About the website'}
                    <g:if test="${fc.userIsSiteAdmin()}">
                        <span style="display: inline-block; margin: 10px;">
                            <div class="btn-group">
                                <a href="${g.createLink(controller:"admin",action:"editSettingText", id: settingType.name, params: [layout:"ajaxLayout"])}"
                                   data-target="#myModal" role="button" class="btn btn-small" data-toggle="modal">Quick Edit</a>
                                <a href="${g.createLink(controller:"admin",action:"editSettingText", id: settingType.name, params: [layout:"nrm",returnUrl: g.createLink(controller: params.controller, action: params.action, absolute: true)])}"
                                   class="btn btn-small">Full Edit</a>
                            </div>
                        </span>
                </h1>
                        <!-- Modal -->
                        <div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h3 id="myModalLabel">Edit page content</h3>
                            </div>
                            <div class="modal-body">
                                <p><g:img dir="images" file="spinner.gif"/></p>
                            </div>
                            <div class="modal-footer">
                                <button id="saveContent" class="btn btn-primary">Save</button>
                                <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                            </div>
                        </div>
                        <r:script>
                            $(document).ready(function (e) {
                                $('#saveContent').click(function(e) {
                                    e.preventDefault();
                                    //$('.modal-body form').submit();
                                    // TODO handle possible errors from ajax
                                    var frm = $('.modal-body form');
                                    $.ajax({
                                        type: frm.attr('method'),
                                        url: frm.attr('action'),
                                        data: frm.serialize()
                                    }).done(function() {
                                        alert( "content saved" );
                                        location.reload(true);
                                    }).fail(function( jqXHR, textStatus ) {
                                        alert( "Request failed: " + textStatus );
                                        //console.log("jqXHR", jqXHR);
                                    }).always(function() {
                                        //alert( "complete" );
                                    });
                                });
                            });
                        </r:script>
                    </g:if>
                    <g:else>
                </h1>
                    </g:else>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span8">
                <div class="" id="aboutDescription" style="margin-top:20px;">
                    <markdown:renderHtml>${content}</markdown:renderHtml>
                </div>
            </div><!-- /.spanN  -->
            <g:if test="${settingType == SettingPageType.ABOUT && fc.userIsLoggedIn()}">
                <div class="span4 well well-small">
                    <fc:getSettingContent settingType="${SettingPageType.INTRO}"/>
                </div>
            </g:if>
        </div><!-- /.row-fluid  -->
    </div>
</body>
</html>