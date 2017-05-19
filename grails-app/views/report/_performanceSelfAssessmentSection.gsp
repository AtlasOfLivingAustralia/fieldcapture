<tr class="title-row">
    <td colspan="4">${section.title}</td>
</tr>
<g:each in="${section.questions}" var="question" status="i">
<tr>
    <g:if test="${i == 0}">
        <td class="gutter" rowspan="${section.questions.size()}"></td>
    </g:if>
    <td class="question">${question.text}</td>
    <td class="meets-expectations">
        <select data-validation-engine="validate[required]" data-bind="value:meetsExpectation${question.name}, options:${fc.modelAsJavascript(model: question.constraints)}"></select>
    </td>
    <td class="evidence">
        <textarea data-validation-engine="validate[required,maxSize[2000]]" maxlength="2000" data-bind="textInput:evidenceFor${question.name}" data-prompt-position="topRight:-110"></textarea>
    </td>
</tr>
</g:each>
<tr>
    <td>Additional practices</td>
    <td>${section.additionalPracticeQuestion.text}</td>
    <td>
        <g:if test="${version == 1}">
            <select data-validation-engine="validate[required]" data-bind="value:meetsExpectation${section.additionalPracticeQuestion.name}, options:${fc.modelAsJavascript(model: section.additionalPracticeQuestion.constraints)}"></select>
        </g:if>
    </td>
    <td>
        <textarea data-validation-engine="validate[maxSize[2000]]" maxlength="2000" data-bind="value:evidenceFor${section.additionalPracticeQuestion.name}" data-prompt-position="topRight:-110"></textarea>
    </td>
</tr>
