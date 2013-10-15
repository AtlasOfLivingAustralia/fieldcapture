<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
    <head>
        <meta name="layout" content="adminLayout"/>
        <title>Settings | Admin | Data capture | Atlas of Living Australia</title>
    </head>

    <body>
        <script type="text/javascript">

            $(document).ready(function() {
            });

        </script>
        <content tag="pageTitle">Settings</content>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Setting</th>
                    <th>Value</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                <g:each var="setting" in="${settings}">
                    <tr>
                        <td>
                            ${setting.key}
                        </td>
                        <td>
                            ${setting.value}
                        </td>
                        <td>
                            ${setting.comment}
                        </td>
                    </tr>
                </g:each>
            </tbody>
        </table>

        <h2>Grails properties</h2>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Setting</th>
                    <th>Value</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                <g:each var="setting" in="${grailsStuff}">
                    <tr>
                        <td>
                            ${setting.key}
                        </td>
                        <td>
                            ${setting.value}
                        </td>
                        <td>
                            ${setting.comment}
                        </td>
                    </tr>
                </g:each>
            </tbody>
        </table>

    </body>
</html>