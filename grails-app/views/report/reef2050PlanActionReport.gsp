<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${(grailsApplication.config.layout.skin?:'main')}"/>
    <title>Reef 2050 Action Status</title>
    <title></title>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>

    <style type="text/css">

        td.status-count {
            padding:5px;
            border: 8px solid #f7f7f7;
            font-weight: bold;
            font-size: 25px;
            width:50px;
            text-align: center;
            vertical-align: middle;
        }

        td.status-description {
            border: 8px solid #f7f7f7;
        }

        td.status-1.status-count {
            background-color: #4fac52;
        }

        td.status-1.status-description {
            background-color: #b8d6af;
        }

        td.status-2.status-count {
            background-color: #BECC48;
        }

        td.status-2.status-description {
            background-color: #E2EAB1;
        }

        td.status-3.status-count {
            background-color: #FDCC5B;
        }

        td.status-3.status-description {
            background-color: #FDECBA;
        }

        td.status-4.status-count {
            background-color: #D02431;
        }

        td.status-4.status-description {
            background-color: #EAA795;
        }

        td.status-5.status-count {
            background-color: #8C8C8C;
        }

        td.status-5.status-description {
            background-color: #CCCCCC;
        }

    </style>
</head>

<body>
<div class="container-fluid">
<g:if test="${flash.error || error}">
    <g:set var="error" value="${flash.error?:error}"/>
    <div class="row-fluid">
        <div class="alert alert-error large-space-before">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span>Error: ${error}</span>
        </div>
    </div>
</g:if>

<div class="well">
    <form>
    <div class="row-fluid">
        <span class="span3">
            <label for="year">Select the financial year to view: </label><g:select name="year" from="${years}" optionValue="label" optionKey="value" value="${year}"></g:select>
        </span>
    </div>

    <div class="row-fluid">
        <button type="submit" class="btn btn-success bottom">Update</button>
    </div>
    </form>
</div>

<g:if test="${!actions}">
    <strong>No data was found for the selected year.</strong>
</g:if>
<g:else>

<div class="row-fluid">
    <div class="span12">
        <table class="table table-striped">
            <thead>
            <tr>Action summary</tr>
            <tr>
                <th>Action ID</th>
                <th>Action description</th>
                <th>Lead Agency</th>
                <th>Status</th>
                <th>Description</th>
                <th>Progress</th>
                <th>Weblink</th>
                <th>Supporting Agencies</th>
                <th>Contributing Partners</th>
                <th>Priority</th>
            </tr>
            </thead>
            <tbody>
                <g:each in="${actions}" var="action">
                    <tr>
                        <td>${action.actionId}</td>
                        <td>${action.actionDescription}</td>
                        <td>${action.reportingLeadAgency}</td>
                        <td>${action.status}</td>
                        <td>${action.description}</td>
                        <td>${action.progress}</td>
                        <td><g:if test="${action.webLink}"><a href="${action.webLink}">${action.webLink}</a></td></g:if>
                        <td>${action.supportingAgencies?.join(', ')}</td>
                        <td>${action.contributingPartners?.join(', ')}</td>
                        <td>${action.priority}</td>
                    </tr>
                </g:each>
            </tbody>
        </table>
    </div>
</div>

<div class="row-fluid">

    <div class="span7">
        <table class="table">

        <g:each in="${status}" var="s">
            <tr>


                <td class="${s.class} status-count">${s.count}</td>
                <td class="${s.class} status-description">${s.description}</td>

            </tr>
        </g:each>

        </table>

    </div>
    <div class="span5">
        <fc:renderScore score="${actionStatus}" minResults="1"/>
    </div>
</div>

    <g:each in="${actionStatusByTheme}" var="theme">
<div class="row-fluid">
   <div class="span12">
       <strong>${theme.key}</strong>
       <fc:renderScore score="${theme.value}" minResults="1"/>

   </div>
</div>
    </g:each>
</g:else>

</div>
</body>
</html>