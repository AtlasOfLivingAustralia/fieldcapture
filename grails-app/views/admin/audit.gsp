<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Audit | Admin | MERIT</title>
		<style type="text/css" media="screen">
		</style>
        <script disposition="head">
            var fcConfig = {
                projectSearchUrl:"${createLink(controller:'admin', action:'auditProjectSearch')}",
                organisationSearchUrl:"${createLink(controller:'admin', action:'auditOrganisationSearch')}",
                settingSearchUrl:"${createLink(controller:'admin', action:'auditSettings')}"
            };
        </script>
        <asset:stylesheet src="audit.css"/>
	</head>
	<body>
        <h3>Audit</h3>
        <content tag="pageTitle">Audit</content>
        <form class="form-inline mb-3">
            Search for a :
            <g:select id="searchType" class="form-control form-control-sm mr-2" name="searchType" value="${searchType}" from="${['Project', 'Organisation', 'Setting / Site Blog']}">
            </g:select>
            <g:textField id="searchTerm" class="form-control form-control-sm mr-2" name="searchTerm" placeholder="Search term..." value="${searchTerm}"/>
            <button class="btn btn-sm" id="btnSearch"><i class="fa fa-search"></i></button>
        </form>
        <g:if test="${results}">
        <g:set var="searchTerm" value="${params.searchTerm}"/>
        <div class="well well-small">
            <table class="table table-striped table-bordered table-hover w-100" id="results-list">
                <thead>
                    <th style="width:30%">Name</th>
                    <th style="width:70%">Description</th>
                </thead>
                <tbody>
                    <g:each in="${results.hits?.hits}" var="hit">
                        <tr>
                            <td>
                                <a href="${createLink(action:action, params:[id:hit._source[id], searchTerm:searchTerm])}">${hit._source?.name}</a>
                            </td>
                            <td>${hit._source?.description}</td>
                        </tr>
                    </g:each>
                </tbody>
            </table>

        </div>
        </g:if>
        <asset:javascript src="base-bs4.js"/>
        <asset:javascript src="audit.js"/>
    <asset:script>
        $(document).ready(function() {
            initialiseAuditSearch();
        });
    </asset:script>
    <asset:deferredScripts/>
    </body>
</html>
