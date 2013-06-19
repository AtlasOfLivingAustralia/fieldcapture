<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
    <head>
        <meta name="layout" content="adminLayout"/>
        <title>Metadata - Admin - Data capture - Atlas of Living Australia</title>
        <r:require module="vkbeautify"/>
    </head>

    <body>
        <script type="text/javascript">

            $(document).ready(function() {

            });

        </script>
        <content tag="pageTitle">Metadata</content>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th><span style="font-size: large">Activities model</span>
                        <button id="btnReloadConfig" class="btn btn-small btn-info pull-right">Edit</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding:0;">
                        <pre id="activitiesMetadata" style="margin:0;width:97%;">${activitiesMetadata}</pre>
                    </td>
                </tr>
            </tbody>
        </table>

        <r:script>
            $(function(){
                $('#activitiesMetadata').html(vkbeautify.json(${activitiesMetadata},2));
            });
        </r:script>
    </body>
</html>