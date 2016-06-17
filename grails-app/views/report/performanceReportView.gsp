
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="${(grailsApplication.config.layout.skin?:'main')+'Print'}"/>
    <title>Performance Report | MERIT</title>
    <%-- styles are inline for the benefit of PDF generation --%>
    <style type="text/css">
    .performance-report .title-row {
        background-color: #f5f5f5;
    }
    .performance-report .header th {
        white-space: normal;
    }

    .performance-report td.question {
        width:45%;
    }
    .performance-report td.meets-expectations {
        width:5%;
    }
    .performance-report td.evidence {
        width:45%;
    }
    .performance-report td textarea {
        width:100%;
        box-sizing: border-box;
        height: 5em;
    }
    </style>
</head>

<body>
<div class="${containerType} validationEngineContainer performance-report">

    <h2>Performance expectations framework</h2>
    <h3>Self assessment worksheet</h3>

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
                <th>Meet expection?</th>
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