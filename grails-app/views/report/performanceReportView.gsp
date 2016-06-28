
<%@ page import="au.org.ala.fieldcapture.DateUtils" contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${(grailsApplication.config.layout.skin?:'main')+'Print'}"/>
    <title>Performance Report | MERIT</title>
    <%-- Override the bootstrap print style that sets background: transparent !important  --%>
    <style type="text/css">
        .performance-report .title-row {
            background-color: #f5f5f5 !important;
        }
        table thead th {
            background-color: #d9edf7 !important;
        }
    </style>
</head>

<body>
<div class="${containerType} validationEngineContainer performance-report">

    <h3>${report.name}</h3>

    <h4>${organisation.name}</h4>
    <hr/>
    <g:if test="${submittingUserName}">
        Report submitted by ${submittingUserName} at ${submissionDate}
        <hr/>
    </g:if>

    <br/>
    <div class="row-fluid">
        <div class="form-inline span12">
            <label>Who is the authorised person completing this self assessment?</label> &nbsp;${report.data.whoCompletedForm}
        </div>
    </div>
    <br/>

    <table class="row-fluid header" data-bind="with:data">
        <thead>
            <tr>
                <th rowspan="2" colspan="2">Performance expectation framework</th>
                <th>Meet expectation?</th>
                <th>Evidence</th>
            </tr>
            <tr>
                <th>Yes, No</th>
                <th>Cite evidence</th>
            </tr>
        </thead>



        <g:each in="${themes}" var="theme">
            <tr>
                <th colspan="4">${theme}</th>
            </tr>
            <g:each in="${sectionsByTheme[theme]}" var="section">
                <g:render template="/report/performanceSelfAssessmentSectionView" model="${section}"></g:render>
            </g:each>
        </g:each>
    </table>

    <br/>

    <div class="row-fluid">
        <div class="span7">
            <label>Are there any areas of the performance expectations your region would like peer assistance in meeting?</label>
        </div>
        <div class="span5">
            <span class="model-text-value">${report.data.peerAssistanceRequired}</span>
        </div>
    </div>

    <div class="row-fluid">
        <div class="span7">
            <label>Are there any areas of the performance expectations your region would be able to provide peer assistance on?</label>
        </div>
        <div class="span5">
            <span class="model-text-value">${report.data.peerAssistanceOffered}</span>
        </div>
    </div>
</div>

</body>
</html>