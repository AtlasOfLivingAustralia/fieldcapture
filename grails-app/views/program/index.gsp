<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="nrm_bs4"/>
    <title>${program.name.encodeAsHTML()} | MERIT</title>
    <script type="text/javascript" src="${grailsApplication.config.google.maps.url}&libraries=visualization"></script>
    <script type="text/javascript" src="//www.google.com/jsapi"></script>
    <script disposition="head">
        var fcConfig = {
            reportOwner: {programId:'${program.programId}'},
            reportCreateUrl: '${g.createLink( action:'createReport', id:program.programId)}',
            viewReportUrl:'',
            editReportUrl:"${createLink(action:"editReport", id:program.programId)}",
            approveReportUrl:'',
            submitReportUrl:'',
            rejectReportUrl:''
        };
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <asset:stylesheet src="program.css"/>

</head>

<body>
<div class="container-fluid">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <g:link controller="home">Home</g:link>
            </li>
            <li class="breadcrumb-item"> Management Units</li>
            <li class="breadcrumb-item active"> ${program.name}</li>
        </ol>

    </nav>

    <h2>${program.name}</h2>

    <div id="programDetails">

        <g:render template="/shared/flashScopeMessage"/>


        <ul id="program-tabs" class="nav nav-tabs" data-tabs="tabs">
            <fc:tabList tabs="${content}"/>
        </ul>

        <div class="tab-content">
            <fc:tabContent tabs="${content}"/>
        </div>

        <div id="loading" class="text-center">
            <asset:image width="50px" src="loading.gif" alt="loading icon"/>
        </div>
    </div>

</div>
<g:render template="/shared/declaration"/>
<script type="text/html" id="loading">
<asset:image id="img-spinner" width="50" height="50" src="loading.gif" alt="Loading"/>
</script>

<asset:script>

    $(function () {

        var program =<fc:modelAsJavascript model="${program}"/>;
        var programViewModel = new ProgramViewModel(program);

        ko.applyBindings(programViewModel);
        $('#loading').hide();
    });

</asset:script>
<asset:javascript src="common-bs4.js"/>
<asset:javascript src="program.js"/>
<asset:deferredScripts/>

</body>

</html>