<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<!doctype html>
<html>
    <head>
        <meta name="layout" content="adminLayout"/>
        <title>Users | Admin | Data capture | Atlas of Living Australia</title>
        <asset:stylesheet src="base-bs4.css"/>
    </head>

    <body>
    <div class="container">
        <h3>Users - Bulk Load User Permissions</h3>
    </div>

        <content tag="pageTitle">Tools</content>
        <div class="container">
            <div class="well">Logged in user is <b class="tooltips" title="${user}">${user.displayName}</b></div>
            <div>
                <p>
                    Upload a csv whose first row contains column headers, and has at least the following 5 columns (in any order):
                </p>
                <code>
                   "Grant ID","Sub-project ID","Recipient email 1","Recipient email 2","Grant manager email"
                </code>
                <p>where:</p>
                <p>
                    <code>Recipient email 1</code> and <code>Recipient email 2</code> are email address for people who will be project administrators
                </p>
                <p>
                    <code>Grant manager email</code> is the email of the person who will be given the Case Manager role for the project
                </p>
            </div>
            <g:uploadForm class="form-horizontal" action="uploadUserPermissionsCSV" enctype="multipart/form-data">
                <div class="form-group row">
                    <label class="control-label col-sm-2 mr-3" for="userPermissions">
                        Select a CSV file to upload
                    </label>
                    <div class="col-sm-4">
                        <input id="userPermissions" class="border" type="file" accept="text/csv" name="projectData" />
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-sm-6 text-center">
                        <g:submitButton name="uploadCSV" value="Load Permissions" class="btn btn-sm text-center btn-primary" />
                    </div>
                </div>

            </g:uploadForm>
            <g:if test="${results}">
            <div class="alert alert-danger">
                <p>${results.message}</p>
                <ul>
                <g:each in="${results?.validationErrors}" var="message">
                    <li>Line ${message.line}: ${message.message}</li>
                </g:each>
                </ul>
            </div>
            </g:if>
        </div>
        <asset:javascript src="base-bs4.js"/>
    </body>
</html>
