<a class="pointer" id="downloadXlsxButton">XLSX</a>
<form id="downloadTabSelection" target="_blank" method="POST" action="${g.createLink(controller: 'search', action: 'downloadAllData')}">

    <input type="hidden" name="view" value="xlsx">
    <g:each in="${params.getList("fq")}" var="selectedFacet">
        <input type="hidden" name="fq" value="${selectedFacet}">
    </g:each>
    <strong>Project Information</strong>
    <ul class="unstyled">
        <g:each in="${['Projects', 'Output Targets', 'Sites']}" var="name">
            <li><label class="checkbox"><input type="checkbox" name="tabs" value="${name}" data-validation-engine="validate[minCheckbox[1]]">${name}</label></li>
        </g:each>
    </ul>

    <strong>Activites</strong>

    <g:each in="${activityTypes}" var="category">
        <strong>${category.name}</strong>
        <ul class="unstyled">
            <g:each in="${category.list}" var="type">
                <li><label class="checkbox"><input type="checkbox" name="tabs" value="${type.name}" data-validation-engine="validate[minCheckbox[1]]">${type.name}</label></li>
            </g:each>

        </ul>
    </g:each>

</form>

<r:script>

$(function() {
   $('#downloadXlsxButton').click(function() {
       $('#downloadTabSelection').submit();
   });
});
</r:script>