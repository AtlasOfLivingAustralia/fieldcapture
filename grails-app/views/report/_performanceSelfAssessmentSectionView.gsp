<tr class="title-row">
    <td colspan="4">${title}</td>
</tr>
<g:set var="data" value="${report.data ?: [:]}"/>
<g:each in="${questions}" var="question" status="i">
<tr>
    <g:if test="${i == 0}">
        <td class="gutter" rowspan="${questions.size()}"></td>
    </g:if>
    <td class="question">${question.text}</td>
    <td class="meets-expectations">
        ${data['meetsExpectation'+question.name] ?: ''}
    </td>
    <td class="evidence">
        ${data['evidenceFor'+question.name] ?: ''}
    </td>
</tr>
</g:each>
<tr>
    <td>Additional practices</td>
    <td>${additionalPracticeQuestion.text}</td>
    <td>
        ${data['meetsExpectation' + additionalPracticeQuestion.name] ?: ''}
    </td>
    <td>
        ${data['evidenceFor' + additionalPracticeQuestion.name] ?: ''}
    </td>
</tr>
