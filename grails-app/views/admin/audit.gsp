<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Audit | Data capture | Atlas of Living Australia</title>
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
        <form class="form-inline">
            Search for a :
            <g:select id="searchType" name="searchType" value="${searchType}" from="${['Project', 'Organisation', 'Setting / Site Blog']}">
            </g:select>
            <g:textField id="searchTerm" name="searchTerm" placeholder="Search term..." value="${searchTerm}"></g:textField>
            <button class="btn" id="btnSearch"><i class="icon-search"></i></button>
        </form>
        <g:if test="${results}">
        <g:set var="searchTerm" value="${params.searchTerm}"/>
        <div class="well well-small">
            <table style="width: 95%;" class="table table-striped table-bordered table-hover" id="results-list">
                <thead>
                    <th>Name</th>
                    <th>Description</th>
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

        <asset:javascript src="audit.js"/>

    </body>
</html>


