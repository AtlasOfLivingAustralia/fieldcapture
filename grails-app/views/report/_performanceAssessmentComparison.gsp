<div id="performance-report">

<form id="performance-report-form" class="form-actions">

    <strong>Compare performance:</strong>

    <form>
        <div class="form-group row">
            <label for="year" class="col-sm-1">Year: </label>
            <div class="col-sm-3">
                <g:select name="year" class="form-control form-control-sm" from="${years}" value="${year}"/>
            </div>
            <label for="state" class="col-sm-2">State: (leave blank for Australia) </label>
            <div class="col-sm-3">
                <g:select name="state" class="form-control form-control-sm" from="${states}" value="${state}"/>
            </div>
            <div class="col-sm-10">
                <button class="btn btn-sm btn-success bottom">Update</button>
            </div>
        </div>
    </form>
    <script>
        $('#performance-report-form button').click(function(e) {
            e.preventDefault();
            var data =  $('#performance-report-form').serialize();

            $('#performance-report').html('');
            $('.loading-message').show();
            $.get(fcConfig.performanceComparisonReportUrl, data, function(data) {
                $('.loading-message').hide();
                $('#performance-report').html(data);
            });
        });
    </script>

</form>

<g:if test="${results || report}">
     <table class="performance-report">
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
                    <th>You verse ${state?:'All'} <fc:iconHelp>Only approved reports are included in the counts in this column.  Cells in yellow indicate the values selected by this organisation</fc:iconHelp></th>
                </tr>
                <g:set var="ratings" value="${version == 1 ? ['0', '1', '2'] : ['0', '1']}"/>
                <g:each in="${themes}" var="theme">
                    <g:each in="${sectionsByTheme[theme]}" var="section" status="i">
                        <g:each in="${ratings}" var="rating" status="j">
                            <tr>
                                <g:if test="${i == 0 && j == 0}">
                                    <td rowspan="${sectionsByTheme[theme].size() * ratings.size()}" class="title-row">
                                        ${theme}
                                    </td>
                                </g:if>

                                <g:if test="${j == 0}">
                                    <td rowspan="${ratings.size()}">
                                        ${section.title}
                                    </td>
                                </g:if>
                                <td>
                                    <g:message code="performance.rating.${rating}"/>
                                </td>
                                <g:set var="valueClass" value="${(report && report.data[section.name+'OverallRating'] == j) ? 'match': ''}"/>
                                <td class="comparison ${valueClass}">

                                    <g:set var="result" value="${results.find{it.label == section.name} ?: [result:['0':0, '1':0, '2':0]]}"/>
                                    ${result.result[rating] ?: 0}
                                </td>
                            </tr>
                        </g:each>
                    </g:each>
                </g:each>
                </tbody>

            </table>

</g:if>
<g:else>
    <g:render template="noReportData"/>
</g:else>

</div>
