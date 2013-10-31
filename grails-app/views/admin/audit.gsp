<!doctype html>
<html>
	<head>
		<meta name="layout" content="adminLayout"/>
		<title>Admin - Audit | Data capture | Atlas of Living Australia</title>
		<style type="text/css" media="screen">
		</style>
	</head>
	<body>
        <h3>Audit</h3>
        <form class="form-inline">
            Search for a project:
            <g:textField id="searchTerm" name="searchTerm" placeholder="Search for projects..." value="${searchTerm}"></g:textField>
            <button class="btn" id="btnProjectSearch"><i class="icon-search"></i></button>
        </form>
        <g:if test="${results}">
        <div>
            <table class="table table-condensed table-striped table-bordered">
                <thead>
                    <th>Name</th>
                    <th>Description</th>
                    <th></th>
                </thead>
                <tbody>
                    <g:each in="${results.hits?.hits}" var="hit">
                        <tr>
                            <td>
                                <a href="${createLink(action:'auditProject', id:hit._source?.projectId)}">${hit._source?.name}</a>
                            </td>
                            <td>${hit._source?.description}</td>
                        </tr>
                    </g:each>
                </tbody>
            </table>

        </div>
        </g:if>
    </body>
</html>

<r:script>

    $(document).ready(function() {
        $("#btnProjectSearch").click(function(e) {
            e.preventDefault();
            doAuditProjectSearch()
        });
    });

    function doAuditProjectSearch() {
        var searchTerm = $("#searchTerm").val();
        if (searchTerm) {
            window.location = "${createLink(controller:'admin', action:'auditProjectSearch')}?searchTerm=" + searchTerm;
        }
    }

</r:script>

