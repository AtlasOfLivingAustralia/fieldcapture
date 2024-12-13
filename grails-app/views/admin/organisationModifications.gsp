<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Update organisations | Admin | MERIT</title>
    <asset:stylesheet src="base-bs4.css"/>
</head>

<body>
<asset:javascript src="base-bs4.js"/>
<script type="text/javascript">

    $(document).ready(function () {

        $("#createOrgs").change(function() {
            if ($("#createOrgs").val()) {
                $("#btnUpdateProjectOrgs").removeAttr("disabled");
            }
            else {
                $("#btnUpdateProjectOrgs").attr("disabled", "disabled");
            }

        }).trigger('change');
        $('#btnUpdateProjectOrgs').click(function (e) {
            e.preventDefault();
            $('form.createOrgs').submit();
        });

    });

</script>
<content tag="pageTitle">Organisation details update</content>

<h4>Bulk creates organisations and updates projects / organisation relationships</h4>
            <g:uploadForm class="createOrgs" action="organisationModifications">
                <div class="form-group form-check">
                <input id="validate-only" type="checkbox" name="validateOnly" class="form-check-input" checked="checked">
                    <label class="form-check-label" for="validate-only">Validate only - don't save any changes</label>
                </div>
                <div class="form-group">
                <input class="form-control" id="createOrgs" type="file" name="orgData">
                </div>
                <button disabled id="btnUpdateProjectOrgs" class="btn btn-sm btn-info" title="Bulk create organisations">Upload</button>
            </g:uploadForm>


<div class="results">
    <table class="table table-striped">
        <thead>
        <tr>
            <td>Project ID</td>
            <td>Result</td>
        </tr>
        </thead>
        <tbody>
        <g:each in="${results}" var="result">
            <tr>
                <td>${result.key}</td>
                <td>${result.value}</td>
            </tr>

        </g:each>
        </tbody>
    </table>

</div>
</body>
</html>
