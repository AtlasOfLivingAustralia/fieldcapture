<div id="performance-report">
<div class="row-fluid">
    <span class="span3">
        <label for="year">Year: </label><g:select id="selectedYear" name="year" from="${years}" value="${year}"></g:select>
    </span>
</div>
<table class="row-fluid">
    <thead>
    <tr>
        <th colspan="3">Result of self assessment</th>
    </tr>

    </thead>
    <tbody>
    <tr class="title-row">
        <th>Performance theme</th>
        <th>Performance expectation</th>
        <th>
            Overall scale
            <ul>
                <li>Still to meet all expected practices</li>
                <li>Meets all expected practices; and</li>
                <li>Meets all expected practices and has advanced practices</li>
            </ul>
        </th>
    </tr>
    <g:each in="${themes}" var="theme">
        <g:each in="${sectionsByTheme[theme]}" var="section" status="i">
        <tr>
            <g:if test="${i == 0}">
                <td rowspan="${sectionsByTheme[theme].size()}" class="title-row">
                    ${theme}
                </td>
            </g:if>
            <td>
                ${section.title}
            </td>
            <td class="rating-container">
                <span class="rating ${fc.comparisonClass(current:report.data[section.name + 'OverallRating'], previous:(previousReport && previousReport.data) ? previousReport.data[section.name + 'OverallRating'] : null)}"><g:message code="performance.rating.${report.data[section.name + 'OverallRating']}"/></span>
            </td>
        </g:each>
    </g:each>
    </tbody>

</table>

<script>
    $('#selectedYear').change(function(e) {
        e.preventDefault();
        var data =  $('#selectedYear').serialize();

        $('#performance-report').html('');
        $('.loading-message').show();
        $.get(fcConfig.performanceAssessmentSummaryReportUrl, data, function(data) {
            $('.loading-message').hide();
            $('#performance-report').html(data);
        });
    });
</script>
</div>