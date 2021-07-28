<%@ page import="au.org.ala.merit.DateUtils" %>
<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>${message?.entity?.name} | Audit Message Detail | Admin | MERIT</title>
		<style type="text/css" media="screen">
		</style>
        <asset:stylesheet src="audit.css"/>
	</head>
	<body>
        <h4>Audit ${message?.entityType?.substring(message?.entityType?.lastIndexOf('.')+1)}: ${message?.entity?.name} ${message?.entity?.type} </h4>
        <g:set var="projectId" value="${params.projectId}"/>
        <g:set var="searchTerm" value="${params.searchTerm}"/>

    <div class="row">
        <div class="col-sm-6">
            <h4>Edited by: ${userDetails?.displayName} <g:encodeAs codec="HTML">${message?.userId ?: '<anon>'}</g:encodeAs> </h4>
            <h5><small>${message?.eventType} : ${DateUtils.displayFormatWithTime(message?.date)}</small></h5>
        </div>
        <div class="col-sm-6 pr-0 text-right">
            <button id="toggle-ids" type="button" class="btn btn-default btn-sm">Show Ids</button>
            <div id="ids" class="col-sm-12">
                <h6>
                    <strong>Id: </Strong><small>${message?.id}</small>
                </h6>
                <h6>
                    <Strong>Entity Id: </Strong>
                    <small><g:encodeAs codec="HTML">${message?.entityId}</g:encodeAs></small>
                </h6>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12 mb-1 text-right">
            <a href="${params.returnTo}" class="btn btn-default btn-sm"><i class="fa fa-backward"></i> Back</a>
        </div>
    </div>

    <div class="row pull-right">
        <table>
            <tr>
                <td style="background: #c6ffc6;"></td><td>Inserted</td>
                <td style="background: #ffc6c6;"></td><td>Deleted</td>
            </tr>
        </table>
    </div>


    <div class="well well-small">

        <div id="content">
            <ul id="tabs" class="nav nav-tabs" role="tablist" data-tabs="tabs">
                <li class="nav-item"><a class="nav-link active" href="#minimal" data-toggle="tab">Overview</a></li>
                <li class="nav-item"><a class="nav-link" href="#detailed" data-toggle="tab">Detailed</a></li>
            </ul>
            <div id="my-tab-content" class="tab-content">
                <div class="tab-pane fade show active overflow-auto" role="tabpanel" id="minimal">
                    <table id="formatedJSON" class="table table-bordered table-hover">
                        <thead>
                        <tr>
                            <th><h4>Fields</h4></th>
                            <th><h4>What's changed?</h4></th>
                        </tr>
                        </thead>
                        <tbody>
                        <g:each var="obj" in="${message?.entity}">
                            <tr>
                                <td>${obj.key}</td>
                                <td wrap class="diff1"></td>
                                <td style="display:none" class="original">${ compare && compare.entity ? compare.entity[(obj.key)] : ''}</td>
                                <td style="display:none" class="changed">${message.entity[(obj.key)]}</td>
                            </tr>
                        </g:each>
                        </tbody>
                    </table>
                </div>
                <div class="tab-pane fade overflow-auto" role="tabpanel" id="detailed">
                    <table id="wrapper" class="table table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th width="30%"><h4>Before</h4></th>
                            <th width="30%"><h4>After</h4></th>
                            <th width="40%"><h4>What's changed? </h4>
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr>
                            <td class="original"><fc:renderJsonObject object="${compare?.entity}" /></td>
                            <td class="changed"><fc:renderJsonObject object="${message?.entity}" /></td>
                            <td style="line-height:1;" class="diff1"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <asset:javascript src="base-bs4.js"/>
    <asset:javascript src="audit.js"/>
    <script type="text/javascript">
        $(document).ready(function() {
            $( "#ids").hide();
            $("#wrapper tr").prettyTextDiff({
                cleanup: true,
                diffContainer: ".diff1"
            });
            $("#formatedJSON tr").prettyTextDiff({
                cleanup: true,
                diffContainer: ".diff1"
            });

            $( "#toggle-ids" ).click(function() {
                $( "#ids" ).toggle();
            });

        });
    </script>
    </body>
</html>
