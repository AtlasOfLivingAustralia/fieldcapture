<%@ page import="org.joda.time.DateTime" %>
<html>

<head>
    <style type="text/css">
    #announcementsTable th {
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

        var events = <fc:modelAsJavascript model="${events}"></fc:modelAsJavascript>;
        var columns =  [
            {title:'Proposed Date of event/announcement (if known)', data:'eventDate', render:dateRenderer},
            {title:'State/Territory', width:'10%', data:'state'},
            {title:'Electorate(s) of the Project', width:'10%', data:'electorate'},
            {title:'Name of Organisation/Proponent', width:'10%', data:'organisationName'},
            {title:'Name', width:'25%', data:'name'},
            {title:'Proposed event/annoucement', data:'eventName'},
            {title:'Description of the event', data:'eventDescription'},
            {title:'Will there be, or do you intend there to be, media involvement in this event?', data:'media'},
            {title:'MERI plan approval status', data:'planStatus'},
            {title:'What programme does the announcement relate to?', width:'13%', data:'associatedProgram'},
            {title:'Grant ID', width:'10%', render:projectUrlRenderer, data:'grantId'}];


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