
<form id="downloadTabSelection" target="_blank" method="POST" action="${g.createLink(controller: 'search', action: 'downloadAllData')}">
    <a class="btn button btn-primary" data-bind="click:downloadXlsx" id="downloadXlsxButton">Download as XLSX</a><br/>
    <label><input type="checkbox" name="formSectionPerTab" value="true" checked="checked"> When downloading reports or activities, export each form section to a separate tab</label>

    <input type="hidden" name="view" value="xlsx">
    <g:each in="${params.getList("fq")}" var="selectedFacet">
        <input type="hidden" name="fq" value="${selectedFacet}">
    </g:each>
    <g:if test="${params.fromDate}">
        <input type="hidden" name="fromDate" value="${params.fromDate}">
    </g:if>
    <g:if test="${params.toDate}">
        <input type="hidden" name="toDate" value="${params.toDate}">
    </g:if>
    <g:if test="${params.query}">
        <input type="hidden" name="query" value="${params.query.encodeAsHTML()}">
    </g:if>
    <br/></p><strong>Project Information</strong>
    <ul class="unstyled">
        <g:each in="${['Projects', 'Output Targets', 'Sites', 'Reports', 'Report Summary', 'Documents', 'Blog']}" var="name">
            <li><label class="checkbox"><input type="checkbox" name="tabs" value="${name}" data-validation-engine="validate[minCheckbox[1]]">${name}</label></li>
        </g:each>
    </ul>

    <strong>Data set summary</strong><br/>
    <ul class="unstyled">
        <li><label class="checkbox"><input type="checkbox" name="tabs" value="Dataset" data-validation-engine="validate[minCheckbox[1]]">Data set summary</label></li>
    </ul>

    <strong>MERI Plan</strong>
    <ul class="unstyled">
        <g:each in="${['Outcomes', 'Monitoring', 'Project Partnerships', 'Project Implementation', 'Key Evaluation Question', 'Priorities', 'Budget', 'Risks and Threats', 'WHS and Case Study', 'Attachments', 'Baseline', 'Event', "Approvals"]}" var="name">
            <li><label class="checkbox"><input type="checkbox" name="tabs" value="MERI_${name}" data-validation-engine="validate[minCheckbox[1]]">${name}</label></li>
        </g:each>
         <!-- RLP project -->
        <g:each in="${['RLP Outcomes', 'RLP Project Details', 'RLP Key Threats', 'RLP Services and Targets']}" var="name">
            <li><label class="checkbox"><input type="checkbox" name="tabs" value="${name.replaceAll(' ','_')}" data-validation-engine="validate[minCheckbox[1]]">${name}</label></li>
        </g:each>
    </ul>

    <strong>Activity Data</strong><br/>
    <ul class="unstyled">
        <li><label class="checkbox"><input type="checkbox" name="tabs" value="Activity Summary">Activity Summary</label></li>
    </ul>

    <g:each in="${activityTypes + [name:'Special', list:[[name:'Upload of stage 1 and 2 reporting data']]]}" var="category" status="i">
        <div class="space-after">
        <a class="accordion-toggle"
           data-bind="toggleVisibility:'#download-category-${i}'">
        </a> <strong>${category.name}</strong>
        <ul data-bind="attr:{id:'download-category-${i}'}" class="unstyled">
            <g:each in="${category.list}" var="type">
                <li><label class="checkbox"><input type="checkbox" name="tabs" value="${type.name}" data-validation-engine="validate[minCheckbox[1]]">${type.name}</label></li>
            </g:each>

        </ul>
        </div>
    </g:each>


    <strong>Output Data</strong><br/>
    <ul class="unstyled">
        <li><label class="checkbox"><input type="checkbox" name="tabs" value="Participant Information" data-validation-engine="validate[minCheckbox[1]]">Participant Information</label></li>
    </ul>

</form>

<asset:script>

$(function() {

   var options = {
       downloadButtonSelector: '#downloadXlsxButton',
       downloadTabsSelector: '#downloadTabSelection',
       downloadXlsxUrl: "${g.createLink(controller: 'search', action: 'downloadAllData')}"
   };


   ko.applyBindings(new DownloadViewModel(options), document.getElementById('downloadTabSelection'));
});
</asset:script>
