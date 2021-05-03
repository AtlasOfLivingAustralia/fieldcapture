<div id="performance-report">
<div class="row mb-3">
        <label for="year" class="col-sm-1">Year: </label>
        <div class="col-sm-3">
            <g:select id="selectedYear" name="year" class="form-control form-control-sm" from="${years}" value="${year}"></g:select>
        </div>
</div>
<table>
                <thead>
                <tr>
                    <th colspan="4">Result of self assessment</th>
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
                            <li>Meets all expected practices and has additional practices</li>
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
                            <g:set var="currentRating" value="${report.data[section.name + 'OverallRating'] > 0 ? 1: 0}"/>
                            <g:set var="previousRating" value="${(previousReport && previousReport.data) ? (previousReport.data[section.name + 'OverallRating']  > 0 ? 1 : 0) : null}"/>

                            <span class="rating ${fc.comparisonClass(current:currentRating, previous:previousRating)}"><g:message code="performance.rating.${report.data[section.name + 'OverallRating']}"/></span>
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
