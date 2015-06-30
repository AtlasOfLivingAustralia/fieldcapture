<%@ page import="org.joda.time.DateTime" %>
<html>

<head>
    <style type="text/css">
    #announcementsTable th {
        white-space: normal;
    }

    #announcementsTable td {
        white-space: normal;
    }

    #announcementsTable table {
        width:100%;
    }
    </style>
</head>
<table id="announcementsTable" class="table table-striped">

</table>
    <g:set var="suffix" value="${au.org.ala.fieldcapture.DateUtils.displayFormat(new org.joda.time.DateTime())}"/>
    <script type="text/javascript">
    $(function() {

        var projectUrlRenderer = function(data, type, row, meta) {
            var projectId = events[meta.row].projectId;
            return '<a href="'+fcConfig.viewProjectUrl+'/'+projectId+'">'+data+'</a>';
        };
        var dateRenderer = function(data) {
            return convertToSimpleDate(data, false);
        };
        var webSiteUrlRenderer = function(data, type, row, meta) {
            return '<a href="'+data+'">'+data+'</a>';
        };

        var events = <fc:modelAsJavascript model="${events}"></fc:modelAsJavascript>;
        var columns =  [
            {title:'Proposed Date of event/announcement (if known)', data:'eventDate', width:'5%', render:dateRenderer},
            {title:'State/Territory', width:'10%', data:'state'},
            {title:'Electorate(s) of the Project', width:'10%', data:'electorate'},
            <g:if test="${params.showOrganisations}">{title:'Name of Organisation/Proponent', width:'10%', data:'organisationName'},</g:if>
            {title:'Name', width:'25%', data:'name'},
            {title:'Name of grant round or other event/announcement', data:'eventName'},
            {title:'Type of event/announcement', data:'type'},
            {title:'Description of the event', data:'eventDescription', width:'15%'},
            {title:'Value of funding round', data:'funding'},
            {title:'MERI plan approval status', data:'planStatus'},
            {title:'What programme does the announcement relate to?', width:'13%', data:'associatedProgram'},
            {title:'Grant ID', width:'10%', render:projectUrlRenderer, data:'grantId'},
            <g:if test="${params.showOrganisations}">
                {title:'Organisation website', width:'10%', render:webSiteUrlRenderer, data:'organisationWebSite'},
                {title:'Contact details', width:'10%', data:'contact'}
            </g:if>
            ];


            $('#announcementsTable').dataTable({
                "data": events,
                "autoWidth": false,
                "columns": columns,
                "dom": 'Tlfrtip',
                tableTools: {
                    "sSwfPath": "${grailsApplication.config.contextPath}/swf/copy_csv_xls_pdf.swf",
                    "aButtons": [
                        "copy",
                        "print",
                        {
                            "sExtends":    "collection",
                            "sButtonText": "Save",
                            "aButtons":    [
                                {"sExtends":"csv",  "sFileName":"Annoucements-${suffix}.csv"}, {"sExtends":"xls",  "sFileName":"Annoucements-${suffix}.xls"}, {"sExtends":"pdf",  "sFileName":"Annoucements-${suffix}.pdf"} ]
                        }
                    ]
                }
            });


    });


</script>


</html>